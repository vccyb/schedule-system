import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type FontSize = 'medium' | 'large' | 'extra-large'

export interface AppSettings {
  fontSize: FontSize
}

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const fontSize = ref<FontSize>('medium')

  // 计算属性
  const fontSizeLabel = computed(() => {
    const labels = {
      medium: '中等',
      large: '大',
      'extra-large': '超大'
    }
    return labels[fontSize.value]
  })

  const fontSizeClass = computed(() => {
    const classes = {
      medium: 'text-base leading-relaxed',
      large: 'text-lg leading-relaxed',
      'extra-large': 'text-xl leading-relaxed'
    }
    return classes[fontSize.value]
  })

  // 方法
  const setFontSize = (newFontSize: FontSize) => {
    fontSize.value = newFontSize
    applyFontSize()
    saveToStorage()
  }

  // 应用字体大小
  const applyFontSize = () => {
    const html = document.documentElement
    // 移除之前的字体大小类
    html.classList.remove('font-medium', 'font-large', 'font-extra-large')
    // 添加新的字体大小类
    html.classList.add(`font-${fontSize.value}`)
  }

  // 从本地存储加载设置
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('app-settings')
      if (stored) {
        const settings: AppSettings = JSON.parse(stored)
        fontSize.value = settings.fontSize || 'medium'
        applyFontSize()
      }
    } catch (error) {
      console.warn('加载设置失败:', error)
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      const settings: AppSettings = {
        fontSize: fontSize.value
      }
      localStorage.setItem('app-settings', JSON.stringify(settings))
    } catch (error) {
      console.warn('保存设置失败:', error)
    }
  }

  // 重置设置
  const resetSettings = () => {
    fontSize.value = 'medium'
    applyFontSize()
    saveToStorage()
  }

  return {
    // 状态
    fontSize,
    
    // 计算属性
    fontSizeLabel,
    fontSizeClass,
    
    // 方法
    setFontSize,
    loadFromStorage,
    saveToStorage,
    resetSettings
  }
})