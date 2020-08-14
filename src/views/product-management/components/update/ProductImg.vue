<template>
  <div class="app-container" style="min-width: 1250px">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="24" >
          <el-form-item label="产品图片" :required="true">
            <el-row>
              <el-col :span="4"  >
                <update-img :img-type="2" :key="timer" :id="1" :img-url="imgs[0].imageUrl"  @add-image="addImage($event)" @remove-image="removeImage($event)"/>
              </el-col>
              <el-col :span="4"  >
                <update-img :img-type="2" :key="timer" :id="2" :img-url="imgs[1].imageUrl"  @add-image="addImage($event)" @remove-image="removeImage($event)"/>
              </el-col>
              <el-col :span="4" >
                <update-img :img-type="2" :key="timer" :id="3" :img-url="imgs[2].imageUrl"  @add-image="addImage($event)" @remove-image="removeImage($event)"/>
              </el-col>
              <el-col :span="4" >
                <update-img :img-type="2" :key="timer" :id="4" :img-url="imgs[3].imageUrl"  @add-image="addImage($event)" @remove-image="removeImage($event)"/>
              </el-col>
            </el-row>
            <span style="color: #c2c2c2">*附件建议尺寸750*500像素,大小均不超过3M</span>
          </el-form-item>
        </el-col>

      </el-row>


      <el-row >
        <el-col :span="20">
          <el-form-item label="产品详情" :required="true" >
            <tinymce v-model="form.productDetail.appDescription" :height="300"  />
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
  import { updateProductImg,productDetail } from '@/api/product'
  import UpdateImg from '../UpdateImg'
  import Tinymce from '@/components/Tinymce'
  const imgDemo = [{
    imageUrl:'',
    id:1,
    uid:undefined,
    imgType:2
  },{
    imageUrl:'',
    id:2,
    uid:undefined,
    imgType:2
  },{
    imageUrl:'',
    id:3,
    uid:undefined,
    imgType:2
  },{
    imageUrl:'',
    id:4,
    uid:undefined,
    imgType:2
  }]
  export default {
    components: { UpdateImg,Tinymce },
    inject: ['reload'],
    data() {
      return {
        imgs:imgDemo,
        timer:'',
        content:
          ``,
        form: {
          productID:undefined,
          productDetail:{appDescription:""},
          commonImages:[],
        }
      }
    },
    props:{
      productId: {
        type: Number,
        default: undefined
      },
    },
    created() {
      this.getProductDetail();
    },
    methods: {
      //返回上一层
      back(){
        this.$emit('back')
      },
      //获取产品详情
      getProductDetail(){
        let queryParam={productID:this.productId}
        productDetail(queryParam).then(response => {
          if(response.status==1){
            this.form.productID=this.productId;
            this.form.productDetail=response.data.productDetail;
            this.form.commonImages=response.data.commonImage;
            this.imgs=imgDemo;
            if(this.form.commonImages!=null&&this.form.commonImages.length>0){
              this.form.commonImages.forEach((item,index) =>{
                let img = {
                  imageUrl: item.imageUrl,
                  id: index+1,
                  uid:new Date().getTime()+"tempId",
                  imgType: 2
                }
                this.imgs[index]=img
              })
            }

          }
        })
      },
      onSubmit() {

        this.form.commonImages=[]
        this.imgs.forEach(item =>{
          if(item.imgType==2){
            if(item.imageUrl!=''){
              this.form.commonImages.push({imageUrl:item.imageUrl})
            }
          }
        })
        if(this.form.commonImages.length==0){
          this.$message({
            type: 'danger',
            message: "请上传产品图片！！"
          });
          return;
        }
        // console.log(this.form)
        updateProductImg(this.form).then(response => {
          if(response.status==1){
            this.$message({
              type: 'success',
              message: '修改成功！'
            });
            this.timer = new Date().getTime();
          }else{
            this.$message({
              type: 'danger',
              message: response.message
            });
          }
        })
      },
      addImage(img){
        this.imgs[img.id-1]=img
        console.log("ss",img.id-1,this.imgs)
      },
      removeImage(img){
        this.imgs[img.id-1]=img
        console.log("ss",img.id-1,this.imgs)
      }
    }
  }
</script>
