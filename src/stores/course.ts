import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Course } from '@/types'
import { SUBJECT_COLORS } from '@/types'

// 安全的ID生成器
let courseIdCounter = 0
const generateUniqueCourseId = () => {
  const timestamp = Date.now()
  courseIdCounter = (courseIdCounter + 1) % 10000
  return `course_${timestamp}_${courseIdCounter}_${Math.random().toString(36).substr(2, 9)}`
}

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([])

  // 计算属性
  const courseCount = computed(() => courses.value.length)

  const getCourseById = computed(
    () => (id: string) => courses.value.find((course) => course.id === id),
  )

  const getCoursesByTeacher = computed(
    () => (teacherId: string) => courses.value.filter((course) => course.teacherId === teacherId),
  )

  const getCoursesBySubject = computed(
    () => (subject: string) => courses.value.filter((course) => course.subject === subject),
  )

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('schedule-system-courses')
      if (stored) {
        courses.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load courses from localStorage:', error)
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      localStorage.setItem('schedule-system-courses', JSON.stringify(courses.value))
    } catch (error) {
      console.error('Failed to save courses to localStorage:', error)
    }
  }

  // 获取随机颜色
  const getRandomColor = () => {
    return SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)]
  }

  // 添加课程
  const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'color'>) => {
    const newCourse: Course = {
      ...course,
      id: generateUniqueCourseId(),
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
    }
    courses.value.push(newCourse)
    saveToStorage()
    return newCourse
  }

  // 更新课程
  const updateCourse = (id: string, updates: Partial<Course>) => {
    const index = courses.value.findIndex((course) => course.id === id)
    if (index !== -1) {
      courses.value[index] = { ...courses.value[index], ...updates }
      saveToStorage()
      return courses.value[index]
    }
    return null
  }

  // 删除课程
  const deleteCourse = (id: string) => {
    const index = courses.value.findIndex((course) => course.id === id)
    if (index !== -1) {
      courses.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // 清空所有课程
  const clearCourses = () => {
    courses.value = []
    saveToStorage()
  }

  return {
    courses,
    courseCount,
    getCourseById,
    getCoursesByTeacher,
    getCoursesBySubject,
    loadFromStorage,
    saveToStorage,
    addCourse,
    updateCourse,
    deleteCourse,
    clearCourses,
  }
})
