import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Teacher } from '@/types'

// 安全的ID生成器
let teacherIdCounter = 0
const generateUniqueTeacherId = () => {
  const timestamp = Date.now()
  teacherIdCounter = (teacherIdCounter + 1) % 10000
  return `teacher_${timestamp}_${teacherIdCounter}_${Math.random().toString(36).substr(2, 9)}`
}

export const useTeacherStore = defineStore('teacher', () => {
  const teachers = ref<Teacher[]>([])

  // 计算属性
  const teacherCount = computed(() => teachers.value.length)

  const getTeacherById = computed(
    () => (id: string) => teachers.value.find((teacher) => teacher.id === id),
  )

  const getTeachersBySubject = computed(
    () => (subject: string) => teachers.value.filter((teacher) => teacher.subject === subject),
  )

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('schedule-system-teachers')
      if (stored) {
        teachers.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load teachers from localStorage:', error)
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      localStorage.setItem('schedule-system-teachers', JSON.stringify(teachers.value))
    } catch (error) {
      console.error('Failed to save teachers to localStorage:', error)
    }
  }

  // 添加教师
  const addTeacher = (teacher: Omit<Teacher, 'id' | 'createdAt'>) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: generateUniqueTeacherId(),
      createdAt: new Date().toISOString(),
    }
    teachers.value.push(newTeacher)
    saveToStorage()
    return newTeacher
  }

  // 更新教师
  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    const index = teachers.value.findIndex((teacher) => teacher.id === id)
    if (index !== -1) {
      teachers.value[index] = { ...teachers.value[index], ...updates }
      saveToStorage()
      return teachers.value[index]
    }
    return null
  }

  // 删除教师
  const deleteTeacher = (id: string) => {
    const index = teachers.value.findIndex((teacher) => teacher.id === id)
    if (index !== -1) {
      teachers.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // 清空所有教师
  const clearTeachers = () => {
    teachers.value = []
    saveToStorage()
  }

  return {
    teachers,
    teacherCount,
    getTeacherById,
    getTeachersBySubject,
    loadFromStorage,
    saveToStorage,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    clearTeachers,
  }
})
