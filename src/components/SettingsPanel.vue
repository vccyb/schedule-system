<template>
  <div class="settings-panel">
    <!-- 设置按钮 -->
    <el-button
      type="text"
      :icon="Setting"
      class="settings-trigger"
      @click="drawerVisible = true"
      circle
      size="large"
    />

    <!-- 设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="系统设置"
      direction="rtl"
      size="350px"
      :modal="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <template #header>
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-500"><Setting /></el-icon>
          <span class="text-lg font-semibold">系统设置</span>
        </div>
      </template>

      <div class="space-y-8">
        <!-- 字体大小设置 -->
        <div class="setting-section">
          <h3 class="setting-title">
            <el-icon class="mr-2"><EditPen /></el-icon>
            字体大小
          </h3>
          <p class="setting-description">调整界面文字的显示大小</p>

          <div class="mt-4 space-y-3">
            <div
              v-for="size in fontSizeOptions"
              :key="size.value"
              class="font-size-option"
              :class="{ active: settingsStore.fontSize === size.value }"
              @click="settingsStore.setFontSize(size.value)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="font-size-preview" :class="size.previewClass">字</div>
                  <span class="ml-3">{{ size.label }}</span>
                </div>
                <el-icon v-if="settingsStore.fontSize === size.value" class="text-blue-500">
                  <Check />
                </el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 重置设置 -->
        <div class="setting-section">
          <h3 class="setting-title">
            <el-icon class="mr-2"><RefreshRight /></el-icon>
            重置设置
          </h3>
          <p class="setting-description">恢复所有设置到默认状态</p>

          <el-button
            type="danger"
            plain
            class="mt-4 w-full"
            @click="handleReset"
            :icon="RefreshRight"
          >
            重置所有设置
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting, EditPen, Check, RefreshRight } from '@element-plus/icons-vue'
import { useSettingsStore } from '@/stores/settings'
import type { FontSize } from '@/stores/settings'

const settingsStore = useSettingsStore()
const drawerVisible = ref(false)

// 字体大小选项
const fontSizeOptions = [
  {
    value: 'medium' as FontSize,
    label: '中等',
    previewClass: 'text-base',
  },
  {
    value: 'large' as FontSize,
    label: '大',
    previewClass: 'text-lg',
  },
  {
    value: 'extra-large' as FontSize,
    label: '超大',
    previewClass: 'text-xl',
  },
]

// 处理重置
const handleReset = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？此操作不可恢复。', '确认重置', {
    type: 'warning',
  })
    .then(() => {
      settingsStore.resetSettings()
      ElMessage.success('设置已重置')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 初始化
onMounted(() => {
  settingsStore.loadFromStorage()
})
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.settings-trigger {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  transition: all 0.3s ease;
}

.settings-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.setting-section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.setting-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.setting-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.font-size-option {
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.font-size-option:hover {
  background-color: #f9fafb;
}

.font-size-option.active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.font-size-preview {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background-color: #e5e7eb;
  font-weight: 500;
}
</style>
