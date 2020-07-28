<template>
  <div class="carousel">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template slot="title">
          <span class="title">浙江大学医学院附属医学妇产科医院</span>
        </template>
        <el-form :inline="true" :model="formInline" label-width="150px" class="demo-form-inline">
          <div class="back">
            <div class="list">
              <el-form-item label="姓名：">
                <p>{{ formInline.realName }}</p>
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="工号：">
                <p>{{ formInline.doctorNo }}</p>
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="电话号码：">
                <p>{{ formInline.doctorPhone }}</p>
              </el-form-item>
            </div>
          </div>

          <div class="list">
            <el-form-item label="手机型号：">
              <p>{{ formInline.model }}</p>
            </el-form-item>
          </div>
          <div class="list">
            <el-form-item label="病区：">
              <!-- <p>{{ formInline.hospitalName }}</p> -->
            </el-form-item>
          </div>
          <div class="list">
            <el-form-item label="级别：">
              <p>{{ formInline.level }}</p>
            </el-form-item>
          </div>
          <div class="back">
            <div class="list">
              <el-form-item label="注册时间：">
                <p>{{ formInline.inputDate }}</p>
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="最后登录时间：">
                <p>{{ formInline.lastLoginTime }}</p>
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="APP版本：">
                <p>{{ formInline.appVersion }}</p>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <span class="title">下级医生</span>
        </template>
        <template>
          <div class="tablebox">
            <el-table :data="formInline.subDoctorList" stripe border style="width: 100%;">
              <el-table-column label="直属下级" align="center">
                <template slot-scope="scope">{{ scope.row.realName }}【{{ scope.row.doctorNo }}】</template>
              </el-table-column>
              <el-table-column label="下级" align="center">
                <template slot-scope="scope">{{ scope.row.doctorNames }}</template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-button class="goBack" @click="goback('ruleForm')">返回</el-button>
  </div>
</template>

<script>
import { detailDoctor, relationList } from '@/api/modules/doctor'
import common from '../../../api/common'
export default {
  data() {
    return {
      activeNames: ['1', '2', '3'],
      formInline: {
        hospitalName: '',
        doctorPhone: '',
        realName: '',
        inputDate: '',
        subDoctorList: []
      },
      id: '',
      doctorId: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: true,
      relationMang: false,
      form: {
        realName: ''
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.doctorId = this.$route.query.doctorId
    this.getdetail()
    // this.getLevel();
  },
  methods: {
    // 获取详情
    getdetail() {
      const params = {
        id: this.id
      }
      common.detailDoctor(params).then(res => {
        if (res.code == 10000) {
          this.formInline = res.data
          const doctorNames = []
          this.formInline.subDoctorList.forEach((v, i) => {
            const arr = []
            this.formInline.subDoctorList[i].subDoctorList.forEach((v, j) => {
              arr.push(
                this.formInline.subDoctorList[i].subDoctorList[j].realName +
                  '【' +
                  this.formInline.subDoctorList[i].subDoctorList[j].doctorNo +
                  '】'
              )
            })
            console.log(arr.join(','))
            this.formInline.subDoctorList[i].doctorNames = arr.join(',')
          })
        }
      })
    },
    // 获取上下级
    // getLevel() {
    //   let params = {
    //     id: this.id
    //   };
    //   common.relationList(params).then(res => {
    //     if (res.code == 10000) {
    //       this.formInlines = res.data;
    //     }
    //   });
    // },
    handleChange(val) {},
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage1 = val
      this.getwomen()
    },
    // 返回上一页
    goback(formName) {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  height: auto;
  background: #f0f2f5;
  padding: 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  &:before {
    content: "";
    width: 4px;
    height: 30px;
    background: #666;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: -5px;
  }
}
.demo-form-inline {
  display: flex;
  flex-wrap: wrap;
  .picture {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .back {
    width: 100%;
    // height: 80px;
    display: flex;
    flex-wrap: wrap;
    background: #f0f2f5;
    // padding: 20px 0;
    .back .list {
      z-index: 999;
      padding: 0;
    }
  }
  .list {
    width: 33.3%;
    height: 80px;
    line-height: 63px;
    padding: 20px 0;
  }
}
.tablebox {
  margin: 20px;
}
.goBack {
  margin: 30px 20px;
}
.block {
  margin: {
    top: 30px;
  }
}
.relation {
  float: right;
  margin: 0 20px 20px 0;
}

/deep/ .el-form-item--medium .el-form-item__content {
  line-height: 36px;
}
</style>
