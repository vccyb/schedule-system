import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ScheduleItem, TimeSlot, AutoScheduleResult } from '@/types'

// 安全的ID生成器，确保唯一性
let idCounter = 0
const generateUniqueId = () => {
  const timestamp = Date.now()
  idCounter = (idCounter + 1) % 10000 // 防止计数器过大
  return `${timestamp}_${idCounter}_${Math.random().toString(36).substr(2, 9)}`
}

export const useScheduleStore = defineStore('schedule', () => {
  const scheduleItems = ref<ScheduleItem[]>([])
  const timeSlots = ref<TimeSlot[]>([
    { id: '1', name: '第一节', startTime: '08:00', endTime: '08:45' },
    { id: '2', name: '第二节', startTime: '08:55', endTime: '09:40' },
    { id: '3', name: '第三节', startTime: '10:00', endTime: '10:45' },
    { id: '4', name: '第四节', startTime: '10:55', endTime: '11:40' },
    { id: '5', name: '第五节', startTime: '14:00', endTime: '14:45' },
    { id: '6', name: '第六节', startTime: '14:55', endTime: '15:40' },
    { id: '7', name: '第七节', startTime: '16:00', endTime: '16:45' },
    { id: '8', name: '第八节', startTime: '16:55', endTime: '17:40' },
  ])

  // 休息时间
  const breakTimes = ref<{ id: string; name: string; startTime: string; endTime: string }[]>([])

  // 计算属性
  const scheduleCount = computed(() => scheduleItems.value.length)

  const getScheduleByDay = computed(
    () => (dayOfWeek: number) => scheduleItems.value.filter((item) => item.dayOfWeek === dayOfWeek),
  )

  const getScheduleByTimeSlot = computed(
    () => (timeSlotId: string) =>
      scheduleItems.value.filter((item) => item.timeSlotId === timeSlotId),
  )

  const getScheduleByDayAndTimeSlot = computed(
    () => (dayOfWeek: number, timeSlotId: string) =>
      scheduleItems.value.find(
        (item) => item.dayOfWeek === dayOfWeek && item.timeSlotId === timeSlotId,
      ),
  )

  const getScheduleByTeacher = computed(
    () => (teacherId: string) => scheduleItems.value.filter((item) => item.teacherId === teacherId),
  )

  const getScheduleByClass = computed(
    () => (classId: string) => scheduleItems.value.filter((item) => item.classId === classId),
  )

  const getTimeSlotById = computed(
    () => (id: string) => timeSlots.value.find((slot) => slot.id === id),
  )

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const storedSchedule = localStorage.getItem('schedule-system-schedule')
      const storedTimeSlots = localStorage.getItem('schedule-system-timeslots')
      const storedBreakTimes = localStorage.getItem('school-break-times')

      if (storedSchedule) {
        scheduleItems.value = JSON.parse(storedSchedule)
      }
      if (storedTimeSlots) {
        timeSlots.value = JSON.parse(storedTimeSlots)
      }
      if (storedBreakTimes) {
        breakTimes.value = JSON.parse(storedBreakTimes)
      }
    } catch (error) {
      console.error('Failed to load schedule from localStorage:', error)
    }
  }

  // 保存到本地存储
  const saveToStorage = () => {
    try {
      localStorage.setItem('schedule-system-schedule', JSON.stringify(scheduleItems.value))
      localStorage.setItem('schedule-system-timeslots', JSON.stringify(timeSlots.value))
      localStorage.setItem('school-break-times', JSON.stringify(breakTimes.value))
    } catch (error) {
      console.error('Failed to save schedule to localStorage:', error)
    }
  }

  // 重置时间配置到默认值
  const resetTimeSlots = () => {
    timeSlots.value = [
      { id: '1', name: '第一节', startTime: '08:00', endTime: '08:45' },
      { id: '2', name: '第二节', startTime: '08:55', endTime: '09:40' },
      { id: '3', name: '第三节', startTime: '10:00', endTime: '10:45' },
      { id: '4', name: '第四节', startTime: '10:55', endTime: '11:40' },
      { id: '5', name: '第五节', startTime: '14:00', endTime: '14:45' },
      { id: '6', name: '第六节', startTime: '14:55', endTime: '15:40' },
      { id: '7', name: '第七节', startTime: '16:00', endTime: '16:45' },
      { id: '8', name: '第八节', startTime: '16:55', endTime: '17:40' },
    ]
    breakTimes.value = []
    saveToStorage()
  }

  // 更新时间配置
  const updateTimeSlots = (newTimeSlots: TimeSlot[]) => {
    timeSlots.value = newTimeSlots
    saveToStorage()
  }

  // 更新休息时间
  const updateBreakTimes = (
    newBreakTimes: { id: string; name: string; startTime: string; endTime: string }[],
  ) => {
    breakTimes.value = newBreakTimes
    saveToStorage()
  }

  // 检查时间冲突（同时检查班级和教师冲突）
  const checkConflict = (
    dayOfWeek: number,
    timeSlotId: string,
    classId?: string,
    teacherId?: string,
    excludeId?: string,
  ) => {
    return scheduleItems.value.some((item) => {
      if (item.id === excludeId) return false
      if (item.dayOfWeek !== dayOfWeek || item.timeSlotId !== timeSlotId) return false

      // 检查班级冲突：同一时间段，同一班级不能有多门课
      if (classId && item.classId === classId) {
        return true
      }

      // 检查教师冲突：同一时间段，同一教师不能上多门课
      if (teacherId && item.teacherId === teacherId) {
        return true
      }

      return false
    })
  }

  // 检查班级冲突
  const checkClassConflict = (
    dayOfWeek: number,
    timeSlotId: string,
    classId: string,
    excludeId?: string,
  ) => {
    return scheduleItems.value.some(
      (item) =>
        item.dayOfWeek === dayOfWeek &&
        item.timeSlotId === timeSlotId &&
        item.classId === classId &&
        item.id !== excludeId,
    )
  }

  // 检查教师冲突
  const checkTeacherConflict = (
    dayOfWeek: number,
    timeSlotId: string,
    teacherId: string,
    excludeId?: string,
  ) => {
    return scheduleItems.value.some(
      (item) =>
        item.dayOfWeek === dayOfWeek &&
        item.timeSlotId === timeSlotId &&
        item.teacherId === teacherId &&
        item.id !== excludeId,
    )
  }

  // 添加排课
  const addScheduleItem = (item: Omit<ScheduleItem, 'id' | 'createdAt'>) => {
    // 检查班级冲突
    if (checkClassConflict(item.dayOfWeek, item.timeSlotId, item.classId)) {
      throw new Error('该时间段该班级已有课程安排')
    }

    // 检查教师冲突
    if (checkTeacherConflict(item.dayOfWeek, item.timeSlotId, item.teacherId)) {
      throw new Error('该时间段该教师已有课程安排')
    }

    const newItem: ScheduleItem = {
      ...item,
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
    }
    scheduleItems.value.push(newItem)
    saveToStorage()
    return newItem
  }

  // 更新排课
  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    const index = scheduleItems.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      const currentItem = scheduleItems.value[index]

      // 如果更新时间、日期、班级或教师，检查冲突
      if (
        updates.dayOfWeek !== undefined ||
        updates.timeSlotId !== undefined ||
        updates.classId !== undefined ||
        updates.teacherId !== undefined
      ) {
        const newDayOfWeek = updates.dayOfWeek ?? currentItem.dayOfWeek
        const newTimeSlotId = updates.timeSlotId ?? currentItem.timeSlotId
        const newClassId = updates.classId ?? currentItem.classId
        const newTeacherId = updates.teacherId ?? currentItem.teacherId

        // 检查班级冲突
        if (checkClassConflict(newDayOfWeek, newTimeSlotId, newClassId, id)) {
          throw new Error('该时间段该班级已有课程安排')
        }

        // 检查教师冲突
        if (checkTeacherConflict(newDayOfWeek, newTimeSlotId, newTeacherId, id)) {
          throw new Error('该时间段该教师已有课程安排')
        }
      }

      scheduleItems.value[index] = { ...currentItem, ...updates }
      saveToStorage()
      return scheduleItems.value[index]
    }
    return null
  }

  // 删除排课
  const deleteScheduleItem = (id: string) => {
    const index = scheduleItems.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      scheduleItems.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // 移动排课（拖拽）
  const moveScheduleItem = (id: string, newDayOfWeek: number, newTimeSlotId: string) => {
    return updateScheduleItem(id, {
      dayOfWeek: newDayOfWeek,
      timeSlotId: newTimeSlotId,
    })
  }

  // 清空所有排课
  const clearSchedule = () => {
    scheduleItems.value = []
    saveToStorage()
  }

  // 清空所有排课数据（用于上课日更改时）
  const clearAllSchedule = () => {
    scheduleItems.value = []
    saveToStorage()
  }

  // 添加时间段
  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: generateUniqueId(),
    }
    timeSlots.value.push(newSlot)
    saveToStorage()
    return newSlot
  }

  // 更新时间段
  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    const index = timeSlots.value.findIndex((slot) => slot.id === id)
    if (index !== -1) {
      timeSlots.value[index] = { ...timeSlots.value[index], ...updates }
      saveToStorage()
      return timeSlots.value[index]
    }
    return null
  }

  // 删除时间段
  const deleteTimeSlot = (id: string) => {
    // 检查是否有课程使用这个时间段
    const hasSchedule = scheduleItems.value.some((item) => item.timeSlotId === id)
    if (hasSchedule) {
      throw new Error('该时间段已有课程安排，无法删除')
    }

    const index = timeSlots.value.findIndex((slot) => slot.id === id)
    if (index !== -1) {
      timeSlots.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // ========== 智能排课算法 ==========

  /**
   * 为指定班级进行智能排课
   * @param classId 班级ID
   * @param courseStore 课程库
   * @param classStore 班级库
   * @returns 排课结果
   */
  const autoScheduleForClass = (
    classId: string,
    courseStore: any,
    classStore: any,
  ): AutoScheduleResult => {
    const result: AutoScheduleResult = {
      success: false,
      message: '',
      scheduledCount: 0,
      conflicts: [],
      unscheduledRequirements: [],
    }

    try {
      const classItem = classStore.getClassById(classId)
      if (!classItem) {
        result.message = '班级不存在'
        return result
      }

      const requirements = classStore.getClassRequirements(classId)
      if (requirements.length === 0) {
        result.message = '该班级没有设置课程需求'
        return result
      }

      // 检查是否已有排课，防止重复执行
      const existingSchedules = scheduleItems.value.filter((item) => item.classId === classId)

      // 计算当前各科目已排课时数
      const currentSubjectHours: Record<string, number> = {}
      for (const schedule of existingSchedules) {
        currentSubjectHours[schedule.subject] = (currentSubjectHours[schedule.subject] || 0) + 1
      }

      // 检查是否所有需求都已满足
      const allRequirementsMet = requirements.every((req: any) => {
        const currentHours = currentSubjectHours[req.subjectName] || 0
        return currentHours >= req.weeklyHours
      })

      if (allRequirementsMet) {
        result.success = true
        result.message = '该班级的所有课程需求已经满足，无需重复排课'
        return result
      }

      // 获取可用的时间段（周一到周五）
      const availableSlots: { dayOfWeek: number; timeSlotId: string }[] = []
      for (let day = 1; day <= 5; day++) {
        for (const timeSlot of timeSlots.value) {
          availableSlots.push({ dayOfWeek: day, timeSlotId: timeSlot.id })
        }
      }

      // 随机打乱时间段以增加随机性
      for (let i = availableSlots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[availableSlots[i], availableSlots[j]] = [availableSlots[j], availableSlots[i]]
      }

      // 处理每个课程需求
      for (const requirement of requirements) {
        // 获取当前科目已排课时数
        const currentHours = currentSubjectHours[requirement.subjectName] || 0
        const needHours = requirement.weeklyHours - currentHours

        // 如果已经满足需求，跳过
        if (needHours <= 0) {
          console.log(
            `${requirement.subjectName} 已满足需求（${currentHours}/${requirement.weeklyHours}）`,
          )
          continue
        }

        console.log(
          `${requirement.subjectName} 需要新增 ${needHours} 节课（当前 ${currentHours}/${requirement.weeklyHours}）`,
        )

        const availableCourses = courseStore.courses.filter(
          (course: any) => course.subject === requirement.subjectName,
        )

        if (availableCourses.length === 0) {
          result.unscheduledRequirements.push({
            subjectName: requirement.subjectName,
            remainingHours: needHours,
            reason: '没有找到对应学科的课程',
          })
          continue
        }

        let scheduledHours = 0
        let courseIndex = 0

        // 只为尚未满足的课时数进行排课
        for (let hour = 0; hour < needHours; hour++) {
          let scheduled = false

          // 选择课程（轮流选择多个老师）
          const course = availableCourses[courseIndex % availableCourses.length]
          courseIndex++

          // 尝试找到合适的时间段
          for (const slot of availableSlots) {
            if (
              !checkClassConflict(slot.dayOfWeek, slot.timeSlotId, classId) &&
              !checkTeacherConflict(slot.dayOfWeek, slot.timeSlotId, course.teacherId)
            ) {
              try {
                addScheduleItem({
                  courseId: course.id,
                  courseName: course.name,
                  teacherId: course.teacherId,
                  teacherName:
                    course.teacherName ||
                    courseStore.getTeacherById?.(course.teacherId)?.name ||
                    '未知教师',
                  classId: classId,
                  className: classItem.name,
                  timeSlotId: slot.timeSlotId,
                  dayOfWeek: slot.dayOfWeek,
                  subject: course.subject,
                  color: course.color,
                })

                scheduledHours++
                result.scheduledCount++
                scheduled = true
                break
              } catch (error) {
                // 如果排课失败，继续尝试下一个时间段
                continue
              }
            }
          }

          // 如果这个课时没有排成功，记录原因
          if (!scheduled) {
            const remainingHours = needHours - scheduledHours
            if (remainingHours > 0) {
              const existingUnscheduled = result.unscheduledRequirements.find(
                (req) => req.subjectName === requirement.subjectName,
              )
              if (existingUnscheduled) {
                existingUnscheduled.remainingHours = remainingHours
              } else {
                result.unscheduledRequirements.push({
                  subjectName: requirement.subjectName,
                  remainingHours: remainingHours,
                  reason: '无法找到空闲时间段或教师时间冲突',
                })
              }
            }
            break
          }
        }
      }

      // 生成结果消息
      if (result.scheduledCount > 0) {
        result.success = true
        if (result.unscheduledRequirements.length === 0) {
          result.message = `智能排课成功！共排了 ${result.scheduledCount} 节课`
        } else {
          result.message = `部分排课成功！共排了 ${result.scheduledCount} 节课，还有 ${result.unscheduledRequirements.length} 个课程需求未能排满`
        }
      } else {
        result.message = '排课失败，请检查课程设置和时间表配置'
      }
    } catch (error: any) {
      result.message = `排课过程中出错：${error.message || error}`
      result.conflicts.push(error.message || error)
    }

    return result
  }

  return {
    scheduleItems,
    timeSlots,
    breakTimes,
    scheduleCount,
    getScheduleByDay,
    getScheduleByTimeSlot,
    getScheduleByDayAndTimeSlot,
    getScheduleByTeacher,
    getScheduleByClass,
    getTimeSlotById,
    loadFromStorage,
    saveToStorage,
    checkConflict,
    checkClassConflict,
    checkTeacherConflict,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    moveScheduleItem,
    clearSchedule,
    clearAllSchedule, // 新增的方法
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    autoScheduleForClass,
    // 新增的方法
    resetTimeSlots,
    updateTimeSlots,
    updateBreakTimes,
  }
})
