import { defineStore } from 'pinia'
import { useTeacherStore } from './teacher'
import { useCourseStore } from './course'
import { useScheduleStore } from './schedule'
import { useClassStore } from './class'
import type { Teacher, Course, ScheduleItem, Class, TimeSlot } from '@/types'

// 完整的系统数据结构
export interface SystemData {
  version: string
  exportDate: string
  data: {
    teachers: Teacher[]
    classes: Class[]
    courses: Course[]
    scheduleItems: ScheduleItem[]
    timeSlots: TimeSlot[]
  }
}

export const useDataManagerStore = defineStore('dataManager', () => {
  // 导出所有数据为JSON
  const exportAllData = (): SystemData => {
    const teacherStore = useTeacherStore()
    const classStore = useClassStore()
    const courseStore = useCourseStore()
    const scheduleStore = useScheduleStore()

    const systemData: SystemData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        teachers: teacherStore.teachers,
        classes: classStore.classes,
        courses: courseStore.courses,
        scheduleItems: scheduleStore.scheduleItems,
        timeSlots: scheduleStore.timeSlots,
      },
    }

    return systemData
  }

  // 导出为JSON文件
  const exportToJsonFile = () => {
    try {
      const data = exportAllData()
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `简单排课系统数据_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true, message: '数据导出成功' }
    } catch (error: any) {
      return { success: false, message: `导出失败：${error.message}` }
    }
  }

  // 导入JSON数据
  const importFromJson = (jsonData: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonData) as SystemData

      // 验证数据结构
      if (!data.data || !data.version) {
        return { success: false, message: '无效的数据格式' }
      }

      const teacherStore = useTeacherStore()
      const classStore = useClassStore()
      const courseStore = useCourseStore()
      const scheduleStore = useScheduleStore()

      // 清空现有数据
      teacherStore.clearTeachers()
      classStore.clearClasses()
      courseStore.clearCourses()
      scheduleStore.clearSchedule()

      // 导入新数据
      if (data.data.teachers) {
        data.data.teachers.forEach((teacher) => {
          teacherStore.teachers.push(teacher)
        })
        teacherStore.saveToStorage()
      }

      if (data.data.classes) {
        data.data.classes.forEach((classItem) => {
          classStore.classes.push(classItem)
        })
        classStore.saveToStorage()
      }

      if (data.data.courses) {
        data.data.courses.forEach((course) => {
          courseStore.courses.push(course)
        })
        courseStore.saveToStorage()
      }

      if (data.data.scheduleItems) {
        data.data.scheduleItems.forEach((scheduleItem) => {
          scheduleStore.scheduleItems.push(scheduleItem)
        })
        scheduleStore.saveToStorage()
      }

      if (data.data.timeSlots) {
        scheduleStore.timeSlots.splice(0, scheduleStore.timeSlots.length, ...data.data.timeSlots)
        scheduleStore.saveToStorage()
      }

      return {
        success: true,
        message: `数据导入成功！导入了 ${data.data.teachers.length} 名教师、${data.data.classes.length} 个班级、${data.data.courses.length} 门课程、${data.data.scheduleItems.length} 项排课记录`,
      }
    } catch (error: any) {
      return { success: false, message: `导入失败：${error.message}` }
    }
  }

  // 从文件导入
  const importFromJsonFile = (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = e.target?.result as string
          const result = importFromJson(jsonData)
          resolve(result)
        } catch (error: any) {
          resolve({ success: false, message: `文件读取失败：${error.message}` })
        }
      }
      reader.onerror = () => {
        resolve({ success: false, message: '文件读取失败' })
      }
      reader.readAsText(file)
    })
  }

  // 验证数据完整性
  const validateData = (data: SystemData): { valid: boolean; issues: string[] } => {
    const issues: string[] = []

    if (!data.version) {
      issues.push('缺少版本信息')
    }

    if (!data.data) {
      issues.push('缺少数据内容')
      return { valid: false, issues }
    }

    if (!Array.isArray(data.data.teachers)) {
      issues.push('教师数据格式错误')
    }

    if (!Array.isArray(data.data.classes)) {
      issues.push('班级数据格式错误')
    }

    if (!Array.isArray(data.data.courses)) {
      issues.push('课程数据格式错误')
    }

    if (!Array.isArray(data.data.scheduleItems)) {
      issues.push('排课数据格式错误')
    }

    return { valid: issues.length === 0, issues }
  }

  return {
    exportAllData,
    exportToJsonFile,
    importFromJson,
    importFromJsonFile,
    validateData,
  }
})
