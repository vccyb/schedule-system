<template>
  <div class="class-management-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">班级管理</h2>
        <p class="text-gray-600 mt-1">管理所有班级信息，包括添加、编辑和删除班级</p>
      </div>
      <el-button type="primary" size="large" @click="showAddDialog" :icon="Plus">
        添加班级
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <el-input
            v-model="searchText"
            placeholder="搜索班级名称"
            :prefix-icon="Search"
            clearable
            size="large"
          />
        </div>
        <el-select
          v-model="selectedGrade"
          placeholder="筛选年级"
          clearable
          size="large"
          style="width: 200px"
        >
          <el-option v-for="grade in gradeOptions" :key="grade" :label="grade" :value="grade" />
        </el-select>
      </div>
    </div>

    <!-- 班级列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <el-table :data="filteredClasses" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="班级名称" min-width="150">
          <template #default="{ row }">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <el-icon class="text-blue-600 text-lg"><School /></el-icon>
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ row.name }}</div>
                <div class="text-sm text-gray-500">班级编号: {{ row.id.slice(-6) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="grade" label="年级" width="120">
          <template #default="{ row }">
            <el-tag type="primary">
              {{ row.grade }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="studentCount" label="学生人数" width="100" align="center">
          <template #default="{ row }">
            <span class="text-gray-900 font-medium">{{ row.studentCount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            <span class="text-gray-500">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="课程需求" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="success" round>
              {{ row.courseRequirements?.length || 0 }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="排课数量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="info" round>
              {{ getScheduleCount(row.id) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="editClass(row)" :icon="Edit">
              编辑
            </el-button>
            <el-button
              size="small"
              type="success"
              link
              @click="manageRequirements(row)"
              :icon="Setting"
            >
              课程需求
            </el-button>
            <el-button size="small" type="danger" link @click="deleteClass(row)" :icon="Delete">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态 -->
      <div v-if="filteredClasses.length === 0 && !loading" class="text-center py-16">
        <el-icon class="text-6xl text-gray-300 mb-4"><School /></el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无班级信息</h3>
        <p class="text-gray-500 mb-6">开始添加第一个班级吧</p>
        <el-button type="primary" @click="showAddDialog" :icon="Plus"> 添加班级 </el-button>
      </div>
    </div>

    <!-- 添加/编辑班级对话框 -->
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
        <el-form-item label="班级名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入班级名称"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="年级" prop="grade">
          <el-select
            v-model="form.grade"
            placeholder="请选择年级"
            style="width: 100%"
            filterable
            allow-create
          >
            <el-option v-for="grade in GRADE_OPTIONS" :key="grade" :label="grade" :value="grade" />
          </el-select>
        </el-form-item>

        <el-form-item label="学生人数" prop="studentCount">
          <el-input-number
            v-model="form.studentCount"
            :min="1"
            :max="100"
            style="width: 100%"
            placeholder="请输入学生人数"
          />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入班级描述（选填）"
            maxlength="200"
            show-word-limit
          />
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

    <!-- 课程需求管理对话框 -->
    <el-dialog
      v-model="requirementDialogVisible"
      :title="`${currentClassName} - 课程需求管理`"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="mb-4">
        <el-button type="primary" @click="showAddRequirement" :icon="Plus" size="small">
          添加课程需求
        </el-button>
      </div>

      <el-table :data="currentClassRequirements" stripe>
        <el-table-column prop="subjectName" label="学科名称" min-width="150" />
        <el-table-column prop="weeklyHours" label="每周课时" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.weeklyHours }} 节</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已排课时" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getScheduledHours(row.subjectName) >= row.weeklyHours ? 'success' : 'warning'"
            >
              {{ getScheduledHours(row.subjectName) }} 节
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="完成状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getScheduledHours(row.subjectName) >= row.weeklyHours ? 'success' : 'info'"
              size="small"
            >
              {{ getScheduledHours(row.subjectName) >= row.weeklyHours ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="editRequirement(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" link @click="deleteRequirement(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="currentClassRequirements.length === 0" class="text-center py-8 text-gray-500">
        <el-icon class="text-4xl mb-2"><Document /></el-icon>
        <p>该班级暂无课程需求</p>
        <p class="text-sm mt-1">点击上方按钮添加课程需求</p>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="requirementDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加/编辑课程需求对话框 -->
    <el-dialog
      v-model="addRequirementDialogVisible"
      :title="isEditRequirement ? '编辑课程需求' : '添加课程需求'"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="requirementFormRef"
        :model="requirementForm"
        :rules="requirementRules"
        label-width="100px"
      >
        <el-form-item label="学科名称" prop="subjectName">
          <el-select
            v-model="requirementForm.subjectName"
            placeholder="请选择学科"
            style="width: 100%"
            filterable
            allow-create
          >
            <el-option
              v-for="subject in subjectOptions"
              :key="subject"
              :label="subject"
              :value="subject"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="每周课时" prop="weeklyHours">
          <el-input-number
            v-model="requirementForm.weeklyHours"
            :min="1"
            :max="20"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRequirementDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleRequirementSubmit"
            :loading="requirementSubmitting"
          >
            {{ isEditRequirement ? '保存' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Search, Edit, Delete, School, Setting, Document } from '@element-plus/icons-vue'
import { useClassStore } from '@/stores/class'
import { useScheduleStore } from '@/stores/schedule'
import { useCourseStore } from '@/stores/course'
import type { Class } from '@/types'
import { GRADE_OPTIONS } from '@/types'
import dayjs from 'dayjs'

const classStore = useClassStore()
const scheduleStore = useScheduleStore()
const courseStore = useCourseStore()

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentEditId = ref('')
const searchText = ref('')
const selectedGrade = ref('')
const formRef = ref<FormInstance>()
const requirementDialogVisible = ref(false)
const addRequirementDialogVisible = ref(false)
const requirementSubmitting = ref(false)
const isEditRequirement = ref(false)
const currentRequirementId = ref('')
const currentClassId = ref('')
const requirementFormRef = ref<FormInstance>()

// 表单数据
const form = reactive({
  name: '',
  grade: '',
  studentCount: 30,
  description: '',
})

// 课程需求表单
const requirementForm = reactive({
  subjectName: '',
  weeklyHours: 2,
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 2, max: 30, message: '班级名称长度为2-30个字符', trigger: 'blur' },
  ],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  studentCount: [
    { required: true, message: '请输入学生人数', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '学生人数必须在1-100之间', trigger: 'blur' },
  ],
}

// 课程需求表单验证规则
const requirementRules: FormRules = {
  subjectName: [{ required: true, message: '请输入学科名称', trigger: 'blur' }],
  weeklyHours: [{ required: true, message: '请输入每周课时数', trigger: 'blur' }],
}

// 计算属性
const dialogTitle = computed(() => (isEdit.value ? '编辑班级' : '添加班级'))

const filteredClasses = computed(() => {
  let classes = classStore.classes

  // 按班级名称搜索
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    classes = classes.filter((cls) => cls.name.toLowerCase().includes(search))
  }

  // 按年级筛选
  if (selectedGrade.value) {
    classes = classes.filter((cls) => cls.grade === selectedGrade.value)
  }

  return classes
})

const gradeOptions = computed(() => {
  const grades = [...new Set(classStore.classes.map((c) => c.grade))]
  return grades.sort()
})

// 课程需求相关计算属性
const currentClassName = computed(() => {
  const classItem = classStore.getClassById(currentClassId.value)
  return classItem ? classItem.name : ''
})

const currentClassRequirements = computed(() => {
  return currentClassId.value ? classStore.getClassRequirements(currentClassId.value) : []
})

const subjectOptions = computed(() => {
  const subjects = [...new Set(courseStore.courses.map((c) => c.subject))]
  return subjects.sort()
})

// 方法
const showAddDialog = () => {
  isEdit.value = false
  currentEditId.value = ''
  resetForm()
  dialogVisible.value = true
}

const editClass = (classItem: Class) => {
  isEdit.value = true
  currentEditId.value = classItem.id
  form.name = classItem.name
  form.grade = classItem.grade
  form.studentCount = classItem.studentCount
  form.description = classItem.description || ''
  dialogVisible.value = true
}

const resetForm = () => {
  form.name = ''
  form.grade = ''
  form.studentCount = 30
  form.description = ''
  formRef.value?.clearValidate()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    const classData = {
      name: form.name.trim(),
      grade: form.grade.trim(),
      studentCount: form.studentCount,
      description: form.description.trim() || undefined,
    }

    if (isEdit.value) {
      classStore.updateClass(currentEditId.value, classData)
      ElMessage.success('班级信息更新成功')
    } else {
      classStore.addClass(classData)
      ElMessage.success('班级添加成功')
    }

    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const deleteClass = async (classItem: Class) => {
  // 检查是否有关联的排课
  const scheduleCount = getScheduleCount(classItem.id)

  let message = `确定要删除班级"${classItem.name}"吗？`
  if (scheduleCount > 0) {
    message += `\n注意：该班级有${scheduleCount}个排课记录，删除后相关排课也会被删除。`
  }

  try {
    await ElMessageBox.confirm(message, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 删除关联的排课
    const classSchedules = scheduleStore.getScheduleByClass(classItem.id)
    classSchedules.forEach((schedule) => {
      scheduleStore.deleteScheduleItem(schedule.id)
    })

    // 删除班级
    classStore.deleteClass(classItem.id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const getScheduleCount = (classId: string) => {
  return scheduleStore.getScheduleByClass(classId).length
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

// 课程需求管理方法
const manageRequirements = (classItem: Class) => {
  currentClassId.value = classItem.id
  requirementDialogVisible.value = true
}

const showAddRequirement = () => {
  isEditRequirement.value = false
  currentRequirementId.value = ''
  requirementForm.subjectName = ''
  requirementForm.weeklyHours = 2
  addRequirementDialogVisible.value = true
}

const editRequirement = (requirement: any) => {
  isEditRequirement.value = true
  currentRequirementId.value = requirement.id
  requirementForm.subjectName = requirement.subjectName
  requirementForm.weeklyHours = requirement.weeklyHours
  addRequirementDialogVisible.value = true
}

const handleRequirementSubmit = async () => {
  if (!requirementFormRef.value || !currentClassId.value) return

  try {
    await requirementFormRef.value.validate()
    requirementSubmitting.value = true

    if (isEditRequirement.value) {
      // 编辑课程需求
      classStore.updateCourseRequirement(currentClassId.value, currentRequirementId.value, {
        subjectName: requirementForm.subjectName,
        weeklyHours: requirementForm.weeklyHours,
      })
      ElMessage.success('课程需求更新成功')
    } else {
      // 检查是否已存在相同学科的需求
      const existing = currentClassRequirements.value.find(
        (req) => req.subjectName === requirementForm.subjectName,
      )
      if (existing) {
        ElMessage.error('该学科的课程需求已存在')
        return
      }

      // 添加课程需求
      classStore.addCourseRequirement(currentClassId.value, {
        subjectName: requirementForm.subjectName,
        weeklyHours: requirementForm.weeklyHours,
      })
      ElMessage.success('课程需求添加成功')
    }

    addRequirementDialogVisible.value = false
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    requirementSubmitting.value = false
  }
}

const deleteRequirement = async (requirementId: string) => {
  if (!currentClassId.value) return

  try {
    await ElMessageBox.confirm('确定要删除这个课程需求吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    classStore.deleteCourseRequirement(currentClassId.value, requirementId)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const getScheduledHours = (subjectName: string) => {
  if (!currentClassId.value) return 0
  const classSchedules = scheduleStore.getScheduleByClass(currentClassId.value)
  return classSchedules.filter((item) => item.subject === subjectName).length
}

// 初始化
onMounted(() => {
  classStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  courseStore.loadFromStorage()
})
</script>

<style scoped>
.class-management-page {
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
