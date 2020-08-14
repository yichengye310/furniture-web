<template>
  <div class="app-container">
    <order-list :page-type="99" />
  </div>
</template>

<script>
import OrderList from './components/OrderList'

export default {
  name: 'OrderSelectList',
  components: { OrderList },
  methods: {

  }
}
</script>
