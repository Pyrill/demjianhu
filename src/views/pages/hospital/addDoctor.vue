<template>
  <div class="formBox">
    <div class="mainBox">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="医院名称" prop="hospitalName">
          <el-select
            v-model="ruleForm.hospitalId"
            placeholder="请选择"
            @change="changeHospital"
          >
            <el-option
              v-for="(v, i) in selectData"
              :key="i"
              :label="v.hospitalName"
              :value="v.hospitalId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="病区" prop="medicalArea">
          <el-input v-model.trim="ruleForm.medicalArea" />
        </el-form-item>
        <el-form-item label="医生姓名" prop="realName">
          <el-input
            v-model.trim="ruleForm.realName"
            oninput="if(value.length>10)value=value.slice(0,10)"
          />
        </el-form-item>
        <el-form-item label="工号" prop="doctorNo">
          <el-input
            v-model.trim="ruleForm.doctorNo"
            oninput="if(value.length>7)value=value.slice(0,7)"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.trim="ruleForm.mobile" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="ruleForm.password" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="ruleForm.level" placeholder="请选择" @change="sublist">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="直属下级" prop="level">
          <el-checkbox-group v-model="checkboxCList" @change="checkboxChange">
            <el-checkbox v-for="(item,index) in sublistData" :key="index" :label="item.realName" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="goback('ruleForm')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  saveDoctor,
  getLists,
  getHospitalm,
  levelSublist
} from '@/api/modules/doctor'
import common from '../../../api/common'
export default {
  data() {
    const checkphone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      checkboxCList: [],
      ruleForm: {
        id: '',
        hospitalId: '',
        hospitalName: '',
        medicalArea: '',
        realName: '',
        doctorNo: '',
        mobile: '',
        level: ''
      },
      rules: {
        hospitalId: [
          { required: true, message: '请选择医院', trigger: 'change' }
        ],
        mobile: [
          {
            validator: checkphone,
            required: true,
            // message: "请输入正确的手机号",
            trigger: 'blur'
          }
        ],
        realName: [
          {
            required: true,
            message: '请输入医生姓名',
            trigger: 'blur',
            max: 10
          }
        ],
        doctorNo: [
          { required: true, message: '请输入工号', trigger: 'blur', max: 7 }
        ]
      },
      id: '',
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
      selectData: {},
      selectCode: [],
      sublistData: []
    }
  },
  mounted() {
    this.gethospital()
    this.id = this.$route.query.id
    if (this.id) {
      this.getdetail()
    }
  },
  methods: {
    // 获取医院
    gethospital() {
      // this.ruleForm.hospitalId = "";
      common.getLists().then(res => {
        if (res.code == 10000) {
          this.selectData = res.data
        }
      })
    },
    // 获取病区
    getmedical(e) {
      if (e) {
        this.ruleForm.hospitalId = e
      }
      common
        .getHospitalm({ hospitalId: this.ruleForm.hospitalId })
        .then(res => {
          if (res.code == 10000) {
            this.selectCode = res.data
          }
        })
    },
    // 根据级别加载下级医生列表
    sublist() {
      const params = {
        level: this.ruleForm.level,
        hospitalId: this.ruleForm.hospitalId
      }

      common.levelSublist(params).then(res => {
        this.sublistData = res.data
        if (this.ruleForm.level) {
        }
      })
    },
    // 清空事件
    // clearlist(e) {
    //   this.ruleForm.level = "";
    // },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data
    },
    // 直属下级
    checkboxChange(e) {
      var arr = []
      this.checkboxCList.forEach(item => {
        this.sublistData.forEach(_item => {
          if (item == _item.realName) {
            var obj = {
              subDoctorId: _item.id,
              bandingDoctorId: _item.bandingDoctorId,
              realName: _item.realName,
              level: _item.level
            }
            arr.push(obj)
          }
        })
      })
      this.ruleForm.directSubDoctorList = arr
    },
    // 选择医院
    changeHospital(e) {
      this.selectData.forEach(item => {
        if (e === item.hospitalId) {
          this.ruleForm.hospitalName = item.hospitalName
        }
      })
      const params = {
        level: this.ruleForm.level,
        hospitalId: this.ruleForm.hospitalId
      }
      common.levelSublist(params).then(res => {
        this.sublistData = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.ruleForm
          if (this.id) {
            data.id = this.id
            data.hospitalName = this.hospitalName
          }
          common.saveDoctor(data).then(res => {
            if (res.code == 10000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$refs[formName].resetFields()
              this.$router.push({ path: 'doctor' })
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
.formBox {
  width: calc(100% - 40px);
  min-height: 650px;
  background: #fefefe;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.mainBox {
  width: 50%;
}
.avatar-uploader {
  width: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
