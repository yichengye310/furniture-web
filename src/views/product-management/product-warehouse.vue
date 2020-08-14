<template>
  <product-list :page-type="'ProductWarehouse'" ></product-list>
</template>

<script>
  import ProductList from './components/ProductList'

  export default {
    name: 'ProductWarehouse',
    components: { ProductList },

  }
</script>
