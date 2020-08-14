<template>
  <div class="app-container" style="min-width: 1250px">
    <order-detail :order-id="orderID" ></order-detail>
  </div>
</template>

<script>

import OrderDetail from './components/OrderDetail'
import {getParamer} from '@/utils/tool'
export default {
  name: 'CatOrderDetail',
  components: { OrderDetail },
  data() {
    return {
      orderID:getParamer("orderID")!=undefined?Number(getParamer("orderID")):undefined,
    }
  },
  created() {
    console.log(this.orderID)
  },
  mounted(){
    this.orderID=getParamer("orderID")!=undefined?Number(getParamer("orderID")):undefined;
    console.log(this.orderID)
  },
  methods: {

  }
}
</script>
