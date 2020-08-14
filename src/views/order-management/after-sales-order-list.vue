<template>
  <div class="app-container">
    <order-list :page-type="4"/>
  </div>
</template>

<script>
  import OrderList from './components/OrderList'

  export default {
    name: 'AfterSalesOrderList',
    components: { OrderList },
    methods: {}
  }
</script>
