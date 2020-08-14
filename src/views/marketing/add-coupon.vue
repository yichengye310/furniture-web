<template>
  <div class="app-container" style="min-width: 1250px">
    <coupon-detail :page-type="'new'" @back="back"></coupon-detail>
  </div>
</template>

<script>

  import CouponDetail from './components/coupon/CouponDetail'

  export default {
    name: 'AddCoupon',
    components: { CouponDetail },
    data() {
      return {}
    },
    created() {
    },
    methods: {
      back() {
        window.location.href = '#/marketing/coupon-list'
      }

    }
  }
</script>
