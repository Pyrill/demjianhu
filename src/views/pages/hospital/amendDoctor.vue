<template>
  <div class="carousel">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <span class="title">浙江大学医学院附属医学妇产科医院</span>
        </template>
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="ruleForm"
          label-width="150px"
          class="demo-form-inline"
          :rules="rules"
        >
          <div class="back">
            <div class="list">
              <el-form-item label="医生姓名" prop="realName">
                <el-input v-model.trim="ruleForm.realName" />
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="工号" prop="doctorNo">
                <el-input v-model.trim="ruleForm.doctorNo" />
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="病区" prop="medicalArea">
                <el-input v-model.trim="ruleForm.medicalArea" />
              </el-form-item>
            </div>
          </div>

          <div class="list">
            <el-form-item label="手机号码" prop="doctorPhone">
              <el-input v-model.trim="ruleForm.doctorPhone" />
            </el-form-item>
          </div>
          <div class="list">
            <el-form-item label="APP版本" prop="appVersion">
              <p>{{ ruleForm.appVersion }}</p>
            </el-form-item>
          </div>
          <div class="list">
            <el-form-item label="手机型号" prop="model">
              <p>{{ ruleForm.model }}</p>
            </el-form-item>
          </div>
          <div class="back">
            <div class="list">
              <el-form-item label="级别" prop="level">
                <el-select v-model="ruleForm.level" placeholder="请选择" :disabled="isFlag?true:false">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="注册时间：">
                <p>{{ ruleForm.inputDate }}</p>
              </el-form-item>
            </div>
            <div class="list">
              <el-form-item label="最后登录时间：">
                <p>{{ ruleForm.lastLoginTime }}</p>
              </el-form-item>
            </div>
          </div>
          <div class="list">
            <el-form-item label="密码" prop="passWord">
              <el-input
                :key="passwordType"
                ref="password"
                v-model.trim="ruleForm.passWord"
                :type="passwordType"
                name="password"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </div>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <span class="title">下级医生</span>
        </template>
        <div class="relation">
          <el-button @click="relationMang" @change="management">关系管理</el-button>
        </div>
        <template>
          <div class="tablebox">
            <el-table :data="ruleForm.subDoctorList" stripe border style="width: 100%;">
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
    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    <el-button class="goBack" @click="goback('ruleForm')">返回</el-button>
    <el-dialog title="关系管理" :visible.sync="relationMangs" center>
      <div>
        <span class="textClass">直属上级:</span>
        <el-checkbox-group v-model="form.directsuper">
          <el-checkbox
            v-for="(item, index) in formInlines.supDoctorList"
            :key="index"
            :label="item.realName"
          />
        </el-checkbox-group>
      </div>
      <div>
        <span class="textClass">直属下级:</span>
        <el-checkbox-group v-model="form.tagscheck">
          <el-checkbox
            v-for="(item, index) in formInlines.subDoctorList"
            :key="index"
            :label="item.realName"
          />
        </el-checkbox-group>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="subSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  detailDoctor,
  relationList,
  saveDoctor,
  ensureSublist,
  selectstatus
} from '@/api/modules/doctor'
import common from '../../../api/common'
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      } else {
        if (value < 6) {
          return callback(new Error('请输入不少于六位数的密码'))
        } else {
          return callback()
        }
      }
    }
    return {
      activeNames: ['1', '2', '3'],
      ruleForm: {
        realName: '',
        doctorNo: '',
        doctorPhone: '',
        medicalArea: '',
        level: 1,
        cityId: '',
        hospitalId: '',
        checkpassWord: '',
        passWord: ''
      },
      id: '',
      doctorId: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: true,
      relationMangs: false,
      formInlines: {
        supDoctorList: [],
        subDoctorList: []
      },
      options: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        },
        {
          value: 3,
          label: '三级'
        },
        {
          value: 4,
          label: '四级'
        }
      ],
      value: '',
      radio: '1',
      // 直属下级
      subCheckList: [],
      selective: false,
      form: {
        tagscheck: [],
        directsuper: []
      },
      isFlag: false,
      passwordType: 'password',
      rules: {
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.doctorId = this.$route.query.doctorId
    this.getdetail()
    this.getLevel()
  },
  methods: {
    // 获取详情
    getdetail() {
      const params = {
        id: this.id
      }
      common.detailDoctor(params).then(res => {
        if (res.code == 10000) {
          this.ruleForm = res.data
          const doctorNames = []
          this.ruleForm.subDoctorList.forEach((v, i) => {
            if (v.selective == true) {
              this.isFlag = true
            }
            const arr = []
            this.ruleForm.subDoctorList[i].subDoctorList.forEach((v, j) => {
              arr.push(
                this.ruleForm.subDoctorList[i].subDoctorList[j].realName +
                  '【' +
                  this.ruleForm.subDoctorList[i].subDoctorList[j].doctorNo +
                  '】'
              )
            })
            console.log(arr.join(','))
            this.ruleForm.subDoctorList[i].doctorNames = arr.join(',')
          })
          this.ruleForm.supDoctorList.forEach((v, i) => {
            if (v.selective == true) {
              this.isFlag = true
            }
          })
        }
      })
    },
    // 获取上下级
    getLevel() {
      const params = {
        id: this.id
      }
      common.relationList(params).then(res => {
        var arrData = []
        var arrDatas = []
        if (res.code == 10000) {
          this.formInlines = res.data
          const subData = this.formInlines.subDoctorList
          const supData = this.formInlines.supDoctorList
          subData.forEach((value, index) => {
            if (value.selective == true) {
              arrData.push(value.realName)
            }
          })
          this.form.tagscheck = arrData
          supData.forEach((value, index) => {
            if (value.selective == true) {
              arrDatas.push(value.realName)
            }
          })
          this.form.directsuper = arrDatas
        }
      })
    },
    // 点击弹框
    relationMang() {
      this.relationMangs = true
      this.getLevel()
    },
    // 关系管理
    management() {
      alert(123)
    },
    // 保存医生
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.ruleForm
          this.ruleForm.hospitalId = data.hospitalId
          this.ruleForm.provinceId = data.provinceId
          this.ruleForm.cityId = data.cityId
          this.ruleForm.hospitalName = data.hospitalName
          this.ruleForm.hospitalPhone = data.hospitalPhone
          this.ruleForm.address = data.address
          this.ruleForm.isHospital = data.isHospital
          common.saveDoctor(this.ruleForm).then(res => {
            if (res.code == 10000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$refs[formName].resetFields()
              this.$router.push({ path: 'doctor' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存上下级
    subSure() {
      this.relationMangs = false
      var doctorBnames = []
      var doctorPnames = []
      this.formInlines.subDoctorList.forEach(items => {
        doctorBnames.push(items.realName)
      })
      this.formInlines.supDoctorList.forEach(items => {
        doctorPnames.push(items.realName)
      })
      const subList = this.formInlines.subDoctorList
      const supList = this.formInlines.supDoctorList
      const supDoctorData = []
      const subDoctorData = []

      supList.forEach(item => {
        const supClass = {
          level: item.level,
          bindingDoctorId: item.doctorId,
          realName: item.realName,
          selective: false
        }
        supDoctorData.push(supClass)
      })
      this.form.directsuper.forEach(item => {
        if (doctorPnames.indexOf(item) != -1) {
          supDoctorData[doctorPnames.indexOf(item)].selective = true
        }
      }) // 0717
      subList.forEach(item => {
        const subClass = {
          level: item.level,
          bindingDoctorId: item.doctorId,
          realName: item.realName,
          selective: false // 0717
        }
        subDoctorData.push(subClass)
      })

      this.form.tagscheck.forEach(item => {
        if (doctorBnames.indexOf(item) != -1) {
          subDoctorData[doctorBnames.indexOf(item)].selective = true
        }
      }) // 0717
      const data = {
        hospitalId: this.ruleForm.hospitalId,
        doctorId: this.ruleForm.id,
        supDoctorBindingList: supDoctorData,
        subDoctorBindingList: subDoctorData
      }
      // debugger
      common.ensureSublist(data).then(res => {
        if (res.data == 10000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }
        this.isFlag = false
        this.getdetail()
        this.getLevel()
      })
    },
    // 关闭弹框
    cancel() {
      this.relationMangs = false
      this.form.directsuper = []
      this.form.tagscheck = []
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
  line-height: 8px;
}
.textClass {
  font-size: 24px;
  display: block;
  margin: 20px 0 20px 0;
}
.testSty {
  margin: 0 15px;
}
/deep/ .el-input__inner {
  width: 302px;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  // color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
