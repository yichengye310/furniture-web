<template>
  <div class="app-container" style="min-width: 1250px;background: #f5f5f5;">
    <el-page-header content="详情页面" style="margin-bottom: 20px" @back="back" />
    <div style="background: #ffffff;padding: 25px 25px;margin-bottom: 20px">
      <el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="6">
            订单编号：{{ orderDetail.orderID }}
          </el-col>
          <el-col :span="6">
            创建时间：<span v-if="orderDetail.orderPaidTime">{{ orderDetail.orderPaidTime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span><span />
          </el-col>
        </el-row>
        <el-table
          :data="purchaseDetails"
          border
          style="width: 100%;margin-bottom: 20px"
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
          <el-table-column
            width="150px"
            align="center"
            label="规格"
          >
            <template slot-scope="{row}">
              <span>{{ row.productStandard }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            align="center"
            label="颜色"
          >
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
          <el-table-column
            align="center"
            label="备注"
          >
            <template slot-scope="{row}">
              <span v-if="row.userRemark">{{ row.userRemark }}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="margin-bottom: 5px">
          收货地址：{{ orderDetail.province + ' ' + orderDetail.city + ' ' + orderDetail.county + ' ' + orderDetail.receiveAddress }}
        </el-row>
      </el-row>
    </div>

    <div style="background: #ffffff;padding: 25px 25px;margin-bottom: 20px">
      <el-form ref="form" :model="form" label-width="80px" style="min-width: 1250px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="发货人" prop="deliverName">
              <el-input v-model="form.deliverName" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="联系方式" prop="deliverPhoneNum">
              <el-input v-model="form.deliverPhoneNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="发货地址" prop="deliverAdd">
              <el-input v-model="form.deliverAdd" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <h3>物流信息</h3>
    <div style="background: #ffffff;padding: 25px 25px;">
      <el-form ref="form1" :rules="rules" :model="form" label-width="80px" style="min-width: 1250px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="物流公司" prop="expressCompany">
              <el-input v-model="form.expressCompany" />
            </el-form-item>
          </el-col>
          <el-col :span="6":offset="2">
            <el-form-item label="物流单号" prop="expressNum">
              <el-input v-model="form.expressNum" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-button style="width: 100px" @click="back">返回</el-button>
            <el-button type="primary" style="width: 100px" @click="onSubmit">发货</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

  </div>
</template>

<script>
import { getParamer } from '@/utils/tool'
import { getOrderByID, delivery } from '@/api/order'
import { parseTime } from '@/utils'
export default {
  name: 'OrderShip',
  data() {
    return {
      orderID: getParamer('orderID') !== undefined ? Number(getParamer('orderID')) : undefined,
      // 产品信息
      purchaseDetails: [],
      orderDetail: {
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
      },
      form: {
        orderID: undefined,
        orderPaidTime: undefined,
        productID: undefined,
        productName: undefined,
        productTitleImage: undefined,
        productStandardID: undefined,
        productStandard: undefined,
        productColourID: undefined,
        productColour: undefined,
        productNumber: undefined,
        userRemark: undefined,
        receiverName: undefined,
        phoneNum: undefined,
        province: undefined,
        city: undefined,
        county: undefined,
        receiveAddress: undefined,
        deliverName: undefined,
        deliverPhoneNum: undefined,
        deliverAdd: undefined,
        expressCompany: undefined,
        expressNum: undefined
      }
    }
  },
  created() {
    this.getOrderDetail()
  },
  methods: {
    // 返回上一层
    back() {
      this.$router.go(-1)// 返回上一层
    },
    // 获取产品详情
    getOrderDetail() {
      const queryParam = { orderID: this.orderID }
      getOrderByID(queryParam).then(response => {
        if (response.status === 0) {
          this.orderDetail = response.data
          this.purchaseDetails.push(this.orderDetail)
          this.form.orderID = this.orderDetail.orderID
          this.form.orderPaidTime = this.orderDetail.orderPaidTime
          this.form.productID = this.orderDetail.productID
          this.form.productName = this.orderDetail.productName
          this.form.productTitleImage = this.orderDetail.productTitleImage
          this.form.productStandardID = this.orderDetail.productStandardID
          this.form.productStandard = this.orderDetail.productStandard
          this.form.productColourID = this.orderDetail.productColourID
          this.form.productColour = this.orderDetail.productColour
          this.form.productNumber = this.orderDetail.productNumber
          this.form.userRemark = this.orderDetail.userRemark
          this.form.receiverName = this.orderDetail.receiverName
          this.form.phoneNum = this.orderDetail.phoneNum
          this.form.province = this.orderDetail.province
          this.form.city = this.orderDetail.city
          this.form.county = this.orderDetail.county
          this.form.receiveAddress = this.orderDetail.receiveAddress
        }
      })
    },
    onSubmit() {
      delivery(this.form).then(response => {
        if (response.status === 0) {
          this.$message({
            type: 'success',
            message: '发货成功！'
          })
          this.$router.go(-1) // 返回上一层
        } else {
          this.$message({
            type: 'danger',
            message: response.message
          })
        }
      })
    }
  }
}
</script>
