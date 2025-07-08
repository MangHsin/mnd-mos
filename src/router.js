import { createRouter, createWebHashHistory } from 'vue-router'
import TestView from './view/Test.vue'

const routes = [
  {
    path: '/',
    redirect: '/test'
  },
  {
    path: '/test',
    name: 'Test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router