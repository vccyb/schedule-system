<template>
  <div class="dev-tools">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">开发者工具</h1>
      <p class="text-gray-600">授权码生成工具（仅供开发者使用）</p>
    </div>

    <!-- 授权码生成器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <el-icon class="mr-2 text-blue-500"><Key /></el-icon>
        专业版授权码生成器
      </h2>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">目标年月</label>
            <el-date-picker
              v-model="targetDate"
              type="month"
              placeholder="选择年月"
              format="YYYY年MM月"
              value-format="YYYY-MM"
              style="width: 100%"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户标识（可选）</label>
            <el-input v-model="userSeed" placeholder="为特定用户生成专属授权码" />
          </div>
        </div>

        <div>
          <el-button
            type="primary"
            @click="generateAuthCode"
            :disabled="!targetDate"
            :icon="Lightning"
          >
            生成授权码
          </el-button>
          <el-button @click="generateCurrentMonthCode" :icon="Star"> 生成本月授权码 </el-button>
        </div>
      </div>
    </div>

    <!-- 生成的授权码 -->
    <div v-if="generatedCode" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">生成的授权码</h3>
        <el-button type="success" size="small" @click="copyCode" :icon="CopyDocument">
          复制授权码
        </el-button>
      </div>

      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div class="text-center">
          <div class="font-mono text-3xl text-blue-600 font-bold mb-4">
            {{ generatedCode.code }}
          </div>
          <div class="space-y-2 text-sm text-gray-600">
            <p>
              <strong>有效期：</strong>{{ generatedCode.yearMonth }} ({{
                generatedCode.expiryDate
              }})
            </p>
            <p v-if="userSeed"><strong>用户标识：</strong>{{ userSeed }}</p>
            <p><strong>功能：</strong>解锁所有专业版功能</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 授权码验证器 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <el-icon class="mr-2 text-green-500"><Check /></el-icon>
        授权码验证器
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">授权码</label>
            <el-input v-model="testCode" placeholder="输入授权码进行验证" maxlength="9" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户标识</label>
            <el-input v-model="testUserSeed" placeholder="可选" />
          </div>
        </div>

        <div>
          <el-button type="success" @click="validateCode" :disabled="!testCode" :icon="Check">
            验证授权码
          </el-button>
        </div>

        <!-- 验证结果 -->
        <div v-if="validationResult" class="mt-4">
          <div
            :class="[
              'p-4 rounded-lg border',
              validationResult.isValid
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800',
            ]"
          >
            <div class="flex items-center mb-2">
              <el-icon
                :class="validationResult.isValid ? 'text-green-600' : 'text-red-600'"
                class="mr-2"
              >
                <component :is="validationResult.isValid ? Check : Close" />
              </el-icon>
              <span class="font-medium">
                {{ validationResult.isValid ? '授权码有效' : '授权码无效' }}
              </span>
            </div>
            <div v-if="validationResult.isValid" class="text-sm">
              <p>功能：解锁所有专业版功能</p>
              <p>有效期至：{{ validationResult.expiryDate }}</p>
              <p>剩余天数：{{ validationResult.remainingDays }} 天</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
      <h3 class="text-lg font-semibold text-blue-900 mb-4">使用说明</h3>
      <div class="text-sm text-blue-800 space-y-2">
        <p><strong>1. 简化的授权模式：</strong></p>
        <ul class="ml-4 space-y-1">
          <li>• <strong>一个授权码解锁所有专业版功能</strong></li>
          <li>• 授权码基于年月和盐值生成，安全可靠</li>
          <li>• 支持为特定用户生成专属授权码</li>
          <li>• 授权码格式：XXXX-XXXX（8位字母数字）</li>
        </ul>
        <p><strong>2. 销售流程：</strong></p>
        <ul class="ml-4 space-y-1">
          <li>• 用户体验免费功能后，想要使用专业版功能</li>
          <li>• 联系你的微信 13170906656 购买专业版授权</li>
          <li>• 你使用开发者工具生成当月专业版授权码</li>
          <li>• 用户输入授权码即可解锁所有专业版功能到月底</li>
          <li>• 下月需要重新购买新授权码</li>
        </ul>
        <p><strong>3. 优势：</strong></p>
        <ul class="ml-4 space-y-1">
          <li>• 用户体验简单：一个码解锁全部功能</li>
          <li>• 管理方便：只需管理一种授权码</li>
          <li>• 定价灵活：可以统一定价专业版套餐</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Key, Lightning, Star, CopyDocument, Check, Close } from '@element-plus/icons-vue'
import { type AuthStatus, generateAuthCode as generateCode, validateAuthCode } from '@/utils/auth'
import dayjs from 'dayjs'

// 响应式数据
const targetDate = ref(dayjs().format('YYYY-MM'))
const userSeed = ref('')
const generatedCode = ref<{
  code: string
  yearMonth: string
  expiryDate: string
} | null>(null)

// 验证相关
const testCode = ref('')
const testUserSeed = ref('')
const validationResult = ref<AuthStatus | null>(null)

// 生成当前月份授权码
const generateCurrentMonthCode = () => {
  const currentMonth = dayjs().format('YYYY-MM')
  targetDate.value = currentMonth
  generateAuthCode()
}

// 生成指定月份授权码
const generateAuthCode = () => {
  if (!targetDate.value) {
    ElMessage.warning('请选择目标年月')
    return
  }

  try {
    const yearMonth = targetDate.value.replace('-', '')
    const code = generateCode(yearMonth, userSeed.value)

    const nextMonth = dayjs(targetDate.value).add(1, 'month')
    generatedCode.value = {
      code,
      yearMonth: dayjs(targetDate.value).format('YYYY年MM月'),
      expiryDate: nextMonth.format('YYYY-MM-01'),
    }

    ElMessage.success('专业版授权码生成成功')
  } catch (error: unknown) {
    const err = error as Error
    ElMessage.error(`生成失败：${err.message}`)
  }
}

// 复制授权码
const copyCode = async () => {
  if (!generatedCode.value) {
    ElMessage.warning('没有可复制的授权码')
    return
  }

  try {
    const codeText = `简单排课系统 - 专业版授权码
授权码: ${generatedCode.value.code}
有效期: ${generatedCode.value.yearMonth}
到期时间: ${generatedCode.value.expiryDate}
${userSeed.value ? `用户标识: ${userSeed.value}` : ''}

功能: 解锁所有专业版功能（智能排课、导出功能、高级统计、批量导入）`

    await navigator.clipboard.writeText(codeText)
    ElMessage.success('授权码信息已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 验证授权码
const validateCode = () => {
  if (!testCode.value) {
    ElMessage.warning('请输入授权码')
    return
  }

  try {
    validationResult.value = validateAuthCode(testCode.value, testUserSeed.value)

    if (validationResult.value.isValid) {
      ElMessage.success('授权码验证成功')
    } else {
      ElMessage.error('授权码验证失败')
    }
  } catch (error: unknown) {
    const err = error as Error
    ElMessage.error(`验证失败：${err.message}`)
    validationResult.value = null
  }
}
</script>

<style scoped>
.dev-tools {
  max-width: 1000px;
}

.el-button {
  border-radius: 6px;
}
</style>
