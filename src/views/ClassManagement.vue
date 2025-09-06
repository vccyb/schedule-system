<template>
  <div class="class-management-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">班级管理</h2>
        <p class="text-gray-600 mt-1">管理所有班级信息，包括添加、编辑和删除班级</p>
      </div>
      <div class="flex items-center space-x-3">
        <el-button type="success" size="large" @click="showImportDialog" :icon="Upload">
          批量导入
          <el-tag v-if="!isBatchImportAuthorized" size="small" type="warning" class="ml-1"
            >付费</el-tag
          >
        </el-button>
        <el-button type="primary" size="large" @click="showAddDialog" :icon="Plus">
          添加班级
        </el-button>
      </div>
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
            @input="resetPagination"
          />
        </div>
        <el-select
          v-model="selectedGrade"
          placeholder="筛选年级"
          clearable
          size="large"
          style="width: 200px"
          @change="resetPagination"
        >
          <el-option v-for="grade in gradeOptions" :key="grade" :label="grade" :value="grade" />
        </el-select>
      </div>
    </div>

    <!-- 班级列表 -->
    <div class="bg-white rounded-lg shadow-sm">
      <el-table
        :data="paginatedClasses"
        stripe
        style="width: 100%"
        v-loading="loading"
        :show-overflow-tooltip="true"
      >
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

        <el-table-column prop="headTeacherName" label="班主任" width="120">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.headTeacherName || '-' }}</span>
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

        <el-form-item label="班主任" prop="headTeacherId">
          <el-select
            v-model="form.headTeacherId"
            placeholder="请选择班主任（可选）"
            style="width: 100%"
            clearable
            filterable
          >
            <el-option
              v-for="teacher in teacherStore.teachers"
              :key="teacher.id"
              :label="`${teacher.name} (${teacher.subject})`"
              :value="teacher.id"
            />
          </el-select>
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
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <el-button type="primary" @click="showAddRequirement" :icon="Plus" size="small">
            添加课程需求
          </el-button>
          <el-button
            type="success"
            @click="showCopyRequirementsDialog"
            :icon="DocumentCopy"
            size="small"
          >
            复制其他班级需求
          </el-button>
        </div>
        <div class="text-sm text-gray-500">共 {{ currentClassRequirements.length }} 个课程需求</div>
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

    <!-- 复制课程需求对话框 -->
    <el-dialog
      v-model="copyRequirementsDialogVisible"
      title="复制课程需求"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="space-y-4">
        <div class="mb-4">
          <p class="text-gray-600 mb-3">
            选择要复制课程需求的源班级，系统将把该班级的所有课程需求复制到当前班级。
          </p>
          <el-alert
            v-if="currentClassRequirements.length > 0"
            title="注意：复制操作将替换当前班级的所有课程需求"
            type="warning"
            show-icon
            :closable="false"
            class="mb-4"
          />
        </div>

        <!-- 源班级选择 -->
        <el-form-item label="选择源班级：" label-width="100px">
          <el-select
            v-model="selectedSourceClass"
            placeholder="请选择要复制课程需求的班级"
            style="width: 100%"
            filterable
            @change="onSourceClassChange"
          >
            <el-option
              v-for="cls in availableSourceClasses"
              :key="cls.id"
              :label="`${cls.name} (${cls.grade})`"
              :value="cls.id"
            >
              <div class="flex items-center justify-between">
                <span>{{ cls.name }} ({{ cls.grade }})</span>
                <el-tag size="small" type="info">
                  {{ cls.courseRequirements.length }} 个需求
                </el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 预览要复制的课程需求 -->
        <div v-if="selectedSourceClass && sourceClassRequirements.length > 0" class="mt-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3">预览要复制的课程需求：</h4>
          <div class="border rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
            <div class="space-y-2">
              <div
                v-for="req in sourceClassRequirements"
                :key="req.id"
                class="flex items-center justify-between p-2 bg-white rounded border"
              >
                <span class="font-medium">{{ req.subjectName }}</span>
                <el-tag size="small" type="primary">{{ req.weeklyHours }} 节/周</el-tag>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="selectedSourceClass" class="text-center py-4 text-gray-500">
          <el-icon class="text-2xl mb-2"><Document /></el-icon>
          <p>该班级暂无课程需求</p>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="copyRequirementsDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleCopyRequirements"
            :disabled="!selectedSourceClass || sourceClassRequirements.length === 0"
            :loading="copySubmitting"
          >
            开始复制
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Excel 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入班级"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="!importPreviewVisible" class="space-y-6">
        <!-- 模板下载区域 -->
        <div class="border rounded-lg p-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <el-icon class="mr-2 text-blue-500"><Download /></el-icon>
            步骤一：下载导入模板
          </h4>
          <p class="text-gray-600 mb-4">请先下载 Excel 模板，按照模板格式填写数据</p>
          <el-button type="primary" @click="downloadTemplate" :icon="Download">
            下载模板
          </el-button>
        </div>

        <!-- 文件上传区域 -->
        <div class="border rounded-lg p-4">
          <h4 class="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <el-icon class="mr-2 text-green-500"><Upload /></el-icon>
            步骤二：上传填好的 Excel 文件
          </h4>
          <p class="text-gray-600 mb-4">支持 .xlsx 和 .xls 格式的 Excel 文件</p>

          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          >
            <el-icon class="text-4xl text-gray-400 mb-4"><Upload /></el-icon>
            <p class="text-gray-600 mb-4">点击选择文件或拖拽文件到此区域</p>
            <el-button type="primary" @click="selectFile">选择文件</el-button>
            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xls"
              style="display: none"
              @change="handleFileSelect"
            />
          </div>
        </div>

        <!-- 注意事项 -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 class="font-medium text-yellow-800 mb-2">注意事项：</h5>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• 班级名称和年级为必填字段</li>
            <li>• 学生人数必须在 1-100 之间</li>
            <li>• 描述为可选字段</li>
            <li>• 如果班级已存在，将会跳过该条记录</li>
          </ul>
        </div>
      </div>

      <!-- 导入预览 -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-medium text-gray-900">导入预览</h4>
          <el-tag type="info">共 {{ importData.length }} 条记录</el-tag>
        </div>

        <div class="max-h-96 overflow-y-auto border rounded">
          <el-table :data="importData" size="small" stripe>
            <el-table-column prop="name" label="班级名称" width="150" />
            <el-table-column prop="grade" label="年级" width="100" />
            <el-table-column prop="studentCount" label="学生人数" width="120" />
            <el-table-column prop="description" label="描述" min-width="200" />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <template v-if="!importPreviewVisible">
            <el-button @click="importDialogVisible = false">取消</el-button>
          </template>
          <template v-else>
            <el-button @click="cancelImport">返回</el-button>
            <el-button type="primary" @click="confirmImport" :loading="importing">
              确认导入
            </el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  Plus,
  Search,
  Edit,
  Delete,
  School,
  Setting,
  Document,
  DocumentCopy,
  Upload,
  Download,
} from '@element-plus/icons-vue'
import { useClassStore } from '@/stores/class'
import { useScheduleStore } from '@/stores/schedule'
import { useCourseStore } from '@/stores/course'
import { useTeacherStore } from '@/stores/teacher'
import { isFeatureAuthorized } from '@/utils/auth'
import { useRouter } from 'vue-router'
import type { Class, ClassCourseRequirement } from '@/types'
import { GRADE_OPTIONS } from '@/types'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'

const classStore = useClassStore()
const scheduleStore = useScheduleStore()
const courseStore = useCourseStore()
const teacherStore = useTeacherStore()
const router = useRouter()

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

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 导入功能相关
const importDialogVisible = ref(false)
const importing = ref(false)
const isBatchImportAuthorized = ref(false)
const fileInputRef = ref<HTMLInputElement>()
const importData = ref<Class[]>([])
const importPreviewVisible = ref(false)

// 复制课程需求功能相关
const copyRequirementsDialogVisible = ref(false)
const selectedSourceClass = ref('')
const sourceClassRequirements = ref<ClassCourseRequirement[]>([])
const copySubmitting = ref(false)

// 表单数据
const form = reactive({
  name: '',
  grade: '',
  studentCount: 30,
  description: '',
  headTeacherId: '',
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

// 分页后的数据
const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredClasses.value.slice(start, end)
})

// 总数量
const total = computed(() => filteredClasses.value.length)

const gradeOptions = computed(() => {
  const grades = [...new Set(classStore.classes.map((c) => c.grade))]
  return grades.sort()
})

// 分页方法
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
}

// 搜索或筛选时重置分页
const resetPagination = () => {
  currentPage.value = 1
}

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

// 可用的源班级（排除当前编辑的班级）
const availableSourceClasses = computed(() => {
  return classStore.classes.filter(
    (cls) => cls.id !== currentClassId.value && cls.courseRequirements.length > 0,
  )
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
  form.headTeacherId = classItem.headTeacherId || ''
  dialogVisible.value = true
}

const resetForm = () => {
  form.name = ''
  form.grade = ''
  form.studentCount = 30
  form.description = ''
  form.headTeacherId = ''
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
      headTeacherId: form.headTeacherId || undefined,
      headTeacherName: form.headTeacherId
        ? teacherStore.getTeacherById(form.headTeacherId)?.name
        : undefined,
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

const editRequirement = (requirement: ClassCourseRequirement) => {
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
  } catch (error: unknown) {
    ElMessage.error(error instanceof Error ? error.message : '操作失败')
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

// 检查批量导入授权
const checkBatchImportAuth = async () => {
  isBatchImportAuthorized.value = await isFeatureAuthorized('BATCH_IMPORT')
}

// 显示导入对话框
const showImportDialog = async () => {
  await checkBatchImportAuth()
  if (!isBatchImportAuthorized.value) {
    ElMessage.warning('批量导入是付费功能，请先获取授权码')
    router.push('/auth')
    return
  }
  importDialogVisible.value = true
}

// 下载模板
const downloadTemplate = () => {
  const templateData = [
    ['班级名称', '年级', '学生人数', '描述'],
    ['一班', '九年级', 45, '优秀班级'],
    ['二班', '九年级', 42, '普通班级'],
  ]

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(templateData)

  // 设置列宽
  worksheet['!cols'] = [
    { wch: 15 }, // 班级名称
    { wch: 15 }, // 年级
    { wch: 15 }, // 学生人数
    { wch: 30 }, // 描述
  ]

  XLSX.utils.book_append_sheet(workbook, worksheet, '班级信息')
  XLSX.writeFile(workbook, '班级导入模板.xlsx')
  ElMessage.success('模板下载成功')
}

// 选择文件
const selectFile = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    ElMessage.error('请选择 Excel 文件')
    return
  }

  parseExcelFile(file)
}

// 解析 Excel 文件
const parseExcelFile = (file: File) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // 转换为 JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

      if (jsonData.length < 2) {
        ElMessage.error('文件中没有数据')
        return
      }

      // 跳过表头，处理数据
      const classes: Class[] = []
      const errors: string[] = []

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (!row[0]) continue // 跳过空行

        const name = row[0]?.toString().trim()
        const grade = row[1]?.toString().trim()
        const studentCount = parseInt(row[2]?.toString() || '30')
        const description = row[3]?.toString().trim() || ''

        // 验证必填字段
        if (!name) {
          errors.push(`第${i + 1}行：班级名称不能为空`)
          continue
        }

        if (!grade) {
          errors.push(`第${i + 1}行：年级不能为空`)
          continue
        }

        // 验证学生人数
        if (isNaN(studentCount) || studentCount < 1 || studentCount > 100) {
          errors.push(`第${i + 1}行：学生人数必须在 1-100 之间`)
          continue
        }

        classes.push({
          id: `class_${Date.now()}_${i}`,
          name,
          grade,
          studentCount,
          description,
          courseRequirements: [],
          createdAt: new Date().toISOString(),
        })
      }

      if (errors.length > 0) {
        ElMessage.error(`发现${errors.length}个错误：\n${errors.join('\n')}`)
        return
      }

      if (classes.length === 0) {
        ElMessage.error('没有可导入的数据')
        return
      }

      importData.value = classes
      importPreviewVisible.value = true
    } catch (error) {
      console.error('解析文件失败:', error)
      ElMessage.error('文件解析失败，请检查文件格式')
    }
  }

  reader.readAsBinaryString(file)
}

// 确认导入
const confirmImport = async () => {
  if (importData.value.length === 0) return

  try {
    importing.value = true

    // 批量添加班级
    importData.value.forEach((classItem) => {
      classStore.addClass({
        name: classItem.name,
        grade: classItem.grade,
        studentCount: classItem.studentCount,
        description: classItem.description,
      })
    })

    ElMessage.success(`成功导入${importData.value.length}个班级`)
    importDialogVisible.value = false
    importPreviewVisible.value = false
    importData.value = []

    // 清空文件输入
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

// 取消导入
const cancelImport = () => {
  importPreviewVisible.value = false
  importData.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 复制课程需求相关方法
const showCopyRequirementsDialog = () => {
  selectedSourceClass.value = ''
  sourceClassRequirements.value = []
  copyRequirementsDialogVisible.value = true
}

const onSourceClassChange = (classId: string) => {
  if (classId) {
    const sourceClass = classStore.getClassById(classId)
    sourceClassRequirements.value = sourceClass ? sourceClass.courseRequirements : []
  } else {
    sourceClassRequirements.value = []
  }
}

const handleCopyRequirements = async () => {
  if (!selectedSourceClass.value || !currentClassId.value) return

  try {
    let confirmMessage = `确定要复制课程需求吗？`

    if (currentClassRequirements.value.length > 0) {
      confirmMessage = `当前班级已有 ${currentClassRequirements.value.length} 个课程需求，复制操作将替换所有现有需求。确定要继续吗？`
    }

    await ElMessageBox.confirm(confirmMessage, '确认复制', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    copySubmitting.value = true

    // 先清空当前班级的所有课程需求
    const currentRequirements = [...currentClassRequirements.value]
    currentRequirements.forEach((req) => {
      classStore.deleteCourseRequirement(currentClassId.value, req.id)
    })

    // 复制源班级的课程需求
    sourceClassRequirements.value.forEach((req) => {
      classStore.addCourseRequirement(currentClassId.value, {
        subjectName: req.subjectName,
        weeklyHours: req.weeklyHours,
      })
    })

    ElMessage.success(`成功复制了 ${sourceClassRequirements.value.length} 个课程需求`)
    copyRequirementsDialogVisible.value = false
  } catch {
    ElMessage.info('已取消复制')
  } finally {
    copySubmitting.value = false
  }
}

// 初始化
onMounted(async () => {
  classStore.loadFromStorage()
  scheduleStore.loadFromStorage()
  courseStore.loadFromStorage()
  teacherStore.loadFromStorage()
  await checkBatchImportAuth()
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
