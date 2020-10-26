<template>
  <div class="app-container">
    <div class="filter-container" v-if="searchStatus">
      <el-input
        v-model="listQuery.orderID"
        placeholder="订单编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phoneNumber"
        placeholder="联系方式"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.state"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.orderFrom"
        placeholder="订单来源"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in orderFromTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">-->
      <!--        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
      <!--      </el-select>-->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
      <!--        新增-->
      <!--      </el-button>-->
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
      @sort-change="sortChange"
    >
      <el-table-column label="订单编号" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orderID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span
            v-if="row.orderPaidTime"
          >{{ row.orderPaidTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else />
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phoneNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="产品图片" min-width="125px" align="center">
        <template slot-scope="{row}">
          <img :src="row.productTitleImage" style="width: 100px;height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="产品标题" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付金额" prop="marketPrice" align="center" min-width="95">
        <template slot-scope="{row}">
          <span v-if="row.finalAmount">{{ row.finalAmount / 100 }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="商品件数" align="center" min-width="95">
        <template slot-scope="{row}">
          <span v-if="row.productNumber">{{ row.productNumber }}件</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" min-width="200">
        <template slot-scope="{row}">
          <el-tag
            :type="row.orderState | orderStateStatusFilter"
          >{{ row.orderState | orderStateFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单来源" min-width="100">
        <template slot-scope="{row}">
          <span v-if="row.orderFrom === 1">直播订单</span>
          <span v-else-if="row.orderFrom === 2">普通订单</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button size="mini" v-if="deltailStatus" @click="catOrderDetail(row)">详情</el-button>
          <el-button
            v-if="pageType==1&&row.orderState==1&&permission.indexOf('OrderDelivery765527')!=-1"
            size="mini"
            type="success"
            @click="orderShip(row)"
          >发货</el-button>
          <el-button
            v-if="pageType==3&&permission.indexOf('OrderDelete50343')!=-1"
            size="mini"
            type="danger"
            @click="deleteOrder(row)"
          >删除</el-button>
          <el-button
            v-if="pageType==4&&permission.indexOf('OrderProcess50345')!=-1"
            size="mini"
            type="primary"
            @click="finishedOrder(row)"
          >已处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  getOrderByState,
  deleteOrderByID,
  setOrderFinishedByID,
} from "@/api/order";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import Cookies from "js-cookie";

const calendarTypeOptions = [
  { key: 1, display_name: "待发货" },
  { key: 2, display_name: "已发货(待收货)" },
  { key: 3, display_name: "已收货(已完成)" },
  { key: 4, display_name: "申请售后(售后订单)" },
];

const orderFromTypeOptions = [
  { key: 1, display_name: "直播订单" },
  { key: 2, display_name: "普通订单" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "PageOrderManagement",
  components: { Pagination },
  directives: { waves },
  filters: {
    orderStateFilter(status) {
      const statusMap = {
        0: "待付款订单",
        1: "待发货",
        2: "已发货(待收货)",
        3: "已收货(已完成)",
        4: "申请售后(售后订单)",
        11: "已取消订单",
      };
      return statusMap[status];
    },
    orderStateStatusFilter(status) {
      const statusMap = {
        0: "primary",
        1: "primary",
        2: "primary",
        3: "success",
        4: "primary",
        11: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  props: {
    pageType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      categoryLevelTwoList: null,
      total: 0,
      searchStatus: false,
      deltailStatus: false,
      permission: [],
      listLoading: true,
      category: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        orderID: undefined,
        phoneNumber: undefined,
        flag: 0,
        state: undefined,
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      orderFromTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    // this.permission = JSON.parse(Cookies.get("permission"));
    this.permission = JSON.parse(sessionStorage.getItem("permission"));
    if (
      (this.pageType === 4 &&
        this.permission.indexOf("OrderSearch43274") != -1) || //售后订单
      (this.pageType === 3 &&
        this.permission.indexOf("OrderSearch4274") != -1) || //订单已完成
      (this.pageType === 99 &&
        this.permission.indexOf("OrderSearch4234") != -1) || //订单搜索
      (this.pageType === 2 &&
        this.permission.indexOf("OrderSearch3423") != -1) || //待收货
      (this.pageType === 1 && this.permission.indexOf("OrderSearch74532") != -1) //待发货
    ) {
      this.searchStatus = true;
    } else {
      this.searchStatus = false;
    }
    if (
      (this.pageType === 4 &&
        this.permission.indexOf("OrderView53615") != -1) || //售后订单
      (this.pageType === 3 && this.permission.indexOf("OrderView5365") != -1) || //订单已完成
      (this.pageType === 99 &&
        this.permission.indexOf("OrderView5345") != -1) || //订单搜索
      (this.pageType === 2 &&
        this.permission.indexOf("OrderView76657") != -1) || //待收货
      (this.pageType === 1 && this.permission.indexOf("OrderView52423") != -1) //待发货
    ) {
      this.deltailStatus = true;
    } else {
      this.deltailStatus = false;
    }
    this.getList();
  },
  methods: {
    catOrderDetail(order) {
      window.location.href =
        "#/order-management/cat-order-detail?orderID=" + order.orderID;
    },
    getList() {
      if (this.listQuery.orderID == "") this.listQuery.orderID = undefined;
      if (this.listQuery.phoneNumber == "")
        this.listQuery.phoneNumber = undefined;
      if (this.pageType == 99) {
        // this.listQuery.state = undefined
      } else {
        this.listQuery.state = this.pageType;
      }
      this.listLoading = true;
      getOrderByState(this.listQuery).then((response) => {
        console.log(response.data);
        this.list = response.data.list;
        this.total = response.data.total;
        // Just to simulate the time of the request
        this.listLoading = false;
      });
    },
    handleChange(value) {
      console.log(value);
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    orderShip(row) {
      window.location.href =
        "#/order-management/order-ship?orderID=" + row.orderID;
    },
    deleteOrder(row) {
      const that = this;
      this.$confirm(
        "此操作删除订单【" + row.orderID + "】, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const param = {
            orderID: row.orderID,
          };
          deleteOrderByID(param).then((response) => {
            if (response.status == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              that.listQuery.pageNo = 1;
              that.getList();
            } else {
              this.$message({
                type: "danger",
                message: response.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    finishedOrder(row) {
      var that = this;
      this.$confirm(
        "此操作将订单【" + row.orderID + "】标记为已处理, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const param = {
            orderID: row.orderID,
          };
          setOrderFinishedByID(param).then((response) => {
            if (response.status == 0) {
              this.$message({
                type: "success",
                message: "操作成功!",
              });
              that.listQuery.pageNo = 1;
              that.getList();
            } else {
              this.$message({
                type: "danger",
                message: response.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消处理操作！",
          });
        });
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "marketPrice") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>
