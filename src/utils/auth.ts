import CryptoJS from 'crypto-js'

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

// 生成授权码（开发者用）
export function generateAuthCode(yearMonth: string, userSeed: string = ''): string {
  const rawString = `${SECRET_SALT}:${yearMonth}:${PRO_FEATURE_KEY}:${userSeed}`
  const hash = CryptoJS.SHA256(rawString).toString(CryptoJS.enc.Base64)

  // 取前8位并格式化为易读格式 XXXX-XXXX
  const code = hash.substring(0, 8).toUpperCase()
  return `${code.substring(0, 4)}-${code.substring(4, 8)}`
}

// 验证授权码
export function validateAuthCode(authCode: string, userSeed: string = ''): AuthStatus {
  const currentDate = new Date()
  const currentYearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}`

  // 清理授权码格式
  const cleanCode = authCode.replace(/[-\s]/g, '').toUpperCase()

  // 验证当前月份的授权码
  const expectedCode = generateAuthCode(currentYearMonth, userSeed).replace(/[-\s]/g, '')

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
export function generateCurrentMonthAuthCode(userSeed: string = ''): string {
  const currentDate = new Date()
  const yearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  return generateAuthCode(yearMonth, userSeed)
}

// 功能名称映射
export const FEATURE_NAMES: Record<ProFeature, string> = {
  SMART_SCHEDULE: '智能排课',
  EXPORT_FUNCTIONS: '导出功能',
  ADVANCED_STATS: '高级统计',
  BATCH_IMPORT: '批量导入',
}

// 检查是否已授权（所有付费功能）
export function isProAuthorized(): boolean {
  const authData = localStorage.getItem('pro_auth')
  if (!authData) return false

  try {
    const { code, userSeed } = JSON.parse(authData)
    const validation = validateAuthCode(code, userSeed)
    return validation.isValid
  } catch {
    return false
  }
}

// 检查特定功能是否已授权（兼容旧接口）
export function isFeatureAuthorized(feature: ProFeature): boolean {
  return isProAuthorized()
}

// 保存授权码
export function saveAuthCode(authCode: string, userSeed: string = ''): boolean {
  const validation = validateAuthCode(authCode, userSeed)
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
export function getAuthStatus(): AuthStatus {
  const authData = localStorage.getItem('pro_auth')

  if (authData) {
    try {
      const { code, userSeed } = JSON.parse(authData)
      return validateAuthCode(code, userSeed)
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
