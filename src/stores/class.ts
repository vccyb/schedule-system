import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Class, ClassCourseRequirement } from '@/types'

// 安全的ID生成器
let classIdCounter = 0
const generateUniqueClassId = () => {
  const timestamp = Date.now()
  classIdCounter = (classIdCounter + 1) % 10000
  return `class_${timestamp}_${classIdCounter}_${Math.random().toString(36).substr(2, 9)}`
}

let requirementIdCounter = 0
const generateUniqueRequirementId = () => {
  const timestamp = Date.now()
  requirementIdCounter = (requirementIdCounter + 1) % 10000
  return `req_${timestamp}_${requirementIdCounter}_${Math.random().toString(36).substr(2, 9)}`
}

export const useClassStore = defineStore('class', () => {
  const classes = ref<Class[]>([])

  // 计算属性
  const classCount = computed(() => classes.value.length)

  const getClassById = computed(() => (id: string) => classes.value.find((cls) => cls.id === id))

  const getClassesByGrade = computed(
    () => (grade: string) => classes.value.filter((cls) => cls.grade === grade),
  )

  const gradeOptions = computed(() => {
    const grades = [...new Set(classes.value.map((cls) => cls.grade))]
    return grades.sort()
  })

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('schedule-system-classes')
      if (stored) {
        classes.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load classes from localStorage:', error)
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      localStorage.setItem('schedule-system-classes', JSON.stringify(classes.value))
    } catch (error) {
      console.error('Failed to save classes to localStorage:', error)
    }
  }

  // 添加班级
  const addClass = (classData: Omit<Class, 'id' | 'createdAt' | 'courseRequirements'>) => {
    const newClass: Class = {
      ...classData,
      id: generateUniqueClassId(),
      courseRequirements: [],
      createdAt: new Date().toISOString(),
    }

    // 如果有班主任ID，自动填充班主任姓名
    if (classData.headTeacherId) {
      // 这里需要从 teacher store 获取教师信息，但为了避免循环依赖，我们在组件中处理
      newClass.headTeacherName = classData.headTeacherName
    }

    classes.value.push(newClass)
    saveToStorage()
    return newClass
  }

  // 更新班级
  const updateClass = (id: string, updates: Partial<Class>) => {
    const index = classes.value.findIndex((cls) => cls.id === id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...updates }
      saveToStorage()
      return classes.value[index]
    }
    return null
  }

  // 删除班级
  const deleteClass = (id: string) => {
    const index = classes.value.findIndex((cls) => cls.id === id)
    if (index !== -1) {
      classes.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // 清空所有班级
  const clearClasses = () => {
    classes.value = []
    saveToStorage()
  }

  // ========== 课程需求管理 ==========

  // 为班级添加课程需求
  const addCourseRequirement = (
    classId: string,
    requirement: Omit<ClassCourseRequirement, 'id' | 'classId' | 'createdAt'>,
  ) => {
    const classIndex = classes.value.findIndex((cls) => cls.id === classId)
    if (classIndex === -1) return null

    const newRequirement: ClassCourseRequirement = {
      ...requirement,
      id: generateUniqueRequirementId(),
      classId,
      createdAt: new Date().toISOString(),
    }

    classes.value[classIndex].courseRequirements.push(newRequirement)
    saveToStorage()
    return newRequirement
  }

  // 更新课程需求
  const updateCourseRequirement = (
    classId: string,
    requirementId: string,
    updates: Partial<ClassCourseRequirement>,
  ) => {
    const classIndex = classes.value.findIndex((cls) => cls.id === classId)
    if (classIndex === -1) return null

    const reqIndex = classes.value[classIndex].courseRequirements.findIndex(
      (req) => req.id === requirementId,
    )
    if (reqIndex === -1) return null

    classes.value[classIndex].courseRequirements[reqIndex] = {
      ...classes.value[classIndex].courseRequirements[reqIndex],
      ...updates,
    }
    saveToStorage()
    return classes.value[classIndex].courseRequirements[reqIndex]
  }

  // 删除课程需求
  const deleteCourseRequirement = (classId: string, requirementId: string) => {
    const classIndex = classes.value.findIndex((cls) => cls.id === classId)
    if (classIndex === -1) return false

    const reqIndex = classes.value[classIndex].courseRequirements.findIndex(
      (req) => req.id === requirementId,
    )
    if (reqIndex === -1) return false

    classes.value[classIndex].courseRequirements.splice(reqIndex, 1)
    saveToStorage()
    return true
  }

  // 获取班级的课程需求
  const getClassRequirements = computed(() => (classId: string) => {
    const cls = classes.value.find((c) => c.id === classId)
    return cls?.courseRequirements || []
  })

  return {
    classes,
    classCount,
    getClassById,
    getClassesByGrade,
    gradeOptions,
    loadFromStorage,
    saveToStorage,
    addClass,
    updateClass,
    deleteClass,
    clearClasses,
    addCourseRequirement,
    updateCourseRequirement,
    deleteCourseRequirement,
    getClassRequirements,
  }
})
