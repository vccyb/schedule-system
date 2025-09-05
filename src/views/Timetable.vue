<template>
  <div class="timetable-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">课程表</h2>
        <p class="text-gray-600 mt-1">查看完整的课程安排，支持导出为Excel或PDF格式</p>
      </div>
      <div class="flex items-center space-x-3">
        <el-button
          type="success"
          @click="handleExportToExcel"
          :icon="Download"
          :disabled="scheduleStore.scheduleCount === 0"
        >
          导出Excel
          <el-tag v-if="!isExportAuthorized" size="small" type="warning" class="ml-1">付费</el-tag>
        </el-button>
        <el-button
          type="primary"
          @click="handleExportToPDF"
          :icon="Printer"
          :disabled="scheduleStore.scheduleCount === 0"
        >
          导出PDF
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
            </el-radio-group>
          </div>
        </div>

        <div class="text-sm text-gray-600">
          当前视角：{{ currentView === ViewType.CLASS ? '班级视角' : '教师视角' }}
        </div>
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

        <el-text class="text-sm text-gray-600"> 利用率: {{ utilizationRate }}% </el-text>
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
            请选择班级或教师查看对应课程表
          </p>
        </div>

        <!-- 课程表网格 -->
        <div class="timetable-grid">
          <!-- 表头 -->
          <div class="grid-header">
            <div class="header-cell corner-cell">时间\星期</div>
            <div v-for="day in weekDays" :key="day.value" class="header-cell day-header">
              {{ day.label }}
            </div>
          </div>

          <!-- 表体 -->
          <div class="grid-body">
            <div v-for="timeSlot in scheduleStore.timeSlots" :key="timeSlot.id" class="grid-row">
              <!-- 时间列 -->
              <div class="time-cell">
                <div class="time-name">{{ timeSlot.name }}</div>
                <div class="time-range">{{ timeSlot.startTime }}-{{ timeSlot.endTime }}</div>
              </div>

              <!-- 课程格子 -->
              <div
                v-for="day in weekDays"
                :key="`${timeSlot.id}-${day.value}`"
                class="course-cell"
                :class="{ 'has-course': getScheduleItem(day.value, timeSlot.id) }"
              >
                <div
                  v-if="getScheduleItem(day.value, timeSlot.id)"
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

        <!-- 统计信息 -->
        <div class="mt-8 print-stats">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">课程表统计</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="stat-card">
              <div class="stat-label">当前课程数</div>
              <div class="stat-value">{{ filteredScheduleItems.length }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">系统总课程数</div>
              <div class="stat-value">{{ courseStore.courseCount }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">系统总教师数</div>
              <div class="stat-value">{{ teacherStore.teacherCount }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">系统已排课时</div>
              <div class="stat-value">{{ scheduleStore.scheduleCount }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">课程表利用率</div>
              <div class="stat-value">{{ utilizationRate }}%</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">涉及教师</div>
              <div class="stat-value">{{ uniqueTeachers.length }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">覆盖学科</div>
              <div class="stat-value">{{ uniqueSubjects.length }}</div>
            </div>

            <div class="stat-card">
              <div class="stat-label">
                {{ currentView === ViewType.CLASS ? '班级完成度' : '教师负荷' }}
              </div>
              <div class="stat-value">{{ currentViewCompletionRate }}%</div>
            </div>
          </div>
        </div>

        <!-- 教师课程统计 -->
        <div class="mt-8 print-teacher-stats">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">教师课程统计</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="teacher in teacherStats" :key="teacher.id" class="teacher-stat-card">
              <div class="flex items-center mb-2">
                <el-avatar
                  :size="32"
                  class="mr-2"
                  :style="{ backgroundColor: getAvatarColor(teacher.name) }"
                >
                  {{ teacher.name.charAt(0) }}
                </el-avatar>
                <div>
                  <div class="font-medium text-gray-900">{{ teacher.name }}</div>
                  <div class="text-sm text-gray-500">{{ teacher.subject }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                课程数: {{ teacher.courseCount }} | 课时数: {{ teacher.scheduleCount }}
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
          {{ currentView === ViewType.CLASS ? '请选择班级' : '请选择教师' }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{
            currentView === ViewType.CLASS
              ? '选择一个班级查看该班级的课程表'
              : '选择一位教师查看该教师的课程表'
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
import { Download, Printer, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { useScheduleStore } from '@/stores/schedule'
import { useClassStore } from '@/stores/class'
import { isFeatureAuthorized } from '@/utils/auth'
import type { ScheduleItem } from '@/types'
import { WEEKDAYS, ViewType } from '@/types'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
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
const currentView = ref<ViewType>(ViewType.CLASS)
const timetableRef = ref()

// 星期选项（从周一开始）
const weekDays = WEEKDAYS.slice(1)

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日')
})

// 计算属性
const subjectOptions = computed(() => {
  const subjects = [...new Set(courseStore.courses.map((c) => c.subject))]
  return subjects.sort()
})

// 是否有选择
const hasSelection = computed(() => {
  if (currentView.value === ViewType.CLASS) {
    return selectedClass.value !== ''
  } else {
    return selectedTeacher.value !== ''
  }
})

// 课程表标题
const timetableTitle = computed(() => {
  if (currentView.value === ViewType.CLASS) {
    if (selectedClass.value) {
      const classItem = classStore.getClassById(selectedClass.value)
      return classItem ? `${classItem.name} 班级课程表` : '班级课程表'
    } else {
      return '班级课程表'
    }
  } else {
    if (selectedTeacher.value) {
      const teacher = teacherStore.getTeacherById(selectedTeacher.value)
      return teacher ? `${teacher.name} 教师课程表` : '教师课程表'
    } else {
      return '教师课程表'
    }
  }
})

const filteredScheduleItems = computed(() => {
  // 如果没有选择班级或教师，不显示任何课程
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

  // 按学科筛选
  if (selectedSubject.value) {
    items = items.filter((item) => item.subject === selectedSubject.value)
  }

  return items
})

// 课程表利用率
const utilizationRate = computed(() => {
  const totalSlots = scheduleStore.timeSlots.length * weekDays.length
  const usedSlots = filteredScheduleItems.value.length
  return totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0
})

// 教师统计
const teacherStats = computed(() => {
  return teacherStore.teachers
    .map((teacher) => {
      const teacherCourses = courseStore.getCoursesByTeacher(teacher.id)
      const teacherSchedules = scheduleStore.getScheduleByTeacher(teacher.id)

      return {
        ...teacher,
        courseCount: teacherCourses.length,
        scheduleCount: teacherSchedules.length,
      }
    })
    .sort((a, b) => b.scheduleCount - a.scheduleCount)
})

// 当前视图涉及的唯一教师
const uniqueTeachers = computed(() => {
  const teacherIds = [...new Set(filteredScheduleItems.value.map((item) => item.teacherId))]
  return teacherIds
})

// 当前视图覆盖的唯一学科
const uniqueSubjects = computed(() => {
  const subjects = [...new Set(filteredScheduleItems.value.map((item) => item.subject))]
  return subjects
})

// 当前视角完成度计算
const currentViewCompletionRate = computed(() => {
  if (currentView.value === ViewType.CLASS && selectedClass.value) {
    // 班级视角：计算课程需求完成度
    const requirements = classStore.getClassRequirements(selectedClass.value)
    if (requirements.length === 0) return 0

    const totalRequired = requirements.reduce((sum, req) => sum + req.weeklyHours, 0)
    const totalScheduled = filteredScheduleItems.value.length
    return totalRequired > 0 ? Math.round((totalScheduled / totalRequired) * 100) : 0
  } else if (currentView.value === ViewType.TEACHER && selectedTeacher.value) {
    // 教师视角：计算教师工作负荷（以每天最多8节课为基准）
    const maxCoursesPerWeek = scheduleStore.timeSlots.length * 5 // 5个工作日
    const teacherCourses = filteredScheduleItems.value.length
    return maxCoursesPerWeek > 0 ? Math.round((teacherCourses / maxCoursesPerWeek) * 100) : 0
  }
  return 0
})

// 方法
const getScheduleItem = (dayOfWeek: number, timeSlotId: string): ScheduleItem | undefined => {
  return filteredScheduleItems.value.find(
    (item) => item.dayOfWeek === dayOfWeek && item.timeSlotId === timeSlotId,
  )
}

const getAvatarColor = (name: string) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const filterTimetable = () => {
  // 触发重新计算过滤后的课程表
}

// 处理视角切换
const handleViewChange = () => {
  // 切换视角时清空筛选条件
  selectedClass.value = ''
  selectedTeacher.value = ''
  selectedSubject.value = ''
}

// 处理导出Excel点击
const handleExportToExcel = async () => {
  await checkExportAuth()
  if (!isExportAuthorized.value) {
    ElMessage.warning('导出功能是付费功能，请先获取授权码')
    router.push('/auth')
    return
  }
  exportToExcel()
}

// 处理导出PDF点击
const handleExportToPDF = async () => {
  await checkExportAuth()
  if (!isExportAuthorized.value) {
    ElMessage.warning('导出功能是付费功能，请先获取授权码')
    router.push('/auth')
    return
  }
  exportToPDF()
}

// 导出Excel
const exportToExcel = () => {
  try {
    const workbook = XLSX.utils.book_new()

    // 创建课程表数据
    const timetableData: (string | number)[][] = []

    // 表头
    const headers = ['时间', ...weekDays.map((day) => day.label)]
    timetableData.push(headers)

    // 数据行
    scheduleStore.timeSlots.forEach((timeSlot) => {
      const row = [`${timeSlot.name}\n${timeSlot.startTime}-${timeSlot.endTime}`]

      weekDays.forEach((day) => {
        const scheduleItem = getScheduleItem(day.value, timeSlot.id)
        if (scheduleItem) {
          if (currentView.value === ViewType.TEACHER) {
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
      })

      timetableData.push(row)
    })

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(timetableData)

    // 设置列宽
    const colWidths = [{ wch: 15 }, ...weekDays.map(() => ({ wch: 20 }))]
    worksheet['!cols'] = colWidths

    // 设置行高
    const rowHeights = timetableData.map(() => ({ hpt: 60 }))
    worksheet['!rows'] = rowHeights

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '课程表')

    // 创建统计表
    const statsData: (string | number)[][] = [
      ['统计项目', '数值'],
      ['总课程数', courseStore.courseCount],
      ['总教师数', teacherStore.teacherCount],
      ['已排课时', scheduleStore.scheduleCount],
      ['利用率', `${utilizationRate.value}%`],
      [''],
      ['教师', '学科', '课程数', '课时数'],
    ]

    teacherStats.value.forEach((teacher) => {
      statsData.push([teacher.name, teacher.subject, teacher.courseCount, teacher.scheduleCount])
    })

    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData)
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '统计信息')

    // 导出文件
    const fileName = `课程表_${dayjs().format('YYYY-MM-DD')}.xlsx`
    XLSX.writeFile(workbook, fileName)

    ElMessage.success('Excel文件导出成功')
  } catch (error) {
    console.error('导出Excel失败:', error)
    ElMessage.error('导出Excel失败')
  }
}

// 导出PDF
const exportToPDF = async () => {
  try {
    const element = document.getElementById('timetable-content')
    if (!element) {
      ElMessage.error('找不到课程表内容')
      return
    }

    ElMessage.info('正在生成PDF，请稍候...')

    // 生成画布
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')

    // 创建PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const imgWidth = 297 // A4横向宽度
    const pageHeight = 210 // A4横向高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // 如果内容超过一页，添加更多页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // 保存PDF
    const fileName = `课程表_${dayjs().format('YYYY-MM-DD')}.pdf`
    pdf.save(fileName)

    ElMessage.success('PDF文件导出成功')
  } catch (error) {
    console.error('导出PDF失败:', error)
    ElMessage.error('导出PDF失败')
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
  grid-template-columns: 120px repeat(6, 1fr);
  background-color: #f8fafc;
}

.header-cell {
  padding: 12px 8px;
  font-weight: 600;
  text-align: center;
  border-right: 1px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb;
}

.corner-cell {
  background-color: #f1f5f9;
}

.day-header {
  color: #374151;
}

.grid-body {
  display: flex;
  flex-direction: column;
}

.grid-row {
  display: grid;
  grid-template-columns: 120px repeat(6, 1fr);
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

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
}

.teacher-stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
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

  .stat-card,
  .teacher-stat-card {
    break-inside: avoid;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .timetable-container {
    overflow-x: auto;
  }

  .grid-header,
  .grid-row {
    grid-template-columns: 100px repeat(6, 120px);
  }

  .course-content {
    font-size: 10px;
    padding: 4px;
  }
}
</style>
