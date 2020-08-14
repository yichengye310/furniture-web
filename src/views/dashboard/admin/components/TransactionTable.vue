<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column label="图片" width="100">
      <template slot-scope="scope">
        <img :src="scope.row.titleImg" style="width: 80px;height: 80px"/>
      </template>
    </el-table-column>
    <el-table-column label="名称"  align="left">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="light" :content="scope.row.productName" placement="top">
          <span style="font-size: 14px;color: #000"> {{ scope.row.productName | orderNoFilter }}</span>
        </el-tooltip><br>
        <span style="font-size: 10px;color: #B7B4B8">{{ scope.row.productCode  }}</span>
      </template>
    </el-table-column>
    <el-table-column label="数量" width="80"  align="center">
      <template slot-scope="scope">
       <span style="color: #0a76a4">{{ scope.row.boughtNum }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getProductListByPage } from '@/api/product'
import Mock from "mockjs";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 15)
    }
  },
  data() {
    return {
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        importance: undefined,
        productName: undefined,
        levelTwoCategoryID: undefined,
        boughtNumFlag: undefined,
        productStockNumFlag: undefined,
        priceFlag: undefined,
      },
      list: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getProductListByPage(this.listQuery).then(response => {
        response.data.list.forEach(item => {
        if(item.productStandards!=null&&item.productStandards.length>0){
          item.bandPrice=item.productStandards[0].bandPrice
        }else{
          item.bandPrice=0
        }
        var productStockNum=0;
        item.productStandards.forEach(productStandard =>{
          productStandard.productStandardsColours.forEach(productStandardsColour=>{
            productStockNum=productStockNum+productStandardsColour.productStockNum;
          })

        })
        item.productStockNum=productStockNum;
      })
        this.list = response.data.list
      })
    }
  }
}
</script>
