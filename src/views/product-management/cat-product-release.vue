<template>
  <div class="app-container" style="min-width: 1250px">
    <product-detail :page-type="'cat'" :product-id="productID" @back="back"></product-detail>
  </div>
</template>

<script>

import ProductDetail from './components/ProductDetail'
import {getParamer} from '@/utils/tool'
export default {
  name: 'CatProductRelease',
  components: { ProductDetail },
  data() {
    return {
      productID:getParamer("productID")!=undefined?Number(getParamer("productID")):undefined,
      pageNo: getParamer("pageNo")!=undefined?Number(getParamer("pageNo")):1,
      pageSize: getParamer("pageSize")!=undefined?Number(getParamer("pageSize")):10,
    }
  },
  created() {
    console.log(this.productID)
  },
  mounted(){
    this.productID=getParamer("productID")!=undefined?Number(getParamer("productID")):undefined;
    console.log(this.productID)
  },
  methods: {
    back(){
      window.location.href='#/product-management/for-sale?pageNo='+this.pageNo+'&pageSize='+this.pageSize
    }
  }
}
</script>
