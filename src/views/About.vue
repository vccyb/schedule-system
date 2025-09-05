<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <div class="text-center mb-12">
      <div
        class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
      >
        <el-icon class="text-4xl text-white"><Calendar /></el-icon>
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">简单排课系统</h1>
      <p class="text-xl text-gray-600 mb-6">简单、高效、智能的排课管理工具</p>
      <p class="text-gray-500">版本 1.0.0</p>
    </div>

    <!-- 开发者信息 -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div class="flex items-center justify-center mb-6">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-6">
          <el-icon class="text-blue-600 text-2xl"><User /></el-icon>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-1">开发者</h2>
          <p class="text-gray-600">全栈开发工程师</p>
        </div>
      </div>

      <div class="text-center">
        <p class="text-3xl font-bold text-blue-600 mb-4">vccyb</p>

        <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="font-semibold text-gray-900 mb-3">联系方式</h3>
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-700 font-medium mb-1">微信号</p>
                <p class="text-2xl font-mono text-blue-600 font-bold">13170906656</p>
              </div>
              <el-button type="primary" @click="copyWechat">
                <el-icon class="mr-1"><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-3 flex items-center justify-center">
            <span class="mr-1">💬</span>
            有任何问题、建议或合作需求，欢迎随时联系
          </p>
        </div>
      </div>
    </div>

    <!-- 版本对比 -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2
        class="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center"
      >
        <el-icon class="mr-3 text-purple-600"><Star /></el-icon>
        版本功能对比
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 免费版 -->
        <div class="border-2 border-gray-200 rounded-lg p-6 relative">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">免费版</h3>
            <p class="text-3xl font-bold text-green-600 mb-2">¥0</p>
            <p class="text-gray-500">永久免费使用</p>
          </div>

          <ul class="space-y-3">
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>基础教师管理</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>基础班级管理</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>基础课程管理</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>手动拖拽排课</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>课程表查看</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>基础统计信息</span>
            </li>
            <li class="flex items-center text-gray-400">
              <el-icon class="text-gray-300 mr-3"><CircleClose /></el-icon>
              <span>智能排课算法</span>
            </li>
            <li class="flex items-center text-gray-400">
              <el-icon class="text-gray-300 mr-3"><CircleClose /></el-icon>
              <span>Excel/PDF导出</span>
            </li>
            <li class="flex items-center text-gray-400">
              <el-icon class="text-gray-300 mr-3"><CircleClose /></el-icon>
              <span>高级统计分析</span>
            </li>
            <li class="flex items-center text-gray-400">
              <el-icon class="text-gray-300 mr-3"><CircleClose /></el-icon>
              <span>批量导入功能</span>
            </li>
          </ul>

          <div class="mt-6">
            <el-button type="success" size="large" class="w-full" disabled> 当前版本 </el-button>
          </div>
        </div>

        <!-- 付费版 -->
        <div
          class="border-2 border-blue-500 rounded-lg p-6 relative bg-gradient-to-b from-blue-50 to-white price-card"
        >
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
              >推荐</span
            >
          </div>

          <!-- 限时优惠标签 -->
          <div
            class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md promotion-tag"
          >
            限时优惠
          </div>

          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">专业版</h3>
            <!-- 价格展示优化 -->
            <div class="mb-3">
              <div class="flex items-center justify-center mb-1">
                <span class="text-gray-400 line-through text-lg mr-3">¥99</span>
                <span class="text-3xl font-bold text-red-600">¥69</span>
                <span class="text-sm text-gray-600 ml-1">/月</span>
              </div>
              <div
                class="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                💰 立省30元
              </div>
            </div>
            <p class="text-gray-500">一次购买，永久解锁所有功能</p>
          </div>

          <ul class="space-y-3">
            <li class="flex items-center">
              <el-icon class="text-green-500 mr-3"><CircleCheck /></el-icon>
              <span>包含免费版全部功能</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">智能排课算法</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">Excel/PDF导出</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">高级统计分析</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">批量导入功能</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">冲突自动检测</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">课表模板定制</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">优先技术支持</span>
            </li>
            <li class="flex items-center">
              <el-icon class="text-blue-500 mr-3"><CircleCheck /></el-icon>
              <span class="font-semibold text-blue-600">免费功能更新</span>
            </li>
          </ul>

          <div class="mt-6 space-y-3">
            <el-button type="danger" size="large" class="w-full" @click="contactForUpgrade">
              <el-icon class="mr-2"><ChatLineRound /></el-icon>
              立即购买 ¥69
            </el-button>
            <p class="text-xs text-center text-gray-500">📱 微信联系：13170906656 获取授权码</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统特色 -->
    <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2
        class="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center"
      >
        <el-icon class="mr-3 text-green-600"><Trophy /></el-icon>
        系统特色
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center p-4">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <el-icon class="text-blue-600 text-2xl"><Star /></el-icon>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">智能算法</h3>
          <p class="text-sm text-gray-600">AI驱动的智能排课算法，自动优化课程安排</p>
        </div>

        <div class="text-center p-4">
          <div
            class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <el-icon class="text-green-600 text-2xl"><Mouse /></el-icon>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">拖拽操作</h3>
          <p class="text-sm text-gray-600">直观的拖拽界面，让排课变得简单直观</p>
        </div>

        <div class="text-center p-4">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <el-icon class="text-purple-600 text-2xl"><View /></el-icon>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">多重视角</h3>
          <p class="text-sm text-gray-600">支持班级和教师双视角，满足不同管理需求</p>
        </div>

        <div class="text-center p-4">
          <div
            class="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <el-icon class="text-orange-600 text-2xl"><Download /></el-icon>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">导出功能</h3>
          <p class="text-sm text-gray-600">支持Excel和PDF格式导出，便于打印分享</p>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2
        class="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center"
      >
        <el-icon class="mr-3 text-indigo-600"><Tools /></el-icon>
        技术栈
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="p-4">
          <div class="text-3xl mb-2">🔥</div>
          <h3 class="font-semibold text-gray-900">Vue 3</h3>
          <p class="text-sm text-gray-600">现代前端框架</p>
        </div>

        <div class="p-4">
          <div class="text-3xl mb-2">📘</div>
          <h3 class="font-semibold text-gray-900">TypeScript</h3>
          <p class="text-sm text-gray-600">类型安全</p>
        </div>

        <div class="p-4">
          <div class="text-3xl mb-2">🎨</div>
          <h3 class="font-semibold text-gray-900">Element Plus</h3>
          <p class="text-sm text-gray-600">UI组件库</p>
        </div>

        <div class="p-4">
          <div class="text-3xl mb-2">💨</div>
          <h3 class="font-semibold text-gray-900">Tailwind CSS</h3>
          <p class="text-sm text-gray-600">现代样式框架</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  Calendar,
  User,
  Star,
  CopyDocument,
  CircleCheck,
  CircleClose,
  ChatLineRound,
  Trophy,
  Mouse,
  View,
  Download,
  Tools,
} from '@element-plus/icons-vue'

// 复制微信号
const copyWechat = async () => {
  try {
    await navigator.clipboard.writeText('13170906656')
    ElMessage.success('微信号已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制：13170906656')
  }
}

// 联系升级
const contactForUpgrade = () => {
  ElMessage.info('请通过微信联系开发者获取专业版授权码（仅需¥69/月）')
  copyWechat()
}
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
}

.el-button {
  border-radius: 8px;
}

/* 价格卡片动画效果 */
.price-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.price-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
}

/* 促销标签动画 */
@keyframes pulse {
  0%,
  100% {
    transform: rotate(15deg) scale(1);
  }
  50% {
    transform: rotate(15deg) scale(1.05);
  }
}

.promotion-tag {
  animation: pulse 2s infinite;
}

/* 价格显示动画 */
@keyframes priceGlow {
  0%,
  100% {
    text-shadow: 0 0 5px rgba(220, 38, 38, 0.3);
  }
  50% {
    text-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
  }
}

.text-red-600 {
  animation: priceGlow 3s ease-in-out infinite;
}
</style>
