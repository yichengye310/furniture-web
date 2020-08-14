<template>
  <div class="update-img">
    <el-upload
      class="avatar-uploader"
      :action="apiUrl+'/uploadImg'"
      :show-file-list="false"
      :headers="headers"
      :data="data"
      ref="upload"
      :disabled="disabled"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img @mouseenter="mouseover" @mouseleave="mouseleave" v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div v-if="imageUrl&&!disabled" @click="removeImg" style="position: absolute; top: 148px;height: 30px;width: 178px;background: red;color:#ffffff;text-align: center; cursor: pointer;">删除</div>
  </div>
</template>
<style >
  .update-img .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .update-img .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .update-img .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .update-img .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>
  import CODE from "@/utils/common"
  import { getToken } from '@/utils/auth'
  export default {
    props: {
      imgType: {
        type: Number,
        default: 1
      },
      id: {
        type: Number,
        default: 1
      },
      imgUrl: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        apiUrl:CODE.apiUrl(),
        imageUrl: '',
        imgId: undefined,
        uid:'',
        headers: {
          token : getToken()
        },
        showDelete:false,
        data: {
          imgType:undefined
        }
      };
    },
    watch: {
      imgUrl: {
        handler(newName, oldName) {
          if(newName!=oldName){
            this.imageUrl=newName;
          }
          // ...
        },
        immediate: true
      },
      imgId: {
        handler(newName, oldName) {
          if(newName!=oldName){
            this.imgId=newName;
          }
          // ...
        },
        immediate: true
      }
    },
    created() {
      this.data={
        imgType:this.imgType
      }
      this.imageUrl=this.imgUrl
      this.imgId=this.id
    },
    methods: {
      handleAvatarSuccess(response, file, fileList) {
        if(response.status!=1){
          this.$message.error(response.message);
        }else{
          this.imageUrl = response.data;
          this.uid = file.uid;
          const img = {
            imageUrl:this.imageUrl,
            id:this.imgId,
            uid:this.uid,
            imgType:this.imgType
          }
          this.$emit('add-image',img)
        }
        console.log(file)
      },
      beforeAvatarUpload(file) {

        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 3;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 3MB!');
        }
        // return isJPG && isLt2M;
        return  isLt2M;
      },
      removeImg(){
        this.imageUrl = '';
        const img = {
          imageUrl:this.imageUrl,
          id:this.id,
          uid:this.uid,
          imgType:this.imgType
        }
        this.$emit('remove-image',img)
      },
      mouseover(){
        this.showDelete = true;
      },
      mouseleave(){
        const that =this;
        setTimeout(function (){
          that.showDelete = false;
          },"300");//0.3s

      }
    }
  }
</script>
