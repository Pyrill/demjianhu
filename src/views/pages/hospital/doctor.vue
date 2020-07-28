<template>
  <div class="carousel">
    <div class="top">
      <div class="select">
        <span class="demonstration">医院名称:</span>
        <el-select
          v-model="operation.hospitalName"
          placeholder="医院名称"
          style="width: 200px;"
          clearable
          @change="getmedical"
          @clear="clearlist"
        >
          <el-option
            v-for="(v, i) in selectData"
            :key="i"
            :label="v.hospitalName"
            :value="v.hospitalId"
          />
        </el-select>
        <span class="demonstration">病区:</span>
        <el-select v-model="operation.medicalArea" placeholder="病区" style="width: 200px;" clearable>
          <el-option v-for="(v, i) in selectCode" :key="i" :label="v.medicalArea" :value="v" />
        </el-select>
        <el-input
          v-model="operation.realName"
          prefix-icon="el-icon-search"
          placeholder="医生姓名"
          clearable
        />
        <el-input
          v-model="operation.doctorNo"
          prefix-icon="el-icon-search"
          placeholder="工号"
          clearable
        />
        <el-button type="primary" @click="getlist">搜索</el-button>
      </div>
      <div class="tool">
        <router-link :to="{ path: 'addDoctor', query: { title: '新增医生'} }">
          <el-button type="warning">新增</el-button>
        </router-link>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :border="true"
      :stripe="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column label="医生ID" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="医院名称" align="center">
        <template slot-scope="scope">{{ scope.row.hospitalName }}</template>
      </el-table-column>
      <el-table-column label="病区" align="center">
        <template slot-scope="scope">{{ scope.row.medicalArea }}</template>
      </el-table-column>
      <el-table-column label="医生姓名" align="center">
        <template slot-scope="scope">{{ scope.row.realName }}</template>
      </el-table-column>
      <el-table-column label="工号" align="center">
        <template slot-scope="scope">{{ scope.row.doctorNo }}</template>
      </el-table-column>
      <el-table-column label="级别" align="center">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">{{ scope.row.doctorPhone }}</template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="scope">{{ scope.row.inputDate }}</template>
      </el-table-column>
      <el-table-column label="最后登录时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.lastLoginTime }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{ path: 'amendDoctor', query: { id: scope.row.id , title: '修改医生'} }">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle />
          </router-link>
          <router-link
            :to="{
              path: 'doctordetail',
              query: { id: scope.row.id, doctorId: scope.row.doctorId }
            }"
          >
            <el-button icon="el-icon-search" type="success" size="mini" circle />
          </router-link>
          <el-button v-if="scope.row.status==1" type="warning" @click="close(scope.row.id)">禁用</el-button>
          <el-button v-else="scope.row.status==2" type="success" @click="open(scope.row.id)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getDoctor,
  updateStatus,
  getHospitalm,
  getLists
} from '@/api/modules/doctor'
import common from '../../../api/common'

export default {
  data() {
    return {
      value: true,
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      count: 0,
      pageSize: 10,
      loading: true,
      hospitalId: '',
      //  导入设备
      formdata: [],
      operation: {
        hospitalName: '',
        hospitalId: '',
        medicalarea: ''
      },
      selectData: [],
      selectCode: []
    }
  },
  mounted() {
    this.hospitalId = this.$route.query.hospitalId
    this.getlist()
    this.gethospital()
  },
  methods: {
    // 获取列表
    getlist() {
      const params = {
        page: this.currentPage,
        rows: this.pageSize,
        realName: this.operation.realName,
        hospitalId: this.operation.hospitalId,
        doctorNo: this.operation.doctorNo,
        medicalArea: this.operation.medicalArea
      }
      common.getDoctor(params).then(res => {
        console.log(params)

        if (res.code == 10000) {
          this.tableData = res.data
          this.count = res.count
          this.loading = false
        }
      })
    },
    // 获取医院
    gethospital() {
      this.operation.hospitalId = ''
      common.getLists().then(res => {
        if (res.code == 10000) {
          this.selectData = res.data
        }
      })
    },
    // 获取病区
    getmedical(e) {
      if (e) {
        this.operation.hospitalId = e
      } else {
        return
      }
      common
        .getHospitalm({ hospitalId: this.operation.hospitalId })
        .then(res => {
          if (res.code == 10000) {
            this.selectCode = res.data
          }
        })
    },
    // 清空事件
    clearlist() {
      this.operation.hospitalId = ''
      this.operation.medicalArea = ''
      this.selectCode = []
      this.getlist()
    },
    // 状态变化
    open(id) {
      const params = {
        id: id,
        status: 1
      }
      common.updateStatus(params).then(res => {
        this.getlist()
      })
    },
    close(id) {
      this.$confirm('禁用后不可登陆！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: id,
            status: 2
          }
          common.updateStatus(params).then(res => {
            this.getlist()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getlist()
    },
    variation($event, num) {
      if ($event == false) {
      }
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
  .top {
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    .demonstration {
      color: #8492a6;
      font-size: 14px;
    }
    .select {
      width: 1000px;
      float: left;
      justify-content: space-between;
      display: inline-block;
      .el-input {
        width: 200px;
      }
    }
    .tool {
      float: right;
      margin-right: 20px;
    }
  }
  .block {
    margin: {
      top: 30px;
    }
  }
}
</style>

