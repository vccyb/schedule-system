<template>
  <div class="courses-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">课程管理</h2>
        <p class="text-gray-600 mt-1">管理所有课程信息，包括添加、编辑和删除课程</p>
      </div>
      <el-button
        type="primary"
        size="large"
        @click="showAddDialog"
        :icon="Plus"
        :disabled="teacherStore.teacherCount === 0"
      >
        添加课程
      </el-button>
    </div>

    <!-- 提示信息 -->
    <div
      v-if="teacherStore.teacherCount === 0"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg"
    >
      <div class="flex items-start">
        <el-icon class="text-yellow-400 mr-2 mt-1"><WarningFilled /></el-icon>
        <div>
          <h3 class="text-sm font-medium text-yellow-800">需要先添加教师</h3>
          <p class="text-sm text-yellow-700 mt-1">
            在添加课程之前，请先
            <router-link to="/teachers" class="font-medium underline">添加教师信息</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div v-if="teacherStore.teacherCount > 0" class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <el-input
            v-model="searchText"
            placeholder="搜索课程名称"
            :prefix-icon="Search"
            clearable
            size="large"
            @input="resetPagination"
          />
        </div>
        <el-select
          v-model="selectedSubject"
          placeholder="筛选学科"
          clearable
          size="large"
          style="width: 200px"
          @change="resetPagination"
        >
          <el-option
            v-for="subject in subjectOptions"
            :key="subject"
            :label="subject"
            :value="subject"
          />
        </el-select>
        <el-select
          v-model="selectedTeacher"
          placeholder="筛选教师"
          clearable
          size="large"
          style="width: 200px"
          filterable
          @change="resetPagination"
        >
          <el-option
            v-for="teacher in teacherStore.teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </div>
    </div>

    <!-- 课程列表 -->
    <div v-if="teacherStore.teacherCount > 0" class="bg-white rounded-lg shadow-sm">
      <el-table
        :data="paginatedCourses"
        stripe
        style="width: 100%"
        v-loading="loading"
        :show-overflow-tooltip="true"
      >
        <el-table-column prop="name" label="课程名称" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded mr-3 flex-shrink-0"
                :style="{ backgroundColor: row.color }"
              ></div>
              <div>
                <div class="font-medium text-gray-900">{{ row.name }}</div>
                <div class="text-sm text-gray-500">课程编号: {{ row.id.slice(-6) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="subject" label="学科" width="120">
          <template #default="{ row }">
            <el-tag :color="getSubjectColor(row.subject)" class="text-white">
              {{ row.subject }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="teacherName" label="授课教师" width="140">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar
                :size="32"
                class="mr-2"
                :style="{ backgroundColor: getAvatarColor(row.teacherName || '') }"
              >
                {{ (row.teacherName || '').charAt(0) }}
              </el-avatar>
              <span class="text-gray-900">{{ row.teacherName || '未知' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="duration" label="课时长度" width="100" align="center">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.duration }}分钟</span>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            <span class="text-gray-500">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="排课次数" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info" round>
              {{ getScheduleCount(row.id) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="editCourse(row)" :icon="Edit">
              编辑
            </el-button>
            <el-button size="small" type="danger" link @click="deleteCourse(row)" :icon="Delete">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex justify-between items-center p-4 border-t">
        <div class="text-sm text-gray-500">共 {{ total }} 条记录，当前第 {{ currentPage }} 页</div>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredCourses.length === 0 && !loading" class="text-center py-16">
        <el-icon class="text-6xl text-gray-300 mb-4"><Reading /></el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无课程信息</h3>
        <p class="text-gray-500 mb-6">开始添加第一门课程吧</p>
        <el-button type="primary" @click="showAddDialog" :icon="Plus"> 添加课程 </el-button>
      </div>
    </div>

    <!-- 添加/编辑课程对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入课程名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="授课教师" prop="teacherId">
          <el-select
            v-model="form.teacherId"
            placeholder="请选择授课教师"
            style="width: 100%"
            filterable
            @change="handleTeacherChange"
          >
            <el-option
              v-for="teacher in teacherStore.teachers"
              :key="teacher.id"
              :label="`${teacher.name} (${teacher.subject})`"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学科" prop="subject">
          <el-input v-model="form.subject" placeholder="自动填入或手动输入" maxlength="20" />
        </el-form-item>

        <el-form-item label="课时长度" prop="duration">
          <el-select v-model="form.duration" placeholder="请选择课时长度" style="width: 100%">
            <el-option label="45分钟" :value="45" />
            <el-option label="50分钟" :value="50" />
            <el-option label="60分钟" :value="60" />
            <el-option label="90分钟" :value="90" />
            <el-option label="120分钟" :value="120" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '保存' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Edit, Delete, Reading, WarningFilled } from '@element-plus/icons-vue'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { useScheduleStore } from '@/stores/schedule'
import type { Course } from '@/types'
import { SUBJECT_COLORS } from '@/types'
import dayjs from 'dayjs'

const teacherStore = useTeacherStore()
const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentEditId = ref('')
const searchText = ref('')
const selectedSubject = ref('')
const selectedTeacher = ref('')
const formRef = ref<FormInstance>()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 表单数据
const form = reactive({
  name: '',
  teacherId: '',
  subject: '',
  duration: 45,
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '课程名称长度为2-50个字符', trigger: 'blur' },
  ],
  teacherId: [{ required: true, message: '请选择授课教师', trigger: 'change' }],
  subject: [{ required: true, message: '请输入学科', trigger: 'blur' }],
  duration: [{ required: true, message: '请选择课时长度', trigger: 'change' }],
}

// 计算属性
const dialogTitle = computed(() => (isEdit.value ? '编辑课程' : '添加课程'))

const filteredCourses = computed(() => {
  let courses = courseStore.courses.map((course) => ({
    ...course,
    teacherName: teacherStore.getTeacherById(course.teacherId)?.name || '未知教师',
  }))

  // 按课程名称搜索
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    courses = courses.filter((course) => course.name.toLowerCase().includes(search))
  }

  // 按学科筛选
  if (selectedSubject.value) {
    courses = courses.filter((course) => course.subject === selectedSubject.value)
  }

  // 按教师筛选
  if (selectedTeacher.value) {
    courses = courses.filter((course) => course.teacherId === selectedTeacher.value)
  }

  return courses
})

// 分页后的数据
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCourses.value.slice(start, end)
})

// 总数量
const total = computed(() => filteredCourses.value.length)

const subjectOptions = computed(() => {
  const subjects = [...new Set(courseStore.courses.map((c) => c.subject))]
  return subjects.sort()
})

// 分页方法
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const resetPagination = () => {
  currentPage.value = 1
}

// 方法
const showAddDialog = () => {
  if (teacherStore.teacherCount === 0) {
    ElMessage.warning('请先添加教师信息')
    return
  }

  isEdit.value = false
  currentEditId.value = ''
  resetForm()
  dialogVisible.value = true
}

const editCourse = (course: Course) => {
  isEdit.value = true
  currentEditId.value = course.id
  form.name = course.name
  form.teacherId = course.teacherId
  form.subject = course.subject
  form.duration = course.duration
  dialogVisible.value = true
}

const resetForm = () => {
  form.name = ''
  form.teacherId = ''
  form.subject = ''
  form.duration = 45
  formRef.value?.clearValidate()
}

const handleTeacherChange = (teacherId: string) => {
  const teacher = teacherStore.getTeacherById(teacherId)
  if (teacher) {
    form.subject = teacher.subject
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    const courseData = {
      name: form.name.trim(),
      teacherId: form.teacherId,
      teacherName: teacherStore.getTeacherById(form.teacherId)?.name,
      subject: form.subject.trim(),
      duration: form.duration,
    }

    if (isEdit.value) {
      courseStore.updateCourse(currentEditId.value, courseData)
      ElMessage.success('课程信息更新成功')
    } else {
      courseStore.addCourse(courseData)
      ElMessage.success('课程添加成功')
    }

    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const deleteCourse = async (course: Course) => {
  // 检查是否有关联的排课
  const scheduleCount = getScheduleCount(course.id)

  let message = `确定要删除课程"${course.name}"吗？`
  if (scheduleCount > 0) {
    message += `\n注意：该课程已被排课${scheduleCount}次，删除后相关排课也会被删除。`
  }

  try {
    await ElMessageBox.confirm(message, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 删除关联的排课
    scheduleStore.scheduleItems.forEach((item) => {
      if (item.courseId === course.id) {
        scheduleStore.deleteScheduleItem(item.id)
      }
    })

    // 删除课程
    courseStore.deleteCourse(course.id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const getScheduleCount = (courseId: string) => {
  return scheduleStore.scheduleItems.filter((item) => item.courseId === courseId).length
}

const getAvatarColor = (name: string) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const getSubjectColor = (subject: string) => {
  const commonSubjects = [
    '语文',
    '数学',
    '英语',
    '物理',
    '化学',
    '生物',
    '政治',
    '历史',
    '地理',
    '音乐',
    '美术',
    '体育',
    '信息技术',
    '通用技术',
  ]
  const index = commonSubjects.indexOf(subject) % SUBJECT_COLORS.length
  return SUBJECT_COLORS[index] || '#409EFF'
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

// 初始化
onMounted(() => {
  teacherStore.loadFromStorage()
  courseStore.loadFromStorage()
  scheduleStore.loadFromStorage()
})
</script>

<style scoped>
.courses-page {
  max-width: 1200px;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
