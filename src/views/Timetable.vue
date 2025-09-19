<template>
  <div class="timetable-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">课程表</h2>
        <p class="text-gray-600 mt-1">查看完整的课程安排，支持导出为Word格式</p>
      </div>
      <div class="flex items-center space-x-3">
        <el-button
          type="primary"
          @click="handleExportToWord"
          :icon="Document"
          :disabled="scheduleStore.scheduleCount === 0 && isExportAuthorized"
        >
          导出Word
          <el-tag v-if="!isExportAuthorized" size="small" type="warning" class="ml-1">付费</el-tag>
        </el-button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <!-- 视角切换 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">查看视角：</span>
            <el-radio-group v-model="currentView" @change="handleViewChange">
              <el-radio-button :value="ViewType.CLASS">班级视角</el-radio-button>
              <el-radio-button :value="ViewType.TEACHER">教师视角</el-radio-button>
              <el-radio-button :value="ViewType.GRADE">年级视角</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="text-sm text-gray-600">当前视角：{{ getViewTypeName(currentView) }}</div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- 班级视角筛选 -->
        <el-select
          v-if="currentView === ViewType.CLASS"
          v-model="selectedClass"
          placeholder="选择班级查看课程表"
          clearable
          style="width: 250px"
          @change="filterTimetable"
        >
          <el-option
            v-for="classItem in classStore.classes"
            :key="classItem.id"
            :label="`${classItem.name} (${classItem.grade})`"
            :value="classItem.id"
          />
        </el-select>

        <!-- 教师视角筛选 -->
        <el-select
          v-if="currentView === ViewType.TEACHER"
          v-model="selectedTeacher"
          placeholder="选择教师查看课程表"
          clearable
          style="width: 250px"
          @change="filterTimetable"
        >
          <el-option
            v-for="teacher in teacherStore.teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>

        <!-- 年级视角筛选 -->
        <el-select
          v-if="currentView === ViewType.GRADE"
          v-model="selectedGrade"
          placeholder="选择年级查看课程表"
          clearable
          style="width: 250px"
          @change="filterTimetable"
        >
          <el-option v-for="grade in gradeOptions" :key="grade" :label="grade" :value="grade" />
        </el-select>

        <el-select
          v-model="selectedSubject"
          placeholder="筛选学科"
          clearable
          style="width: 200px"
          @change="filterTimetable"
        >
          <el-option
            v-for="subject in subjectOptions"
            :key="subject"
            :label="subject"
            :value="subject"
          />
        </el-select>

        <el-divider direction="vertical" />

        <el-text class="text-sm text-gray-600">
          显示课程数: {{ filteredScheduleItems.length }}
        </el-text>
      </div>
    </div>

    <!-- 课程表 -->
    <div v-if="hasSelection" class="bg-white rounded-lg shadow-sm p-6" ref="timetableRef">
      <div class="timetable-container" id="timetable-content">
        <!-- 标题 -->
        <div class="text-center mb-6 print-title">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ timetableTitle }}</h1>
          <p class="text-gray-600">{{ currentDate }}</p>
          <p v-if="!hasSelection" class="text-sm text-orange-500 mt-2">
            请选择班级、教师或年级查看对应课程表
          </p>
        </div>

        <!-- 课程表网格 -->
        <div class="timetable-grid" :style="getTimetableGridStyle()">
          <!-- 表头 -->
          <div class="grid-header">
            <div class="header-cell corner-cell">时间\星期</div>
            <div v-for="day in weekDays" :key="day.value" class="header-cell day-header">
              {{ day.label }}
            </div>
          </div>

          <!-- 表体 -->
          <div class="grid-body">
            <div
              v-for="timeSlot in allTimeSlots"
              :key="timeSlot.id"
              class="grid-row"
              :class="{ 'break-time-row': timeSlot.type === 'break' }"
            >
              <!-- 时间列 -->
              <div class="time-cell" :class="{ 'break-time-cell': timeSlot.type === 'break' }">
                <div class="time-name">{{ timeSlot.name }}</div>
                <div class="time-range">{{ timeSlot.startTime }}-{{ timeSlot.endTime }}</div>
              </div>

              <!-- 课程格子 -->
              <div
                v-for="day in weekDays"
                :key="`${timeSlot.id}-${day.value}`"
                class="course-cell"
                :class="{
                  'has-course':
                    timeSlot.type === 'class' && getScheduleItem(day.value, timeSlot.id),
                  'break-time-cell': timeSlot.type === 'break',
                }"
              >
                <div v-if="timeSlot.type === 'break'" class="break-content">休息时间</div>
                <div
                  v-else-if="getScheduleItem(day.value, timeSlot.id)"
                  class="course-content"
                  :style="{ backgroundColor: getScheduleItem(day.value, timeSlot.id)?.color }"
                >
                  <div class="course-name">
                    {{ getScheduleItem(day.value, timeSlot.id)?.courseName }}
                  </div>
                  <div class="course-info">
                    <div v-if="currentView === ViewType.TEACHER" class="course-class">
                      {{ getScheduleItem(day.value, timeSlot.id)?.className }}
                    </div>
                    <div v-else-if="currentView === ViewType.GRADE" class="course-class">
                      {{ getScheduleItem(day.value, timeSlot.id)?.className }}
                    </div>
                    <div v-else class="course-teacher">
                      {{ getScheduleItem(day.value, timeSlot.id)?.teacherName }}
                    </div>
                  </div>
                  <div class="course-subject">
                    {{ getScheduleItem(day.value, timeSlot.id)?.subject }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-if="!hasSelection" class="bg-white rounded-lg shadow-sm p-6">
      <div class="text-center py-16">
        <el-icon class="text-6xl text-gray-300 mb-4"><Calendar /></el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ getViewTypeName(currentView) }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{
            currentView === ViewType.CLASS
              ? '选择一个班级查看该班级的课程表'
              : currentView === ViewType.TEACHER
                ? '选择一位教师查看该教师的课程表'
                : '选择一个年级查看该年级的课程表'
          }}
        </p>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="hasSelection && scheduleStore.scheduleCount === 0" class="text-center py-16">
      <el-icon class="text-6xl text-gray-300 mb-4"><Calendar /></el-icon>
      <h3 class="text-lg font-medium text-gray-900 mb-2">课程表为空</h3>
      <p class="text-gray-500 mb-6">还没有安排任何课程</p>
      <el-button type="primary" @click="$router.push('/schedule')"> 开始排课 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { useScheduleStore } from '@/stores/schedule'
import { useClassStore } from '@/stores/class'
import { isFeatureAuthorized } from '@/utils/auth'
import type { ScheduleItem } from '@/types'
import { WEEKDAYS, ViewType } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const teacherStore = useTeacherStore()
const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()
const classStore = useClassStore()

// 检查导出功能是否已授权
const isExportAuthorized = ref(false)

// 初始化授权状态
const checkExportAuth = async () => {
  isExportAuthorized.value = await isFeatureAuthorized('EXPORT_FUNCTIONS')
}

const selectedTeacher = ref('')
const selectedSubject = ref('')
const selectedClass = ref('')
const selectedGrade = ref('')
const currentView = ref<ViewType>(ViewType.CLASS)
const timetableRef = ref()

// 星期选项（根据学校设置过滤）
const weekDays = computed(() => {
  // 从localStorage读取学校设置
  const savedSettings = localStorage.getItem('school-settings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      if (settings.schoolDays && Array.isArray(settings.schoolDays)) {
        // 根据学校设置的上课日过滤星期
        return WEEKDAYS.filter((day) => settings.schoolDays.includes(String(day.value)))
      }
    } catch (e) {
      console.error('解析学校设置失败:', e)
    }
  }
  // 默认返回所有星期
  return WEEKDAYS
})

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日')
})

// 计算属性
const subjectOptions = computed(() => {
  const subjects = [...new Set(courseStore.courses.map((c) => c.subject))]
  return subjects.sort()
})

const gradeOptions = computed(() => {
  const grades = [...new Set(classStore.classes.map((c) => c.grade))]
  return grades.sort()
})

// 是否有选择
const hasSelection = computed(() => {
  if (currentView.value === ViewType.CLASS) {
    return selectedClass.value !== ''
  } else if (currentView.value === ViewType.TEACHER) {
    return selectedTeacher.value !== ''
  } else {
    return selectedGrade.value !== ''
  }
})

// 获取视角名称
const getViewTypeName = (viewType: ViewType) => {
  switch (viewType) {
    case ViewType.CLASS:
      return '班级视角'
    case ViewType.TEACHER:
      return '教师视角'
    case ViewType.GRADE:
      return '年级视角'
    default:
      return '未知视角'
  }
}

// 课程表标题
const timetableTitle = computed(() => {
  if (currentView.value === ViewType.CLASS) {
    if (selectedClass.value) {
      const classItem = classStore.getClassById(selectedClass.value)
      return classItem ? `${classItem.name} 班级课程表` : '班级课程表'
    } else {
      return '班级课程表'
    }
  } else if (currentView.value === ViewType.TEACHER) {
    if (selectedTeacher.value) {
      const teacher = teacherStore.getTeacherById(selectedTeacher.value)
      return teacher ? `${teacher.name} 教师课程表` : '教师课程表'
    } else {
      return '教师课程表'
    }
  } else {
    if (selectedGrade.value) {
      return `${selectedGrade.value} 年级课程表`
    } else {
      return '年级课程表'
    }
  }
})

const filteredScheduleItems = computed(() => {
  // 如果没有选择班级、教师或年级，不显示任何课程
  if (!hasSelection.value) {
    return []
  }

  let items = scheduleStore.scheduleItems

  // 按视角筛选
  if (currentView.value === ViewType.CLASS && selectedClass.value) {
    items = items.filter((item) => item.classId === selectedClass.value)
  }

  if (currentView.value === ViewType.TEACHER && selectedTeacher.value) {
    items = items.filter((item) => item.teacherId === selectedTeacher.value)
  }

  if (currentView.value === ViewType.GRADE && selectedGrade.value) {
    // 筛选该年级的所有班级的课程
    const gradeClasses = classStore.classes.filter((c) => c.grade === selectedGrade.value)
    const classIds = gradeClasses.map((c) => c.id)
    items = items.filter((item) => classIds.includes(item.classId))
  }

  // 按学科筛选
  if (selectedSubject.value) {
    items = items.filter((item) => item.subject === selectedSubject.value)
  }

  return items
})

// 计算属性：合并时间槽和休息时间并按时间排序
const allTimeSlots = computed(() => {
  // 合并课程时间和休息时间
  const allSlots = [
    ...scheduleStore.timeSlots.map((slot) => ({ ...slot, type: 'class' })),
    ...scheduleStore.breakTimes.map((breakTime) => ({
      ...breakTime,
      type: 'break',
      id: breakTime.id,
      name: breakTime.name,
      startTime: breakTime.startTime,
      endTime: breakTime.endTime,
    })),
  ]

  // 按开始时间排序
  return allSlots.sort((a, b) => {
    const [aHours, aMinutes] = a.startTime.split(':').map(Number)
    const [bHours, bMinutes] = b.startTime.split(':').map(Number)
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes)
  })
})

// 计算最小宽度
const calculateMinWidth = () => {
  // 基础宽度：时间列(120px) + 星期列数 * 每列最小宽度(150px)
  const baseWidth = 120 + weekDays.value.length * 150
  // 确保最小宽度至少为800px
  return `${Math.max(baseWidth, 800)}px`
}

// 获取课程表网格样式
const getTimetableGridStyle = () => {
  return {
    minWidth: calculateMinWidth(),
    gridTemplateColumns: `120px repeat(${weekDays.value.length}, 1fr)`,
  }
}

// 方法
const getScheduleItem = (dayOfWeek: number, timeSlotId: string): ScheduleItem | undefined => {
  return filteredScheduleItems.value.find(
    (item) => item.dayOfWeek === dayOfWeek && item.timeSlotId === timeSlotId,
  )
}

const filterTimetable = () => {
  // 触发重新计算过滤后的课程表
}

// 处理视角切换
const handleViewChange = () => {
  // 切换视角时清空筛选条件
  selectedClass.value = ''
  selectedTeacher.value = ''
  selectedGrade.value = ''
  selectedSubject.value = ''
}

// 处理导出Word点击
const handleExportToWord = async () => {
  await checkExportAuth()
  if (!isExportAuthorized.value) {
    ElMessage.warning('导出功能是付费功能，请先获取授权码')
    router.push('/auth')
    return
  }
  if (scheduleStore.scheduleCount === 0) {
    ElMessage.warning('暂无课程数据，请先进行排课')
    return
  }
  exportToWord()
}

// 导出Word
const exportToWord = () => {
  try {
    // 创建表格数据
    const timetableData = []

    // 表头
    const headers = ['时间', ...weekDays.value.map((day) => day.label)]
    timetableData.push(headers)

    // 数据行
    const sortedTimeSlots = allTimeSlots.value
    sortedTimeSlots.forEach((timeSlot) => {
      const row = [`${timeSlot.name}\n${timeSlot.startTime}-${timeSlot.endTime}`]

      weekDays.value.forEach((day) => {
        if (timeSlot.type === 'break') {
          // 休息时间显示为休息
          row.push('休息时间')
        } else {
          const scheduleItem = getScheduleItem(day.value, timeSlot.id)
          if (scheduleItem) {
            if (currentView.value === ViewType.TEACHER) {
              row.push(
                `${scheduleItem.courseName}\n${scheduleItem.className}\n${scheduleItem.subject}`,
              )
            } else if (currentView.value === ViewType.GRADE) {
              row.push(
                `${scheduleItem.courseName}\n${scheduleItem.className}\n${scheduleItem.subject}`,
              )
            } else {
              row.push(
                `${scheduleItem.courseName}\n${scheduleItem.teacherName}\n${scheduleItem.subject}`,
              )
            }
          } else {
            row.push('')
          }
        }
      })

      timetableData.push(row)
    })

    // 创建Word文档
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${timetableTitle.value}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; vertical-align: middle; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .title { text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
          .date { text-align: center; font-size: 14px; color: #666; margin-bottom: 20px; }
          .break-time { background-color: #e3f2fd; }
        </style>
      </head>
      <body>
        <div class='title'>${timetableTitle.value}</div>
        <div class='date'>${currentDate.value}</div>
        <table>
          ${timetableData
            .map(
              (row, rowIndex) => `
            <tr>
              ${row
                .map(
                  (cell) => `
                <${rowIndex === 0 ? 'th' : 'td'} ${rowIndex > 0 && sortedTimeSlots[rowIndex - 1]?.type === 'break' ? 'class="break-time"' : ''}>${cell.replace(/\n/g, '<br/>')}</${rowIndex === 0 ? 'th' : 'td'}>
              `,
                )
                .join('')}
            </tr>
          `,
            )
            .join('')}
        </table>
      </body>
      </html>
    `

    // 创建Blob对象
    const blob = new Blob([content], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `课程表_${dayjs().format('YYYY-MM-DD')}.docx`
    link.click()

    ElMessage.success('Word文件导出成功')
  } catch (error) {
    console.error('导出Word失败:', error)
    ElMessage.error('导出Word失败')
  }
}

// 初始化
onMounted(async () => {
  teacherStore.loadFromStorage()
  courseStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  classStore.loadFromStorage()
  await checkExportAuth()
})
</script>

<style scoped>
.timetable-page {
  max-width: 1400px;
}

.timetable-container {
  min-width: 800px;
}

.timetable-grid {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.grid-header {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  background-color: #f8fafc;
}

.grid-body {
  display: flex;
  flex-direction: column;
}

.grid-row {
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  border-bottom: 1px solid #e5e7eb;
}

.grid-row:last-child {
  border-bottom: none;
}

.time-cell {
  padding: 16px 8px;
  background-color: #f8fafc;
  border-right: 1px solid #e5e7eb;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.time-name {
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.time-range {
  font-size: 12px;
  color: #6b7280;
}

.course-cell {
  padding: 4px;
  border-right: 1px solid #e5e7eb;
  min-height: 80px;
  position: relative;
}

.course-cell:last-child {
  border-right: none;
}

.course-content {
  height: 100%;
  padding: 8px;
  border-radius: 6px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.course-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.course-info {
  margin-bottom: 2px;
}

.course-teacher,
.course-class {
  opacity: 0.9;
  font-size: 11px;
}

.course-subject {
  font-size: 10px;
  opacity: 0.8;
}

.break-time-row {
  background-color: #f8fafc;
}

.break-time-cell {
  background-color: #e3f2fd !important;
  border-right: 1px solid #bbdefb !important;
}

.break-content {
  height: 100%;
  padding: 8px;
  border-radius: 6px;
  color: #1976d2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
}

/* 打印样式 */
@media print {
  .timetable-page {
    max-width: none;
  }

  .print-title {
    page-break-inside: avoid;
  }

  .timetable-grid {
    page-break-inside: avoid;
  }

  .course-content {
    font-size: 10px;
    padding: 4px;
  }

  .break-content {
    font-size: 10px;
    padding: 4px;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .timetable-container {
    overflow-x: auto;
  }

  .grid-header,
  .grid-row {
    grid-template-columns: 100px repeat(7, 120px);
  }

  .course-content {
    font-size: 10px;
    padding: 4px;
  }

  .break-content {
    font-size: 10px;
    padding: 4px;
  }
}
</style>
