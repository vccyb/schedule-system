<template>
  <div class="dashboard">
    <!-- 使用引导区块 -->
    <div
      class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center mb-4">
            <el-icon class="text-3xl mr-3"><Guide /></el-icon>
            <h2 class="text-2xl font-bold">欢迎使用简单排课系统</h2>
          </div>
          <p class="text-lg mb-6 opacity-90">让我们帮您快速上手，只需几个步骤即可完成排课！</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <!-- 步骤1: 添加教师 -->
            <div
              class="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/25 transition-all cursor-pointer border border-white/20 hover:border-white/40"
              @click="$router.push('/teachers')"
            >
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-bold">1</span>
                </div>
                <h3 class="font-semibold">添加教师</h3>
              </div>
              <p class="text-sm opacity-90">先添加教师信息，包括姓名、教授科目等</p>
            </div>

            <!-- 步骤2: 创建班级 -->
            <div
              class="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/25 transition-all cursor-pointer border border-white/20 hover:border-white/40"
              @click="$router.push('/classes')"
            >
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-bold">2</span>
                </div>
                <h3 class="font-semibold">创建班级</h3>
              </div>
              <p class="text-sm opacity-90">设置班级信息和课程需求，确定每周课时数</p>
            </div>

            <!-- 步骤3: 添加课程 -->
            <div
              class="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/25 transition-all cursor-pointer border border-white/20 hover:border-white/40"
              @click="$router.push('/courses')"
            >
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-bold">3</span>
                </div>
                <h3 class="font-semibold">添加课程</h3>
              </div>
              <p class="text-sm opacity-90">关联教师和科目，创建具体课程</p>
            </div>

            <!-- 步骤4: 开始排课 -->
            <div
              class="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/25 transition-all cursor-pointer border border-white/20 hover:border-white/40"
              @click="$router.push('/schedule')"
            >
              <div class="flex items-center mb-2">
                <div class="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-bold">4</span>
                </div>
                <h3 class="font-semibold">开始排课</h3>
              </div>
              <p class="text-sm opacity-90">使用智能排课或手动拖拽安排课程</p>
              <div class="mt-2">
                <el-tag
                  size="small"
                  type="warning"
                  class="bg-orange-500/80 border-orange-400 text-white"
                >
                  付费功能
                </el-tag>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <el-button type="primary" size="large" @click="startGuide">
              <el-icon class="mr-2"><VideoPlay /></el-icon>
              开始体验
            </el-button>
            <el-button
              size="large"
              class="text-white border-2 border-white/70 transition-all bg-transparent font-semibold"
              @click="$router.push('/about')"
            >
              <el-icon class="mr-2"><InfoFilled /></el-icon>
              关于系统
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">教师总数</p>
            <p class="text-2xl font-bold text-gray-900">{{ teacherStore.teacherCount }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <el-icon class="text-blue-600 text-xl"><User /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">班级总数</p>
            <p class="text-2xl font-bold text-gray-900">{{ classStore.classCount }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <el-icon class="text-indigo-600 text-xl"><School /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">课程总数</p>
            <p class="text-2xl font-bold text-gray-900">{{ courseStore.courseCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <el-icon class="text-green-600 text-xl"><Reading /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">已排课时</p>
            <p class="text-2xl font-bold text-gray-900">{{ scheduleStore.scheduleCount }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <el-icon class="text-purple-600 text-xl"><Calendar /></el-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">课程表利用率</p>
            <p class="text-2xl font-bold text-gray-900">{{ utilizationRate }}%</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <el-icon class="text-orange-600 text-xl"><TrendCharts /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <el-icon class="mr-2 text-blue-500"><Lightning /></el-icon>
          快速操作
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <el-button
            type="primary"
            size="large"
            class="h-20 flex flex-col items-center justify-center ml-[12px]"
            @click="$router.push('/teachers')"
          >
            <el-icon class="text-xl mb-1"><UserFilled /></el-icon>
            添加教师
          </el-button>

          <el-button
            type="primary"
            size="large"
            class="h-20 flex flex-col items-center justify-center bg-indigo-500 hover:bg-indigo-600 border-indigo-500"
            @click="$router.push('/classes')"
          >
            <el-icon class="text-xl mb-1"><School /></el-icon>
            添加班级
          </el-button>

          <el-button
            type="success"
            size="large"
            class="h-20 flex flex-col items-center justify-center"
            @click="$router.push('/courses')"
          >
            <el-icon class="text-xl mb-1"><DocumentAdd /></el-icon>
            添加课程
          </el-button>

          <el-button
            type="warning"
            size="large"
            class="h-20 flex flex-col items-center justify-center relative"
            @click="handleSmartSchedule"
          >
            <el-icon class="text-xl mb-1"><Calendar /></el-icon>
            智能排课
            <el-tag size="small" type="warning" class="absolute top-1 right-1 text-xs">付费</el-tag>
          </el-button>

          <el-button
            type="info"
            size="large"
            class="h-20 flex flex-col items-center justify-center relative"
            @click="handleExportTimetable"
          >
            <el-icon class="text-xl mb-1"><Grid /></el-icon>
            导出课表
            <el-tag size="small" type="warning" class="absolute top-1 right-1 text-xs">付费</el-tag>
          </el-button>
        </div>
      </div>

      <!-- 最近添加的内容 -->
      <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <el-icon class="mr-2 text-green-500"><Clock /></el-icon>
          最近添加
        </h3>

        <div class="space-y-4">
          <div v-if="recentClasses.length > 0">
            <h4 class="text-sm font-medium text-gray-700 mb-2">班级</h4>
            <div class="space-y-2">
              <div
                v-for="classItem in recentClasses"
                :key="classItem.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <el-icon class="mr-2 text-indigo-500"><School /></el-icon>
                  <span class="text-sm">{{ classItem.name }}</span>
                  <el-tag size="small" class="ml-2">{{ classItem.grade }}</el-tag>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(classItem.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div v-if="recentTeachers.length > 0">
            <h4 class="text-sm font-medium text-gray-700 mb-2">教师</h4>
            <div class="space-y-2">
              <div
                v-for="teacher in recentTeachers"
                :key="teacher.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <el-icon class="mr-2 text-blue-500"><User /></el-icon>
                  <span class="text-sm">{{ teacher.name }}</span>
                  <el-tag size="small" class="ml-2">{{ teacher.subject }}</el-tag>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(teacher.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div v-if="recentCourses.length > 0">
            <h4 class="text-sm font-medium text-gray-700 mb-2">课程</h4>
            <div class="space-y-2">
              <div
                v-for="course in recentCourses"
                :key="course.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <el-icon class="mr-2 text-green-500"><Reading /></el-icon>
                  <span class="text-sm">{{ course.name }}</span>
                  <el-tag size="small" class="ml-2">{{ course.subject }}</el-tag>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(course.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="
              recentClasses.length === 0 &&
              recentTeachers.length === 0 &&
              recentCourses.length === 0
            "
            class="text-center py-8 text-gray-500"
          >
            <el-icon class="text-4xl mb-2"><DocumentAdd /></el-icon>
            <p>暂无最近添加的内容</p>
            <p class="text-sm">开始添加班级、教师和课程吧！</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统提示 -->
    <div v-if="systemTips.length > 0" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
      <div class="flex items-start">
        <el-icon class="text-blue-400 mr-2 mt-1"><InfoFilled /></el-icon>
        <div>
          <h3 class="text-sm font-medium text-blue-800 mb-2">系统提示</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li v-for="tip in systemTips" :key="tip">{{ tip }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  User,
  Reading,
  Calendar,
  TrendCharts,
  Lightning,
  UserFilled,
  DocumentAdd,
  Grid,
  Clock,
  InfoFilled,
  School,
  Guide,
  VideoPlay,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { useScheduleStore } from '@/stores/schedule'
import { useClassStore } from '@/stores/class'
import { isFeatureAuthorized } from '@/utils/auth'

import dayjs from 'dayjs'

const router = useRouter()
const teacherStore = useTeacherStore()
const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()
const classStore = useClassStore()

// 响应式变量

// 课程表利用率（总时间段数量为8*7=56）
const utilizationRate = computed(() => {
  const totalSlots = scheduleStore.timeSlots.length * 7 // 7天
  const usedSlots = scheduleStore.scheduleCount
  return totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0
})

// 最近添加的班级（最多2个）
const recentClasses = computed(() => {
  return [...classStore.classes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
})

// 最近添加的教师（最多2个）
const recentTeachers = computed(() => {
  return [...teacherStore.teachers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
})

// 最近添加的课程（最多2个）
const recentCourses = computed(() => {
  return [...courseStore.courses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
})

// 系统提示
const systemTips = computed(() => {
  const tips: string[] = []

  if (classStore.classCount === 0) {
    tips.push('请先添加班级信息，班级是排课的基础')
  }

  if (teacherStore.teacherCount === 0) {
    tips.push('请先添加教师信息，然后才能创建课程')
  }

  if (courseStore.courseCount === 0 && teacherStore.teacherCount > 0 && classStore.classCount > 0) {
    tips.push('已有班级和教师信息，可以开始创建课程了')
  }

  if (
    courseStore.courseCount > 0 &&
    scheduleStore.scheduleCount === 0 &&
    classStore.classCount > 0
  ) {
    tips.push('已有课程和班级信息，可以开始进行排课了')
  }

  if (scheduleStore.scheduleCount > 0 && utilizationRate.value < 20) {
    tips.push('当前课程表利用率较低，可以安排更多课程')
  }

  return tips
})

// 格式化日期
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('MM-DD HH:mm')
}

// 处理智能排课点击
const handleSmartSchedule = async () => {
  if (await isFeatureAuthorized('SMART_SCHEDULE')) {
    router.push('/schedule')
  } else {
    ElMessage.warning('智能排课是付费功能，请先获取授权码')
    router.push('/auth')
  }
}

// 处理导出课表点击
const handleExportTimetable = async () => {
  if (await isFeatureAuthorized('EXPORT_FUNCTIONS')) {
    router.push('/timetable')
  } else {
    ElMessage.warning('导出功能是付费功能，请先获取授权码')
    router.push('/auth')
  }
}

// 引导相关方法
const startGuide = () => {
  // 根据当前系统状态，引导到适当的页面
  if (teacherStore.teacherCount === 0) {
    ElMessage.info('开始第一步：添加教师信息')
    setTimeout(() => {
      window.location.href = '/teachers'
    }, 500)
  } else if (classStore.classCount === 0) {
    ElMessage.info('进行第二步：创建班级')
    setTimeout(() => {
      window.location.href = '/classes'
    }, 500)
  } else if (courseStore.courseCount === 0) {
    ElMessage.info('进行第三步：添加课程')
    setTimeout(() => {
      window.location.href = '/courses'
    }, 500)
  } else {
    ElMessage.info('开始智能排课')
    setTimeout(() => {
      window.location.href = '/schedule'
    }, 500)
  }
}

// 初始化数据
onMounted(() => {
  teacherStore.loadFromStorage()
  courseStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  classStore.loadFromStorage()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.el-button {
  border-radius: 8px;
}
</style>
