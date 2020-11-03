<template>
  <div class="app-container">
    <div class="filter-container">
      <el-cascader
        v-if="permission.indexOf('SearchAccount22343')!=-1"
        clearable
        class="filter-item"
        placeholder="角色筛选"
        v-model="roleID"
        :options="roleList"
        :props="{ expandTrigger: 'hover' }"
      ></el-cascader>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        v-if="permission.indexOf('SearchAccount22343')!=-1"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        v-if="permission.indexOf('AddAccount23573')!=-1"
      >新增账号</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 100%">
      <el-table-column label="账号" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="bandPrice" min-width="95" align="center">
        <template slot-scope="{row}">
          <span v-if="row.gender">{{ row.gender==1?'男':'女' }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="bandPrice" min-width="95" align="center">
        <template slot-scope="{row}">
          <span v-if="row.businessRole">{{ row.businessRole.roleName }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150px" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" min-width="125" align="center">
        <template slot-scope="{row}">
          <span
            v-if="row.createdTimeStamp"
          >{{ row.createdTimeStamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="240"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(row)"
            v-if="permission.indexOf('UpdateAccount2543')!=-1"
          >编辑</el-button>
          <el-button
            type="success"
            size="small"
            @click="handleUpdatePwd(row)"
            v-if="permission.indexOf('UpdateAccount2543')!=-1"
          >重置密码</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleModifyStatus(row)"
            v-if="permission.indexOf('deleteAccount2043')!=-1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogVisible" title="编辑用户">
      <el-form
        :model="user"
        label-width="100px"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
      >
        <el-form-item label="登录账号" prop="loginAccount" required>
          <el-input v-model="user.loginAccount" style="min-width: 200px;max-width: 800px"></el-input>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="userName" required>
          <el-input v-model="user.userName" style="min-width: 200px;max-width: 800px"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber" required>
          <el-input v-model="user.phoneNumber" style="min-width: 200px;max-width: 800px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" required>
          <el-radio-group v-model="user.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="账号类型" prop="roleIDList" required>
          <el-cascader
            style="min-width: 200px;max-width: 800px"
            placeholder="请选择账号类型"
            v-model="user.roleIDList"
            :options="roleList"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPwdVisible" title="重置用户密码">
      <el-form :model="pwd" label-width="100px" label-position="left">
        <el-form-item label="账户密码" prop="loginAccount">
          <el-input
            v-model="pwd.password"
            type="password"
            style="min-width: 200px;max-width: 800px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="loginAccount">
          <el-input
            v-model="pwd.passwordConfirm"
            type="password"
            style="min-width: 200px;max-width: 800px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogPwdVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPwd">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoutes } from "@/api/role";
import { userListByPage, updateUser, deleteUser } from "@/api/account";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Cookies from "js-cookie";

export default {
  name: "PageAccountManagement",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "info",
        2: "danger",
        9: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      permission: [],
      rules: {
        loginAccount: [
          { required: true, message: "请填写登录账号", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请填写联系人姓名", trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请填写联系方式", trigger: "blur" },
        ],
        gender: [
          { required: true, message: "请选择联系人性别", trigger: "change" },
        ],
        roleIDList: [
          { required: true, message: "请选择账户类型", trigger: "change" },
        ],
      },
      user: {
        userID: undefined,
        loginAccount: "",
        userName: "",
        gender: 1,
        roleID: "",
        roleIDList: [],
        phoneNumber: "",
      },
      pwd: {
        userID: undefined,
        passwordConfirm: "",
        password: "",
      },
      list: null,
      roleList: null,
      total: 0,
      listLoading: true,
      dialogVisible: false,
      dialogPwdVisible: false,
      roleID: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        roleID: undefined,
      },
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.permission = JSON.parse(Cookies.get("permission"));
    this.getRoles();
    this.getList();
  },
  methods: {
    getList() {
      console.log(this.roleID);
      if (this.roleID != null && this.roleID.length > 0) {
        this.listQuery.roleID = this.roleID[0];
      } else {
        this.listQuery.roleID = null;
      }
      userListByPage(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    catProduct(product) {
      window.location.href =
        "#/product-management/cat-product-release?productID=" +
        product.productID;
    },
    confirmUser() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.user.roleID = this.user.roleIDList[0];
          this.user.loginPassword = undefined;
          updateUser(this.user).then((response) => {
            if (response.status == 1) {
              this.$message({
                type: "success",
                message: "编辑成功！",
              });
              this.dialogVisible = false;
            } else {
              this.$message({
                type: "danger",
                message: response.message,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    confirmPwd() {
      if (this.pwd.password.length < 6) {
        this.$message({
          type: "danger",
          message: "密码必须大于六位数！！！",
        });
        return;
      }
      if (this.pwd.password != this.pwd.passwordConfirm) {
        this.$message({
          type: "danger",
          message: "两次输入密码不一致！！！",
        });
        return;
      }
      updateUser({
        userID: this.pwd.userID,
        loginPassword: this.pwd.password,
      }).then((response) => {
        if (response.status == 1) {
          this.$message({
            type: "success",
            message: "重置密码成功！",
          });
          this.dialogPwdVisible = false;
        } else {
          this.$message({
            type: "danger",
            message: response.message,
          });
        }
      });
    },
    getRoles() {
      this.listLoading = true;
      getRoutes().then((response) => {
        if (response.data.length > 0) {
          this.roleList = [];
          for (let i = 0; i < response.data.length; i++) {
            let role = {
              label: response.data[i].roleName,
              value: response.data[i].roleID,
            };

            this.roleList.push(role);
          }
        }

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    handleModifyStatus(row) {
      this.$confirm(
        "此操作删除账户【" + row.userName + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let param = {
            userID: row.userID,
          };
          deleteUser(param).then((response) => {
            if (response.status == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            } else {
              this.$message({
                type: "danger",
                message: response.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleCreate() {
      window.location.href = "#/account-management/add-account";
    },
    handleUpdate(row) {
      this.user = row;
      this.user.roleIDList = [this.user.roleID];
      this.dialogVisible = true;
    },
    handleUpdatePwd(row) {
      this.pwd.userID = row.userID;
      this.dialogPwdVisible = true;
    },
  },
};
</script>

<style scoped>
</style>
