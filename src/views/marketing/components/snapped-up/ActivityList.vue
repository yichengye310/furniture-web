<template>
  <div class="app-container">
    <div class="filter-container">
<!--            <el-select v-model="listQuery.state" placeholder="状态" clearable class="filter-item" style="width: 130px">-->
<!--              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
<!--            </el-select>-->

<!--      <el-input v-model="listQuery.orderID" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-input v-model="listQuery.phoneNumber" placeholder="联系方式" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->

      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        查询-->
<!--      </el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" v-if="permission.indexOf('AddSnappedUp524')!=-1">
        添加限时抢购
      </el-button>
      <!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        Export-->
      <!--      </el-button>-->
      <!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--        reviewer-->
      <!--      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >

            <el-table-column label="产品图片" width="120px"  align="center">
              <template slot-scope="{row}">
                <img :src="row.activityImg" style="width: 100px;height: 100px"/>
              </template>
            </el-table-column>
            <el-table-column label="产品标题" min-width="150px">
              <template slot-scope="{row}">
                <span  >{{ row.productName }}</span>
              </template>
            </el-table-column>
      <el-table-column label="优惠方式"  min-width="100px" align="center">
        <template slot-scope="{row}">
          <span >{{ row.discountWay ==1 ?'满减':'折扣' }}</span>
        </template>
      </el-table-column>


      <el-table-column label="限购数量"  prop="limitNum" align="center" min-width="95" >
        <template slot-scope="{row}">
          <span v-if="row.limitNum"  >{{ row.limitNum  }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" min-width="180" >
        <template slot-scope="{row}">
          <span v-if="row.startTime" >{{  row.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" min-width="180" >
        <template slot-scope="{row}">
          <span v-if="row.endTime" >{{  row.endTime  | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width" >
        <template slot-scope="{row}">
          <el-button type="primary" v-if="permission.indexOf('EditPanicBuying52414')!=-1" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button  size="mini" type="danger" @click="handleModifyStatus(row)" v-if="permission.indexOf('DeletePanicBuying52574')!=-1">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { productLimitedTimeListByPage,productLimitedTimeDelete } from '@/api/marketing'
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import waves from '@/directive/waves' // waves directive
  import Cookies from "js-cookie";


  export default {
    components: { Pagination },
    directives: { waves },
    props: {
      pageType: {
        type: Number,
        default: 1
      },
    },
    directives: { waves },
    data() {
      return {
        permission:[],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          type: 0,
          productCode: undefined,//选填，产品编号模糊查询
          productName: undefined,//选填，产品标题模糊查询
          discountWay: undefined,//选填，1满减(如：满3000减50) 2折扣（如：原价3000，折后价2500）
          activeObject: undefined,//必填，活动对象，1.全部用户 2普通用户 3会员用户
          productDescription: undefined//选填，产品简介模糊查询
        },
      }
    },
    created() {
      // this.permission=JSON.parse(Cookies.get("permission"));
      this.permission=JSON.parse(sessionStorage.getItem("permission"));
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        productLimitedTimeListByPage(this.listQuery).then(response => {
          console.log(response.data)
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      handleModifyStatus(row) {
        var that=this;

        this.$confirm('此操作删除产品【'+row.productName+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            productLimitedTimeID : row.limitedTimeProductID,
          }
          productLimitedTimeDelete(param).then(response => {
            if(response.status==1){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              that.getList();
            }else{
              this.$message({
                type: 'danger',
                message: response.message
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      handleCreate() {
        window.location.href="#/marketing/add-snapped-up"
      },
      handleUpdate(row) {
        window.location.href="#/marketing/update-snapped-up?id="+row.limitedTimeProductID
      }
    }
  }
</script>
