import Vue from 'vue'
import Router from 'vue-router'

const req = require.context('@/router/modules', false, /\.js$/)
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
var arr = []
requireAll(req).forEach(item => {
  console.log(item)

  arr = [...arr, ...item.default]
})

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
// import hospital from './modules/hospital'

export const constantRoutes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

export const asyncRoutes = [
  ...arr
]
console.log(arr)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(params) {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  router.addRoutes(params)
}

export default router
