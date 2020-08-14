<template>
  <div class="app-container">
    <el-tabs v-model="activeTap"  style="height: 100%;" @tab-click="handleClick" >
      <el-tab-pane label="编辑基本信息" name="first">
        <basic-info :product-id="productID" @back="back"></basic-info>
      </el-tab-pane>
      <el-tab-pane label="编辑产品图片" name="second">
        <product-img :product-id="productID" @back="back"></product-img>
      </el-tab-pane>
      <el-tab-pane label="编辑产品规格" name="third">
        <product-standard :product-id="productID" @back="back"></product-standard>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicInfo from './components/update/BasicInfo'
import {getParamer} from '@/utils/tool'
import ProductImg from "./components/update/ProductImg";
import ProductStandard from "./components/update/ProductStandard";

export default {
  name: 'Update',
  components: {ProductStandard, ProductImg, BasicInfo },
  data(){
    return {
      productID:getParamer("productID")!=undefined?Number(getParamer("productID")):undefined,
      pageNo: getParamer("pageNo")!=undefined?Number(getParamer("pageNo")):1,
      pageSize: getParamer("pageSize")!=undefined?Number(getParamer("pageSize")):10,
      activeTap:'first'
    }
  },
  methods: {
    back(){
      window.location.href='#/product-management/product-warehouse?pageNo='+this.pageNo+'&pageSize='+this.pageSize
    },
    handleClick(tab, event){
      console.log(tab, event);
    }
  }
}
</script>
