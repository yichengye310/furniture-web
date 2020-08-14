<template>
  <div class="app-container" style="min-width: 1250px">
    <coupon-detail :page-type="'update'" :coupon-id="couponID" @back="back"></coupon-detail>
  </div>
</template>

<script>

  import CouponDetail from './components/coupon/CouponDetail'
  import {getParamer} from '@/utils/tool'

  export default {
    name: 'UpdateCoupon',
    components: { CouponDetail },
    data() {
      return {
        couponID:getParamer("couponID")!=undefined?Number(getParamer("couponID")):undefined,
      }
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
