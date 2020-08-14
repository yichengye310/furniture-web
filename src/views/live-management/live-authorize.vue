<template>
  <div>
    <el-input @keyup.enter.native="handleFilter"
              class="filter-item"
              placeholder="用户手机号" style="width: 200px;"
              v-waves
              v-if="(userType == '4' && permission.indexOf('SearchLiveUser123')!=-1) || (userType == '3' && permission.indexOf('SearchLiveUser234')!=-1)"
              v-model="listQuery.phoneNumber"/>
    <el-button @click="handleFilter" class="filter-item"
               icon="el-icon-search"
               type="primary" v-if="(userType == '4' && permission.indexOf('SearchLiveUser123')!=-1) || (userType == '3' && permission.indexOf('SearchLiveUser234')!=-1)" v-waves>
      查询
    </el-button>
    <el-table
      :data="list"
      fit
      highlight-current-row
      style="width: 100%"
      v-loading="listLoading"
    >

      <el-table-column align="center" label="手机号" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" min-width="240">
        <template slot-scope="{row}">
          <el-button @click="handleUpdate(row)" size="small" type="primary" v-waves
                     v-if="permission.indexOf('AuthorizeLive1534')!=-1">
            {{ (row.isOpenLive === 1? '取消授权': '授权')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :limit.sync="listQuery.pageSize" :page.sync="listQuery.pageNo" :total="total" @pagination="getList"
                v-show="total>0"/>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import waves from '@/directive/waves' // waves directive
  import Cookies from 'js-cookie'
  import { queryUserByPage } from '@/api/user'
  import { updateLivePermission } from '@/api/live'

  export default {
    name: 'live-authorize',
    components: { Pagination },
    directives: { waves },
    data(){
      return {
        permission: [],
        listQuery: {},
        listLoading: false,
        total: 0,
        list: [],
        //userType: 4 // 商家4，经销商3
    }},
    props:['userType'],/*通过props接收父组件传递过来的数据 */
    created() {
      // console.log("created: " + this.userType)
      this.permission = JSON.parse(Cookies.get('permission'));
      this.listQuery.pageNo = 1;
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.userType = this.userType;
        if (!this.listQuery.phoneNumber) {
          delete this.listQuery.phoneNumber;
        }
        queryUserByPage(this.listQuery).then(response => {
          console.log(response.data)
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1;
        this.getList();
      },
      handleUpdate(row) {
        this.$confirm('此操作修改用户直播权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateLivePermission({userID: row.userID})
            .then(()=>{
              row.isOpenLive = row.isOpenLive == 1? 2: 1;
            })
            .catch(()=>{
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改直播权限'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
