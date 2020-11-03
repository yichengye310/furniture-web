<template>
  <div class="app-container">
    <div class="filter-container">
      <el-cascader
        v-if="permission.indexOf('Search534')!=-1"
        clearable class="filter-item"
        placeholder="分类筛选"
        v-model="userType"
        :options="userTypeList"
        :props="{ expandTrigger: 'hover' }"></el-cascader>
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
      ref="table"
    >

      <el-table-column label="用户类型" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span v-if="!row.inEdit">{{ row.userType | userTypeFilter }}</span>
          <el-select v-else v-model="row.userType" :disabled="pageType=='cat'" :value="row.userType">
            <el-option
              v-for="item in userTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span  >{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系方式" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="余额"   min-width="95" align="center" >
        <template slot-scope="{row}">
          <span  >/</span>
        </template>
      </el-table-column>

      <el-table-column label="购买件数"   min-width="95" align="center">
        <template slot-scope="{row}">
          <span  >/</span>
        </template>
      </el-table-column>

      <el-table-column label="消费金额"   min-width="95" align="center">
        <template slot-scope="{row}">
          <span  >/</span>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.createdTimeStamp">{{ row.createdTimeStamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else></span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span v-if="!row.inEdit"><el-button type="primary" size="mini" @click="row.inEdit=true">编辑</el-button></span>
          <span v-else><el-button type="success" size="mini" @click="handleUpdate(row)">完成</el-button></span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { queryUserByPage, updateUserType } from '@/api/user'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from "js-cookie";


  export default {
    name: 'UserList',
    components: { Pagination },
    directives: { waves },
    filters: {
      userTypeFilter(status) {
        const statusMap = {
          1: '普通用户',
          2: '会员',
          3: '经销商',
          4: '商家'
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        tableKey: 0,
        permission: [],
        list: null,
        userTypeList: [
          {
            label:'普通用户',
            value:1,
          },
          {
            label:'会员',
            value:2,
          },
          {
            label:'经销商',
            value:3,
          },
          {
            label:'商家',
            value:4,
          }
        ],
        total: 0,
        listLoading: true,
        userType: [],
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          phoneNumber: undefined,
          userType: undefined,
        },
      }
    },
    created() {
      this.permission=JSON.parse(Cookies.get("permission"));
      this.getList()
    },
    props: [
      'pageType'
    ],
    methods: {
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      getList() {
        this.listLoading = true
        if( this.userType.length>0){
          this.listQuery.userType = this.userType[0];
        }else{
          this.listQuery.userType = null;
        }
        if(this.listQuery.phoneNumber==''){
          this.listQuery.phoneNumber = undefined;
        }
        queryUserByPage(this.listQuery).then(response => {

          // response.data.list.forEach(item => {
          //
          // })
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleUpdate(row) {
        updateUserType({
          userID: row.userID,
          userType: row.userType
        })
          .then((res) => {
            this.$message({
              type: 'info',
              message: res.message
            });
            if (res.status === 0) {
              row.inEdit = false
              this.$refs.table.setCurrentRow(undefined);
            }
          })
          .catch(() => {

          })
      }
    }
  }
</script>

<style scoped>

</style>
