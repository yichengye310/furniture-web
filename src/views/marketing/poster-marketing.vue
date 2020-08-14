<template>
  <div class="app-container">
    <product-list :flag="2" />
  </div>
</template>

<script>
import ProductList from './components/product/ProductList'

export default {
  name: 'PosterMarketing',
  components: { ProductList }
}
</script>
