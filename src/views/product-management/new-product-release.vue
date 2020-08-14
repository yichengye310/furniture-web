<template>
  <div class="app-container" style="min-width: 1250px">
    <product-detail :page-type="'new'" @back="back"></product-detail>
  </div>
</template>

<script>

import ProductDetail from './components/ProductDetail'
export default {
  name: 'NewProductRelease',
  components: { ProductDetail },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {
    back(){
      window.location.href='#/product-management/product-warehouse'
    },

  }
}
</script>
