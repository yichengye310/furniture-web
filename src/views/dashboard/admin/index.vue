<template>
  <div class="dashboard-editor-container">

    <el-row  style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :span="18" >
        <el-divider content-position="left">店铺信息数据统计</el-divider>
        <panel-group @handleSetLineChartData="handleSetLineChartData" />
        <el-divider content-position="left">本周经营状况</el-divider>
        <el-row >
          <line-chart :chart-data="lineChartData" />
        </el-row>
        <el-divider content-position="left">常用工具</el-divider>
        <el-row >
          <chang-yong-tool />
        </el-row>
      </el-col>
      <el-col :span="6" style="padding-left: 20px" >
        <el-divider content-position="left">热销榜单</el-divider>
        <transaction-table  />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import ChangYongTool from './components/ChangYongTool'
import TransactionTable from './components/TransactionTable'

const lineChartData = {
  huiyuanNumber: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  yonghuNumber: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  orderNumber: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    ChangYongTool,
    TransactionTable
  },
  data() {
    return {
      lineChartData: lineChartData.huiyuanNumber
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
