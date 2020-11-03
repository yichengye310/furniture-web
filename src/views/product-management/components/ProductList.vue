<template>
  <div class="app-container">
    <div class="filter-container">
      <el-cascader
        clearable class="filter-item"
        v-if="(pageType=='ProductWarehouse'&&permission.indexOf('ProductSearch')!=-1)||(pageType=='ForSale'&&permission.indexOf('ProductSearch5345')!=-1)"
        placeholder="分类筛选"
        v-model="category"
        :options="categoryLevelTwoList"
        :props="{ expandTrigger: 'hover' }"></el-cascader>
      <el-input v-model="listQuery.productName" v-if="(pageType=='ProductWarehouse'&&permission.indexOf('ProductSearch')!=-1)||(pageType=='ForSale'&&permission.indexOf('ProductSearch5345')!=-1)" placeholder="产品标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
         <el-button v-waves class="filter-item" v-if="(pageType=='ProductWarehouse'&&permission.indexOf('ProductSearch')!=-1)||(pageType=='ForSale'&&permission.indexOf('ProductSearch5345')!=-1)" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" v-if="pageType=='ProductWarehouse'&&permission.indexOf('NewProductRelease87453')!=-1" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column label="产品图片" width="125px">
        <template slot-scope="{row}">
          <img :src="row.titleImg" style="width: 100px;height: 100px"/>
        </template>
      </el-table-column>
      <el-table-column label="产品编号" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品标题" min-width="180px">
        <template slot-scope="{row}">
          <span  >{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格"  prop="bandPrice" align="center" :sort-orders="['ascending', 'descending']" min-width="95" sortable>
        <template slot-scope="{row}">
          <span v-if="row.productStandards"  >{{ row.bandPrice / 100 }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="productStockNum" :sort-orders="['ascending', 'descending']" min-width="95" sortable>
        <template slot-scope="{row}">
          <span v-if="row.productStockNum"  >{{ row.productStockNum }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" align="center" prop="boughtNum" :sort-orders="['ascending', 'descending']" min-width="95" sortable>
        <template slot-scope="{row}">
          <span v-if="row.boughtNum"  >{{ row.boughtNum }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" min-width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state==1?'销售中': row.state==2?'已下架':row.state==9?'已删除':'仓库中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="pageType=='ForSale'&&permission.indexOf('ProductView76657')!=-1" type="primary" size="mini" @click="catProduct(row)">
            查看
          </el-button>
          <el-button type="primary" v-if="pageType=='ProductWarehouse'&&permission.indexOf('ProductEditor42352')!=-1" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.state!=1&&pageType=='ProductWarehouse'&&permission.indexOf('ProductOffTheShelf1232145')!=-1" size="mini" type="success" @click="handleModifyStatus(row,1)">
            上架
          </el-button>
          <el-button v-if="pageType=='ForSale'&&permission.indexOf('ProductOffTheShelf1234523')!=-1" size="mini" @click="handleModifyStatus(row,2)">
            下架
          </el-button>
          <el-button v-if="row.state!= 9&row.state!= 9&&pageType=='ProductWarehouse'&&permission.indexOf('ProductDelete')!=-1" size="mini" type="danger" @click="handleModifyStatus(row,9)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { getProductListByPage,updateProduct } from '@/api/product'
  import { categoryLevelTwoListByPage } from '@/api/category'
  import waves from '@/directive/waves' // waves directive
  import Cookies from "js-cookie";
  import { parseTime } from '@/utils'
  import {getParamer} from '@/utils/tool'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  // arr to obj, such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: 'success',
          0: 'info',
          2: 'danger',
          9: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    props:{
      pageType: {
        type: String,
        default: 'ProductWarehouse'
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        categoryLevelTwoList: null,
        total: 0,
        permission: false,
        listLoading: true,
        category: [],
        listQuery: {
          pageNo: getParamer("pageNo")!=undefined?Number(getParamer("pageNo")):1,
          pageSize: getParamer("pageSize")!=undefined?Number(getParamer("pageSize")):10,
          importance: undefined,
          productName: undefined,
          levelTwoCategoryID: undefined,
          levelThreeCategoryID: undefined,
          boughtNumFlag: undefined,
          productStockNumFlag: undefined,
          priceFlag: undefined,
        },
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      }
    },
    created() {
      this.permission=JSON.parse(Cookies.get("permission"));
      this.getCategoryLevelTwoListByPage()
      this.getList()
    },
    methods: {
      getList() {
        if(this.pageType=='ForSale'){
          this.listQuery.state=1
        }
        this.listLoading = true
        console.log(this.category)
        if( this.category.length>0){
          this.listQuery.levelTwoCategoryID = this.category[0];
          if(this.category.length>1){
            this.listQuery.levelThreeCategoryID = this.category[1];
          }
        }else{
          this.listQuery.levelTwoCategoryID = null;
          this.listQuery.levelThreeCategoryID = null;
        }
        getProductListByPage(this.listQuery).then(response => {
          console.log(response.data)
          response.data.list.forEach(item => {
            var productStockNum=0;
            if(item.productStandards!=null&&item.productStandards.length>0){
              item.bandPrice=item.productStandards[0].bandPrice
              item.productStandards.forEach(productStandard =>{
                if(productStandard.productStandardsColours!=null&&productStandard.productStandardsColours.length>0) {
                  productStandard.productStandardsColours.forEach(productStandardsColour => {
                    productStockNum = productStockNum + productStandardsColour.productStockNum;
                  })
                }

              })
            }else{
              item.bandPrice=0
            }

            item.productStockNum=productStockNum;
          })
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      catProduct(product){
        window.location.href="#/product-management/cat-product-release?productID="+product.productID+'&pageNo='+this.listQuery.pageNo+'&pageSize='+this.listQuery.pageSize
      },
      getCategoryLevelTwoListByPage() {
        this.listLoading = true
        categoryLevelTwoListByPage().then(response => {
          if(response.data.list.length>0){
            this.categoryLevelTwoList=[]
            for (let i = 0; i <  response.data.list.length; i++) {
              let categoryLevelTwo={
                label:null,
                value:null,
                children:[]
              }
              let children=[]
              categoryLevelTwo.label=response.data.list[i].categoryName
              categoryLevelTwo.value=response.data.list[i].categoryID
              if( response.data.list[i].productCategoryLevelThrees.length>0){
                for(let j = 0; j <  response.data.list[i].productCategoryLevelThrees.length; j++){
                  let categoryLevelTwoChild={
                    label:null,
                    value:null
                  }
                  categoryLevelTwoChild.label=response.data.list[i].productCategoryLevelThrees[j].categoryName
                  categoryLevelTwoChild.value=response.data.list[i].productCategoryLevelThrees[j].categoryID
                  children.push(categoryLevelTwoChild)
                }
              }
              categoryLevelTwo.children=children;
              this.categoryLevelTwoList.push(categoryLevelTwo)
            }
          }

          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        var that=this;
        let stas = '';
        if(status==1){
          stas = '上架';
        }else if(status==2){
          stas = '下架';
        }else if(status==9){
          stas = '删除';
        }
        this.$confirm('此操作'+stas+'产品【'+row.productName+'】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            productID : row.productID,
            state : status
          }
          updateProduct(param).then(response => {
            if(response.status==1){
              this.$message({
                type: 'success',
                message: stas+'成功!'
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
            message: '已取消'+stas
          });
        });

      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'bandPrice') {
          this.listQuery.productStockNumFlag = undefined
          this.listQuery.boughtNumFlag = undefined
          if (order === 'ascending') {
            this.listQuery.priceFlag = 1
          }else{
            this.listQuery.priceFlag = 2
          }
        }else if (prop === 'boughtNum') {
          this.listQuery.priceFlag = undefined
          this.listQuery.productStockNumFlag = undefined
          if (order === 'ascending') {
            this.listQuery.boughtNumFlag = 1
          }else{
            this.listQuery.boughtNumFlag = 2
          }
        }else if (prop === 'productStockNum') {
          this.listQuery.priceFlag = undefined
          this.listQuery.boughtNumFlag = undefined
          if (order === 'ascending') {
            this.listQuery.productStockNumFlag = 1
          }else{
            this.listQuery.productStockNumFlag = 2
          }
        } else {
          this.listQuery.priceFlag = undefined
          this.listQuery.boughtNumFlag = undefined
          this.listQuery.productStockNumFlag = undefined
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleCreate() {
        window.location.href="#/product-management/new-product-release"
      },

      handleUpdate(row) {
        window.location.href="#/product-management/update?productID="+row.productID+'&pageNo='+this.listQuery.pageNo+'&pageSize='+this.listQuery.pageSize
      }
    }
  }
</script>

<style scoped>

</style>
