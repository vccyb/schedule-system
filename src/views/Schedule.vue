<template>
  <div class="schedule-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">排课管理</h2>
        <p class="text-gray-600 mt-1">先选择班级，然后为该班级安排课程</p>
      </div>
      <div class="flex items-center space-x-3" v-if="selectedClass">
        <el-button
          type="success"
          @click="handleAutoSchedule"
          :icon="Lightning"
          :loading="autoScheduling"
          :disabled="!hasClassRequirements && isSmartScheduleAuthorized"
        >
          智能排课
          <el-tag v-if="!isSmartScheduleAuthorized" size="small" type="warning" class="ml-1"
            >付费</el-tag
          >
        </el-button>
        <el-button type="primary" @click="showAddDialog" :icon="Plus"> 手动排课 </el-button>
        <el-button type="info" @click="showRequirementDialog" :icon="Setting">
          课程需求设置
        </el-button>
      </div>
    </div>

    <!-- 班级选择卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <el-icon class="mr-2 text-blue-500"><School /></el-icon>
        选择班级进行排课
      </h3>

      <div v-if="classStore.classCount === 0" class="text-center py-8">
        <el-icon class="text-4xl text-gray-300 mb-4"><School /></el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无班级信息</h3>
        <p class="text-gray-500 mb-6">请先添加班级信息</p>
        <el-button type="primary" @click="$router.push('/classes')">添加班级</el-button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="classItem in classStore.classes"
          :key="classItem.id"
          class="class-card border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
          :class="{
            'border-blue-500 bg-blue-50': selectedClass === classItem.id,
            'border-gray-200 hover:border-blue-300': selectedClass !== classItem.id,
          }"
          @click="selectClass(classItem.id)"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-gray-900">{{ classItem.name }}</h4>
            <el-tag size="small" type="primary">{{ classItem.grade }}</el-tag>
          </div>

          <div class="text-sm text-gray-600 space-y-1">
            <div class="flex items-center">
              <el-icon class="mr-1"><User /></el-icon>
              {{ classItem.studentCount }} 名学生
            </div>
            <div class="flex items-center">
              <el-icon class="mr-1"><Reading /></el-icon>
              {{ classItem.courseRequirements?.length || 0 }} 门课程需求
            </div>
            <div class="flex items-center">
              <el-icon class="mr-1"><Calendar /></el-icon>
              {{ getClassScheduleCount(classItem.id) }} 节已排课
            </div>
          </div>

          <div v-if="selectedClass === classItem.id" class="mt-3 text-center">
            <el-tag type="success" size="small">已选中</el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程需求和排课状态 -->
    <div v-if="selectedClass" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 课程需求 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <el-icon class="mr-2 text-green-500"><Document /></el-icon>
          课程需求
        </h3>

        <div v-if="currentClassRequirements.length === 0" class="text-center py-8 text-gray-500">
          <el-icon class="text-4xl mb-2"><Document /></el-icon>
          <p>该班级暂无课程需求</p>
          <p class="text-sm mt-1">点击"课程需求设置"添加需求</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="req in currentClassRequirements"
            :key="req.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <span class="font-medium text-gray-900">{{ req.subjectName }}</span>
              <span class="text-sm text-gray-500 ml-2">每周 {{ req.weeklyHours }} 节</span>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600">
                已排: {{ getScheduledHours(req.subjectName) }} / {{ req.weeklyHours }}
              </div>
              <div
                v-if="getScheduledHours(req.subjectName) < req.weeklyHours"
                class="text-xs text-orange-500"
              >
                还需 {{ req.weeklyHours - getScheduledHours(req.subjectName) }} 节
              </div>
              <div v-else class="text-xs text-green-500">已完成</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 排课统计 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <el-icon class="mr-2 text-purple-500"><DataAnalysis /></el-icon>
          排课统计
        </h3>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span class="text-gray-700">总课时数</span>
            <span class="font-semibold text-purple-600">{{
              currentClassScheduleItems.length
            }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span class="text-gray-700">涉及教师</span>
            <span class="font-semibold text-blue-600">{{ uniqueTeachers.length }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span class="text-gray-700">覆盖学科</span>
            <span class="font-semibold text-green-600">{{ uniqueSubjects.length }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span class="text-gray-700">完成度</span>
            <span class="font-semibold text-orange-600">{{ completionRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程表网格 -->
    <div v-if="selectedClass" class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <el-icon class="mr-2 text-indigo-500"><Calendar /></el-icon>
          {{ selectedClassName }} 课程表
        </h3>
        <div class="flex items-center space-x-2">
          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            @click="clearClassSchedule"
            :disabled="currentClassScheduleItems.length === 0"
          >
            清空该班级排课
          </el-button>
        </div>
      </div>

      <div class="schedule-container" :style="getScheduleContainerStyle()">
        <!-- 时间表头 -->
        <div class="schedule-header grid grid-cols-8 gap-1 mb-1">
          <div class="header-cell text-center font-medium text-gray-700 p-3 bg-gray-100 rounded">
            时间/星期
          </div>
          <div
            v-for="day in weekDays"
            :key="day.value"
            class="header-cell text-center font-medium text-gray-700 p-3 bg-gray-100 rounded"
          >
            {{ day.label }}
          </div>
        </div>

        <!-- 课程表主体 -->
        <div class="schedule-body">
          <div
            v-for="timeSlot in scheduleStore.timeSlots"
            :key="timeSlot.id"
            class="schedule-row grid grid-cols-8 gap-1 mb-1"
          >
            <!-- 时间列 -->
            <div class="time-cell bg-gray-50 p-3 rounded flex flex-col justify-center">
              <div class="text-sm font-medium text-gray-700">{{ timeSlot.name }}</div>
              <div class="text-xs text-gray-500">
                {{ timeSlot.startTime }}-{{ timeSlot.endTime }}
              </div>
            </div>

            <!-- 课程格子 -->
            <div
              v-for="day in weekDays"
              :key="`${timeSlot.id}-${day.value}`"
              class="schedule-cell min-h-[80px] bg-white border-2 border-dashed border-gray-200 rounded p-2 relative"
              :class="{
                'border-blue-300 bg-blue-50':
                  dragOverCell === `${day.value}-${timeSlot.id}` &&
                  !isConflictZone(day.value, timeSlot.id),
                'border-green-300 bg-green-50': getScheduleItem(day.value, timeSlot.id),
                'border-red-400 bg-red-50':
                  draggedTeacherId && isConflictZone(day.value, timeSlot.id),
                'cursor-not-allowed': draggedTeacherId && isConflictZone(day.value, timeSlot.id),
              }"
              @dragover.prevent="handleDragOver($event, day.value, timeSlot.id)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, day.value, timeSlot.id)"
              @click="handleCellClick(day.value, timeSlot.id)"
            >
              <!-- 已排课程 -->
              <div
                v-if="getScheduleItem(day.value, timeSlot.id)"
                class="course-block absolute inset-1 rounded p-2 text-white text-xs cursor-move flex flex-col justify-center"
                :style="{ backgroundColor: getScheduleItem(day.value, timeSlot.id)?.color }"
                draggable="true"
                @dragstart="handleDragStart($event, getScheduleItem(day.value, timeSlot.id)!)"
                @dragend="handleDragEnd"
              >
                <div class="font-medium mb-1">
                  {{ getScheduleItem(day.value, timeSlot.id)?.courseName }}
                </div>
                <div class="text-xs opacity-90">
                  {{ getScheduleItem(day.value, timeSlot.id)?.teacherName }}
                </div>
                <div class="text-xs opacity-80">
                  {{ getScheduleItem(day.value, timeSlot.id)?.subject }}
                </div>

                <!-- 删除按钮 -->
                <el-button
                  size="small"
                  type="danger"
                  :icon="Close"
                  circle
                  class="absolute -top-2 -right-2 w-6 h-6"
                  @click.stop="deleteScheduleItem(getScheduleItem(day.value, timeSlot.id)!.id)"
                />
              </div>

              <!-- 空单元格提示 -->
              <div
                v-else
                class="absolute inset-0 flex items-center justify-center text-xs"
                :class="{
                  'text-gray-400': !draggedTeacherId || !isConflictZone(day.value, timeSlot.id),
                  'text-red-500': draggedTeacherId && isConflictZone(day.value, timeSlot.id),
                }"
              >
                <div
                  v-if="draggedTeacherId && isConflictZone(day.value, timeSlot.id)"
                  class="text-center"
                >
                  <div class="flex items-center justify-center mb-1">
                    <el-icon class="mr-1"><WarningFilled /></el-icon>
                    教师冲突
                  </div>
                  <div class="text-xs">不可拖拽</div>
                </div>
                <div v-else>点击排课</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 手动排课对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="手动排课"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="100px">
        <el-form-item label="课程" prop="courseId">
          <el-select
            v-model="addForm.courseId"
            placeholder="请选择课程"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="course in availableCourses"
              :key="course.id"
              :label="`${course.name} - ${course.teacherName} (${course.subject})`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="星期" prop="dayOfWeek">
          <el-select v-model="addForm.dayOfWeek" placeholder="请选择星期" style="width: 100%">
            <el-option
              v-for="day in weekDays"
              :key="day.value"
              :label="day.label"
              :value="day.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="时间段" prop="timeSlotId">
          <el-select v-model="addForm.timeSlotId" placeholder="请选择时间段" style="width: 100%">
            <el-option
              v-for="slot in scheduleStore.timeSlots"
              :key="slot.id"
              :label="`${slot.name} (${slot.startTime}-${slot.endTime})`"
              :value="slot.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddSubmit" :loading="addSubmitting">
            确定排课
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 课程需求设置面板 -->
    <el-drawer
      v-model="requirementPanelVisible"
      title="课程需求设置"
      direction="rtl"
      size="500px"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <el-icon class="mr-2 text-green-500"><Setting /></el-icon>
            {{ selectedClassName }} - 课程需求设置
          </h3>
        </div>
      </template>

      <div class="space-y-6">
        <!-- 添加课程需求按钮 -->
        <div>
          <el-button type="primary" @click="showAddRequirement" :icon="Plus" size="default">
            添加课程需求
          </el-button>
        </div>

        <!-- 课程需求列表 -->
        <div v-if="currentClassRequirements.length === 0" class="text-center py-8 text-gray-500">
          <el-icon class="text-4xl mb-2"><Document /></el-icon>
          <p>该班级暂无课程需求</p>
          <p class="text-sm mt-1">点击上方按钮添加课程需求</p>
        </div>

        <el-table v-else :data="currentClassRequirements" stripe>
          <el-table-column prop="subjectName" label="学科名称" min-width="120" />
          <el-table-column prop="weeklyHours" label="每周课时" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="primary">{{ row.weeklyHours }} 节</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="已排课时" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="
                  getScheduledHours(row.subjectName) >= row.weeklyHours ? 'success' : 'warning'
                "
              >
                {{ getScheduledHours(row.subjectName) }} 节
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="完成状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getScheduledHours(row.subjectName) >= row.weeklyHours ? 'success' : 'info'"
                size="small"
              >
                {{ getScheduledHours(row.subjectName) >= row.weeklyHours ? '已完成' : '进行中' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="editRequirement(row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" link @click="deleteRequirement(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!-- 添加/编辑课程需求对话框 -->
    <el-dialog
      v-model="addRequirementDialogVisible"
      :title="isEditRequirement ? '编辑课程需求' : '添加课程需求'"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="requirementFormRef"
        :model="requirementForm"
        :rules="requirementRules"
        label-width="100px"
      >
        <el-form-item label="学科名称" prop="subjectName">
          <el-select
            v-model="requirementForm.subjectName"
            placeholder="请选择学科"
            style="width: 100%"
            filterable
            allow-create
          >
            <el-option
              v-for="subject in subjectOptions"
              :key="subject"
              :label="subject"
              :value="subject"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="每周课时" prop="weeklyHours">
          <el-input-number
            v-model="requirementForm.weeklyHours"
            :min="1"
            :max="20"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRequirementDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleRequirementSubmit"
            :loading="requirementSubmitting"
          >
            {{ isEditRequirement ? '保存' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  Plus,
  Lightning,
  Delete,
  Reading,
  User,
  Close,
  School,
  Calendar,
  Document,
  DataAnalysis,
  Setting,
  WarningFilled,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { useScheduleStore } from '@/stores/schedule'
import { useClassStore } from '@/stores/class'
import { isFeatureAuthorized } from '@/utils/auth'
import type { Course, ScheduleItem, ClassCourseRequirement } from '@/types'
import { WEEKDAYS } from '@/types'

const router = useRouter()
const teacherStore = useTeacherStore()
const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()
const classStore = useClassStore()

// 检查智能排课是否已授权
const isSmartScheduleAuthorized = ref(false)

// 初始化授权状态
const checkSmartScheduleAuth = async () => {
  isSmartScheduleAuthorized.value = await isFeatureAuthorized('SMART_SCHEDULE')
}

// 响应式数据
const selectedClass = ref('')
const dragOverCell = ref('')
const draggedItem = ref<ScheduleItem | Course | null>(null)
const addDialogVisible = ref(false)
const addSubmitting = ref(false)
const addFormRef = ref<FormInstance>()
const autoScheduling = ref(false)
const draggedTeacherId = ref('') // 拖拽课程的教师ID

// 手动排课表单
const addForm = reactive({
  courseId: '',
  dayOfWeek: 1 as number,
  timeSlotId: '',
})

const addRules: FormRules = {
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  dayOfWeek: [{ required: true, message: '请选择星期', trigger: 'change' }],
  timeSlotId: [{ required: true, message: '请选择时间段', trigger: 'change' }],
}

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

// 计算属性
const selectedClassName = computed(() => {
  const classItem = classStore.getClassById(selectedClass.value)
  return classItem ? `${classItem.name} (${classItem.grade})` : ''
})

const currentClassRequirements = computed(() => {
  return selectedClass.value ? classStore.getClassRequirements(selectedClass.value) : []
})

const currentClassScheduleItems = computed(() => {
  return selectedClass.value ? scheduleStore.getScheduleByClass(selectedClass.value) : []
})

const hasClassRequirements = computed(() => {
  return currentClassRequirements.value.length > 0
})

const availableCourses = computed(() => {
  return courseStore.courses.map((course) => ({
    ...course,
    teacherName: teacherStore.getTeacherById(course.teacherId)?.name || '未知教师',
  }))
})

const uniqueTeachers = computed(() => {
  const teacherIds = [...new Set(currentClassScheduleItems.value.map((item) => item.teacherId))]
  return teacherIds
})

const uniqueSubjects = computed(() => {
  const subjects = [...new Set(currentClassScheduleItems.value.map((item) => item.subject))]
  return subjects
})

const completionRate = computed(() => {
  const totalRequired = currentClassRequirements.value.reduce(
    (sum, req) => sum + req.weeklyHours,
    0,
  )
  const totalScheduled = currentClassScheduleItems.value.length
  return totalRequired > 0 ? Math.round((totalScheduled / totalRequired) * 100) : 0
})

// 检查教师在指定时间段是否有冲突
const hasTeacherConflict = computed(() => {
  return (dayOfWeek: number, timeSlotId: string, teacherId: string) => {
    if (!teacherId) return false

    // 获取该教师在指定时间的课程，但排除正在被拖拽的课程
    const conflictingSchedule = scheduleStore.scheduleItems.find(
      (item) =>
        item.dayOfWeek === dayOfWeek &&
        item.timeSlotId === timeSlotId &&
        item.teacherId === teacherId &&
        item.id !== draggedItem.value?.id, // 排除正在被拖拽的课程
    )

    // 调试输出（可在控制台查看）
    if (draggedItem.value && teacherId === draggedTeacherId.value) {
      console.log(`冲突检测 - 日期:${dayOfWeek} 时段:${timeSlotId} 教师:${teacherId}`, {
        拖拽中的课程ID: draggedItem.value?.id,
        找到的冲突课程: conflictingSchedule,
        结果: !!conflictingSchedule,
      })
    }

    return !!conflictingSchedule
  }
})

// 检查是否为冲突区域（拖拽时用）
const isConflictZone = computed(() => {
  return (dayOfWeek: number, timeSlotId: string) => {
    if (!draggedTeacherId.value) return false
    return hasTeacherConflict.value(dayOfWeek, timeSlotId, draggedTeacherId.value)
  }
})

// 方法
const selectClass = (classId: string) => {
  selectedClass.value = classId
}

const getClassScheduleCount = (classId: string) => {
  return scheduleStore.getScheduleByClass(classId).length
}

const getScheduleItem = (dayOfWeek: number, timeSlotId: string) => {
  return currentClassScheduleItems.value.find(
    (item) => item.dayOfWeek === dayOfWeek && item.timeSlotId === timeSlotId,
  )
}

const getScheduledHours = (subjectName: string) => {
  return currentClassScheduleItems.value.filter((item) => item.subject === subjectName).length
}

// 拖拽相关方法
const handleDragStart = (event: DragEvent, item: ScheduleItem) => {
  // 强制清理所有之前的拖拽状态
  draggedItem.value = null
  draggedTeacherId.value = ''
  dragOverCell.value = ''

  // 等待一帧再设置新状态，确保界面更新
  setTimeout(() => {
    draggedItem.value = item
    draggedTeacherId.value = item.teacherId // 记录拖拽课程的教师ID

    console.log('开始拖拽课程:', {
      课程ID: item.id,
      课程名称: item.courseName,
      教师ID: item.teacherId,
      教师名称: item.teacherName,
      原位置: `周${item.dayOfWeek}第${item.timeSlotId}节`,
    })
  }, 0)

  event.dataTransfer?.setData('text/plain', item.id)
}

const handleDragOver = (event: DragEvent, dayOfWeek: number, timeSlotId: string) => {
  event.preventDefault()
  dragOverCell.value = `${dayOfWeek}-${timeSlotId}`
}

// 全局拖拽状态重置函数
const resetDragState = () => {
  console.log('重置拖拽状态')
  draggedItem.value = null
  dragOverCell.value = ''
  draggedTeacherId.value = ''
}

const handleDragLeave = () => {
  dragOverCell.value = ''
}

const handleDragEnd = () => {
  console.log('拖拽结束事件')
  // 等待一个短暂的延迟再清理状态，确保 drop 事件先完成
  setTimeout(() => {
    resetDragState()
  }, 150) // 增加延迟时间
}

const handleDrop = async (event: DragEvent, dayOfWeek: number, timeSlotId: string) => {
  event.preventDefault()
  dragOverCell.value = ''

  console.log('尝试放置课程:', {
    目标位置: `周${dayOfWeek}第${timeSlotId}节`,
    拖拽中的课程: draggedItem.value,
    拖拽中的教师ID: draggedTeacherId.value,
  })

  if (!draggedItem.value || !selectedClass.value) {
    console.log('无效的拖拽操作，清理状态')
    // 如果没有拖拽项，先清理状态
    resetDragState()
    return
  }

  // 检查教师冲突（使用更新后的冲突检测逻辑）
  const hasConflict = isConflictZone.value(dayOfWeek, timeSlotId)
  console.log('冲突检测结果:', hasConflict)

  if (draggedTeacherId.value && hasConflict) {
    console.log('检测到教师冲突，拒绝拖拽')
    ElMessage.error('该时间段教师已有课程安排，无法拖拽！')
    // 拖拽失败时清理状态
    resetDragState()
    return
  }

  const currentDraggedItem = draggedItem.value

  console.log('准备移动课程:', currentDraggedItem)

  // 立即清理拖拽状态，防止干扰后续操作
  resetDragState()

  try {
    if ('courseId' in currentDraggedItem) {
      // 移动已有的排课
      const scheduleItem = currentDraggedItem as ScheduleItem
      console.log('执行课程移动:', {
        课程ID: scheduleItem.id,
        从: `周${scheduleItem.dayOfWeek}第${scheduleItem.timeSlotId}节`,
        到: `周${dayOfWeek}第${timeSlotId}节`,
      })

      await scheduleStore.moveScheduleItem(scheduleItem.id, dayOfWeek, timeSlotId)
      ElMessage.success('课程移动成功')

      console.log('课程移动成功完成')
    }
  } catch (error: any) {
    console.error('课程移动失败:', error)
    ElMessage.error(error.message || '排课失败')
  }
}

const handleCellClick = (dayOfWeek: number, timeSlotId: string) => {
  if (!selectedClass.value) return

  addForm.dayOfWeek = dayOfWeek
  addForm.timeSlotId = timeSlotId
  addForm.courseId = ''
  showAddDialog()
}

const showAddDialog = () => {
  if (!selectedClass.value) {
    ElMessage.warning('请先选择班级')
    return
  }
  addDialogVisible.value = true
}

const handleAddSubmit = async () => {
  if (!addFormRef.value || !selectedClass.value) return

  try {
    await addFormRef.value.validate()
    addSubmitting.value = true

    const course = courseStore.getCourseById(addForm.courseId)
    const teacher = teacherStore.getTeacherById(course?.teacherId || '')
    const classItem = classStore.getClassById(selectedClass.value)

    if (!course || !teacher || !classItem) {
      ElMessage.error('数据不完整，排课失败')
      return
    }

    await scheduleStore.addScheduleItem({
      courseId: course.id,
      courseName: course.name,
      teacherId: course.teacherId,
      teacherName: teacher.name,
      classId: selectedClass.value,
      className: classItem.name,
      timeSlotId: addForm.timeSlotId,
      dayOfWeek: addForm.dayOfWeek,
      subject: course.subject,
      color: course.color,
    })

    ElMessage.success('排课成功')
    addDialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '排课失败')
  } finally {
    addSubmitting.value = false
  }
}

const deleteScheduleItem = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个课程安排吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    scheduleStore.deleteScheduleItem(id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const clearClassSchedule = async () => {
  if (!selectedClass.value) return

  try {
    await ElMessageBox.confirm(
      `确定要清空${selectedClassName.value}的所有课程安排吗？`,
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    const classSchedules = scheduleStore.getScheduleByClass(selectedClass.value)
    classSchedules.forEach((schedule) => {
      scheduleStore.deleteScheduleItem(schedule.id)
    })

    ElMessage.success('清空成功')
  } catch {
    ElMessage.info('已取消操作')
  }
}

// 课程需求设置相关状态
const requirementPanelVisible = ref(false)
const addRequirementDialogVisible = ref(false)
const isEditRequirement = ref(false)
const currentRequirementId = ref('')
const requirementSubmitting = ref(false)

// 课程需求表单
const requirementForm = reactive({
  subjectName: '',
  weeklyHours: 2,
})

// 课程需求表单引用
const requirementFormRef = ref<FormInstance>()

// 课程需求表单验证规则
const requirementRules: FormRules = {
  subjectName: [{ required: true, message: '请输入学科名称', trigger: 'blur' }],
  weeklyHours: [{ required: true, message: '请输入每周课时数', trigger: 'blur' }],
}

// 学科选项（常用学科）
const subjectOptions = [
  '语文',
  '数学',
  '英语',
  '物理',
  '化学',
  '生物',
  '政治',
  '历史',
  '地理',
  '体育',
  '音乐',
  '美术',
  '信息技术',
  '通用技术',
  '心理健康',
  '班会',
]

const showRequirementDialog = () => {
  if (!selectedClass.value) {
    ElMessage.warning('请先选择班级')
    return
  }
  requirementPanelVisible.value = true
}

// 显示添加课程需求对话框
const showAddRequirement = () => {
  isEditRequirement.value = false
  requirementForm.subjectName = ''
  requirementForm.weeklyHours = 2
  addRequirementDialogVisible.value = true
}

// 编辑课程需求
const editRequirement = (requirement: ClassCourseRequirement) => {
  isEditRequirement.value = true
  currentRequirementId.value = requirement.id
  requirementForm.subjectName = requirement.subjectName
  requirementForm.weeklyHours = requirement.weeklyHours
  addRequirementDialogVisible.value = true
}

// 提交课程需求表单
const handleRequirementSubmit = async () => {
  if (!requirementFormRef.value || !selectedClass.value) return

  try {
    await requirementFormRef.value.validate()
    requirementSubmitting.value = true

    if (isEditRequirement.value) {
      // 编辑课程需求
      classStore.updateCourseRequirement(selectedClass.value, currentRequirementId.value, {
        subjectName: requirementForm.subjectName,
        weeklyHours: requirementForm.weeklyHours,
      })
      ElMessage.success('课程需求更新成功')
    } else {
      // 检查是否已存在相同学科的需求
      const existing = currentClassRequirements.value.find(
        (req) => req.subjectName === requirementForm.subjectName,
      )
      if (existing) {
        ElMessage.error('该学科的课程需求已存在')
        return
      }

      // 添加课程需求
      classStore.addCourseRequirement(selectedClass.value, {
        subjectName: requirementForm.subjectName,
        weeklyHours: requirementForm.weeklyHours,
      })
      ElMessage.success('课程需求添加成功')
    }

    addRequirementDialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    requirementSubmitting.value = false
  }
}

// 删除课程需求
const deleteRequirement = async (requirementId: string) => {
  if (!selectedClass.value) return

  try {
    await ElMessageBox.confirm('确定要删除这个课程需求吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    classStore.deleteCourseRequirement(selectedClass.value, requirementId)
    ElMessage.success('课程需求删除成功')
  } catch {
    // 用户取消删除
  }
}

// 智能排课
const handleAutoSchedule = async () => {
  // 检查授权
  await checkSmartScheduleAuth()
  if (!isSmartScheduleAuthorized.value) {
    ElMessage.warning('智能排课是付费功能，请先获取授权码')
    router.push('/auth')
    return
  }

  if (!selectedClass.value) {
    ElMessage.warning('请先选择班级')
    return
  }

  if (!hasClassRequirements.value) {
    ElMessage.warning('请先为该班级设置课程需求')
    return
  }

  try {
    autoScheduling.value = true

    const result = scheduleStore.autoScheduleForClass(selectedClass.value, courseStore, classStore)

    if (result.success) {
      ElMessage.success(result.message)

      if (result.unscheduledRequirements.length > 0) {
        const unscheduledInfo = result.unscheduledRequirements
          .map((req) => `${req.subjectName}: 还需${req.remainingHours}节 (${req.reason})`)
          .join('\n')

        ElMessageBox.alert(`以下课程需求未能完全安排：\n${unscheduledInfo}`, '排课提醒', {
          type: 'warning',
        })
      }
    } else {
      ElMessage.error(result.message)
    }
  } catch (error: any) {
    ElMessage.error(error.message || '智能排课失败')
  } finally {
    autoScheduling.value = false
  }
}

// 计算最小宽度
const calculateMinWidth = () => {
  // 基础宽度：时间列(120px) + 星期列数 * 每列最小宽度(150px)
  const baseWidth = 120 + weekDays.value.length * 150
  // 确保最小宽度至少为800px
  return `${Math.max(baseWidth, 800)}px`
}

// 获取课程表容器样式
const getScheduleContainerStyle = () => {
  return {
    minWidth: calculateMinWidth(),
    gridTemplateColumns: `120px repeat(${weekDays.value.length}, 1fr)`,
  }
}

// 初始化
onMounted(async () => {
  teacherStore.loadFromStorage()
  courseStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  classStore.loadFromStorage()
  await checkSmartScheduleAuth()
})
</script>

<style scoped>
.schedule-page {
  max-width: 1400px;
}

.class-card:hover {
  transform: translateY(-1px);
}

.schedule-container {
  min-width: 800px;
  overflow-x: auto;
}

.schedule-header {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.header-cell {
  font-weight: 600;
  color: #374151;
}

.time-cell {
  min-height: 80px;
}

.schedule-cell {
  transition: all 0.2s ease;
}

.schedule-cell:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.schedule-cell.cursor-not-allowed:hover {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.course-block {
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-block:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .schedule-container {
    overflow-x: auto;
  }

  .class-card {
    min-height: 120px;
  }
}
</style>
