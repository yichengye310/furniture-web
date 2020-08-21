<template>
  <div>
<!--    <el-input @keyup.enter.native="handleFilter"-->
<!--              class="filter-item"-->
<!--              placeholder="直播标题" style="width: 200px;"-->
<!--              v-if="permission.indexOf('LiveList123')!=-1"-->
<!--              v-model="listQuery.phoneNumber"/>-->
<!--    <el-button @click="handleFilter" class="filter-item"-->
<!--               icon="el-icon-search"-->
<!--               type="primary" v-if="permission.indexOf('LiveList123')!=-1" v-waves>-->
<!--      查询-->
<!--    </el-button>-->
    <el-table
      :data="list"
      fit
      highlight-current-row
      style="width: 100%"
      v-loading="listLoading"
    >
      <el-table-column align="center" label="直播编号" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播标题" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否开启定位" min-width="120px">
        <template slot-scope="{row}">
          <span>{{(row.live || {}).isOpenLocation === 1? '是': '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播方式" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ (row.live || {}).liveWay === 1? '视频直播': (row.live || {}).liveWay === 2? '录屏直播': '' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ (row.live || {}).userType | userTypeFilter }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="联系方式" min-width="150px">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ '' }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" label="直播时间" min-width="180px">
        <template slot-scope="{row}">
          <span>{{ row.ctime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播商品" min-width="150px">
        <template slot-scope="{row}">
          <div>限时抢购 {{JSON.parse((row.live || {}).limitProducts || "[]").length }}</div>
          <div>普通商品 {{JSON.parse((row.live || {}).products || "[]").length }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="直播状态" min-width="100px">
        <template slot-scope="{row}">
          <el-tag light size="mini" type="success" v-if="row.status === 1">{{'直播中'}}</el-tag>
          <el-tag light size="mini" type="info" v-else-if="row.status === 0">{{ '已结束' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作" min-width="120">
        <template slot-scope="{row}">
          <el-button @click="handleUpdate(row)" plain size="small" type="info"
                     v-if="permission.indexOf('ViewLiveProducts534')!=-1">
            查看商品
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :limit.sync="listQuery.records" :page.sync="listQuery.pageNo" :total="totalRecords"
                @pagination="getList"
                v-show="totalRecords>0"/>

    <el-dialog :visible.sync="dialogVisible" width="1000px" >
      <el-table
        :data="limitProducts"
        fit
        highlight-current-row
        v-loading="listLoading"
      >
        <template slot="empty">
          <span>无限时抢购</span>
        </template>
        <el-table-column align="center" label="产品类型" min-width="150px">
          <template slot-scope="{row}">
            <span>限时抢购</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品图片" min-width="150px">
          <template slot-scope="{row}">
            <!-- <img :src="row.titleImg" style="width: 5rem; height: 5rem;" alt/> -->
            <img :src="row.activityImg" style="width: 5rem; height: 5rem;" alt/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品标题" min-width="150px">
          <template slot-scope="{row}">
            <span>{{row.productName || ''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格" min-width="150px">
          <template slot-scope="{row}">
            <!-- <span>{{(row.lowPrice || 0) * .01}}元</span> -->
            <span>{{(row.productLimitedTimeStandardsDTOS[0].originalPrice || 0) * .01}}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存" min-width="150px">
          <template slot-scope="{row}">
            <!-- <span>{{row.productStockNum || 0}}</span>
            <span>{{row.productStockNum || 0}}</span> -->
            <span>{{row.limitNum || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="products"
        fit
        highlight-current-row
        v-loading="listLoading"
      >
        <template slot="empty">
          <span>无普通商品</span>
        </template>
        <el-table-column align="center" label="产品类型" min-width="150px">
          <template slot-scope="{row}">
            <span>普通商品</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品图片" min-width="150px">
          <template slot-scope="{row}">
            <img :src="row.titleImg"  style="width: 5rem; height: 5rem;"  alt/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品标题" min-width="150px">
          <template slot-scope="{row}">
            <span>{{row.productName || ''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格" min-width="150px">
          <template slot-scope="{row}">
            <span>{{(row.lowPrice || 0) * .01}}元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存" min-width="150px">
          <template slot-scope="{row}">
            <span>{{row.productStockNum || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import { parseTime } from '@/utils';
  import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
  import waves from '@/directive/waves'; // waves directive
  import Cookies from 'js-cookie';
  import { getLiveList, getLiveProducts } from '@/api/live';

  export default {
    name: 'live-list',
    components: { Pagination },
    directives: { waves },
    filters: {
      userTypeFilter(status) {
        const statusMap = {
          1: '普通用户',
          2: '会员',
          3: '经销商',
          4: '商家'
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        permission: [],
        listQuery: {
          // status: 01
        },
        listLoading: false,
        totalRecords: 0,
        list: [],
        dialogVisible: false,
        limitProducts: [],
        products: []
        //userType: 4 // 商家4，经销商3
      }
    },
    created() {
      this.permission = JSON.parse(Cookies.get('permission'))
      this.listQuery.pageNo = 1;
      this.getList();
    },
    mounted() {
    },
    methods: {
      getList() {
        this.listLoading = true
        this.listQuery.sort = 0;
        if (!this.listQuery.phoneNumber) {
          delete this.listQuery.phoneNumber
        }
        getLiveList(this.listQuery).then(response => {
          console.log(response.data)
          this.list = response.data.ret.list
          this.totalRecords = response.data.ret.totalRecords
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1;
        this.getList();
      },
      handleUpdate(row) {
        getLiveProducts({cid: row.cid})
          .then((res) => {
            console.log(res.data)
            if (res.status === 1) {
              this.limitProducts = res.data.limitProducts;
              this.products = res.data.products;
            }
          })
          .catch(() => {

          })
        this.dialogVisible = true;
      },
    }
  }
</script>

<style scoped>

</style>
