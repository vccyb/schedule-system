<template>
  <div class="auth-manager">
    <!-- 页面头部 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">授权管理</h1>
      <p class="text-gray-600">管理您的专业版功能授权码</p>
    </div>

    <!-- 授权状态 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div
            :class="[
              'w-4 h-4 rounded-full mr-3',
              authStatus.isValid ? 'bg-green-500' : 'bg-red-500',
            ]"
          ></div>
          <h2 class="text-xl font-semibold text-gray-900">专业版授权状态</h2>
        </div>
        <el-tag :type="authStatus.isValid ? 'success' : 'danger'" size="large">
          {{ authStatus.isValid ? '已授权' : '未授权' }}
        </el-tag>
      </div>

      <div v-if="authStatus.isValid" class="mb-6">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <el-icon class="text-green-600 mr-2"><Check /></el-icon>
            <span class="font-medium text-green-800">授权有效</span>
          </div>
          <div class="text-sm text-green-700 space-y-1">
            <p><strong>有效期至：</strong>{{ authStatus.expiryDate }}</p>
            <p><strong>剩余天数：</strong>{{ authStatus.remainingDays }} 天</p>
          </div>
        </div>
      </div>

      <div class="flex space-x-3">
        <el-button type="primary" size="large" @click="showAuthDialog" :icon="Key">
          {{ authStatus.isValid ? '更新授权码' : '输入授权码' }}
        </el-button>

        <el-button
          v-if="authStatus.isValid"
          type="danger"
          size="large"
          @click="clearAuthCode"
          :icon="Delete"
        >
          清除授权
        </el-button>
      </div>
    </div>

    <!-- 付费功能列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <el-icon class="mr-2 text-purple-600"><Star /></el-icon>
        专业版功能列表
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="feature in features"
          :key="feature.key"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center">
            <el-icon :class="authStatus.isValid ? 'text-green-500' : 'text-gray-400'" class="mr-3">
              <component :is="authStatus.isValid ? Check : Lock" />
            </el-icon>
            <div>
              <h4 class="font-medium text-gray-900">{{ feature.name }}</h4>
              <p class="text-sm text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
          <el-tag :type="authStatus.isValid ? 'success' : 'info'" size="small">
            {{ authStatus.isValid ? '可用' : '需授权' }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 购买授权码提示 -->
    <div
      class="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8 relative overflow-hidden"
    >
      <!-- 背景装饰 -->
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-transparent rounded-full opacity-20 transform translate-x-8 -translate-y-8 float-decoration"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-transparent rounded-full opacity-30 transform -translate-x-4 translate-y-4 float-decoration"
        style="animation-delay: 3s"
      ></div>

      <div class="relative z-10">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start">
            <el-icon class="text-blue-500 mr-3 mt-1 text-xl"><InfoFilled /></el-icon>
            <div>
              <h3 class="text-xl font-bold text-blue-900 mb-1">如何获取授权码？</h3>
              <p class="text-sm text-blue-700">一次购买，解锁所有专业版功能</p>
            </div>
          </div>

          <!-- 价格卡片 -->
          <div
            class="bg-white rounded-lg shadow-lg p-4 border-2 border-orange-200 relative price-card"
          >
            <!-- 促销标签 -->
            <div
              class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md promotion-tag"
            >
              限时优惠
            </div>

            <div class="text-center">
              <div class="flex items-center justify-center mb-1">
                <span class="text-gray-400 line-through text-lg mr-2">￥99</span>
                <span class="text-2xl font-bold text-red-600">￥69</span>
                <span class="text-sm text-gray-600 ml-1">/月</span>
              </div>
              <div class="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                省030元
              </div>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- 功能介绍 -->
          <div>
            <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
              <el-icon class="mr-2 text-purple-500"><Star /></el-icon>
              专业版亮点功能
            </h4>
            <div class="space-y-2 text-sm text-blue-800">
              <div class="flex items-center feature-item p-2 rounded">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span><strong>智能排课</strong> - AI算法自动安排课程</span>
              </div>
              <div class="flex items-center feature-item p-2 rounded">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span><strong>导出功能</strong> - 支持Excel和PDF格式导出</span>
              </div>
              <div class="flex items-center feature-item p-2 rounded">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span><strong>高级统计</strong> - 详细的课程安排统计分析</span>
              </div>
              <div class="flex items-center feature-item p-2 rounded">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span><strong>批量导入</strong> - 从 Excel 批量导入数据</span>
              </div>
            </div>
          </div>

          <!-- 购买信息 -->
          <div>
            <h4 class="font-semibold text-blue-900 mb-3 flex items-center">
              <el-icon class="mr-2 text-orange-500"><CopyDocument /></el-icon>
              购买流程
            </h4>
            <div class="space-y-2 text-sm text-blue-800">
              <div class="flex items-start step-item">
                <div
                  class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5"
                >
                  1
                </div>
                <span>联系开发者微信：<strong class="text-orange-600">13170906656</strong></span>
              </div>
              <div class="flex items-start step-item">
                <div
                  class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5"
                >
                  2
                </div>
                <span>支付 <strong class="text-red-600">￥69</strong> 获取当月授权码</span>
              </div>
              <div class="flex items-start step-item">
                <div
                  class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5"
                >
                  3
                </div>
                <span>在系统中输入授权码即即解锁</span>
              </div>
            </div>

            <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-xs text-yellow-800">
                <strong>温馨提示：</strong>授权码购买永久有效，每月更新
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <el-button type="primary" size="large" @click="copyWechat" class="shadow-lg">
            <el-icon class="mr-2"><CopyDocument /></el-icon>
            复制微信号
          </el-button>
          <el-button size="large" @click="$router.push('/about')" class="shadow-md">
            查看更多详情
          </el-button>
        </div>
      </div>
    </div>

    <!-- 授权码输入对话框 -->
    <el-dialog
      v-model="authDialogVisible"
      title="输入专业版授权码"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">授权码</label>
          <el-input
            v-model="authCodeInput"
            placeholder="请输入授权码，格式：XXXX-XXXX"
            maxlength="9"
            @input="formatAuthCode"
          />
          <p class="text-xs text-gray-500 mt-1">授权码格式：4位字母数字-4位字母数字</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">用户标识（可选）</label>
          <el-input
            v-model="userSeedInput"
            placeholder="如果开发者为您生成了专属授权码，请输入用户标识"
          />
          <p class="text-xs text-gray-500 mt-1">通常为您的微信号或其他唯一标识</p>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-start">
            <el-icon class="text-yellow-600 mr-2 mt-1"><Warning /></el-icon>
            <div class="text-sm text-yellow-800">
              <p><strong>注意：</strong></p>
              <ul class="mt-1 space-y-1">
                <li>• 一个授权码即可解锁所有专业版功能</li>
                <li>• 授权码只在当月有效</li>
                <li>• 确保授权码输入正确，区分大小写</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <el-button @click="authDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitAuthCode"
            :loading="submitting"
            :disabled="!authCodeInput.trim()"
          >
            验证并保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Key,
  Delete,
  InfoFilled,
  CopyDocument,
  Warning,
  Check,
  Lock,
  Star,
} from '@element-plus/icons-vue'
import {
  type ProFeature,
  type AuthStatus,
  getAuthStatus,
  saveAuthCode,
  clearAuth,
} from '@/utils/auth'

// 功能列表
const features = [
  {
    key: 'SMART_SCHEDULE' as ProFeature,
    name: '智能排课',
    description: '使用AI算法自动安排课程，避免时间冲突，优化教师和教室资源配置',
  },
  {
    key: 'EXPORT_FUNCTIONS' as ProFeature,
    name: '导出功能',
    description: '支持导出Excel和PDF格式的课程表，便于打印和分享',
  },
  {
    key: 'ADVANCED_STATS' as ProFeature,
    name: '高级统计',
    description: '提供详细的课程安排统计分析，包括教师工作量、教室利用率等',
  },
  {
    key: 'BATCH_IMPORT' as ProFeature,
    name: '批量导入',
    description: '支持从Excel批量导入教师、班级、课程等数据，提高数据录入效率',
  },
]

// 响应式数据
const authStatus = ref<AuthStatus>({
  isValid: false,
  expiryDate: '',
  remainingDays: 0,
})
const authDialogVisible = ref(false)
const authCodeInput = ref('')
const userSeedInput = ref('')
const submitting = ref(false)

// 格式化授权码输入
const formatAuthCode = (value: string) => {
  // 移除所有非字母数字和斜杠字符，保留斜杠因为授权码可能包含斜杠
  let cleaned = value.replace(/[^A-Za-z0-9/]/g, '').toUpperCase()

  // 限制长度
  if (cleaned.length > 8) {
    cleaned = cleaned.substring(0, 8)
  }

  // 添加分隔符
  if (cleaned.length > 4) {
    authCodeInput.value = `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`
  } else {
    authCodeInput.value = cleaned
  }
}

// 显示授权对话框
const showAuthDialog = () => {
  authCodeInput.value = ''
  userSeedInput.value = ''
  authDialogVisible.value = true
}

// 提交授权码
const submitAuthCode = async () => {
  submitting.value = true

  try {
    const success = saveAuthCode(authCodeInput.value, userSeedInput.value)

    if (success) {
      ElMessage.success('授权码验证成功！所有专业版功能已解锁')
      authDialogVisible.value = false
      refreshAuthStatus()
    } else {
      ElMessage.error('授权码无效，请检查输入是否正确')
    }
  } catch (error: unknown) {
    const err = error as Error
    ElMessage.error(`验证失败：${err.message}`)
  } finally {
    submitting.value = false
  }
}

// 清除授权
const clearAuthCode = async () => {
  try {
    await ElMessageBox.confirm('确定要清除专业版授权吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    clearAuth()
    refreshAuthStatus()
    ElMessage.success('授权已清除')
  } catch {
    // 用户取消
  }
}

// 复制微信号
const copyWechat = async () => {
  try {
    await navigator.clipboard.writeText('13170906656')
    ElMessage.success('微信号已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制：13170906656')
  }
}

// 刷新授权状态
const refreshAuthStatus = () => {
  authStatus.value = getAuthStatus()
}

// 初始化
onMounted(() => {
  refreshAuthStatus()
})
</script>

<style scoped>
.auth-manager {
  max-width: 1000px;
}

.el-button {
  border-radius: 6px;
}

/* 价格卡片动画效果 */
.price-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.price-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 促销标签动画 */
@keyframes pulse {
  0%,
  100% {
    transform: rotate(12deg) scale(1);
  }
  50% {
    transform: rotate(12deg) scale(1.05);
  }
}

.promotion-tag {
  animation: pulse 2s infinite;
}

/* 渐变背景动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float-decoration {
  animation: float 6s ease-in-out infinite;
}

/* 功能列表动画 */
.feature-item {
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.feature-item:hover {
  transform: translateX(5px);
  background-color: rgba(59, 130, 246, 0.05);
}

/* 步骤列表动画 */
.step-item {
  transition: transform 0.2s ease;
}

.step-item:hover {
  transform: translateX(3px);
}
</style>
