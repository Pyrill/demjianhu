import router from './router'
import store from './store'

// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// 设置title
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
// var flag = true
router.beforeEach(async(to, from, next) => {
  // 进度条开始
  // NProgress.start()
  // 设置title
  document.title = getPageTitle(to.meta.title)
  if (to.path === '/login') {
    next()
    // NProgress.done()
  } else {
    next()
    if (store.state.user.flag) {
      store.state.user.flag = false
      const accessRoutes = await store.dispatch('permission/generateRoutes', 'admin')
      router.addRoutes(accessRoutes)
    }

    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
