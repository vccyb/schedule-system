// 使用浏览器原生的 Web Crypto API 替代 crypto-js

// 授权配置（只有开发者知道的密钥）
const SECRET_SALT = 'SIMPLE_SCHEDULE_PRO_2024_VccYb_Auth_System'
const PRO_FEATURE_KEY = 'pro_all_features'

// 付费功能类型
export type ProFeature = 'SMART_SCHEDULE' | 'EXPORT_FUNCTIONS' | 'ADVANCED_STATS' | 'BATCH_IMPORT'

// 授权状态
export interface AuthStatus {
  isValid: boolean
  expiryDate: string
  remainingDays: number
}

// 使用浏览器原生 crypto API 生成 SHA-256 哈希
async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  // 转换为 Base64 格式
  const bytes = new Uint8Array(hashBuffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// 生成授权码（开发者用）
export async function generateAuthCode(yearMonth: string, userSeed: string = ''): Promise<string> {
  const rawString = `${SECRET_SALT}:${yearMonth}:${PRO_FEATURE_KEY}:${userSeed}`
  const hash = await generateHash(rawString)

  // 取前8位并格式化为易读格式 XXXX-XXXX
  const code = hash.substring(0, 8).toUpperCase()
  return `${code.substring(0, 4)}-${code.substring(4, 8)}`
}

// 验证授权码
export async function validateAuthCode(
  authCode: string,
  userSeed: string = '',
): Promise<AuthStatus> {
  const currentDate = new Date()
  const currentYearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}`

  // 清理授权码格式
  const cleanCode = authCode.replace(/[-\s]/g, '').toUpperCase()

  // 验证当前月份的授权码
  const expectedCode = (await generateAuthCode(currentYearMonth, userSeed)).replace(/[-\s]/g, '')

  if (cleanCode === expectedCode) {
    // 计算本月剩余天数
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const remainingDays = Math.ceil(
      (nextMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    )

    return {
      isValid: true,
      expiryDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 2).padStart(2, '0')}-01`,
      remainingDays,
    }
  }

  return {
    isValid: false,
    expiryDate: '',
    remainingDays: 0,
  }
}

// 获取当前月份授权码（开发者用）
export async function generateCurrentMonthAuthCode(userSeed: string = ''): Promise<string> {
  const currentDate = new Date()
  const yearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  return await generateAuthCode(yearMonth, userSeed)
}

// 功能名称映射
export const FEATURE_NAMES: Record<ProFeature, string> = {
  SMART_SCHEDULE: '智能排课',
  EXPORT_FUNCTIONS: '导出功能',
  ADVANCED_STATS: '高级统计',
  BATCH_IMPORT: '批量导入',
}

// 检查是否已授权（所有付费功能）
export async function isProAuthorized(): Promise<boolean> {
  const authData = localStorage.getItem('pro_auth')
  if (!authData) return false

  try {
    const { code, userSeed } = JSON.parse(authData)
    const validation = await validateAuthCode(code, userSeed)
    return validation.isValid
  } catch {
    return false
  }
}

// 检查特定功能是否已授权（兼容旧接口）
export async function isFeatureAuthorized(feature: ProFeature): Promise<boolean> {
  return await isProAuthorized()
}

// 保存授权码
export async function saveAuthCode(authCode: string, userSeed: string = ''): Promise<boolean> {
  const validation = await validateAuthCode(authCode, userSeed)
  if (validation.isValid) {
    localStorage.setItem('pro_auth', JSON.stringify({ code: authCode, userSeed }))
    return true
  }
  return false
}

// 清除授权
export function clearAuth(): void {
  localStorage.removeItem('pro_auth')
}

// 获取授权状态
export async function getAuthStatus(): Promise<AuthStatus> {
  const authData = localStorage.getItem('pro_auth')

  if (authData) {
    try {
      const { code, userSeed } = JSON.parse(authData)
      return await validateAuthCode(code, userSeed)
    } catch {
      return {
        isValid: false,
        expiryDate: '',
        remainingDays: 0,
      }
    }
  } else {
    return {
      isValid: false,
      expiryDate: '',
      remainingDays: 0,
    }
  }
}
