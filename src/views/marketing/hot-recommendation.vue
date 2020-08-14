<template>
  <div class="app-container">
    <product-list :flag="4" />
  </div>
</template>

<script>
import ProductList from './components/product/ProductList'

export default {
  name: 'HotRecommendation',
  components: { ProductList }
}
</script>
