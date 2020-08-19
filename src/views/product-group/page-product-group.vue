<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      :data="tableData"
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.productCategoryLevelThrees"
            :show-header="false"
            style="width: 100%"
          >
            <el-table-column label="分类图片" width="180">
              <template slot-scope="{row}">
                <img :src="row.categoryImg" style="width: 100px;height: 100px" />
              </template>
            </el-table-column>
            <el-table-column prop="categoryName" label="分类名称"></el-table-column>
            <el-table-column width="200px" header-align="center" label="操作">
              <template slot-scope="{row}">
                <el-button
                  type="primary"
                  @click="handleUpdateThree(row,props.row)"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button
                  type="danger"
                  @click="deleteThree(row,props.row)"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column width="250px" header-align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="success" @click="handleCreateThree(row)" icon="el-icon-plus" circle></el-button>
          <el-button type="primary" @click="handleUpdate(row)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" @click="deleteTwo(row)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="type=='new' || type=='add'?'新增类别':'修改类别'"
      :visible.sync="dialogVisible"
      width="500px"
      @close="closeDialog"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="图片" v-if="level==3" required>
          <update-img-for-group
            :imgType="2"
            id="tempId"
            :img-url="form.categoryImg"
            @add-image="addImage($event)"
          ></update-img-for-group>
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="form.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="简称">
          <el-input v-model="form.reducedName"></el-input>
        </el-form-item>
        <el-form-item label="类型" v-if="level==2">
          <el-radio-group v-model="form.hotFlag">
            <el-radio :label="1">非热门</el-radio>
            <el-radio :label="2">热门</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import {
  categoryLevelTwoListByPage,
  categoryLevelTwoAdd,
  categoryLevelThreeAdd,
  deleteCategoryLevelTwo,
  deleteCategoryLevelThree,
  updateCategoryLevelTwo,
  updateCategoryLevelThree,
} from "@/api/category";
import UpdateImgForGroup from "./components/UpdateImgForGroup";
const formTemp = {
  parentID: undefined, //必填，父分类ID  二级分类的parentID为一级分类的categoryID
  categoryName: undefined, //分类名称，不可超过32字
  categoryImg: undefined, //分类名称，不可超过32字
  reducedName: undefined, //选填分类简称
  hotFlag: undefined, //选填，1非热门种类 2热门种类，不填则默认为1
};
export default {
  name: "PageProductGroup",
  components: {
    UpdateImgForGroup,
  },
  data() {
    return {
      tableData: undefined,
      expandRowKeys: [],
      dialogVisible: false,
      level: 2,
      type: "add",
      getRowKeys(row) {
        return row.categoryID;
      },
      form: formTemp,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      categoryLevelTwoListByPage().then((response) => {
        if (response.data.list.length > 0) {
          this.tableData = response.data.list;
        }
      });
    },
    handleCreate() {
      this.type = "add";
      this.level = 2;
      this.form.hotFlag = 1;
      this.dialogVisible = true;
    },
    handleUpdate(row) {
      this.type = "update";
      this.level = 2;
      this.form.hotFlag = 1;
      this.form = row;
      this.dialogVisible = true;
    },
    handleUpdateThree(row, parentRow) {
      this.type = "update";
      this.level = 3;
      this.form = row;
      this.expandRowKeys = [parentRow.categoryID];
      this.form.hotFlag = undefined;
      this.dialogVisible = true;
    },
    handleCreateThree(parentRow) {
      this.type = "add";
      this.level = 3;
      this.expandRowKeys = [parentRow.categoryID];
      this.form.parentID = parentRow.categoryID;
      this.form.hotFlag = undefined;
      this.dialogVisible = true;
    },
    createCategory() {
      if (this.form.categoryName == undefined || this.form.categoryName == "") {
        this.$message({
          type: "danger",
          message: "请填写类别名称!!!",
        });
        return;
      }
      if (this.level == 2 && this.type == "add") {
        this.form.categoryImg = undefined;
        this.form.parentID = 1;
        categoryLevelTwoAdd(this.form).then((response) => {
          if (response.status == 1) {
            this.$message({
              type: "success",
              message: "创建成功！",
            });
            this.dialogVisible = false;
            this.form = formTemp;
            this.getList();
          } else {
            this.$message({
              type: "danger",
              message: response.message,
            });
          }
        });
      } else if (this.level == 2 && this.type == "update") {
        updateCategoryLevelTwo(this.form).then((response) => {
          if (response.status == 1) {
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
            this.dialogVisible = false;
            this.form = formTemp;
            this.getList();
          } else {
            this.$message({
              type: "danger",
              message: response.message,
            });
          }
        });
      } else if (this.level == 3 && this.type == "add") {
        if (this.form.categoryImg == undefined || this.form.categoryImg == "") {
          this.$message({
            type: "danger",
            message: "请选择类别图片!!!",
          });
          return;
        }
        categoryLevelThreeAdd(this.form).then((response) => {
          if (response.status == 1) {
            this.$message({
              type: "success",
              message: "创建成功！",
            });
            this.dialogVisible = false;
            this.form = formTemp;
            this.getList();
          } else {
            this.$message({
              type: "danger",
              message: response.message,
            });
          }
        });
      } else if (this.level == 3 && this.type == "update") {
        if (this.form.categoryImg == undefined || this.form.categoryImg == "") {
          this.$message({
            type: "danger",
            message: "请选择类别图片!!!",
          });
          return;
        }
        updateCategoryLevelThree(this.form).then((response) => {
          if (response.status == 1) {
            this.$message({
              type: "success",
              message: "编辑成功！",
            });
            this.dialogVisible = false;
            this.form = formTemp;
            this.getList();
          } else {
            this.$message({
              type: "danger",
              message: response.message,
            });
          }
        });
      }
    },
    deleteTwo(row) {
      this.$confirm("是否删除类别[" + row.categoryName + "]?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          deleteCategoryLevelTwo({ categoryID: row.categoryID }).then(
            (response) => {
              if (response.status == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                this.getList();
              } else {
                this.$message({
                  type: "danger",
                  message: response.message,
                });
              }
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteThree(row, parentRow) {
      this.$confirm("是否删除类别[" + row.categoryName + "]?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          deleteCategoryLevelThree({ categoryID: row.categoryID }).then(
            (response) => {
              if (response.status == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                this.expandRowKeys = [parentRow.categoryID];
                this.getList();
              } else {
                this.$message({
                  type: "danger",
                  message: response.message,
                });
              }
            }
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
    addImage(img) {
      this.form.categoryImg = img.imageUrl;
    },
    closeDialog() {
      this.form = {
        parentID: undefined, //必填，父分类ID  二级分类的parentID为一级分类的categoryID
        categoryName: undefined, //分类名称，不可超过32字
        categoryImg: undefined, //分类名称，不可超过32字
        reducedName: undefined, //选填分类简称
        hotFlag: undefined, //选填，1非热门种类 2热门种类，不填则默认为1
      };
      this.$refs.form.resetFields();
    },
  },
};
</script>
