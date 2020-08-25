<template>
  <div class="app-container">
    <h3>{{roleName}}</h3>
    <el-divider></el-divider>
    <el-checkbox-group v-model="checkList">
      <el-row v-for="(temp,index) in tempList" :key="index">
        <el-col :span="4">
          <!-- <el-checkbox :label="temp.name + '(' +index+ ')'" @change="chooseTemp(temp,index)"></el-checkbox> -->
          <el-checkbox :label="temp.code" @change="select(temp.code, temp.children)">{{temp.name}}</el-checkbox>
        </el-col>
        <el-col :span="20">
          <el-row
            v-for="(tempChild,childIndex) in temp.children"
            v-if="temp.children.length>0"
            :key="childIndex"
          >
            <el-col :span="4">
              <!-- <el-checkbox
                :label="tempChild.name+ '('+index+''+childIndex+')'"
                @change="chooseTempChild(temp,tempChild,index,childIndex)"
              ></el-checkbox> -->
              <el-checkbox
                :label="tempChild.code"
                @change="select(tempChild.code, tempChild.children)"
              >{{tempChild.name}}</el-checkbox>
            </el-col>
            <el-col :span="20">
              <el-row>
                <!-- <el-checkbox
                  :label="tempGrandson.name+ '(' +childIndex+''+grandsonIndex+ ')'"
                  @change="chooseTempGrandson($event, temp,tempChild,index,tempGrandson,childIndex,grandsonIndex)"
                  v-for="(tempGrandson,grandsonIndex) in tempChild.children"
                  v-if="tempChild.children.length>0"
                  :key="grandsonIndex"
                ></el-checkbox> -->
                <el-checkbox
                  :label="tempGrandson.code"
                  @change="select(tempGrandson.code, [])"
                  v-for="(tempGrandson,grandsonIndex) in tempChild.children"
                  v-if="tempChild.children.length>0"
                  :key="grandsonIndex"
                >{{tempGrandson.name}}</el-checkbox>
              </el-row>
            </el-col>
            <el-divider></el-divider>
          </el-row>
        </el-col>
        <el-divider></el-divider>
      </el-row>

      <!--      <el-checkbox label="复选框 B"></el-checkbox>-->
      <!--      <el-checkbox label="复选框 C"></el-checkbox>-->
      <!--      <el-checkbox label="禁用" disabled></el-checkbox>-->
      <!--      <el-checkbox label="选中且禁用" disabled></el-checkbox>-->
    </el-checkbox-group>
    <el-row>
      <el-col :offset="10" :span="24">
        <el-button @click="back">返回</el-button>
        <el-button @click="onSubmit" type="primary">提交</el-button>
        <!-- <el-button @click="check">检查数据</el-button> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getParamer } from "@/utils/tool";
import { getRoute, updateRole } from "@/api/role";
import CODE from "@/utils/common";

export default {
  name: "RoleAuthorize",
  data() {
    return {
      roleID:
        getParamer("roleID") != undefined
          ? Number(getParamer("roleID"))
          : undefined,
      roleName:
        getParamer("roleName") != undefined
          ? decodeURIComponent(getParamer("roleName"))
          : undefined,
      tempList: CODE.permission(),
      role: {},
      checkList: [],
      permission: [],
    };
  },
  created() {
    getRoute({ roleID: this.roleID }).then((response) => {
      this.role = response.data;
      if (
        this.role.permissionContent != null &&
        this.role.permissionContent != ""
      ) {
        var p = JSON.parse(this.role.permissionContent);
        this.checkList = p.checkList;
        this.permission = p.permission;
      }
    });
  },
  mounted() {
    this.roleID =
      getParamer("roleID") != undefined
        ? Number(getParamer("roleID"))
        : undefined;
    this.roleName =
      getParamer("roleName") != undefined
        ? decodeURIComponent(getParamer("roleName"))
        : undefined;
  },
  methods: {
    //返回上一层
    back() {
      this.$router.go(-1); //返回上一层
    },

    onSubmit() {
      var p = {
        checkList: this.checkList,
        permission: this.checkList,
      };
      this.role.permissionContent = JSON.stringify(p);
      updateRole(this.role).then((response) => {
        if (response.status == 1) {
          this.$message({
            type: "success",
            message: "授权成功！",
          });
          this.back();
        } else {
          this.$message({
            type: "danger",
            message: response.message,
          });
        }
      });
    },

    chooseTemp(temp, index) {
      if (this.permission.indexOf(temp.code) == -1) {
        if (temp.children.length > 0) {
          temp.children.forEach((tempChild, childIndex) => {
            if (this.permission.indexOf(tempChild.code) == -1) {
              this.permission.push(tempChild.code);
              this.checkList.push(
                tempChild.name + "(" + index + "" + childIndex + ")"
                // tempChild.name
              );
            }
            if (tempChild.children.length > 0) {
              tempChild.children.forEach((tempGrandson, grandsonIndex) => {
                if (this.permission.indexOf(tempGrandson.code) == -1) {
                  this.permission.push(tempGrandson.code);
                  this.checkList.push(
                    tempGrandson.name +
                      "(" +
                      childIndex +
                      "" +
                      grandsonIndex +
                      ")"
                    // tempGrandson.name
                  );
                }
              });
            }
          });
        }
        this.checkList.push(temp.name + "(" + index + ")");
        // this.checkList.push(temp.name);
        this.permission.push(temp.code);
        console.log(1, this.checkList, this.permission);
      } else {
        if (temp.children.length > 0) {
          temp.children.forEach((tempChild, childIndex) => {
            if (this.permission.indexOf(tempChild.code) != -1) {
              this.checkList.splice(
                this.checkList.indexOf(
                  tempChild.name + "(" + index + "" + childIndex + ")"
                  // tempChild.name
                ),
                1
              );
              this.permission.splice(
                this.permission.indexOf(tempChild.code),
                1
              );
            }
            if (tempChild.children.length > 0) {
              tempChild.children.forEach((tempGrandson, grandsonIndex) => {
                if (this.permission.indexOf(tempGrandson.code) != -1) {
                  this.permission.splice(
                    this.permission.indexOf(tempGrandson.code),
                    1
                  );
                  this.checkList.splice(
                    this.checkList.indexOf(
                      tempGrandson.name +
                        "(" +
                        childIndex +
                        "" +
                        grandsonIndex +
                        ")"
                      // tempGrandson.name
                    ),
                    1
                  );
                }
              });
            }
          });
        }
        this.permission.splice(this.permission.indexOf(temp.code), 1);
        this.checkList.splice(
          this.checkList.indexOf(temp.name + "(" + index + ")"),
          // this.checkList.indexOf(temp.name),
          1
        );
      }
      console.log(2, this.checkList, this.permission);
    },
    chooseTempChild(temp, tempChild, index, childIndex) {
      if (this.permission.indexOf(temp.code) == -1) {
        this.permission.push(temp.code);
        this.checkList.push(temp.name + "(" + index + ")");
        // this.checkList.push(temp.name);
      }
      if (this.permission.indexOf(tempChild.code) == -1) {
        this.permission.push(tempChild.code);
        if (tempChild.children.length > 0) {
          tempChild.children.forEach((tempGrandson, grandsonIndex) => {
            if (this.permission.indexOf(tempGrandson.code) == -1) {
              this.permission.push(tempGrandson.code);
              this.checkList.push(
                tempGrandson.name + "(" + childIndex + "" + grandsonIndex + ")"
                // tempGrandson.name
              );
            }
          });
        }
      } else {
        this.permission.splice(this.permission.indexOf(tempChild.code), 1);
        if (tempChild.children.length > 0) {
          tempChild.children.forEach((tempGrandson, grandsonIndex) => {
            if (this.permission.indexOf(tempGrandson.code) != -1) {
              this.permission.splice(
                this.permission.indexOf(tempGrandson.code),
                1
              );
              this.checkList.splice(
                this.checkList.indexOf(
                  tempGrandson.name +
                    "(" +
                    childIndex +
                    "" +
                    grandsonIndex +
                    ")"
                  // tempGrandson.name
                ),
                1
              );
            }
          });
        }
      }
    },
    chooseTempGrandson(
      ev,
      temp,
      tempChild,
      index,
      tempGrandson,
      childIndex,
      grandsonIndex
    ) {
      console.log(ev, temp, tempChild, index, tempGrandson, childIndex, grandsonIndex);
      if (ev) {
        if (this.permission.indexOf(tempGrandson.code) == -1) {
          this.permission.push(tempGrandson.code);
          if (this.permission.indexOf(tempChild.code) == -1) {
            this.permission.push(tempChild.code);
            this.checkList.push(
              tempChild.name + "(" + index + "" + childIndex + ")"
              // tempChild.name
            );
          }
          if (this.permission.indexOf(temp.code) == -1) {
            this.permission.push(temp.code);
            this.checkList.push(temp.name + "(" + index + ")");
            // this.checkList.push(temp.name);
          }
        }
      } else {
        this.permission.splice(this.permission.indexOf(tempGrandson.code), 1);
        this.checkList.splice(
          this.checkList.indexOf(temp.name + "(" + index + ")"),
          // this.checkList.indexOf(temp.name),
          1
        );
      }
      console.log(this.checkList, this.permission);
    },

    select (code, children) {
      if (this.checkList.indexOf(code) !== -1) {
        children.forEach(item => {
          this.treeHandle(item, true)
        })
      } else {
        children.forEach(item => {
          this.treeHandle(item, false)
        })
      }
      this.check()
    },
    // true 增 false 减
    treeHandle (obj, flag) {
      if (flag) {
        if (obj.children && obj.children.length > 0) {
          obj.children.forEach(item => {
            this.treeHandle(item, flag)
          })
        } else {
          if (this.checkList.indexOf(obj.code) === -1) {
            this.checkList.push(obj.code)
          }
        }
      } else {
        if (obj.children && obj.children.length > 0) {
          obj.children.forEach(item => {
            this.treeHandle(item, flag)
          })
        } else {
          console.log(obj.name)
          if (this.checkList.indexOf(obj.code) !== -1) {
            this.checkList.splice(this.checkList.indexOf(obj.code), 1)
          }
        }
      }
    },
    check () {
      this.tempList.forEach((item, index) => {
        this.checkData(item)
      })
    },
    checkData (obj) {
      let count = 0
      let list = obj.children
      if (list && list.length) {
        list.forEach((item, number) => {
          this.checkData(item)
          if (this.checkList.indexOf(item.code) !== -1) {
            count++
          }
        })
        // if (count === list.length) { // 全部选中 分组则选中
        if (count > 0) { // 只要选中一个 分组则选中
          if (this.checkList.indexOf(obj.code) === -1) this.checkList.push(obj.code)
        } else {
          if (this.checkList.indexOf(obj.code) !== -1) this.checkList.splice(this.checkList.indexOf(obj.code), 1)
        }
      }
      this.checkList = this.checkList.concat()
    }
  },
};
</script>

<style scoped>
</style>
