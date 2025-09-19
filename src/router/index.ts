import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/Landing.vue'),
      meta: { title: '简单排课系统' },
    },
    {
      path: '/app',
      name: 'layout',
      component: () => import('@/views/Layout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: '仪表板' },
        },
        {
          path: '/teachers',
          name: 'teachers',
          component: () => import('@/views/Teachers.vue'),
          meta: { title: '教师管理' },
        },
        {
          path: '/classes',
          name: 'classes',
          component: () => import('@/views/ClassManagement.vue'),
          meta: { title: '班级管理' },
        },
        {
          path: '/courses',
          name: 'courses',
          component: () => import('@/views/Courses.vue'),
          meta: { title: '课程管理' },
        },
        {
          path: '/schedule',
          name: 'schedule',
          component: () => import('@/views/Schedule.vue'),
          meta: { title: '排课管理' },
        },
        {
          path: '/timetable',
          name: 'timetable',
          component: () => import('@/views/Timetable.vue'),
          meta: { title: '课程表' },
        },
        {
          path: '/school-settings',
          name: 'school-settings',
          component: () => import('@/views/SchoolSettings.vue'),
          meta: { title: '学校配置' },
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/About.vue'),
          meta: { title: '关于系统' },
        },
        {
          path: '/auth',
          name: 'auth',
          component: () => import('@/views/AuthManager.vue'),
          meta: { title: '授权管理' },
        },
      ],
    },
    // 开发者工具页面（仅在开发环境下可用）
    ...(import.meta.env.DEV
      ? [
          {
            path: '/dev-tools',
            name: 'dev-tools',
            component: () => import('@/views/DevTools.vue'),
            meta: { title: '开发者工具' },
          },
        ]
      : []),
    // 404 页面 - 必须放在最后
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '页面未找到' },
    },
  ],
})

export default router
