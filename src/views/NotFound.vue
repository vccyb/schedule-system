<template>
  <div class="not-found-page">
    <div class="container">
      <!-- 可爱的404动画区域 -->
      <div class="error-content">
        <!-- 数字404 -->
        <div class="error-number">
          <span class="digit bounce-1">4</span>
          <span class="digit bounce-2">0</span>
          <span class="digit bounce-3">4</span>
        </div>

        <!-- 可爱的表情 -->
        <div class="cute-face">
          <div class="eyes">
            <div class="eye left-eye">
              <div class="pupil"></div>
            </div>
            <div class="eye right-eye">
              <div class="pupil"></div>
            </div>
          </div>
          <div class="mouth"></div>
        </div>

        <!-- 错误信息 -->
        <div class="error-message">
          <h2 class="title">哎呀！页面走丢了 (｡•́︿•̀｡)</h2>
          <p class="subtitle">看起来你要找的页面去了一个神秘的地方...</p>
          <p class="description">
            别担心，我们的小精灵正在努力寻找它！
            <br />
            或者你可以先回到首页看看其他有趣的内容
          </p>
        </div>

        <!-- 漂浮的装饰元素 -->
        <div class="floating-elements">
          <div class="star star-1">⭐</div>
          <div class="star star-2">✨</div>
          <div class="star star-3">🌟</div>
          <div class="cloud cloud-1">☁️</div>
          <div class="cloud cloud-2">☁️</div>
        </div>

        <!-- 按钮区域 -->
        <div class="action-buttons">
          <el-button type="primary" size="large" @click="goHome" class="home-button" :icon="House">
            <span class="button-text">回到首页</span>
          </el-button>

          <el-button size="large" @click="goBack" class="back-button" :icon="ArrowLeft">
            <span class="button-text">返回上页</span>
          </el-button>
        </div>

        <!-- 建议链接 -->
        <div class="helpful-links">
          <h3>你可能想要：</h3>
          <div class="links-grid">
            <router-link to="/app" class="help-link">
              <el-icon><Calendar /></el-icon>
              <span>开始排课</span>
            </router-link>
            <router-link to="/teachers" class="help-link">
              <el-icon><User /></el-icon>
              <span>教师管理</span>
            </router-link>
            <router-link to="/classes" class="help-link">
              <el-icon><School /></el-icon>
              <span>班级管理</span>
            </router-link>
            <router-link to="/about" class="help-link">
              <el-icon><InfoFilled /></el-icon>
              <span>关于系统</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { House, ArrowLeft, Calendar, User, School, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()

// 管理页面滚动状态
onMounted(() => {
  document.documentElement.classList.add('landing-page')
  document.body.classList.add('landing-page')
})

onUnmounted(() => {
  document.documentElement.classList.remove('landing-page')
  document.body.classList.remove('landing-page')
})

// 回到首页
const goHome = () => {
  router.push('/')
  ElMessage.success('欢迎回来！ヾ(◍°∇°◍)ﾉﾞ')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
    ElMessage.info('这是你访问的第一个页面，为你跳转到首页啦~')
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.not-found-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.container {
  max-width: 800px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
}

.error-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.error-content::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(103, 194, 58, 0.1), transparent);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

/* 404数字动画 */
.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  gap: 10px;
}

.digit {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.bounce-1 {
  animation:
    bounce 2s ease-in-out infinite,
    gradientShift 3s ease-in-out infinite;
}

.bounce-2 {
  animation:
    bounce 2s ease-in-out infinite 0.2s,
    gradientShift 3s ease-in-out infinite 0.5s;
}

.bounce-3 {
  animation:
    bounce 2s ease-in-out infinite 0.4s,
    gradientShift 3s ease-in-out infinite 1s;
}

/* 可爱表情 */
.cute-face {
  margin: 40px 0;
  position: relative;
}

.eyes {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
}

.eye {
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 50%;
  position: relative;
  animation: blink 4s ease-in-out infinite;
}

.pupil {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 6px;
  left: 9px;
  animation: eyeMove 3s ease-in-out infinite;
}

.mouth {
  width: 60px;
  height: 30px;
  border: 4px solid #ff6b6b;
  border-top: none;
  border-radius: 0 0 60px 60px;
  margin: 0 auto;
  animation: mouthMove 2s ease-in-out infinite;
}

/* 漂浮装饰 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.star,
.cloud {
  position: absolute;
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.star-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.star-2 {
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.star-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 2s;
}

.cloud-1 {
  top: 30%;
  right: 10%;
  animation-delay: 0.5s;
  animation-duration: 4s;
}

.cloud-2 {
  bottom: 30%;
  right: 25%;
  animation-delay: 1.5s;
  animation-duration: 3.5s;
}

/* 错误信息 */
.error-message {
  margin: 40px 0;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 12px;
}

.description {
  color: #888;
  line-height: 1.6;
}

/* 按钮区域 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px 0;
}

.home-button,
.back-button {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.home-button:hover,
.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.button-text {
  margin-left: 8px;
}

/* 帮助链接 */
.helpful-links {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.helpful-links h3 {
  color: #666;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.help-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.help-link:hover {
  background: #e3f2fd;
  color: #1976d2;
  border-color: #bbdefb;
  transform: translateY(-2px);
  text-decoration: none;
}

.help-link .el-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

/* 动画效果 */
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateY(-5px) rotate(-5deg);
  }
}

@keyframes blink {
  0%,
  90%,
  100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}

@keyframes eyeMove {
  0%,
  100% {
    left: 9px;
  }
  25% {
    left: 15px;
  }
  50% {
    left: 9px;
  }
  75% {
    left: 3px;
  }
}

@keyframes mouthMove {
  0%,
  100% {
    border-radius: 0 0 60px 60px;
  }
  50% {
    border-radius: 0 0 40px 40px;
    transform: scale(1.1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    padding: 40px 20px;
    margin: 10px;
  }

  .digit {
    font-size: 5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .home-button,
  .back-button {
    width: 100%;
    max-width: 280px;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .help-link {
    padding: 16px 12px;
  }
}

@media (max-width: 480px) {
  .digit {
    font-size: 4rem;
  }

  .eyes {
    gap: 30px;
  }

  .eye {
    width: 25px;
    height: 25px;
  }

  .pupil {
    width: 10px;
    height: 10px;
    top: 5px;
    left: 7px;
  }

  .mouth {
    width: 50px;
    height: 25px;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .error-content {
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
  }

  .title {
    color: #fff;
  }

  .subtitle {
    color: #ccc;
  }

  .description {
    color: #aaa;
  }

  .help-link {
    background: #404040;
    color: #ccc;
  }

  .help-link:hover {
    background: #505050;
    color: #64b5f6;
  }

  .helpful-links h3 {
    color: #ccc;
  }
}
</style>
