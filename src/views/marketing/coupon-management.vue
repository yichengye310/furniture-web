<template>
  <div class="app-container">
    <el-button @click="handleCreate" class="filter-item"
               icon="el-icon-edit" style="margin-bottom: .8rem;" type="primary"
               v-if="permission.indexOf('addCoupon1234')!=-1">
      创建优惠券
    </el-button>
    <el-tabs @tab-click="" type="card">
      <el-tab-pane label="店铺活动优惠券">
        <coupon-list :coupon-type="1"></coupon-list>
      </el-tab-pane>
      <el-tab-pane label="会员优惠券">
        <coupon-list :coupon-type="2"></coupon-list>
      </el-tab-pane>
      <el-tab-pane label="直播优惠券">
        <coupon-list :coupon-type="3"></coupon-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import waves from '@/directive/waves' // waves directive
  import Cookies from 'js-cookie'
  import CouponList from './components/coupon/CouponList'

  export default {
    name: 'coupon-management',
    components: { CouponList, Pagination },
    directives: { waves },
    data() {
      return {
        permission: [],
        listQuery: {},
        listLoading: false,
        total: 0,
        list: [],
        userType: 4 // 商家4，经销商3
      }
    },
    created() {
      // this.permission = JSON.parse(Cookies.get('permission'))
      this.permission = JSON.parse(sessionStorage.getItem('permission'))
    },
    mounted() {
    },
    methods: {
      handleCreate() {
        window.location.href="#/marketing/add-coupon"
      },
    }
  }
</script>

<style scoped>

</style>
