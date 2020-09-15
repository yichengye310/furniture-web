<template>
  <div class="app-container">
    <el-tabs @tab-click="" type="card">
      <el-tab-pane label="直播列表">
        <live-list></live-list>
      </el-tab-pane>
      <el-tab-pane v-waves label="商家" v-if="permission.indexOf('LiveList234')!=-1">
        <live-authorize :userType="4"></live-authorize>
      </el-tab-pane>
      <el-tab-pane v-waves label="经销商"  v-if="permission.indexOf('LiveList345')!=-1">
        <live-authorize :userType="3"></live-authorize>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import waves from '@/directive/waves' // waves directive
  import Cookies from 'js-cookie'
  import LiveAuthorize from './live-authorize'
  import LiveList from './live-list'

  export default {
    name: 'live-center',
    components: { LiveList, LiveAuthorize, Pagination },
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
    methods: {}
  }
</script>

<style scoped>

</style>
