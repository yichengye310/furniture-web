<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.phoneNumber" placeholder="联系方式" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>

      <el-table-column label="姓名" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span  >{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地址"   min-width="300px" align="center" >
        <template slot-scope="{row}">
          <span >{{row.province + ' ' + row.city + ' ' + row.country + ' ' + row.address}}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.userRemark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="180px" align="center">
        <template slot-scope="{row}">
          <el-button @click="handleUpdate(row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { getMadeToOrderList, deleteMadeToOrder } from '@/api/custom'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination


  export default {
    name: 'CustomList',
    components: { Pagination },
    directives: { waves },
    filters: {
      userTypeFilter(status) {
        const statusMap = {
          1: '普通用户',
          2: '会员',
          3: '经销商'
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          phoneNumber: undefined,
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        if(this.listQuery.phoneNumber==''){
          this.listQuery.phoneNumber = undefined;
        }
        getMadeToOrderList(this.listQuery).then(response => {

          // response.data.list.forEach(item => {
          //
          // })
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleUpdate(row) {
        this.$confirm('此操作将删除该定制请求, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMadeToOrder({ orderID: row.orderID })
            .then(() => {
              this.getList();
            })
            .catch(() => {
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除定制请求'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
