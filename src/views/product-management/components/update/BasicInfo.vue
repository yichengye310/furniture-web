<template>
  <div class="app-container" style="min-width: 1250px">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-form-item label="产品分类" :required="true">
          <el-select v-model="levelTwoCategoryID" placeholder="请选择二级分类" >
            <el-option
              v-for="item in categoryLevelTwoList"
              :key="item.categoryID"
              :label="item.categoryName"
              :value="item.categoryID">
            </el-option>
          </el-select>
          <el-select v-model="levelThreeCategoryID" placeholder="请选择三级分类" >
            <el-option
              v-for="item in categoryLevelThreeList"
              :key="item.categoryID"
              :label="item.categoryName"
              :value="item.categoryID">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="产品编号" >
            <el-input v-model="form.product.productCode" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="产品标题" :required="true">
            <el-input v-model="form.product.productName" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="产品简介" :required="true">
            <el-input type="textarea" v-model="form.product.productDescription" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" >
          <el-form-item label="产品视频" :required="true">
            <el-row>
              <el-col :span="4" >
                <update-video :img-type="10" :img-url="form.product.titleVideo"  @add-image="addVideo($event)" @remove-image="removeVideo($event)"/>
              </el-col>
              <el-col :span="16">
                <span style="color: #c2c2c2;line-height: 178px">*建议尺寸800*800像素,大小均不超过10M</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="24" >
          <el-form-item label="产品主图" :required="true">
            <el-row>
              <el-col :span="4" >
                <update-img :img-type="1" :img-url="form.product.titleImg"  @add-image="addImage($event)" @remove-image="removeImage($event)"/>
              </el-col>
              <el-col :span="16">
                <span style="color: #c2c2c2;line-height: 178px">*建议尺寸800*800像素,大小均不超过3M</span>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="产品类型" :required="true">
            <el-radio-group v-model="form.product.isSpecialGoods " >
              <el-radio :label="2" >普通产品</el-radio>
              <el-radio :label="1">会员专属产品</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="售后服务" :required="true" >
            <span style="font-size: 13px;color:#8b8b8b ">从家具产品交货之日起,严格执行国家有关家具产品的三包规定执行,提供优质的售后服务。<br>
            (定制产品不退还,请联系客服进行维修)</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="上架时间" :required="true" >
            <el-radio-group v-model="form.product.state" >
              <el-radio :label="1" >立即上架</el-radio>
              <el-radio :label="3">放入仓库</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="10">
          <el-form-item >
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="onSubmit" >提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { addProduct,productDetail,updateProduct } from '@/api/product'
  import { categoryLevelTwoListByPage } from '@/api/category'
  import UpdateImg from '../UpdateImg'
  import UpdateImgForStandards from '../UpdateImgForStandards'
  import Tinymce from '@/components/Tinymce'
  import UpdateVideo from '../UpdateVideo'
  export default {
    components: { UpdateVideo, UpdateImg,UpdateImgForStandards,Tinymce },

    data() {
      return {
        imgs:[],
        content:
          ``,
        proID:undefined,
        levelTwoCategoryID:"",
        levelThreeCategoryID:"",
        categoryLevelTwoList:[],
        categoryLevelThreeList:[],
        standardList:[
          {
            bandPrice: "",
            productStandardsColours: [{
              tempId:"tempId"+new Date().getTime(),
              colourImage: "",
              colourName: "",
              productStockNum: "",
              state: 1},],
            standard: "",
            state: 1,
            tradePrice: ""}
        ],
        form: {
          product: {
            productCode:"",
            state:1,
            levelThreeCategoryID:"",
            levelTwoCategoryID:"",
            levelOneCategoryID:1,
            productName:"",
            productDescription:"",
            isSpecialGoods:2,
            titleImg:"",
          titleVideo: ""},
          productDetail:{appDescription:""},
          commonImages:[],
          productStandardsDTOS: [{
            bandPrice: "",
            productStandardsColours: [{
              colourImage: "",
              colourName: "默认",
              productStockNum: "",
              state: 1}],
            standard: "",
            state: 1,
            tradePrice: ""}
          ]
        }
      }
    },
    props:{
      productId: {
        type: Number,
        default: undefined
      },
    },
    watch: {
      levelTwoCategoryID: {
        handler(newName, oldName) {
          if(newName!=oldName){
            this.form.product.levelTwoCategoryID=newName;
            this.getLevelTwoCategoryIDList(newName);
          }
          // ...
        },
        immediate: true
      },
      levelThreeCategoryID: {
        handler(newName, oldName) {
          if(newName!=oldName){
            this.form.product.levelThreeCategoryID=newName;
          }
          // ...
        },
        immediate: true
      }
    },
    created() {
      this.getCategoryLevelTwoListByPage()
      this.getProductDetail()
    },
    methods: {
      //返回上一层
      back(){
        this.$emit('back')
        // this.$router.go(-1);//返回上一层
      },
      //获取产品详情
      getProductDetail(){
        let queryParam={productID:this.productId}
        productDetail(queryParam).then(response => {
          if(response.status==1){
            this.form.product=response.data;
            this.form.product.productDetail = undefined;
            this.form.product.commonImage= undefined;
            this.form.product.productStandards= undefined;
            this.form.product.productComments= undefined;
            this.levelTwoCategoryID=response.data.levelTwoCategoryID;
            this.getLevelTwoCategoryIDList(this.levelTwoCategoryID);
            this.levelThreeCategoryID=response.data.levelThreeCategoryID;
          }
        })
      },
      onSubmit() {
        if(this.imgs!=null&&this.imgs.length!=0){
          this.imgs.forEach(item =>{
            if(item.imgType==1){
              this.form.product.titleImg=item.imageUrl;
            }
          })
        }

        if(this.form.product.titleImg==null||this.form.product.titleImg==""){
          this.$message({
            type: 'danger',
            message: "请上传产品主图！！"
          });
          return;
        }
        updateProduct(this.form.product).then(response => {
          if(response.status==1){
            this.$message({
              type: 'success',
              message: '修改成功！'
            });
          }else{
            this.$message({
              type: 'danger',
              message: response.message
            });
          }
        })
      },
      getLevelTwoCategoryIDList(levelOneCategoryID){
        if(this.categoryLevelTwoList!=null&&this.categoryLevelTwoList.length>0){
          this.categoryLevelTwoList.forEach(item => {
            if(item.categoryID==levelOneCategoryID){
              this.categoryLevelThreeList=item.productCategoryLevelThrees;
              return
            }
          })

        }
      },
      getCategoryLevelTwoListByPage() {
        categoryLevelTwoListByPage().then(response => {
          if(response.data.list.length>0){
            this.categoryLevelTwoList=response.data.list;
          }
          this.getProductDetail();

        })
      },
      addStandard() {
        this.standardList.push({
          bandPrice: '',
          productStandardsColours: [{
            tempId:"tempId"+new Date().getTime(),
            colourImage: "",
            colourName: "默认",
            productStockNum: '',
            state: 1}],
          standard: "",
          state: 1,
          tradePrice: ''
        });
      },
      addProductStandardsColour(item) {
        const productStandardsColour = {
          tempId:"tempId"+new Date().getTime(),
          colourImage: "",
          colourName: "默认",
          productStockNum: '',
          state: 1
        }
        if(item.productStandardsColours!=null){
          item.productStandardsColours.push(productStandardsColour);
        }else{
          item.productStandardsColours=[productStandardsColour]
        }
      },
      removeProductStandardsColour(item,index) {
        if(item.productStandardsColours.length<=1){
          this.$message.error('至少保留一种规格颜色!');
        }else{
          item.productStandardsColours.splice(index,1)
        }
      },
      removeStandard(index) {
        if(this.standardList.length<=1){
          this.$message.error('至少保留一种规格颜色!');
        }else{
          this.standardList.splice(index,1)
        }
      },
      addStandardsColourImage(img){
        this.standardList.forEach((standard, index) => {
          standard.productStandardsColours.forEach((productStandardsColour, index) => {
            if(productStandardsColour.tempId==img.tempId){
              productStandardsColour.colourImage=img.imageUrl
              return true
            }
          })
        })
        console.log("ss",this.standardList)
      },
      addImage(img){
        this.imgs.push(img)
        console.log("ss",this.imgs)
      },
      removeImage(img){
        var index = this.imgs.findIndex(item =>{
          if(item.imageUrl==img.imageUrl){
            return true
          }
        })
        this.imgs.splice(index,1)
        console.log("ss",this.imgs)
      },
      addVideo(video) {
        console.log(video)
        this.form.product.titleVideo = video.imageUrl;

        // this.imgs[img.id - 1] = img
        // console.log('ss', img.id - 1, this.imgs)
      },
      removeVideo(video) {
        console.log(video)
        this.form.product.titleVideo = '';
        // this.imgs[img.id - 1] = img
        // console.log('ss', img.id - 1, this.imgs)
      }
    }
  }
</script>
