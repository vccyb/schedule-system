<template>
  <div class="layout h-screen bg-gray-50">
    <el-container class="h-full">
      <!-- 侧边栏 -->
      <el-aside class="bg-white shadow-lg" width="250px">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-xl font-bold text-gray-800 flex items-center">
            <el-icon class="mr-2 text-blue-500">
              <Calendar />
            </el-icon>
            简单排课
          </h1>
        </div>

        <el-menu :default-active="$route.path" class="border-none" router unique-opened>
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表板</span>
          </el-menu-item>

          <el-menu-item index="/teachers">
            <el-icon><User /></el-icon>
            <span>教师管理</span>
          </el-menu-item>

          <el-menu-item index="/classes">
            <el-icon><School /></el-icon>
            <span>班级管理</span>
          </el-menu-item>

          <el-menu-item index="/courses">
            <el-icon><Reading /></el-icon>
            <span>课程管理</span>
          </el-menu-item>

          <el-menu-item index="/schedule">
            <el-icon><Calendar /></el-icon>
            <span>排课管理</span>
          </el-menu-item>

          <el-menu-item index="/timetable">
            <el-icon><Grid /></el-icon>
            <span>课程表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="p-0">
        <!-- 顶部导航栏 -->
        <div
          class="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between"
        >
          <div class="flex items-center">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>简单排课</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="flex items-center space-x-4">
            <el-tooltip content="导出课程表" placement="bottom">
              <el-button type="primary" size="small" @click="exportSchedule" :icon="Download">
                导出
              </el-button>
            </el-tooltip>

            <el-dropdown>
              <el-button type="text" size="small">
                <el-icon class="mr-1"><Setting /></el-icon>
                设置
                <el-icon class="ml-1"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="exportData">
                    <el-icon><Download /></el-icon>
                    导出数据
                  </el-dropdown-item>
                  <el-dropdown-item @click="showImportDialog">
                    <el-icon><Upload /></el-icon>
                    导入数据
                  </el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/auth')">
                    <el-icon><Key /></el-icon>
                    授权管理
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="clearAllData">
                    <el-icon><Delete /></el-icon>
                    清空所有数据
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="showAbout">
                    <el-icon><InfoFilled /></el-icon>
                    关于系统
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 页面内容 -->
        <div :class="settingsStore.fontSizeClass" class="page-content">
          <RouterView />
        </div>
      </el-main>
    </el-container>

    <!-- 设置面板 -->
    <SettingsPanel />

    <!-- 数据导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入数据"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="text-center py-6">
        <div class="mb-6">
          <el-icon class="text-6xl text-blue-500 mb-4"><Upload /></el-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">选择数据文件</h3>
          <p class="text-gray-600 mb-4">支持导入之前导出的JSON数据文件</p>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <el-icon class="text-yellow-600 mr-2 mt-1"><InfoFilled /></el-icon>
            <div class="text-left">
              <p class="text-sm text-yellow-800 font-medium mb-1">注意事项：</p>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• 导入将会清空当前所有数据</li>
                <li>• 请确保数据文件来源可靠</li>
                <li>• 建议在导入前先导出当前数据做备份</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-3">
          <el-button type="primary" @click="triggerFileSelect">
            <el-icon class="mr-2"><Upload /></el-icon>
            选择文件
          </el-button>
          <el-button @click="importDialogVisible = false">取消</el-button>
        </div>

        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInputRef"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleFileSelect"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Calendar,
  Odometer,
  User,
  Reading,
  Grid,
  Download,
  Upload,
  Setting,
  ArrowDown,
  Delete,
  InfoFilled,
  School,
  Key,
  Tools,
} from '@element-plus/icons-vue'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { useScheduleStore } from '@/stores/schedule'
import { useClassStore } from '@/stores/class'
import { useDataManagerStore } from '@/stores/dataManager'
import { useSettingsStore } from '@/stores/settings'
import SettingsPanel from '@/components/SettingsPanel.vue'

const route = useRoute()
const router = useRouter()

const teacherStore = useTeacherStore()
const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()
const classStore = useClassStore()
const dataManagerStore = useDataManagerStore()
const settingsStore = useSettingsStore()

// 检查是否为开发环境
const isDev = import.meta.env.DEV

// 响应式变量
const importDialogVisible = ref(false)
const fileInputRef = ref<HTMLInputElement>()

// 当前页面标题
const currentPageTitle = computed(() => {
  return (route.meta.title as string) || '简单排课'
})

// 导出课程表
const exportSchedule = () => {
  router.push('/timetable')
  ElMessage.success('跳转到课程表页面，可在该页面进行导出操作')
}

// 清空所有数据
const clearAllData = async () => {
  try {
    await ElMessageBox.confirm('此操作将永久删除所有教师、课程和排课数据，是否继续？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    teacherStore.clearTeachers()
    courseStore.clearCourses()
    scheduleStore.clearSchedule()
    classStore.clearClasses()

    ElMessage.success('所有数据已清空')
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 显示关于信息
const showAbout = () => {
  router.push('/about')
}

// 导出数据
const exportData = () => {
  try {
    const result = dataManagerStore.exportToJsonFile()
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error: any) {
    ElMessage.error(`导出失败：${error.message}`)
  }
}

// 显示导入对话框
const showImportDialog = () => {
  importDialogVisible.value = true
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  if (!file.name.endsWith('.json')) {
    ElMessage.error('请选择JSON文件')
    return
  }

  try {
    const result = await dataManagerStore.importFromJsonFile(file)
    if (result.success) {
      ElMessage.success(result.message)
      importDialogVisible.value = false
      // 刷新页面数据
      window.location.reload()
    } else {
      ElMessage.error(result.message)
    }
  } catch (error: any) {
    ElMessage.error(`导入失败：${error.message}`)
  } finally {
    // 清空文件输入
    if (target) {
      target.value = ''
    }
  }
}

// 触发文件选择
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

// 初始化设置
onMounted(() => {
  settingsStore.loadFromStorage()
})
</script>

<style scoped>
.layout {
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
}

.el-menu-item {
  margin: 4px 12px;
  border-radius: 8px;
}

.el-menu-item:hover {
  background-color: #f0f9ff !important;
  color: #3b82f6 !important;
}

.el-menu-item.is-active {
  background-color: #3b82f6 !important;
  color: white !important;
}

.dev-menu-item {
  border-left: 3px solid #f59e0b;
  background-color: #fef3c7;
}

.dev-menu-item:hover {
  background-color: #fbbf24 !important;
  color: white !important;
}

.dev-menu-item.is-active {
  background-color: #f59e0b !important;
  color: white !important;
}

/* 页面内容区域样式优化 */
.page-content {
  padding: 24px;
  min-height: calc(100vh - 73px); /* 最小高度：减去顶部导航栏高度 */
  overflow-x: hidden;
}

/* 优化滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 8px;
}

.page-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.page-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
