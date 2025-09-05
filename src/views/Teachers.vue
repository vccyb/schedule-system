<template>
  <div class="teachers-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">教师管理</h2>
        <p class="text-gray-600 mt-1">管理所有教师信息，包括添加、编辑和删除教师</p>
      </div>
      <el-button type="primary" size="large" @click="showAddDialog" :icon="Plus">
        添加教师
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <el-input
            v-model="searchText"
            placeholder="搜索教师姓名或联系方式"
            :prefix-icon="Search"
            clearable
            size="large"
          />
        </div>
        <el-select
          v-model="selectedSubject"
          placeholder="筛选学科"
          clearable
          size="large"
          style="width: 200px"
        >
          <el-option
            v-for="subject in subjectOptions"
            :key="subject"
            :label="subject"
            :value="subject"
          />
        </el-select>
      </div>
    </div>

    <!-- 教师列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <el-table :data="filteredTeachers" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="姓名" min-width="120">
          <template #default="{ row }">
            <div class="flex items-center">
              <el-avatar
                :size="40"
                class="mr-3"
                :style="{ backgroundColor: getAvatarColor(row.name) }"
              >
                {{ row.name.charAt(0) }}
              </el-avatar>
              <div>
                <div class="font-medium text-gray-900">{{ row.name }}</div>
                <div class="text-sm text-gray-500">教师编号: {{ row.id.slice(-6) }}</div>
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

        <el-table-column prop="phone" label="手机号码" width="140">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.phone || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="180">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.email || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            <span class="text-gray-500">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="课程数量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info" round>
              {{ getCourseCount(row.id) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="editTeacher(row)" :icon="Edit">
              编辑
            </el-button>
            <el-button size="small" type="danger" link @click="deleteTeacher(row)" :icon="Delete">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="filteredTeachers.length === 0 && !loading" class="text-center py-16">
        <el-icon class="text-6xl text-gray-300 mb-4"><UserFilled /></el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无教师信息</h3>
        <p class="text-gray-500 mb-6">开始添加第一位教师吧</p>
        <el-button type="primary" @click="showAddDialog" :icon="Plus"> 添加教师 </el-button>
      </div>
    </div>

    <!-- 添加/编辑教师对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入教师姓名"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="学科" prop="subject">
          <el-select
            v-model="form.subject"
            placeholder="请选择学科"
            style="width: 100%"
            filterable
            allow-create
          >
            <el-option
              v-for="subject in commonSubjects"
              :key="subject"
              :label="subject"
              :value="subject"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码（选填）" maxlength="11" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址（选填）" maxlength="50" />
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
import { Plus, Search, Edit, Delete, UserFilled } from '@element-plus/icons-vue'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import type { Teacher } from '@/types'
import { SUBJECT_COLORS } from '@/types'
import dayjs from 'dayjs'

const teacherStore = useTeacherStore()
const courseStore = useCourseStore()

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentEditId = ref('')
const searchText = ref('')
const selectedSubject = ref('')
const formRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  name: '',
  subject: '',
  phone: '',
  email: '',
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' },
  ],
  subject: [{ required: true, message: '请选择或输入学科', trigger: 'change' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
}

// 常用学科列表
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

// 计算属性
const dialogTitle = computed(() => (isEdit.value ? '编辑教师' : '添加教师'))

const filteredTeachers = computed(() => {
  let teachers = teacherStore.teachers

  // 按姓名或联系方式搜索
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    teachers = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(search) ||
        (teacher.phone && teacher.phone.includes(search)) ||
        (teacher.email && teacher.email.toLowerCase().includes(search)),
    )
  }

  // 按学科筛选
  if (selectedSubject.value) {
    teachers = teachers.filter((teacher) => teacher.subject === selectedSubject.value)
  }

  return teachers
})

const subjectOptions = computed(() => {
  const subjects = [...new Set(teacherStore.teachers.map((t) => t.subject))]
  return subjects.sort()
})

// 方法
const showAddDialog = () => {
  isEdit.value = false
  currentEditId.value = ''
  resetForm()
  dialogVisible.value = true
}

const editTeacher = (teacher: Teacher) => {
  isEdit.value = true
  currentEditId.value = teacher.id
  form.name = teacher.name
  form.subject = teacher.subject
  form.phone = teacher.phone || ''
  form.email = teacher.email || ''
  dialogVisible.value = true
}

const resetForm = () => {
  form.name = ''
  form.subject = ''
  form.phone = ''
  form.email = ''
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    const teacherData = {
      name: form.name.trim(),
      subject: form.subject.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
    }

    if (isEdit.value) {
      teacherStore.updateTeacher(currentEditId.value, teacherData)
      ElMessage.success('教师信息更新成功')
    } else {
      teacherStore.addTeacher(teacherData)
      ElMessage.success('教师添加成功')
    }

    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const deleteTeacher = async (teacher: Teacher) => {
  // 检查是否有关联的课程
  const courseCount = getCourseCount(teacher.id)

  let message = `确定要删除教师"${teacher.name}"吗？`
  if (courseCount > 0) {
    message += `\n注意：该教师有${courseCount}门课程，删除后相关课程也会被删除。`
  }

  try {
    await ElMessageBox.confirm(message, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 删除关联的课程
    const teacherCourses = courseStore.getCoursesByTeacher(teacher.id)
    teacherCourses.forEach((course) => {
      courseStore.deleteCourse(course.id)
    })

    // 删除教师
    teacherStore.deleteTeacher(teacher.id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const getCourseCount = (teacherId: string) => {
  return courseStore.getCoursesByTeacher(teacherId).length
}

const getAvatarColor = (name: string) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const getSubjectColor = (subject: string) => {
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
})
</script>

<style scoped>
.teachers-page {
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
