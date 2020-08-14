<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" v-if="permission.indexOf('AddRole23543')!=-1" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">
        添加角色
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="roleList"
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column label="角色"  prop="bandPrice" min-width="100" align="center">
        <template slot-scope="{row}">
          <span v-if="row.roleName"  >{{ row.roleName }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="角色说明"  prop="bandPrice"  min-width="200" align="center" >
        <template slot-scope="{row}">
          <span v-if="row.description"  >{{ row.description }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.createdTimeStamp">{{ row.createdTimeStamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="grantRole(row)">
            授权
          </el-button>
          <el-button  size="mini" type="danger" @click="deleteRole(row)" v-if="permission.indexOf('deleteRole20412')!=-1">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加角色" width="500px" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="角色名称" required >
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" >
          <el-input v-model="form.description" type="text" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getRoutes,deleteRole,addRole,updateRole } from '@/api/role'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from "js-cookie";


  export default {
    name: 'RoleManagement',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        dialogFormVisible: false,
        roleList: null,
        form: {
          roleName:'',
          description:'',
          permissionContent:''
        },
        total: 0,
        listLoading: true,
        permission: [],
        roleID: [],
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          roleID: undefined
        },
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.permission=JSON.parse(Cookies.get("permission"));
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getRoutes().then(response => {
          this.roleList=response.data
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      grantRole(row){
        this.$router.push(`/account-management/role-authorize?roleID=${row.roleID}&roleName=${row.roleName}`)
      },
      deleteRole(row) {
        var that=this;
        this.$confirm('此操作删除角色【'+row.roleName+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            roleID : row.roleID
          }
          deleteRole(param).then(response => {
            if(response.status==1){
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              that.getList();
            }else{
              this.$message({
                type: 'danger',
                message: response.message
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          });
        });

      },
      handleCreate() {
        this.dialogFormVisible = false
        if(this.form.roleName==null||this.form.roleName==''){
          this.$message({
            type: 'danger',
            message: "请填写角色名称！！！"
          });
          return;
        }
        addRole(this.form).then(response => {
          if(response.status==1){
            this.$message({
              type: 'success',
              message: '添加成功！'
            });
            this.getList();
          }else{
            this.$message({
              type: 'danger',
              message: response.message
            });
          }
        })

      },
      handleUpdate(row) {
        window.location.href="#/account-management/role-authorize?roleID="+row.roleID+"&roleName="+row.roleName
      }
    }
  }
</script>

<style scoped>

</style>
