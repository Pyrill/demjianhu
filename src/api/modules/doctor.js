import request from '@/utils/request'
export default {
  // 获取医生列表
  getDoctor(data) {
    return request({
      url: '/web/doctor/list',
      method: 'get',
      params: data
    })
  },
  // 获取医生详情
  detailDoctor(data) {
    return request({
      url: '/web/doctor/detail',
      method: 'get',
      params: data
    })
  },
  // 保存医生
  saveDoctor(data) {
    return request({
      url: '/web/doctor/save',
      method: 'post',
      data: data
    })
  },
  // 改变状态
  updateStatus(data) {
    return request({
      url: '/web/doctor/update/status',
      method: 'get',
      params: data
    })
  },
  // 医生直属关系
  relationList(data) {
    return request({
      url: '/web/doctor/relation/list',
      method: 'get',
      params: data
    })
  },
  // 医院病区列表
  getHospitalm(data) {
    return request({
      url: '/web/hospital/' + data.hospitalId + '/medicalarea',
      method: 'get',
      params: data
    })
  },
  // 获取医院列表
  getLists(data) {
    return request({
      url: '/web/hospital/list/all',
      method: 'get',
      params: data
    })
  },
  // 根据级别加载下级医生列表
  levelSublist(data) {
    return request({
      url: '/web/doctor/level/sublist',
      method: 'get',
      params: data
    })
  },
  // 保存上下级
  ensureSublist(data) {
    return request({
      url: '/web/doctor/save/binding',
      method: 'post',
      data: data
    })
  },
  // 显示医生等级选择状态
  selectstatus(data) {
    return request({
      url: '/web/doctor/level/selectstatus',
      method: 'get',
      params: data
    })
  }
}
