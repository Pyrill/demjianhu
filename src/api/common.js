
// import login from './modules/login'

const req = require.context('@/api/modules', false, /\.js$/)
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
var arr = {}
requireAll(req).forEach(item => {
  arr = Object.assign(arr, item.default)
})

export default {
  ...arr
  // ...login,
}

