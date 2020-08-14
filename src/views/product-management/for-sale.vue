<template>
  <product-list :page-type="'ForSale'" ></product-list>
</template>

<script>
  import ProductList from './components/ProductList'

  export default {
    name: 'ForSale',
    components: { ProductList },

  }
</script>
