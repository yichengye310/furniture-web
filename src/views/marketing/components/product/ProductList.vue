<template>
  <div class="app-container" v-loading="listLoading">
    <el-form ref="form"   label-width="80px" style="min-width: 1400px">
      <el-form-item label="活动信息">
        <poster-marketing-item :product="item" v-for="item in list" @update="update($event)" @get-list="getList"></poster-marketing-item>
        <el-button style="margin-top: 10px" type="primary" @click="add()" v-if="(flag==2&&permission.indexOf('AddPosterMarketing5421')!=-1)||(flag==4&&permission.indexOf('AddHotRecommendation5421')!=-1)">添加</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose">
      <el-form ref="form" :model="productDetail" label-width="80px" v-if="!isSelectProductStatus">
        <el-form-item label="图片">
          <update-img-for-poster-markeying :img-type="4"  :id="productDetail.tempId"  :img-url="productDetail.imageUrl" @add-image="addStandardsColourImage($event)" />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="selectProduct">选择产品</el-button>
        </el-form-item>
        <el-form-item label="产品信息" v-if="productList.length>0">
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
        </el-form-item>
      </el-form>
      <div v-else>
        <div class="filter-container">
          <el-cascader
            clearable class="filter-item"
            placeholder="分类筛选"
            v-model="category"
            :options="categoryLevelTwoList"
            :props="{ expandTrigger: 'hover' }"></el-cascader>
          <el-input v-model="selectProductListQuery.productName" placeholder="产品标题" style="width: 200px;" class="filter-item" @keyup.enter.native="getSelectProductList" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getSelectProductList">
            查询
          </el-button>
        </div>
        <el-table
          :data="selectProductList"
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
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="{row}">
              <el-button type="text" @click="selectProductBtn(row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="selectProductTotal>0" :total="selectProductTotal" :page.sync="selectProductListQuery.pageNo" :limit.sync="selectProductListQuery.pageSize" @pagination="getSelectProductList" />
      </div>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import PosterMarketingItem from './PosterMarketingItem'
  import { addCommonImg, updateCommonImg, commonImageListByPage, getProductListByPage } from '@/api/product'
  import { categoryLevelTwoListByPage } from '@/api/category'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Cookies from "js-cookie";

  import UpdateImgForPosterMarkeying from "./UpdateImgForPosterMarkeying";
  const tempProductDetail = {
    tempId:"tempId"+new Date().getTime(),
    imageID: undefined,
    relationID: undefined,
    imageUrl: "",
    state: 1,
    flag: undefined
  }

  export default {
    components: {PosterMarketingItem,UpdateImgForPosterMarkeying,Pagination },
    directives: { waves },
    props:{
      flag:{
        type: Number,
        default: undefined
      }
    },
    data() {
      return {
        productDetail: tempProductDetail,
        productList:[],
        permission:[],
        selectProductList:[],
        categoryLevelTwoList: null,
        category: [],
        list: undefined,
        total: 0,
        selectProductTotal: undefined,
        isCreate: true,
        dialogVisible: false,
        isSelectProductStatus: false,
        listLoading: true,
        selectProductListQuery:{
          pageNo: 1,
          pageSize: 10,
          state: 1,
          importance: undefined,
          productName: undefined,
          levelTwoCategoryID: undefined,
          levelThreeCategoryID: undefined,
          boughtNumFlag: undefined,
          productStockNumFlag: undefined,
          priceFlag: undefined,
        },
        listQuery:{
          pageNo: 1,
          pageSize: 1000,
          flag:4
        }
      }
    },
    created() {
      this.permission=JSON.parse(Cookies.get("permission"));
      this.listQuery.flag = this.flag
      this.getList();
    },
    mounted() {
      this.permission=JSON.parse(Cookies.get("permission"));
      this.listQuery.flag = this.flag
      this.getList();
    },
    watch: {
      propDialogVisible: {
        handler(newName, oldName) {
          this.dialogVisible=newName;
          // ...
        },
        immediate: true
      },
      dialogVisible:{
        handler(newName, oldName) {
          if(newName){
            this.isSelectProductStatus=false
            this.productDetail.flag=this.flag;
            if(this.productDetail.imageID){
              this.productDetail.tempId="tempId"+new Date().getTime();
              this.productList=[]
              if(this.productDetail.product){
                this.productList.push(this.productDetail.product)
              }
            }else{
              this.productList=[]
              this.productDetail=tempProductDetail;
              this.productDetail.imageUrl=""
              this.productDetail.tempId="tempId"+new Date().getTime();
            }
            this.getSelectProductList();
            this.getCategoryLevelTwoListByPage();
          }else{
            this.productList=[]
            this.productDetail=tempProductDetail;
            this.productDetail.imageUrl=""
          }
          // ...
        },
        immediate: true
      },
    },
    methods: {
      getCategoryLevelTwoListByPage() {
        categoryLevelTwoListByPage().then(response => {
          if(response.data.list.length>0){
            this.categoryLevelTwoList=[]
            for (let i = 0; i <  response.data.list.length; i++) {
              let categoryLevelTwo={
                label:null,
                value:null,
                children:[]
              }
              let children=[]
              categoryLevelTwo.label=response.data.list[i].categoryName
              categoryLevelTwo.value=response.data.list[i].categoryID
              if( response.data.list[i].productCategoryLevelThrees.length>0){
                for(let j = 0; j <  response.data.list[i].productCategoryLevelThrees.length; j++){
                  let categoryLevelTwoChild={
                    label:null,
                    value:null
                  }
                  categoryLevelTwoChild.label=response.data.list[i].productCategoryLevelThrees[j].categoryName
                  categoryLevelTwoChild.value=response.data.list[i].productCategoryLevelThrees[j].categoryID
                  children.push(categoryLevelTwoChild)
                }
              }
              categoryLevelTwo.children=children;
              this.categoryLevelTwoList.push(categoryLevelTwo)
            }
          }
        })
      },
      getSelectProductList() {
        if( this.category.length>0){
          this.selectProductListQuery.levelTwoCategoryID = this.category[0];
          if(this.category.length>1){
            this.selectProductListQuery.levelThreeCategoryID = this.category[1];
          }
        }else{
          this.selectProductListQuery.levelTwoCategoryID = null;
          this.selectProductListQuery.levelThreeCategoryID = null;
        }
        getProductListByPage(this.selectProductListQuery).then(response => {
          console.log(response.data)
          response.data.list.forEach(item => {
            var productStockNum=0;
            if(item.productStandards!=null&&item.productStandards.length>0){
              item.bandPrice=item.productStandards[0].bandPrice
              item.productStandards.forEach(productStandard =>{
                productStandard.productStandardsColours.forEach(productStandardsColour=>{
                  productStockNum=productStockNum+productStandardsColour.productStockNum;
                })
              })
            }else{
              item.bandPrice=0
            }
            item.productStockNum=productStockNum;
          })
          this.selectProductList = response.data.list
          this.selectProductTotal = response.data.total
          this.listLoading = false
        })
      },
      selectProduct() {
        this.isSelectProductStatus = true;
      },
      selectProductBtn(row) {
        this.isSelectProductStatus = false;
        this.productDetail.relationID=row.productID
        this.productList=[]
        this.productList.push(row)
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.getList();
            done();
          })
          .catch(_ => {});
      },

      onSubmit() {
        let productDetail=this.productDetail;
        if(productDetail.imageUrl==undefined||productDetail.imageUrl==""){
          this.$message({
            type: 'danger',
            message: "请选择图片!!!"
          });
          return
        }
        if(productDetail.relationID==undefined||productDetail.relationID==""){
          this.$message({
            type: 'danger',
            message: "请选择产品!!!"
          });
          return
        }
        productDetail.tempId=undefined
        productDetail.product=undefined
        if(this.isCreate){
          addCommonImg(productDetail).then(response => {
            if(response.status==1){
              this.$message({
                type: 'success',
                message: '创建成功！'
              });
              this.getList()
            }else{
              this.$message({
                type: 'danger',
                message: response.message
              });
            }
          })
        }else{
          updateCommonImg(productDetail).then(response => {
            if(response.status==1){
              this.$message({
                type: 'success',
                message: '编辑成功！'
              });
              this.getList()
            }else{
              this.$message({
                type: 'danger',
                message: response.message
              });
            }
          })
        }

      },

      addStandardsColourImage(img){
        if(this.productDetail.tempId==img.tempId){
          this.productDetail.imageUrl=img.imageUrl;
          return true
        }
      },
      add(){
        this.isCreate=true;
        this.dialogVisible=true;
      },
      update(item){
        this.productDetail=item;
        this.dialogVisible=true;
        this.isCreate=false;
      },
      getList() {
        this.listLoading = true
        commonImageListByPage(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
          this.dialogVisible = false
        })
      }
    }
  }
</script>
