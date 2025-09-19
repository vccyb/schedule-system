// 教师信息
export interface Teacher {
  id: string
  name: string
  subject: string
  phone?: string
  email?: string
  createdAt: string
}

// 班级课程需求
export interface ClassCourseRequirement {
  id: string
  classId: string
  subjectName: string // 学科名称
  weeklyHours: number // 每周课时数
  createdAt: string
}

// 班级信息
export interface Class {
  id: string
  name: string
  grade: string
  studentCount: number
  description?: string
  headTeacherId?: string // 班主任教师ID
  headTeacherName?: string // 班主任姓名（冗余字段，便于显示）
  courseRequirements: ClassCourseRequirement[] // 课程需求列表
  createdAt: string
}

// 课程信息
export interface Course {
  id: string
  name: string
  teacherId: string
  teacherName?: string
  subject: string
  duration: number // 课时长度（分钟）
  color: string
  createdAt: string
}

// 时间段
export interface TimeSlot {
  id: string
  name: string
  startTime: string
  endTime: string
}

// 休息时间
export interface BreakTime {
  id: string
  name: string
  startTime: string
  endTime: string
}

// 课程表条目
export interface ScheduleItem {
  id: string
  courseId: string
  courseName?: string
  teacherId: string
  teacherName?: string
  classId: string
  className?: string
  timeSlotId: string
  dayOfWeek: number // 0-6, 0是周日
  subject: string
  color: string
  createdAt: string
}

// 周几的枚举
export const WEEKDAYS = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
]

// 年级选项
export const GRADE_OPTIONS = [
  '一年级',
  '二年级',
  '三年级',
  '四年级',
  '五年级',
  '六年级',
  '初一',
  '初二',
  '初三',
  '高一',
  '高二',
  '高三',
]

// 查看视角枚举
export enum ViewType {
  CLASS = 'class',
  TEACHER = 'teacher',
  GRADE = 'grade',
}

// 智能排课结果
export interface AutoScheduleResult {
  success: boolean
  message: string
  scheduledCount: number
  conflicts: string[]
  unscheduledRequirements: {
    subjectName: string
    remainingHours: number
    reason: string
  }[]
}

// 学科颜色配置
export const SUBJECT_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FECA57',
  '#FF9FF3',
  '#54A0FF',
  '#5F27CD',
  '#00D2D3',
  '#FF9F43',
  '#A55EEA',
  '#26DE81',
  '#FD79A8',
  '#FDCB6E',
  '#74B9FF',
]
