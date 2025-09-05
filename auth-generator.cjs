#!/usr/bin/env node

/**
 * 简单排课系统 - 授权码生成工具
 * 开发者专用工具，用于快速生成当月授权码
 */

const CryptoJS = require('crypto-js')

// 授权配置（与项目中的配置完全一致）
const SECRET_SALT = 'SIMPLE_SCHEDULE_PRO_2024_VccYb_Auth_System'
const PRO_FEATURE_KEY = 'pro_all_features'

/**
 * 生成授权码
 * @param {string} yearMonth - 年月，格式：YYYYMM
 * @param {string} userSeed - 用户标识（可选）
 * @returns {string} 授权码，格式：XXXX-XXXX
 */
function generateAuthCode(yearMonth, userSeed = '') {
  const rawString = `${SECRET_SALT}:${yearMonth}:${PRO_FEATURE_KEY}:${userSeed}`
  const hash = CryptoJS.SHA256(rawString).toString(CryptoJS.enc.Base64)

  // 取前8位并格式化为易读格式 XXXX-XXXX
  const code = hash.substring(0, 8).toUpperCase()
  return `${code.substring(0, 4)}-${code.substring(4, 8)}`
}

/**
 * 验证授权码
 * @param {string} authCode - 授权码
 * @param {string} userSeed - 用户标识（可选）
 * @returns {object} 验证结果
 */
function validateAuthCode(authCode, userSeed = '') {
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

/**
 * 生成当前月份授权码
 * @param {string} userSeed - 用户标识（可选）
 * @returns {object} 授权码信息
 */
function generateCurrentMonthAuth(userSeed = '') {
  const currentDate = new Date()
  const yearMonth = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  const authCode = generateAuthCode(yearMonth, userSeed)

  // 计算有效期信息
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  const remainingDays = Math.ceil(
    (nextMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  return {
    authCode,
    yearMonth: `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`,
    expiryDate: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 2).padStart(2, '0')}-01`,
    remainingDays,
    userSeed: userSeed || '通用授权码',
  }
}

/**
 * 生成指定月份授权码
 * @param {string} targetYearMonth - 目标年月，格式：YYYY-MM
 * @param {string} userSeed - 用户标识（可选）
 * @returns {object} 授权码信息
 */
function generateTargetMonthAuth(targetYearMonth, userSeed = '') {
  const yearMonth = targetYearMonth.replace('-', '')
  const authCode = generateAuthCode(yearMonth, userSeed)

  const [year, month] = targetYearMonth.split('-')
  const targetDate = new Date(parseInt(year), parseInt(month) - 1, 1)
  const nextMonth = new Date(parseInt(year), parseInt(month), 1)

  return {
    authCode,
    yearMonth: `${year}年${month}月`,
    expiryDate: `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`,
    targetDate: targetYearMonth,
    userSeed: userSeed || '通用授权码',
  }
}

// 主程序
function main() {
  const args = process.argv.slice(2)

  console.log('🔐 简单排课系统 - 授权码生成工具')
  console.log('='.repeat(50))
  console.log()

  if (args.length === 0) {
    // 生成当前月份授权码
    const auth = generateCurrentMonthAuth()

    console.log('📅 当前月份专业版授权码')
    console.log(`生成时间: ${new Date().toLocaleString()}`)
    console.log()

    console.log(`🎯 授权码: ${auth.authCode}`)
    console.log(`📆 有效期: ${auth.yearMonth}`)
    console.log(`⏰ 到期时间: ${auth.expiryDate}`)
    console.log(`⏳ 剩余天数: ${auth.remainingDays} 天`)
    console.log(`👤 授权类型: ${auth.userSeed}`)
    console.log()

    console.log('✨ 解锁功能:')
    console.log('  ✓ 智能排课 - 使用AI算法自动安排课程')
    console.log('  ✓ 导出功能 - 支持Excel和PDF格式导出')
    console.log('  ✓ 高级统计 - 详细的课程安排统计分析')
    console.log('  ✓ 批量导入 - 从Excel批量导入数据')
    console.log()

    // 验证生成的授权码
    console.log('🔍 授权码验证测试:')
    const validation = validateAuthCode(auth.authCode)
    console.log(`验证结果: ${validation.isValid ? '✅ 有效' : '❌ 无效'}`)
    if (validation.isValid) {
      console.log(`有效期至: ${validation.expiryDate}`)
      console.log(`剩余天数: ${validation.remainingDays} 天`)
    }
  } else if (args[0] === '--help' || args[0] === '-h') {
    // 显示帮助信息
    console.log('使用方法:')
    console.log('  node auth-generator.js                    # 生成当前月份授权码')
    console.log('  node auth-generator.js --month 2024-12    # 生成指定月份授权码')
    console.log('  node auth-generator.js --user 用户名       # 生成专属用户授权码')
    console.log('  node auth-generator.js --test XXXX-XXXX   # 验证授权码')
    console.log('  node auth-generator.js --help             # 显示帮助信息')
    console.log()
  } else if (args[0] === '--month') {
    // 生成指定月份授权码
    const targetMonth = args[1]
    if (!targetMonth || !targetMonth.match(/^\d{4}-\d{2}$/)) {
      console.error('❌ 错误: 请提供正确的月份格式 (YYYY-MM)')
      console.log('示例: node auth-generator.js --month 2024-12')
      return
    }

    const userSeed = args[2] || ''
    const auth = generateTargetMonthAuth(targetMonth, userSeed)

    console.log(`📅 ${auth.yearMonth} 专业版授权码`)
    console.log()
    console.log(`🎯 授权码: ${auth.authCode}`)
    console.log(`📆 目标月份: ${auth.yearMonth}`)
    console.log(`⏰ 到期时间: ${auth.expiryDate}`)
    console.log(`👤 授权类型: ${auth.userSeed}`)
  } else if (args[0] === '--user') {
    // 生成专属用户授权码
    const userSeed = args[1]
    if (!userSeed) {
      console.error('❌ 错误: 请提供用户标识')
      console.log('示例: node auth-generator.js --user 张三')
      return
    }

    const auth = generateCurrentMonthAuth(userSeed)

    console.log(`👤 专属用户授权码 - ${userSeed}`)
    console.log()
    console.log(`🎯 授权码: ${auth.authCode}`)
    console.log(`📆 有效期: ${auth.yearMonth}`)
    console.log(`⏰ 到期时间: ${auth.expiryDate}`)
    console.log(`⏳ 剩余天数: ${auth.remainingDays} 天`)
    console.log(`👤 专属用户: ${userSeed}`)
  } else if (args[0] === '--test') {
    // 验证授权码
    const testCode = args[1]
    const userSeed = args[2] || ''

    if (!testCode) {
      console.error('❌ 错误: 请提供要验证的授权码')
      console.log('示例: node auth-generator.js --test ABCD-1234')
      return
    }

    console.log(`🔍 验证授权码: ${testCode}`)
    if (userSeed) {
      console.log(`👤 用户标识: ${userSeed}`)
    }
    console.log()

    const validation = validateAuthCode(testCode, userSeed)
    console.log(`验证结果: ${validation.isValid ? '✅ 有效' : '❌ 无效'}`)

    if (validation.isValid) {
      console.log(`✓ 功能: 解锁所有专业版功能`)
      console.log(`✓ 有效期至: ${validation.expiryDate}`)
      console.log(`✓ 剩余天数: ${validation.remainingDays} 天`)
    } else {
      console.log('❌ 授权码无效或已过期')
    }
  } else {
    console.error('❌ 错误: 未知参数')
    console.log('使用 --help 查看帮助信息')
  }

  console.log()
  console.log('💡 使用说明:')
  console.log('1. 在系统"授权管理"页面输入授权码')
  console.log('2. 一个授权码解锁所有专业版功能')
  console.log('3. 授权码只在当月有效，下月需重新生成')
  console.log('4. 联系开发者微信: 13170906656 购买授权码')
}

// 检查是否安装了 crypto-js
try {
  require('crypto-js')
} catch (error) {
  console.error('❌ 错误: 缺少 crypto-js 依赖')
  console.log('请在项目目录中运行: npm install crypto-js')
  process.exit(1)
}

// 运行主程序
if (require.main === module) {
  main()
}

// 导出函数供其他模块使用
module.exports = {
  generateAuthCode,
  validateAuthCode,
  generateCurrentMonthAuth,
  generateTargetMonthAuth,
}
