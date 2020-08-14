<template>
  <div class="app-container">
    <h3>基本信息</h3>
    <el-divider></el-divider>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="登录账号" prop="loginAccount" required >
        <el-input v-model="form.loginAccount"  style="min-width: 200px;max-width: 800px"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="loginPassword" required>
        <el-input v-model="form.loginPassword"  style="min-width: 200px;max-width: 800px" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="loginPasswordConfirm" required>
        <el-input v-model="form.loginPasswordConfirm"  style="min-width: 200px;max-width: 800px" type="password"></el-input>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="userName" required>
        <el-input v-model="form.userName" style="min-width: 200px;max-width: 800px"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneNumber" required>
        <el-input v-model="form.phoneNumber" style="min-width: 200px;max-width: 800px"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender" required>
        <el-radio-group v-model="form.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="账号类型" prop="roleIDList" required>

        <el-cascader
          style="min-width: 200px;max-width: 800px"
          placeholder="请选择账号类型"
          v-model="form.roleIDList"
          :options="roleList"
          :props="{ expandTrigger: 'hover' }"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button @click="back">取消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { addUser } from '@/api/account'
  import { getRoutes } from '@/api/role'
  const validatePassword = (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error('密码不能少于六位数！！！'))
    } else {
      callback()
    }
  }
    export default {
        name: "AddAccount",
      data() {
        return {
          roleList:[],
          form: {
            loginAccount: '',
            loginPassword: '',
            loginPasswordConfirm: '',
            userName: '',
            gender: 1,
            roleID: '',
            roleIDList: [],
            phoneNumber: '',
          },
          rules: {
            loginAccount: [
              { required: true, message: '请填写登录账号', trigger: 'blur' }
            ],
            userName: [
              { required: true, message: '请填写联系人姓名', trigger: 'blur' }
            ],
            phoneNumber: [
              { required: true, message: '请填写联系方式', trigger: 'blur' }
            ],
            loginPassword: [{required: true, trigger: 'blur', validator: validatePassword}],
            loginPasswordConfirm: [{required: true, trigger: 'blur', validator: validatePassword}],
            gender: [
              { required: true, message: '请选择联系人性别', trigger: 'change' }
            ],
            roleIDList: [
              { required: true, message: '请选择账户类型', trigger: 'change' }
            ]
          }
        }
      },
      created() {
        this.getRoles()
      },
      methods: {
        //返回上一层
        back(){
          this.$router.go(-1);//返回上一层
        },
        getRoles() {
          getRoutes().then(response => {
            if(response.data.length>0){
              this.roleList=[]
              for (let i = 0; i <  response.data.length; i++) {
                let role={
                  label:response.data[i].roleName,
                  value:response.data[i].roleID
                }

                this.roleList.push(role)
              }
            }

          })
        },
        onSubmit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.form.roleID=this.form.roleIDList[0];
              if(this.form.loginPassword!=this.form.loginPasswordConfirm){
                this.$message({
                  type: 'danger',
                  message: '两次密码输入不一致！！！'
                });
                return ;
              }
              addUser(this.form).then(response => {
                if(response.status==1){
                  this.$message({
                    type: 'success',
                    message: '创建成功！'
                  });
                  this.back();
                }else{
                  this.$message({
                    type: 'danger',
                    message: response.message
                  });
                }
              })
            } else {
              return false;
            }
          });
        }
      }
    }
</script>

<style scoped>

</style>
