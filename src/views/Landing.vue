<template>
  <div class="landing-page min-h-screen">
    <!-- 导航栏 -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <el-icon class="text-2xl text-blue-600 mr-2"><Calendar /></el-icon>
            <span class="text-xl font-bold text-gray-900">简单排课</span>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <a
              @click.prevent="scrollToSection('features')"
              class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >功能特色</a
            >
            <a
              @click.prevent="scrollToSection('testimonials')"
              class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >用户评价</a
            >
            <a
              @click.prevent="scrollToSection('pricing')"
              class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >价格方案</a
            >
            <el-button type="primary" @click="enterApp">立即体验</el-button>
          </div>

          <!-- 移动端菜单按钮 -->
          <el-button
            type="text"
            class="md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
            :icon="Menu"
          />
        </div>

        <!-- 移动端菜单 -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
          <div class="flex flex-col space-y-4">
            <a
              @click.prevent="handleMobileMenuClick('features')"
              class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >功能特色</a
            >
            <a
              @click.prevent="handleMobileMenuClick('testimonials')"
              class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >用户评价</a
            >
            <a
              @click.prevent="handleMobileMenuClick('pricing')"
              class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >价格方案</a
            >
            <el-button type="primary" @click="enterApp" class="w-full">立即体验</el-button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section
      class="hero-section bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-16"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- 左侧内容 -->
          <div class="text-center lg:text-left">
            <div class="animate-fade-in-up">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                让排课变得
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  简单高效
                </span>
              </h1>

              <p class="mt-6 text-xl text-gray-600 leading-relaxed">
                专为中小学设计的智能排课系统，一键生成课程表，节省90%的排课时间，
                让教务管理更轻松，让教学更专注。
              </p>

              <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <el-button
                  type="primary"
                  size="large"
                  @click="enterApp"
                  class="px-8 py-3 text-lg font-semibold animate-pulse-button"
                >
                  <el-icon class="mr-2"><ArrowRight /></el-icon>
                  立即免费体验
                </el-button>

                <el-button size="large" @click="scrollToDemo" class="px-8 py-3 text-lg">
                  <el-icon class="mr-2"><VideoPlay /></el-icon>
                  观看演示
                </el-button>
              </div>

              <!-- 特性标签 -->
              <div class="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  <el-icon class="mr-1 text-xs"><Check /></el-icon>
                  免费试用
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <el-icon class="mr-1 text-xs"><Check /></el-icon>
                  智能排课
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  <el-icon class="mr-1 text-xs"><Check /></el-icon>
                  一键导出
                </span>
              </div>
            </div>
          </div>

          <!-- 右侧动画展示 -->
          <div class="relative">
            <div class="animate-float">
              <!-- 主屏幕 -->
              <div
                class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform rotate-3"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span class="text-sm text-gray-500">简单排课系统</span>
                </div>

                <!-- 模拟课程表 -->
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <div class="w-12 h-8 bg-gray-100 rounded"></div>
                    <div class="flex-1 grid grid-cols-5 gap-1">
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="h-8 bg-blue-100 rounded animate-pulse-slow"
                        :style="{ animationDelay: `${i * 0.2}s` }"
                      ></div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <div class="w-12 h-8 bg-gray-100 rounded"></div>
                    <div class="flex-1 grid grid-cols-5 gap-1">
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="h-8 bg-green-100 rounded animate-pulse-slow"
                        :style="{ animationDelay: `${(i + 5) * 0.2}s` }"
                      ></div>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <div class="w-12 h-8 bg-gray-100 rounded"></div>
                    <div class="flex-1 grid grid-cols-5 gap-1">
                      <div
                        v-for="i in 5"
                        :key="i"
                        class="h-8 bg-purple-100 rounded animate-pulse-slow"
                        :style="{ animationDelay: `${(i + 10) * 0.2}s` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 悬浮卡片 -->
              <div
                class="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-bounce-light"
              >
                <div class="flex items-center space-x-2">
                  <el-icon class="text-green-500"><SuccessFilled /></el-icon>
                  <span class="text-sm font-medium">智能排课完成！</span>
                </div>
              </div>

              <div
                class="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-slide-up"
              >
                <div class="flex items-center space-x-2">
                  <el-icon class="text-blue-500"><Clock /></el-icon>
                  <span class="text-sm font-medium">节省时间: 3小时</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div class="animate-count-up">
            <div class="text-4xl font-bold text-blue-600" ref="schoolCount">
              {{ animatedSchoolCount }}
            </div>
            <div class="text-gray-600 mt-2">所学校正在使用</div>
          </div>
          <div class="animate-count-up">
            <div class="text-4xl font-bold text-green-600" ref="teacherCount">
              {{ animatedTeacherCount }}
            </div>
            <div class="text-gray-600 mt-2">位教师受益</div>
          </div>
          <div class="animate-count-up">
            <div class="text-4xl font-bold text-purple-600" ref="timeCount">
              {{ animatedTimeCount }}
            </div>
            <div class="text-gray-600 mt-2">小时节省时间</div>
          </div>
          <div class="animate-count-up">
            <div class="text-4xl font-bold text-orange-600" ref="satisfactionCount">
              {{ animatedSatisfactionCount }}%
            </div>
            <div class="text-gray-600 mt-2">用户满意度</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特色 -->
    <section id="features" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">为什么选择简单排课？</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            专业的排课系统，解决教务管理的所有难题，让您专注于教学本身
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 智能排课 -->
          <div
            class="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors"
            >
              <el-icon class="text-3xl text-blue-600"><Lightning /></el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">智能排课</h3>
            <p class="text-gray-600 mb-6">
              AI算法智能分析教师时间、班级需求，一键生成最优课程表， 节省传统手动排课90%的时间。
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                考虑教师不可用时间
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                避免课程冲突
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                均衡工作负荷
              </li>
            </ul>
          </div>

          <!-- 简单易用 -->
          <div
            class="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors"
            >
              <el-icon class="text-3xl text-green-600"><Star /></el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">简单易用</h3>
            <p class="text-gray-600 mb-6">
              直观的界面设计，无需专业培训，教务老师也能轻松上手， 5分钟完成整学期排课。
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                可视化拖拽操作
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                一键导入数据
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                实时预览效果
              </li>
            </ul>
          </div>

          <!-- 多格式导出 -->
          <div
            class="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors"
            >
              <el-icon class="text-3xl text-purple-600"><Download /></el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">多格式导出</h3>
            <p class="text-gray-600 mb-6">
              支持多种格式导出，包括 Excel、PDF、图片等，满足不同场景需求，
              轻松分享给各个班级和教师。
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                Excel 表格导出
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                高清 PDF 打印
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                美化图片分享
              </li>
            </ul>
          </div>

          <!-- 数据安全 -->
          <div
            class="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors"
            >
              <el-icon class="text-3xl text-orange-600"><Lock /></el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">数据安全</h3>
            <p class="text-gray-600 mb-6">
              本地存储，数据不上传云端，保障学校数据安全和隐私， 支持数据备份和恢复功能。
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                本地数据存储
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                一键备份恢复
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                数据隐私保护
              </li>
            </ul>
          </div>

          <!-- 精美打印 -->
          <div
            class="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors"
            >
              <el-icon class="text-3xl text-indigo-600"><TrendCharts /></el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">精美打印</h3>
            <p class="text-gray-600 mb-6">
              专业设计的课程表模板，美观大方，信息清晰， 支持自定义样式和学校标识。
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                多种模板选择
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                自定义样式
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                学校标识支持
              </li>
            </ul>
          </div>

          <!-- 专业支持 -->
          <div
            class="feature-card bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-200 transition-colors"
            >
              <el-icon class="text-3xl text-pink-600"><Service /></el-icon>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">专业支持</h3>
            <p class="text-gray-600 mb-6">
              提供专业的技术支持和使用指导，答疑解惑， 确保您能够充分发挥系统的优势。
            </p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                在线客服支持
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                操作指导文档
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-2"><Check /></el-icon>
                定期功能更新
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 用户评价 -->
    <section id="testimonials" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">用户的声音</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            来自全国各地学校的真实用户反馈，见证简单排课的专业与高效
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 用户评价1 -->
          <div
            class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium"
              >
                李
              </div>
              <div class="ml-3">
                <h4 class="font-medium text-gray-900">李主任</h4>
                <p class="text-gray-500 text-sm">北京市第三中学</p>
              </div>
            </div>

            <div class="flex text-yellow-400 mb-3">
              <el-icon v-for="i in 5" :key="i" class="text-sm"><Star /></el-icon>
            </div>

            <p class="text-gray-600 leading-relaxed">
              使用简单排课系统后，我们的排课效率提升了90%以上。以前需要2-3天才能完成的排课工作，现在半小时就搞定了。
            </p>
          </div>

          <!-- 用户评价2 -->
          <div
            class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-medium"
              >
                张
              </div>
              <div class="ml-3">
                <h4 class="font-medium text-gray-900">张老师</h4>
                <p class="text-gray-500 text-sm">上海实验小学</p>
              </div>
            </div>

            <div class="flex text-yellow-400 mb-3">
              <el-icon v-for="i in 5" :key="i" class="text-sm"><Star /></el-icon>
            </div>

            <p class="text-gray-600 leading-relaxed">
              界面设计非常人性化，就算是对电脑不太熟悉的老师也能快速上手。导出的课程表格式美观，学生和家长都很满意。
            </p>
          </div>

          <!-- 用户评价3 -->
          <div
            class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium"
              >
                王
              </div>
              <div class="ml-3">
                <h4 class="font-medium text-gray-900">王校长</h4>
                <p class="text-gray-500 text-sm">广州市育才中学</p>
              </div>
            </div>

            <div class="flex text-yellow-400 mb-3">
              <el-icon v-for="i in 5" :key="i" class="text-sm"><Star /></el-icon>
            </div>

            <p class="text-gray-600 leading-relaxed">
              数据安全是我们最关心的问题，简单排课采用本地存储，保护了我们的隐私。而且客服响应很及时，遇到问题都能快速解决。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 价格方案 -->
    <section id="pricing" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">简单透明的价格</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            无隐藏费用，无复杂套餐，按月付费，随时可以取消
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- 免费版 -->
          <div
            class="pricing-card bg-white rounded-xl p-8 shadow-lg border border-gray-200 relative"
          >
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">免费版</h3>
              <p class="text-gray-600 mb-6">适合小规模学校试用</p>
              <div class="mb-6">
                <span class="text-4xl font-bold text-gray-900">¥0</span>
                <span class="text-gray-600">/月</span>
              </div>
              <el-button size="large" class="w-full" @click="enterApp"> 立即免费使用 </el-button>
            </div>

            <ul class="space-y-4">
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-3"><Check /></el-icon>
                <span>手动录入班级</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-3"><Check /></el-icon>
                <span>手动录入教师</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-3"><Check /></el-icon>
                <span>手动排课功能</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-3"><Check /></el-icon>
                <span>基础课程表导出</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-500 mr-3"><Check /></el-icon>
                <span>数据本地存储</span>
              </li>
              <li class="flex items-center text-gray-400">
                <el-icon class="text-gray-300 mr-3"><Close /></el-icon>
                <span>智能排课算法</span>
              </li>
              <li class="flex items-center text-gray-400">
                <el-icon class="text-gray-300 mr-3"><Close /></el-icon>
                <span>批量导出功能</span>
              </li>
              <li class="flex items-center text-gray-400">
                <el-icon class="text-gray-300 mr-3"><Close /></el-icon>
                <span>优先技术支持</span>
              </li>
            </ul>
          </div>

          <!-- 专业版 -->
          <div
            class="pricing-card bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 shadow-xl text-white relative"
          >
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold"
              >
                推荐选择
              </span>
            </div>

            <!-- 限时优惠标签 -->
            <div
              class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md promotion-tag"
            >
              限时优惠
            </div>

            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold mb-2">专业版</h3>
              <p class="text-blue-100 mb-6">一次购买，永久解锁所有功能</p>

              <!-- 价格展示优化 -->
              <div class="mb-6">
                <div class="flex items-center justify-center mb-2">
                  <span class="text-blue-200 line-through text-lg mr-3">¥99</span>
                  <span class="text-4xl font-bold text-yellow-300 price-glow">¥69</span>
                  <span class="text-blue-100 ml-1">/月</span>
                </div>
                <div
                  class="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  💰 立省30元
                </div>
              </div>

              <el-button size="large" type="warning" class="w-full font-semibold">
                立即购买 ¥69
              </el-button>
              <p class="text-xs text-center text-blue-100 mt-2">
                📱 微信联系：13170906656 获取授权码
              </p>
            </div>

            <ul class="space-y-4">
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>Excel快捷导入班级</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>Excel快捷导入教师</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>智能排课算法</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>多格式导出(Excel/PDF)</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>批量导出功能</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>课程需求设置</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>数据备份恢复</span>
              </li>
              <li class="flex items-center">
                <el-icon class="text-green-400 mr-3"><Check /></el-icon>
                <span>优先技术支持</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 特别说明 -->
        <div class="mt-12 text-center">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 class="font-semibold text-blue-900 mb-2">购买说明</h4>
            <p class="text-blue-800 text-sm">
              专业版按月付费，无需年费，随时可以取消。购买后即可获得授权码解锁所有专业功能。
              <br />
              联系微信：<strong>13170906656</strong> 获取专业版授权码
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA行动召唤 -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">准备好让排课变得更简单了吗？</h2>
        <p class="text-xl text-blue-100 mb-8 leading-relaxed">
          加入全国1200+所学校的选择，让8500+位教师受益的智能排课系统，
          <br />
          现在就开始您的免费体验之旅！
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <el-button
            type="warning"
            size="large"
            @click="enterApp"
            class="px-8 py-3 text-lg font-semibold"
          >
            <el-icon class="mr-2"><ArrowRight /></el-icon>
            立即免费体验
          </el-button>

          <el-button
            size="large"
            class="px-8 py-3 text-lg text-white border-2 border-white/70 bg-transparent hover:bg-white/10"
            @click="scrollToDemo"
          >
            <el-icon class="mr-2"><VideoPlay /></el-icon>
            了解更多功能
          </el-button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- 品牌信息 -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center mb-4">
              <el-icon class="text-2xl text-blue-400 mr-2"><Calendar /></el-icon>
              <span class="text-xl font-bold">简单排课</span>
            </div>
            <p class="text-gray-400 mb-6 leading-relaxed">
              专为中小学设计的智能排课系统，让教务管理更轻松，让教学更专注。
              我们致力于用技术简化教育管理，提升教学效率。
            </p>
            <div class="flex space-x-4">
              <span class="text-gray-400">联系微信：13170906656</span>
            </div>
          </div>

          <!-- 产品功能 -->
          <div>
            <h3 class="font-semibold mb-4">产品功能</h3>
            <ul class="space-y-2 text-gray-400">
              <li><span class="cursor-not-allowed opacity-60">智能排课</span></li>
              <li><span class="cursor-not-allowed opacity-60">手动调整</span></li>
              <li><span class="cursor-not-allowed opacity-60">多格式导出</span></li>
              <li><span class="cursor-not-allowed opacity-60">数据管理</span></li>
            </ul>
          </div>

          <!-- 支持与帮助 -->
          <div>
            <h3 class="font-semibold mb-4">支持与帮助</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">使用教程</a></li>
              <li><a href="#" class="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" class="hover:text-white transition-colors">联系客服</a></li>
              <li><a href="#" class="hover:text-white transition-colors">意见反馈</a></li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p class="text-gray-400 text-sm">© 2025 简单排课系统. 保留所有权利.</p>
          <div class="mt-4 md:mt-0 flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors"
              >隐私政策</a
            >
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors"
              >服务条款</a
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  Menu,
  ArrowRight,
  VideoPlay,
  Check,
  SuccessFilled,
  Clock,
  Star,
  TrendCharts,
  Lock,
  Lightning,
  Service,
  Download,
  Close,
} from '@element-plus/icons-vue'

const router = useRouter()
const mobileMenuOpen = ref(false)

// 动画计数器
const animatedSchoolCount = ref(0)
const animatedTeacherCount = ref(0)
const animatedTimeCount = ref(0)
const animatedSatisfactionCount = ref(0)

// 进入应用
const enterApp = () => {
  router.push('/app')
}

// 平滑滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const offsetTop = element.offsetTop - 80 // 减去导航栏高度
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
  }
}

// 移动端菜单点击处理
const handleMobileMenuClick = (sectionId: string) => {
  scrollToSection(sectionId)
  mobileMenuOpen.value = false
}

// 滚动到演示区域
const scrollToDemo = () => {
  scrollToSection('features')
}

// 数字动画
const animateNumber = (target: { value: number }, finalValue: number, duration: number = 2000) => {
  const startValue = 0
  const startTime = Date.now()

  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.floor(startValue + (finalValue - startValue) * easeOutQuart)

    target.value = currentValue

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      target.value = finalValue
    }
  }

  animate()
}

// 初始化动画
onMounted(() => {
  // 延迟启动数字动画
  setTimeout(() => {
    animateNumber(animatedSchoolCount, 1200)
    animateNumber(animatedTeacherCount, 8500)
    animateNumber(animatedTimeCount, 15000)
    animateNumber(animatedSatisfactionCount, 98)
  }, 1000)
})
</script>

<style scoped>
/* 确保页面可以正常滚动 */
.landing-page {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 基础动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(3deg);
  }
  50% {
    transform: translateY(-20px) rotate(3deg);
  }
}

@keyframes bounceLight {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseButton {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes pulseSlow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 应用动画类 */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-light {
  animation: bounceLight 3s ease-in-out infinite;
}

.animate-slide-up {
  animation: slideUp 1s ease-out;
}

.animate-pulse-button {
  animation: pulseButton 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

.animate-count-up {
  animation: fadeInUp 0.8s ease-out;
}

/* 渐变文字 */
.text-transparent {
  color: transparent;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 自定义背景渐变 */
.hero-section {
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e5e7eb" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-section {
    padding-top: 5rem;
    padding-bottom: 3rem;
  }

  .animate-float {
    animation: none; /* 移动端禁用复杂动画 */
  }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 功能卡片特效 */
.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* 价格卡片特效 */
.pricing-card {
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 导航栏背景模糊效果 */
nav {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 按钮悬停效果增强 */
.el-button {
  transition: all 0.3s ease !important;
}

.el-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

/* 价格标签样式 */
.price-glow {
  text-shadow: 0 0 5px rgba(255, 140, 0, 0.8);
}

/* 限时优惠标签样式 */
.promotion-tag {
  transform: rotate(-10deg);
}
</style>
