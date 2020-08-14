<template>
  <div class="app-container">
    <order-list :page-type="2" />
  </div>
</template>

<script>
import OrderList from './components/OrderList'

export default {
  name: 'ToBeReceivedList',
  components: { OrderList },
  methods: {

  }
}
</script>
