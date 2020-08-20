<template>
  <div class="app-container" style="min-width: 1250px">
    <el-page-header content="详情页面" style="margin-bottom: 20px" @back="back" />
    <h3>基本信息</h3>
    <el-table
      :data="basicInformation"
      :show-header="false"
      border
      style="width: 800px"
    >
      <el-table-column
        prop="label"
        label="名称"
        width="180"
      >
        <template slot-scope="{row}">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="值">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
    </el-table>
    <h3>购买详情</h3>
    <el-table
      :data="purchaseDetails"
      border
      style="width: 1250px"
    >
      <el-table-column label="图片" width="125px" align="center">
        <template slot-scope="{row}">
          <img :src="row.productTitleImage" style="width: 100px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="规格">
        <template slot-scope="{row}">
          <span>{{ row.productStandard }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="颜色">
        <template slot-scope="{row}">
          <span>{{ row.productColour }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
        align="center"
        label="数量"
      >
        <template slot-scope="{row}">
          <span>{{ row.productNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
        align="center"
        label="实际付款"
      >
        <template slot-scope="{row}">
          <span v-if="row.finalAmount">{{ row.finalAmount / 100 }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="{row}">
          <span v-if="row.userRemark">{{ row.userRemark }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
    </el-table>
    <h3>收货人信息</h3>
    <el-table :data="recipientInformation" :show-header="false" border style="width: 800px">
      <el-table-column prop="label" label="名称" width="180">
        <template slot-scope="{row}">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="值">
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
    </el-table>
    <h3 v-if="form.orderState==2">物流信息</h3>
    <el-table v-if="form.orderState==2" :data="logisticsInformation" :show-header="false" border style="width: 800px">
      <el-table-column prop="label" label="名称" width="180">
        <template slot-scope="{row}">
          <span>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="值">
        <template slot-scope="{row}">
          <span v-if="row.label='发货时间'&&row.value">{{ row.value | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          <span v-else>{{ row.value }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrderByID } from '@/api/order'
import { parseTime } from '@/utils'
const orderStateFilter = {
  0: '待付款订单',
  1: '待发货',
  2: '已发货(待收货)',
  3: '已收货(已完成)',
  4: '申请售后(售后订单)',
  11: '已取消订单'
}
export default {
  filters: {
    orderStateFilter(status) {
      return orderStateFilter[status]
    }
  },
  props: {
    orderId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      // 基本信息
      basicInformation: [
        {
          label: '订单状态',
          value: ''
        },
        {
          label: '订单编号',
          value: ''
        },
        {
          label: '支付下单时间',
          value: ''
        },
        {
          label: '卖家ID',
          value: ''
        }
      ],
      // 收货人信息
      recipientInformation: [
        {
          label: '收货人',
          value: ''
        },
        {
          label: '收货人地址',
          value: ''
        },
        {
          label: '联系方式',
          value: ''
        }
      ],
      // 物流信息
      logisticsInformation: [
        {
          label: '物流公司',
          value: ''
        },
        {
          label: '物流单号',
          value: ''
        },
        {
          label: '发货时间',
          value: ''
        }
      ],
      // 产品信息
      purchaseDetails: [],
      form: {
        orderID: undefined,
        orderState: undefined,
        orderPaidTime: undefined,
        userName: undefined,
        userPhone: undefined,
        productID: undefined,
        productName: undefined,
        productTitleImage: undefined,
        productStandardID: undefined,
        productStandard: undefined,
        productColourID: undefined,
        productColour: undefined,
        finalAmount: undefined,
        productNumber: undefined,
        userRemark: undefined,
        receiverName: undefined,
        phoneNum: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        receiveAddress: undefined,
        expressTime: undefined,
        expressName: undefined,
        expressNumber: undefined
      }
    }
  },
  watch: {

  },
  created() {
    this.getOrderDetail()
  },
  methods: {
    // 返回上一层
    back() {
      this.$router.go(-1) // 返回上一层
    },
    // 获取产品详情
    getOrderDetail() {
      const queryParam = { orderID: this.orderId }
      getOrderByID(queryParam).then(response => {
        if (response.status == 0) {
          this.form = response.data
          console.log(this.form)
          this.basicInformation[0].value = orderStateFilter[this.form.orderState] || ''
          this.basicInformation[1].value = this.form.orderID
          this.basicInformation[2].value = this.form.orderPaidTime ? parseTime(this.form.orderPaidTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
          this.basicInformation[3].value = this.form.userName
          this.purchaseDetails.push(this.form)
          this.recipientInformation[0].value = this.form.receiverName
          this.recipientInformation[1].value = this.form.province + ' ' + this.form.city + ' ' + this.form.county + ' ' + this.form.receiveAddress
          this.recipientInformation[2].value = this.form.phoneNum
          this.logisticsInformation[0].value = this.form.expressName
          this.logisticsInformation[1].value = this.form.expressNumber
          this.logisticsInformation[2].value = this.form.expressTime ? parseTime(this.form.expressTime, '{y}-{m}-{d} {h}:{i}:{s}') : ''
        }
      })
    },
    onSubmit() {

    }

  }
}
</script>
