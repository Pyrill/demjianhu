<template>
  <div class="carousel">
    <div class="top">
      <div class="select">
        <el-input
          v-model="operation.hospitalName"
          prefix-icon="el-icon-search"
          placeholder="医院名称"
          clearable
        />
        <el-button type="primary" @click="hospitalList">搜索</el-button>
      </div>
      <div class="tool">
        <router-link
          v-if="power.addPer == 0"
          :to="{ path: 'addHospital', query: { title: ' / 新增医院' } }"
        >
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
      <el-table-column label="ID" align="center" width="50">
        <template slot-scope="scope">{{ scope.row.hospitalId }}</template>
      </el-table-column>
      <el-table-column label="医院名称" align="center">
        <template slot-scope="scope">{{ scope.row.hospitalName }}</template>
      </el-table-column>

      <el-table-column label="省份" align="center">
        <template slot-scope="scope">{{ scope.row.provinceName }}</template>
      </el-table-column>
      <el-table-column label="市级" align="center">
        <template slot-scope="scope">{{ scope.row.cityName }}</template>
      </el-table-column>
      <el-table-column label="详细地址" align="center">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">{{ scope.row.hospitalPhone }}</template>
      </el-table-column>
      <el-table-column label="加入时间" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.createddate }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editHospital(scope.row)"
          />
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
import { getList } from '@/api/modules/hospital'

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      count: 0,
      pageSize: 10,
      loading: true,
      operation: {
        provinceId: '',
        cityId: '',
        areaId: '',
        date: []
      },
      power: {
        delPer: '',
        addPer: '',
        updatePer: '',
        getPer: ''
      },
      province: {}
    }
  },
  mounted() {
    this.hospitalList()
  },
  methods: {
    // 获取列表
    hospitalList() {
      const params = {
        page: this.currentPage,
        rows: this.pageSize,
        name: this.operation.hospitalName,
        fromDate: this.operation.date[0],
        toDate: this.operation.date[1],
        mobile: this.operation.hospitalPhone
      }
      common
        .getList(params)
        .then(res => {
          if (res.code == 10000) {
            this.tableData = res.data
            this.count = res.count
            this.loading = false
          }
        })
        .catch(error => {
          console.log(error, '====')
        })
    },
    // 清空事件
    clearlist() {
      this.operation.cityId = ''
      this.operation.areaId = ''
      this.city = {}
      this.town = {}
    },
    clearlist1() {
      this.operation.areaId = ''
      this.town = {}
    },
    clearlist2() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    editHospital(item) {
      this.$store.state.hospital.hospitalList = item
      localStorage.setItem('hospital', JSON.stringify(item))
      this.$router.push('/hospital/addHospital?type=1')
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.hospitalList()
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
      width: 300px;
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
  .picture {
    width: 100%;
    height: 100%;
    display: block;
  }
  .block {
    margin: {
      top: 30px;
    }
  }
}
</style>
