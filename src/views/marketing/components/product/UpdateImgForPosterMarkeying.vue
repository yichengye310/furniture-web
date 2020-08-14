<template>
  <div class="update-img-for-standards">
    <el-upload
      class="avatar-uploader"
      :action="apiUrl+'/uploadImg'"
      :headers="headers"
      :show-file-list="false"
      :data="data"
      ref="upload"
      :disabled="disabled"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img  v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<style >
  .update-img-for-standards .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .update-img-for-standards .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .update-img-for-standards .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 105px;
    line-height: 105px;
    text-align: center;
  }
  .update-img-for-standards .avatar {
    width: 300px;
    height: 105px;
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
        type: String,
        default: ''
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
    watch: {
      imgUrl: {
        handler(newName, oldName) {
          if(newName!=oldName){
            this.imageUrl=newName;
          }
          // ...
        },
        immediate: true
      }
    },
    data() {
      return {
        apiUrl:CODE.apiUrl(),
        imageUrl: '',
        headers: {
          token : getToken()
        },
        data: {
          imgType:undefined
        }
      };
    },
    created() {
      this.data={
        imgType:this.imgType
      }
      this.imageUrl=this.imgUrl
    },
    methods: {
      handleAvatarSuccess(response, file, fileList) {
        if(response.status!=1){
          this.$message.error(response.message);
        }else{
          this.imageUrl = response.data;
          const img = {
            imageUrl:this.imageUrl,
            tempId:this.id,
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
      }

    }
  }
</script>
