<template>
  <div class="school-settings-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">学校设置</h2>
        <p class="text-gray-600 mt-1">配置学校的课程时间安排和基本信息</p>
      </div>
    </div>

    <!-- 设置选项卡 -->
    <el-tabs v-model="activeTab" type="card" class="bg-white rounded-lg shadow-sm">
      <!-- 时间配置 -->
      <el-tab-pane label="时间配置" name="time">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">课程时间配置</h3>

          <!-- 模板应用 -->
          <div class="mb-6 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-gray-900">应用时间配置模板</h4>
            </div>
            <div class="flex flex-wrap gap-2">
              <el-button @click="applyTemplate('primary')" size="small">小学模板</el-button>
              <el-button @click="applyTemplate('middle')" size="small">中学模板</el-button>
              <el-button @click="applyTemplate('high')" size="small">高中模板</el-button>
              <el-button @click="applyTemplate('custom')" size="small">自定义模板</el-button>
              <el-button @click="resetTimeSettings" size="small" type="danger" :icon="Delete"
                >重置默认</el-button
              >
            </div>
          </div>

          <!-- 每日课时配置 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <el-card>
              <template #header>
                <div class="flex items-center">
                  <el-icon class="mr-2"><Calendar /></el-icon>
                  <span>每日课时数</span>
                </div>
              </template>
              <el-form-item label="每日课时数">
                <el-input-number
                  v-model="timeForm.dailyPeriods"
                  :min="1"
                  :max="15"
                  @change="handleDailyPeriodsChange"
                  style="width: 100%"
                />
              </el-form-item>
            </el-card>

            <el-card>
              <template #header>
                <div class="flex items-center">
                  <el-icon class="mr-2"><Timer /></el-icon>
                  <span>每节课时长</span>
                </div>
              </template>
              <el-form-item label="每节课时长(分钟)">
                <el-input-number
                  v-model="timeForm.periodDuration"
                  :min="10"
                  :max="120"
                  @change="handlePeriodDurationChange"
                  style="width: 100%"
                />
              </el-form-item>
            </el-card>
          </div>

          <!-- 时间段配置 -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium text-gray-900">课程时间段配置</h4>
              <el-button @click="addTimeSlot" type="primary" :icon="Plus">添加时间段</el-button>
            </div>

            <el-table :data="timeForm.timeSlots" style="width: 100%" border>
              <el-table-column prop="name" label="节次" width="120">
                <template #default="{ row }">
                  <el-input v-model="row.name" size="small" />
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="150">
                <template #default="{ row }">
                  <el-time-picker
                    v-model="row.startTime"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间" width="150">
                <template #default="{ row }">
                  <el-time-picker
                    v-model="row.endTime"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ $index }">
                  <el-button
                    @click="removeTimeSlot($index)"
                    type="danger"
                    size="small"
                    :icon="Delete"
                    circle
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 休息时间配置 -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-medium text-gray-900">休息时间配置</h4>
              <el-button @click="addBreakTime" type="primary" :icon="Plus">添加休息时间</el-button>
            </div>

            <el-table :data="timeForm.breakTimes" style="width: 100%" border>
              <el-table-column prop="name" label="休息时间名称" width="150">
                <template #default="{ row }">
                  <el-input v-model="row.name" size="small" />
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="150">
                <template #default="{ row }">
                  <el-time-picker
                    v-model="row.startTime"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间" width="150">
                <template #default="{ row }">
                  <el-time-picker
                    v-model="row.endTime"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="选择时间"
                    size="small"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ $index }">
                  <el-button
                    @click="removeBreakTime($index)"
                    type="danger"
                    size="small"
                    :icon="Delete"
                    circle
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="flex justify-end space-x-3">
            <el-button @click="resetTimeSettings" type="warning">重置</el-button>
            <el-button @click="saveTimeSettings" type="primary">保存时间配置</el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 学校信息配置 -->
      <el-tab-pane label="学校信息" name="school">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">学校基本信息</h3>

          <el-form :model="schoolForm" label-width="120px" class="max-w-2xl">
            <el-form-item label="学校名称">
              <el-input v-model="schoolForm.schoolName" placeholder="请输入学校名称" />
            </el-form-item>

            <el-form-item label="学期名称">
              <el-input v-model="schoolForm.semesterName" placeholder="请输入学期名称" />
            </el-form-item>

            <el-form-item label="默认年级">
              <el-select
                v-model="schoolForm.defaultGrade"
                placeholder="请选择默认年级"
                style="width: 100%"
              >
                <el-option
                  v-for="grade in GRADE_OPTIONS"
                  :key="grade"
                  :label="grade"
                  :value="grade"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="上课日">
              <el-checkbox-group v-model="schoolForm.schoolDays">
                <el-checkbox label="1">周一</el-checkbox>
                <el-checkbox label="2">周二</el-checkbox>
                <el-checkbox label="3">周三</el-checkbox>
                <el-checkbox label="4">周四</el-checkbox>
                <el-checkbox label="5">周五</el-checkbox>
                <el-checkbox label="6">周六</el-checkbox>
                <el-checkbox label="7">周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <div class="flex justify-end space-x-3 mt-6">
              <el-button @click="resetSchoolSettings" type="warning">重置</el-button>
              <el-button @click="saveSchoolSettings" type="primary">保存学校信息</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>

      <!-- 校区配置 -->
      <el-tab-pane label="校区管理" name="campus">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">校区信息管理</h3>

          <div class="mb-4">
            <el-button @click="addCampus" type="primary" :icon="Plus">添加校区</el-button>
          </div>

          <el-table :data="campusForm.campuses" style="width: 100%" border>
            <el-table-column prop="name" label="校区名称" width="200">
              <template #default="{ row }">
                <el-input v-model="row.name" size="small" placeholder="校区名称" />
              </template>
            </el-table-column>
            <el-table-column prop="code" label="校区代码" width="150">
              <template #default="{ row }">
                <el-input v-model="row.code" size="small" placeholder="校区代码" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ $index }">
                <el-button
                  @click="removeCampus($index)"
                  type="danger"
                  size="small"
                  :icon="Delete"
                  circle
                />
              </template>
            </el-table-column>
          </el-table>

          <div class="flex justify-end space-x-3 mt-6">
            <el-button @click="resetCampusSettings" type="warning">重置</el-button>
            <el-button @click="saveCampusSettings" type="primary">保存校区配置</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { useScheduleStore } from '@/stores/schedule'
import { useClassStore } from '@/stores/class'
import { GRADE_OPTIONS } from '@/types'
import type { TimeSlot } from '@/types'

const scheduleStore = useScheduleStore()
const classStore = useClassStore()

// 活动标签页
const activeTab = ref('time')

// 时间配置表单数据
const timeForm = ref({
  dailyPeriods: 8,
  periodDuration: 40,
  timeSlots: [] as TimeSlot[],
  breakTimes: [] as { id: string; name: string; startTime: string; endTime: string }[],
})

// 学校信息配置表单数据
const schoolForm = ref({
  schoolName: '默认学校',
  semesterName: '2023-2024学年',
  schoolDays: ['1', '2', '3', '4', '5'], // 默认周一到周五上课
  defaultGrade: '一年级',
})

// 校区配置表单数据
const campusForm = ref({
  campuses: [] as { id: string; name: string; code: string }[],
})

// 保存初始的上课日设置
let initialSchoolDays: string[] = []

// 监听上课日变化
watch(
  () => schoolForm.value.schoolDays,
  (newVal, oldVal) => {
    // 只有当旧值存在且新旧值不同时才触发
    if (
      oldVal &&
      JSON.stringify(newVal) !== JSON.stringify(oldVal) &&
      JSON.stringify(oldVal) !== JSON.stringify(initialSchoolDays)
    ) {
      // 检查是否有已排课程
      if (scheduleStore.scheduleCount > 0) {
        ElMessageBox.confirm(
          '更改上课日设置将影响已排课程，系统需要清空所有排课数据以确保数据一致性。确定要继续吗？',
          '警告：将清空所有排课数据',
          {
            type: 'warning',
            confirmButtonText: '确定并清空排课',
            cancelButtonText: '取消',
          },
        )
          .then(() => {
            // 清空所有排课数据
            scheduleStore.clearAllSchedule()
            ElMessage.success('已清空所有排课数据，请重新进行排课')
          })
          .catch(() => {
            // 恢复原来的设置
            schoolForm.value.schoolDays = [...oldVal]
            ElMessage.info('已取消操作')
          })
      }
    }
  },
  { deep: true },
)

// 应用时间配置模板
const applyTemplate = (templateType: string) => {
  ElMessageBox.confirm('应用模板将覆盖当前的时间配置，确定要继续吗？', '确认应用模板', {
    type: 'warning',
  })
    .then(() => {
      switch (templateType) {
        case 'primary':
          // 小学标准模板：上午4节，下午3节，课间休息10分钟
          timeForm.value.dailyPeriods = 7
          timeForm.value.periodDuration = 40
          timeForm.value.timeSlots = [
            { id: '1', name: '第一节', startTime: '08:00', endTime: '08:40' },
            { id: '2', name: '第二节', startTime: '08:50', endTime: '09:30' },
            { id: '3', name: '第三节', startTime: '09:40', endTime: '10:20' },
            { id: '4', name: '第四节', startTime: '10:30', endTime: '11:10' },
            { id: '5', name: '第五节', startTime: '14:00', endTime: '14:40' },
            { id: '6', name: '第六节', startTime: '14:50', endTime: '15:30' },
            { id: '7', name: '第七节', startTime: '15:40', endTime: '16:20' },
          ]
          timeForm.value.breakTimes = [
            { id: 'break-1', name: '课间休息', startTime: '10:20', endTime: '10:30' },
            { id: 'break-2', name: '午休', startTime: '11:10', endTime: '14:00' },
            { id: 'break-3', name: '课间休息', startTime: '15:30', endTime: '15:40' },
          ]
          break
        case 'middle':
          // 中学标准模板：上午5节，下午4节
          timeForm.value.dailyPeriods = 9
          timeForm.value.periodDuration = 45
          timeForm.value.timeSlots = [
            { id: '1', name: '第一节', startTime: '08:00', endTime: '08:45' },
            { id: '2', name: '第二节', startTime: '08:55', endTime: '09:40' },
            { id: '3', name: '第三节', startTime: '09:50', endTime: '10:35' },
            { id: '4', name: '第四节', startTime: '10:45', endTime: '11:30' },
            { id: '5', name: '第五节', startTime: '11:40', endTime: '12:25' },
            { id: '6', name: '第六节', startTime: '14:00', endTime: '14:45' },
            { id: '7', name: '第七节', startTime: '14:55', endTime: '15:40' },
            { id: '8', name: '第八节', startTime: '15:50', endTime: '16:35' },
            { id: '9', name: '第九节', startTime: '16:45', endTime: '17:30' },
          ]
          timeForm.value.breakTimes = [
            { id: 'break-1', name: '课间休息', startTime: '10:35', endTime: '10:45' },
            { id: 'break-2', name: '大课间', startTime: '12:25', endTime: '14:00' },
            { id: 'break-3', name: '课间休息', startTime: '15:40', endTime: '15:50' },
          ]
          break
        case 'high':
          // 高中标准模板：上午5节，下午5节
          timeForm.value.dailyPeriods = 10
          timeForm.value.periodDuration = 40
          timeForm.value.timeSlots = [
            { id: '1', name: '第一节', startTime: '08:00', endTime: '08:40' },
            { id: '2', name: '第二节', startTime: '08:50', endTime: '09:30' },
            { id: '3', name: '第三节', startTime: '09:40', endTime: '10:20' },
            { id: '4', name: '第四节', startTime: '10:30', endTime: '11:10' },
            { id: '5', name: '第五节', startTime: '11:20', endTime: '12:00' },
            { id: '6', name: '第六节', startTime: '14:00', endTime: '14:40' },
            { id: '7', name: '第七节', startTime: '14:50', endTime: '15:30' },
            { id: '8', name: '第八节', startTime: '15:40', endTime: '16:20' },
            { id: '9', name: '第九节', startTime: '16:30', endTime: '17:10' },
            { id: '10', name: '第十节', startTime: '17:20', endTime: '18:00' },
          ]
          timeForm.value.breakTimes = [
            { id: 'break-1', name: '课间休息', startTime: '10:20', endTime: '10:30' },
            { id: 'break-2', name: '大课间', startTime: '12:00', endTime: '14:00' },
            { id: 'break-3', name: '课间休息', startTime: '15:30', endTime: '15:40' },
            { id: 'break-4', name: '课间休息', startTime: '17:10', endTime: '17:20' },
          ]
          break
        case 'custom':
          // 自定义模板：上午6节，下午5节
          timeForm.value.dailyPeriods = 11
          timeForm.value.periodDuration = 40
          timeForm.value.timeSlots = [
            { id: '1', name: '第一节', startTime: '08:00', endTime: '08:40' },
            { id: '2', name: '第二节', startTime: '08:45', endTime: '09:25' },
            { id: '3', name: '第三节', startTime: '09:30', endTime: '10:10' },
            { id: '4', name: '第四节', startTime: '10:15', endTime: '10:55' },
            { id: '5', name: '第五节', startTime: '11:00', endTime: '11:40' },
            { id: '6', name: '第六节', startTime: '11:45', endTime: '12:25' },
            { id: '7', name: '第七节', startTime: '14:00', endTime: '14:40' },
            { id: '8', name: '第八节', startTime: '14:45', endTime: '15:25' },
            { id: '9', name: '第九节', startTime: '15:30', endTime: '16:10' },
            { id: '10', name: '第十节', startTime: '16:15', endTime: '16:55' },
            { id: '11', name: '第十一节', startTime: '17:00', endTime: '17:40' },
          ]
          timeForm.value.breakTimes = [
            { id: 'break-1', name: '课间休息', startTime: '10:55', endTime: '11:00' },
            { id: 'break-2', name: '午休', startTime: '12:25', endTime: '14:00' },
            { id: 'break-3', name: '课间休息', startTime: '15:25', endTime: '15:30' },
            { id: 'break-4', name: '课间休息', startTime: '16:55', endTime: '17:00' },
          ]
          break
      }
      ElMessage.success('模板应用成功')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 初始化时间配置表单数据
const initTimeForm = () => {
  timeForm.value.timeSlots = scheduleStore.timeSlots.map((slot) => ({
    ...slot,
    startTime: slot.startTime,
    endTime: slot.endTime,
  }))
  timeForm.value.dailyPeriods = timeForm.value.timeSlots.length

  // 初始化休息时间
  const savedBreakTimes = localStorage.getItem('school-break-times')
  if (savedBreakTimes) {
    try {
      timeForm.value.breakTimes = JSON.parse(savedBreakTimes)
    } catch (e) {
      timeForm.value.breakTimes = []
    }
  }
}

// 处理每日课时数变化
const handleDailyPeriodsChange = (value: number) => {
  const currentLength = timeForm.value.timeSlots.length
  if (value > currentLength) {
    // 增加时间段
    for (let i = currentLength; i < value; i++) {
      const periodNumber = i + 1
      timeForm.value.timeSlots.push({
        id: `slot-${Date.now()}-${i}`,
        name: `第${periodNumber}节`,
        startTime: '08:00',
        endTime: '08:40',
      })
    }
  } else if (value < currentLength) {
    // 减少时间段
    timeForm.value.timeSlots.splice(value)
  }
}

// 处理每节课时长变化
const handlePeriodDurationChange = (value: number) => {
  // 根据每节课时长自动调整结束时间
  let currentTime = '08:00'
  timeForm.value.timeSlots.forEach((slot, index) => {
    const [hours, minutes] = currentTime.split(':').map(Number)
    const endTimeMinutes = hours * 60 + minutes + value
    const endHours = Math.floor(endTimeMinutes / 60)
    const endMinutes = endTimeMinutes % 60
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

    slot.startTime = currentTime
    slot.endTime = endTime

    // 计算下一节课的开始时间（间隔10分钟）
    const nextStartMinutes = endTimeMinutes + 10
    const nextHours = Math.floor(nextStartMinutes / 60)
    const nextMinutes = nextStartMinutes % 60
    currentTime = `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
  })
}

// 添加时间段
const addTimeSlot = () => {
  const newIndex = timeForm.value.timeSlots.length + 1
  timeForm.value.timeSlots.push({
    id: `slot-${Date.now()}-${newIndex}`,
    name: `第${newIndex}节`,
    startTime: '08:00',
    endTime: '08:40',
  })
  timeForm.value.dailyPeriods = timeForm.value.timeSlots.length
}

// 删除时间段
const removeTimeSlot = (index: number) => {
  timeForm.value.timeSlots.splice(index, 1)
  timeForm.value.dailyPeriods = timeForm.value.timeSlots.length

  // 重新编号剩余的时间段
  timeForm.value.timeSlots.forEach((slot, i) => {
    const periodNumber = i + 1
    slot.name = `第${periodNumber}节`
  })
}

// 添加休息时间
const addBreakTime = () => {
  timeForm.value.breakTimes.push({
    id: `break-${Date.now()}`,
    name: '休息时间',
    startTime: '10:00',
    endTime: '10:10',
  })
}

// 删除休息时间
const removeBreakTime = (index: number) => {
  timeForm.value.breakTimes.splice(index, 1)
}

// 重置时间配置
const resetTimeSettings = () => {
  ElMessageBox.confirm('确定要重置为默认时间配置吗？此操作不可恢复。', '确认重置', {
    type: 'warning',
  })
    .then(() => {
      scheduleStore.resetTimeSlots()
      initTimeForm()
      ElMessage.success('已重置为默认时间配置')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 保存时间配置
const saveTimeSettings = () => {
  try {
    // 验证时间段
    if (timeForm.value.timeSlots.length === 0) {
      ElMessage.warning('至少需要配置一个时间段')
      return
    }

    // 检查时间是否有效
    for (const slot of timeForm.value.timeSlots) {
      if (!slot.startTime || !slot.endTime) {
        ElMessage.warning('请填写完整的时间配置')
        return
      }

      // 检查结束时间是否晚于开始时间
      const start = slot.startTime.split(':').map(Number)
      const end = slot.endTime.split(':').map(Number)
      const startMinutes = start[0] * 60 + start[1]
      const endMinutes = end[0] * 60 + end[1]

      if (endMinutes <= startMinutes) {
        ElMessage.warning(`"${slot.name}"的结束时间必须晚于开始时间`)
        return
      }
    }

    // 保存到store
    scheduleStore.updateTimeSlots(timeForm.value.timeSlots)

    // 保存休息时间到localStorage
    localStorage.setItem('school-break-times', JSON.stringify(timeForm.value.breakTimes))

    ElMessage.success('时间配置保存成功')
  } catch (error) {
    console.error('保存时间配置失败:', error)
    ElMessage.error('保存时间配置失败')
  }
}

// 添加校区
const addCampus = () => {
  campusForm.value.campuses.push({
    id: `campus-${Date.now()}`,
    name: '新校区',
    code: 'NEW',
  })
}

// 删除校区
const removeCampus = (index: number) => {
  campusForm.value.campuses.splice(index, 1)
}

// 重置校区配置
const resetCampusSettings = () => {
  ElMessageBox.confirm('确定要重置校区配置吗？此操作不可恢复。', '确认重置', {
    type: 'warning',
  })
    .then(() => {
      campusForm.value.campuses = []
      ElMessage.success('已重置校区配置')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 保存校区配置
const saveCampusSettings = () => {
  try {
    // 保存校区配置到localStorage
    localStorage.setItem('school-campuses', JSON.stringify(campusForm.value.campuses))
    ElMessage.success('校区配置保存成功')
  } catch (error) {
    console.error('保存校区配置失败:', error)
    ElMessage.error('保存校区配置失败')
  }
}

// 重置学校信息配置
const resetSchoolSettings = () => {
  ElMessageBox.confirm('确定要重置学校信息配置吗？此操作不可恢复。', '确认重置', {
    type: 'warning',
  })
    .then(() => {
      schoolForm.value = {
        schoolName: '默认学校',
        semesterName: '2023-2024学年',
        schoolDays: ['1', '2', '3', '4', '5'],
        defaultGrade: '一年级',
      }
      ElMessage.success('已重置学校信息配置')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 保存学校信息配置
const saveSchoolSettings = () => {
  try {
    // 保存到localStorage
    localStorage.setItem('school-settings', JSON.stringify(schoolForm.value))
    ElMessage.success('学校信息配置保存成功')
  } catch (error) {
    console.error('保存学校信息配置失败:', error)
    ElMessage.error('保存学校信息配置失败')
  }
}

// 初始化
onMounted(() => {
  initTimeForm()

  // 加载学校信息配置
  try {
    const savedSettings = localStorage.getItem('school-settings')
    if (savedSettings) {
      schoolForm.value = { ...schoolForm.value, ...JSON.parse(savedSettings) }
    }
    // 保存初始的上课日设置
    initialSchoolDays = [...schoolForm.value.schoolDays]
  } catch (error) {
    console.error('加载学校信息配置失败:', error)
  }

  // 加载校区配置
  try {
    const savedCampuses = localStorage.getItem('school-campuses')
    if (savedCampuses) {
      campusForm.value.campuses = JSON.parse(savedCampuses)
    }
  } catch (error) {
    console.error('加载校区配置失败:', error)
  }
})
</script>

<style scoped>
.school-settings-page {
  max-width: 1200px;
}
</style>
