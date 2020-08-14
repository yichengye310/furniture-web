<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-row>
          <img :src="productDetail.imageUrl" style="width:200px;height: 70px;background: #2d2f33 " />
        </el-row>
        <el-row>
          <el-button @click="update" v-if="(flag=2&&permission.indexOf('EditPosterMarketing5222')!=-1)||(flag=4&&permission.indexOf('EditHotRecommendation5222')!=-1)">编辑</el-button>
          <el-button type="text" @click="deleteImg()" v-if="(flag=2&&permission.indexOf('DeletePosterMarketing52574')!=-1)||(flag=4&&permission.indexOf('DeleteHotRecommendation52574')!=-1)">删除</el-button>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="productList"
          border
          style="width: 100%">
          <el-table-column label="产品图片" width="125px"  align="center">
            <template slot-scope="{row}">
              <img :src="row.titleImg" style="width: 100px;height: 100px"/>
            </template>
          </el-table-column>

          <el-table-column label="产品标题"  align="center" >
            <template slot-scope="{row}">
              <span>{{ row.productName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="180px"
            align="center"
            label="规格">
            <template slot-scope="{row}">
              <span v-for="item in row.productStandards">{{ item.standard }}<br></span>
            </template>
          </el-table-column>

          <el-table-column
            width="120px"
            align="center"
            label="单价">
            <template slot-scope="{row}">
              <span v-if="row.productStandards">{{ row.productStandards[0].bandPrice / 100 }}</span>
              <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            align="center"
            label="销量">
            <template slot-scope="{row}">
              <span v-if="row.boughtNum">{{ row.boughtNum }}</span>
              <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="备注">
            <template slot-scope="{row}">
              <span v-if="row.userRemark">{{ row.userRemark }}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { deleteCommonImg } from '@/api/product'
import { productLimitedTimeDelete } from '@/api/marketing'
import Cookies from "js-cookie";
export default {
  props:{
    product:{
      type: Object,
      default: undefined
    }
  },
  watch: {
    product: {
      handler(newName, oldName) {
        this.productDetail=newName;
        this.productList=[];
        this.productList.push(newName.product);
        // ...
      },
      immediate: true
    },
  },
  data() {
    return {
      list: 0,
      productDetail: undefined,
      productList:[]
    }
  },
  created(){
    this.permission=JSON.parse(Cookies.get("permission"));
    this.productDetail=this.product;
    this.productList=[];
    this.productList.push(this.product.product);
  },
  mounted() {
    this.permission=JSON.parse(Cookies.get("permission"));
    this.productDetail=this.product;
    this.productList=[];
    this.productList.push(this.product.product);
  },
  methods: {
    update(){
      this.$emit('update',this.productDetail)
    },
    deleteImg(){
      this.$confirm('此操作删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          imageID : this.productDetail.imageID,
        }
        deleteCommonImg(param).then(response => {
          if(response.status==1){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$emit('get-list')
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
          message: '已取消删除'
        });
      });

    }
  }
}
</script>
