import Layout from '@/layout'

export default [{
  path: '/hospital',
  component: Layout,
  name: 'hospital',
  redirect: '/hospital',
  hidden: false,
  meta: {
    title: '医院管理',
    icon: 'article'
  },
  children: [
    {
      path: 'hospital',
      name: 'hospital',
      component: () => import('@/views/pages/hospital/hospital'),
      meta: {
        title: '医院列表'

      }
    },
    {
      path: 'addHospital',
      name: 'addHospital',
      component: () => import('@/views/pages/hospital/addHospital'),
      meta: {
        title: '操作医院'
      },
      hidden: true
    },
    {
      path: 'doctor',
      name: 'doctor',
      component: () => import('@/views/pages/hospital/doctor'),
      meta: {
        title: '医生列表'
      }
    },
    {
      path: 'addDoctor',
      name: 'addDoctor',
      component: () => import('@/views/pages/hospital/addDoctor'),
      meta: {
        title: '新增医生'
      },
      hidden: true
    },
    {
      path: 'doctorDetail',
      name: 'doctorDetail',
      component: () => import('@/views/pages/hospital/doctorDetail'),
      meta: {
        title: '医生详情'
      },
      hidden: true
    },
    {
      path: 'amendDoctor',
      name: 'amendDoctor',
      component: () => import('@/views/pages/hospital/amendDoctor'),
      meta: {
        title: '修改医生'
      },
      hidden: true
    }

  ]
}

]
