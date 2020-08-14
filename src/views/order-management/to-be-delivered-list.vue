<template>
  <div class="app-container">
    <order-list :page-type="1" />
  </div>
</template>

<script>
import OrderList from './components/OrderList'

export default {
  name: 'ToBeDeliveredList',
  components: { OrderList },
  methods: {

  }
}
</script>
