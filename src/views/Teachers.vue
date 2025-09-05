<template>
  <div class="teachers-page">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">教师管理</h2>
        <p class="text-gray-600 mt-1">管理所有教师信息，包括添加、编辑和删除教师</p>
      </div>
      <div class="flex items-center space-x-3">
        <el-button type="success" size="large" @click="showImportDialog" :icon="Upload">
          批量导入
          <el-tag v-if="!isBatchImportAuthorized" size="small" type="warning" class="ml-1">付费</el-tag>
        </el-button>
        <el-button type="primary" size="large" @click="showAddDialog" :icon="Plus">
          添加教师
        </el-button>
      </div>
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

    <!-- Excel 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入教师"
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
          
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
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
            <li>• 姓名和学科为必填字段</li>
            <li>• 手机号码格式：1xxxxxxxxx（共 11 位数字）</li>
            <li>• 邮箱格式：example@domain.com</li>
            <li>• 如果教师已存在，将会跳过该条记录</li>
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
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="subject" label="学科" width="120" />
            <el-table-column prop="phone" label="手机号码" width="140" />
            <el-table-column prop="email" label="邮箱" min-width="180" />
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
import { Plus, Search, Edit, Delete, UserFilled, Upload, Download } from '@element-plus/icons-vue'
import { useTeacherStore } from '@/stores/teacher'
import { useCourseStore } from '@/stores/course'
import { isFeatureAuthorized } from '@/utils/auth'
import { useRouter } from 'vue-router'
import type { Teacher } from '@/types'
import { SUBJECT_COLORS } from '@/types'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'

const teacherStore = useTeacherStore()
const courseStore = useCourseStore()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const currentEditId = ref('')
const searchText = ref('')
const selectedSubject = ref('')
const formRef = ref<FormInstance>()

// 导入功能相关
const importDialogVisible = ref(false)
const importing = ref(false)
const isBatchImportAuthorized = ref(false)
const fileInputRef = ref<HTMLInputElement>()
const importData = ref<Teacher[]>([])
const importPreviewVisible = ref(false)

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
    ['姓名', '学科', '手机号码', '邮箱'],
    ['张三', '数学', '13800138000', 'zhangsan@example.com'],
    ['李四', '语文', '13900139000', 'lisi@example.com'],
  ]
  
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(templateData)
  
  // 设置列宽
  worksheet['!cols'] = [
    { wch: 15 }, // 姓名
    { wch: 15 }, // 学科
    { wch: 20 }, // 手机号码
    { wch: 25 }, // 邮箱
  ]
  
  XLSX.utils.book_append_sheet(workbook, worksheet, '教师信息')
  XLSX.writeFile(workbook, '教师导入模板.xlsx')
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
      const teachers: Teacher[] = []
      const errors: string[] = []
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (!row[0]) continue // 跳过空行
        
        const name = row[0]?.toString().trim()
        const subject = row[1]?.toString().trim()
        const phone = row[2]?.toString().trim()
        const email = row[3]?.toString().trim()
        
        // 验证必填字段
        if (!name) {
          errors.push(`第${i + 1}行：姓名不能为空`)
          continue
        }
        
        if (!subject) {
          errors.push(`第${i + 1}行：学科不能为空`)
          continue
        }
        
        // 验证手机号格式
        if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
          errors.push(`第${i + 1}行：手机号格式不正确`)
          continue
        }
        
        // 验证邮箱格式
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push(`第${i + 1}行：邮箱格式不正确`)
          continue
        }
        
        teachers.push({
          id: `teacher_${Date.now()}_${i}`,
          name,
          subject,
          phone: phone || undefined,
          email: email || undefined,
          createdAt: new Date().toISOString(),
        })
      }
      
      if (errors.length > 0) {
        ElMessage.error(`发现${errors.length}个错误：\n${errors.join('\n')}`)
        return
      }
      
      if (teachers.length === 0) {
        ElMessage.error('没有可导入的数据')
        return
      }
      
      importData.value = teachers
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
    
    // 批量添加教师
    importData.value.forEach(teacher => {
      teacherStore.addTeacher({
        name: teacher.name,
        subject: teacher.subject,
        phone: teacher.phone,
        email: teacher.email,
      })
    })
    
    ElMessage.success(`成功导入${importData.value.length}位教师`)
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

// 初始化
onMounted(async () => {
  teacherStore.loadFromStorage()
  courseStore.loadFromStorage()
  await checkBatchImportAuth()
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
