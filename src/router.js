import { createRouter, createWebHistory } from 'vue-router'
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
  history: createWebHistory(),
  routes
})

export default router