import request from '@/utils/request'
export default {
  // 获取医院列表
  getList(data) {
    return request({
      url: '/web/hospital/list',
      method: 'get',
      params: data
    })
  },
  // 增加医院列表
  insertList(data) {
    return request({
      url: '/web/hospital/insert',
      method: 'post',
      params: data
    })
  },
  // 省
  getProvince(data) {
    return request({
      url: '/web/province/getAllProvince',
      method: 'get',
      params: data
    })
  },
  getCity(data) {
    return request({
      url: '/web/city/getCity',
      method: 'get',
      params: data
    })
  }
}
