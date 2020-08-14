<template>
  <div class="app-container">
    <order-list :page-type="3" />
  </div>
</template>

<script>
import OrderList from './components/OrderList'

export default {
  name: 'CompletedList',
  components: { OrderList },
  methods: {

  }
}
</script>
