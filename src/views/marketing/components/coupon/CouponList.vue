<template>
  <div>
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input
          @keyup.enter.native="handleFilter"
          class="filter-item"
          placeholder="优惠券名称"
          style="width: 200px;"
          v-if="permission.indexOf('SearchCoupon1234')!=-1"
          v-model="listQuery.couponName"
          v-waves
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          placeholder="开始日期"
          type="date"
          v-if="permission.indexOf('SearchCoupon1234')!=-1"
          v-model="listQuery.couponBeginTime"
          v-waves
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          placeholder="结束日期"
          type="date"
          v-if="permission.indexOf('SearchCoupon1234')!=-1"
          v-model="listQuery.couponEndTime"
          v-waves
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="handleFilter"
          class="filter-item"
          icon="el-icon-search"
          type="primary"
          v-if="permission.indexOf('SearchCoupon1234')!=-1"
          v-waves
        >查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" fit highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column align="center" label="优惠券ID" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.couponID }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优惠券类型" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.couponName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面值" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.couponAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用条件" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.couponDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="有效时间" min-width="180px">
        <template slot-scope="{row}">
          <span>{{ row.couponBeginTime | parseTime('{y}-{m}-{d}') }} - {{ row.couponEndTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发行数量" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.couponTotalNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="剩余数量" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.couponTotalNumber - row.couponSendedNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" min-width="120px">
        <template slot="header" slot-scope="scope">
          <el-cascader
            :options="stateList"
            :props="{ expandTrigger: 'hover' }"
            @change="getList"
            class="filter-item"
            clearable
            v-if="permission.indexOf('SearchCoupon1234')!=-1"
            v-model="listQuery.couponState"
            v-waves
          ></el-cascader>
        </template>
        <template slot-scope="{row}">
          <el-tag
            plain
            size="mini"
            type="info"
            v-if="row.couponState === 0"
          >{{ row.couponState | statusFilter }}</el-tag>
          <el-tag
            plain
            size="mini"
            type="success"
            v-if="row.couponState === 1"
          >{{ row.couponState | statusFilter }}</el-tag>
          <el-tag
            plain
            size="mini"
            type="danger"
            v-if="row.couponState === 9"
          >{{ row.couponState | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        min-width="200"
      >
        <template slot-scope="{row}">
          <el-button
            @click="handleUpdate(row)"
            size="mini"
            type="primary"
            v-if="permission.indexOf('editCoupon1234')!=-1"
          >编辑</el-button>
          <el-button
            :disabled="row.couponState === 9"
            @click="handleUpdateTerminate(row)"
            plain
            size="mini"
            type="info"
            v-if="permission.indexOf('endCoupon1234')!=-1"
          >终止</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNo"
      :total="total"
      @pagination="getList"
      v-show="total>0"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import Cookies from "js-cookie";
import { getCouponList, terminateCoupon } from "@/api/marketing";

export default {
  name: "coupon-list",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未生效",
        1: "发放中",
        9: "已终止",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      stateList: [
        {
          label: "未生效",
          value: 0,
        },
        {
          label: "发放中",
          value: 1,
        },
        {
          label: "已终止",
          value: 9,
        },
      ],
      permission: [],
      listQuery: {
        couponBeginTime: undefined,
        couponEndTime: undefined,
        couponType: this.couponType,
        couponState: 1,
      },
      listLoading: false,
      total: 0,
      list: [],
      dialogVisible: false,
      //userType: 4 // 商家4，经销商3
    };
  },
  props: ["couponType"],
  created() {
    this.permission = JSON.parse(Cookies.get("permission"));
    this.listQuery.pageNo = 1;
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true;
      console.log(JSON.stringify(this.listQuery));
      if (this.listQuery.couponState) {
        this.listQuery.couponState = this.listQuery.couponState[0];
      }
      if (this.listQuery.couponBeginTime) {
        this.listQuery.couponBeginTime = new Date(
          this.listQuery.couponBeginTime
        ).getTime();
      }
      if (this.listQuery.couponEndTime) {
        this.listQuery.couponEndTime = new Date(
          this.listQuery.couponEndTime
        ).getTime();
      }
      getCouponList(this.listQuery).then((response) => {
        console.log(response.data);
        this.list = response.data.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    handleUpdate(row) {
      window.location.href =
        "#/marketing/update-coupon?couponID=" + row.couponID;
    },
    handleUpdateTerminate(row) {
      this.$confirm("此操作将终止该优惠券, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          terminateCoupon({ couponID: row.couponID })
            .then((res) => {
              row.couponState = 9;
              this.$message({
                type: "info",
                message: res.message,
              });
            })
            .catch(() => {
              this.$message({
                type: "danger",
                message: res.message,
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消终止优惠券",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>
