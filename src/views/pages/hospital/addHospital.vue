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
          <el-input v-model.trim="ruleForm.hospitalName" />
        </el-form-item>
        <el-form-item label="医院类型" prop="isHospital">
          <el-select
            v-model="ruleForm.isHospital"
            clearable
            placeholder="请选择医院类型"
            @change="typeChange"
          >
            <el-option label="医院" value="0" />
            <el-option label="月子中心" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="hospitalPhone">
          <el-input v-model.trim="ruleForm.hospitalPhone" />
        </el-form-item>

        <el-form-item label="省市区" prop="cityId">
          <el-select v-model="ruleForm.provinceId" placeholder="省" clearable @change="getcity()">
            <el-option v-for="(v, i) in province" :key="i" :label="v.name" :value="v.code" />
          </el-select>
          <el-select v-model="ruleForm.cityId" placeholder="市" clearable>
            <el-option v-for="(v, i) in city" :key="i" :label="v.name" :value="v.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model.trim="ruleForm.address" @blur="getaddress()" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button type="primary" plain @click="goback()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { insertList, getProvince, getCity } from '@/api/modules/hospital'

export default {
  data() {
    var checkphone = (rule, value, callback) => {
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
      province: {},
      city: {},
      town: {},
      center: {
        lng: 120.136438,
        lat: 30.265916
      },
      zoom: 15,
      ruleForm: {
        hospitalName: '',
        isHospital: '',
        hospitalPhone: '',
        address: '',
        hospitalDesc: '',
        provinceId: '',
        cityId: '',
        lat: '',
        title: '',
        hospitalId: ''
      },
      hospital: '',
      rules: {
        hospitalName: [
          { required: true, message: '请输入医院名称', trigger: 'blur' }
        ],
        isHospital: [
          { required: true, message: '请选择医院类型', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        hospitalPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        cityId: [{ required: true, message: '请输入省市区', trigger: 'change' }]
      },
      firstFlag: true
    }
  },
  mounted() {
    this.getprovince()
    var type = this.$route.query.type
    if (localStorage.getItem('hospital') && type) {
      this.hospital = JSON.parse(localStorage.getItem('hospital'))
      this.ruleForm.hospitalId = this.hospital.hospitalId
      this.ruleForm.hospitalName = this.hospital.hospitalName
      this.ruleForm.isHospital = this.hospital.isHospital
      this.ruleForm.hospitalPhone = this.hospital.hospitalPhone
      this.ruleForm.address = this.hospital.address
      this.ruleForm.provinceId = this.hospital.provinceId + ''
      this.ruleForm.cityId = this.hospital.cityId + ''
    }
  },
  methods: {
    // 省市区三级联动
    getprovince() {
      // this.ruleForm.provinceId = "";
      common.getProvince().then(res => {
        if (res.code == 10000) {
          if (this.ruleForm.provinceId !== '') {
            this.getcity(this.ruleForm.provinceId)
          }
          this.province = res.data
        }
      })
    },
    getcity(e) {
      if (e) {
        this.ruleForm.provinceId = e
      }
      common.getCity({ provincecode: this.ruleForm.provinceId }).then(res => {
        if (res.code == 10000) {
          if (!this.firstFlag) {
            this.ruleForm.cityId = ''
          } else {
            this.firstFlag = false
          }
          this.city = res.data
          console.log(this.city)
        }
      })
    },

    getaddress() {
      if (!this.ruleForm.cityId) {
        return
      }
      const address =
        this.ruleForm.provinceId.split(',')[1] +
        this.ruleForm.cityId.split(',')[1] +
        this.ruleForm.address
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const ruleForm = this.ruleForm

          this.ruleForm.hospitalId = ruleForm.hospitalId
          this.ruleForm.provinceId = ruleForm.provinceId
          this.ruleForm.cityId = ruleForm.cityId
          this.ruleForm.hospitalName = ruleForm.hospitalName
          this.ruleForm.hospitalPhone = ruleForm.hospitalPhone
          this.ruleForm.address = ruleForm.address
          this.ruleForm.isHospital = ruleForm.isHospital

          common.insertList(this.ruleForm).then(res => {
            if (res.code == 10000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$router.go(-1)
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          })
        } else {
          this.$msg.error('保存失败,医院名称已存在!')
          return false
        }
      })
    },
    // 医院类型
    typeChange(val) {
      if (val == '0') {
        this.type1 = false
        this.type2 = true
      } else if (val == '1') {
        this.type1 = true
        this.type2 = false
      }
    },
    // 清空事件
    clearlist() {
      this.ruleForm.cityId = ''
      this.city = {}
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
