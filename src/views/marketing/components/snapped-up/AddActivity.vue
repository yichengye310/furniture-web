<template>
  <div class="app-container">
    <div v-if="pageType=='activity'">
      <h3>活动设置</h3>
      <el-divider></el-divider>
      <el-form ref="form" :model="activity" label-width="100px" style="margin-bottom: 20px">
        <el-form-item label="活动开始时间">
          <el-date-picker type="datetime" placeholder="选择日期" value-format="timestamp" v-model="activity.startTime" style="width: 200px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-date-picker  type="datetime" placeholder="选择日期" value-format="timestamp" v-model="activity.endTime" style="width: 200px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-radio-group v-model="activity.discountWay" @change="emptyProductList()">
            <el-radio :label="1">满减</el-radio>
            <el-radio :label="2">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <h3>产品设置</h3>
      <el-divider></el-divider>
      <el-form ref="form" :model="activity" label-width="80px">
        <el-form-item label="活动对象">
          <el-radio-group v-model="activity.activeObject">
            <el-radio :label="1">全部用户</el-radio>
            <el-radio :label="2">普通用户</el-radio>
            <el-radio :label="3">会员用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择产品">
          <el-button type="primary" style="margin-bottom: 20px" @click="addProduct">+添加产品</el-button>
          <el-row>
            <el-table
              :data="form.productLimitedTimeDTOS"
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column label="产品图片" width="125px">
                <template slot-scope="{row}">
                  <img :src="row.activityImg" style="width: 100px;height: 100px"/>
                </template>
              </el-table-column>
              <el-table-column label="产品标题" min-width="180px">
                <template slot-scope="{row}">
                  <span  >{{ row.productName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="原价"  prop="originalPrice" align="center" form>
                <template slot-scope="{row}">
                  <span v-if="row.productLimitedTimeStandardsDTOS[0].originalPrice"  >{{ row.productLimitedTimeStandardsDTOS[0].originalPrice / 100 }}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column label="批发价"  prop="discountPrice" align="center" form>
                <template slot-scope="{row}">
                  <span v-if="row.productLimitedTimeStandardsDTOS[0].discountPrice"  >{{ row.productLimitedTimeStandardsDTOS[0].discountPrice / 100 }}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column label="折扣价"  prop="tradePrice" align="center" form>
                <template slot-scope="{row}">
                  <span v-if="row.productLimitedTimeStandardsDTOS[0].tradePrice"  >{{ row.productLimitedTimeStandardsDTOS[0].tradePrice / 100 }}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column label="限购数量"  prop="limitNum" align="center" form>
                <template slot-scope="{row}">
                  <span v-if="row.limitNum"  >{{ row.limitNum }}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary"  size="mini" @click="editProduct(scope.row,scope.$index)"  >
                    编辑
                  </el-button>
                  <el-button size="mini" type="danger" @click="deleteProduct(scope.$index)"  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form-item>
        <el-form-item label="优惠规则" v-if="activity.discountWay==1">
          <el-row>
            消费满
            <el-input v-model="activity.full" style="width: 150px">
              <template slot="append">元</template>
            </el-input>
            优惠金额
            <el-input v-model="activity.reduce" style="width: 150px">
              <template slot="append">元</template>
            </el-input>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-col :span="24" :offset="10">
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="onSubmit" >提交</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="pageType=='product'">
        <product-detail :page-type="'new'" :product-item="productItem" :discount-way="activity.discountWay" @add-product="addProductItem($event)" @edit-product="editProductItem($event)" @back-product-item="backProductItem($event)"></product-detail>
    </div>
  </div>
</template>

<script>
  import {productLimitedTimeAdd} from '@/api/marketing'
  import ProductDetail from './ProductDetail'
  export default {
    components:{
      ProductDetail
    },
    data() {
      return {
        pageType:'activity',
        productItem:undefined,
        editIndex:undefined,
        activity:{
          startTime:undefined,
          endTime: undefined,
          discountWay: 1,
          activeObject: 1,
          full: null,
          reduce: null,
        },
        form: {
          productLimitedTimeDTOS:[]
        }
      }
    },
    methods: {
      emptyProductList() {
        this.form.productLimitedTimeDTOS=[];//情况产品列表
      },
      //返回上一层
      back() {
        this.$router.go(-1);//返回上一层
      },
      addProduct() {
        this.pageType='product';
        this.productItem=undefined;
      },
      deleteProduct(index) {
        this.form.productLimitedTimeDTOS.splice(index, 1);
      },
      editProduct(row,index) {
        console.log(index)
        this.editIndex=index;
        this.pageType='product';
        this.productItem=row;
      },
      editProductItem(product) {
        this.form.productLimitedTimeDTOS[this.editIndex]=product;
        this.pageType='activity';
        this.productItem=undefined;
        this.editIndex=undefined;
      },
      addProductItem(product) {
        this.form.productLimitedTimeDTOS.push(product);
        this.pageType='activity';
        this.productItem=undefined;
      },
      backProductItem() {
        this.pageType='activity';
        this.productItem=undefined;
      },
      onSubmit() {
        var flag = true;
        if(this.activity.startTime==null||this.activity.startTime==""){
          this.$message({
            type: 'danger',
            message: "请选择开始时间！！"
          });
          flag=false;
          return;
        }
        if(this.activity.endTime==null||this.activity.endTime==""){
          this.$message({
            type: 'danger',
            message: "请选择结束时间！！"
          });
          flag=false;
          return;
        }
        // if(new Date().getTime()>this.activity.startTime){
        //   this.$message({
        //     type: 'danger',
        //     message: "开始时间必须大于当前时间！！"
        //   });
        //   flag=false;
        //   return;
        // }
        if(this.activity.endTime<this.activity.startTime){
          this.$message({
            type: 'danger',
            message: "结束时间必须大于开始时间！！"
          });
          flag=false;
          return;
        }
        if(this.activity.discountWay==1){
          if(this.activity.full==null||this.activity.full==''){
            this.$message({
              type: 'danger',
              message: "请输入消费满减金额！！"
            });
            flag=false;
            return;
          }
          if(this.activity.reduce==null||this.activity.reduce==''){
            this.$message({
              type: 'danger',
              message: "请输入消费满减金额！！"
            });
            flag=false;
            return;
          }
        }
        if(this.form.productLimitedTimeDTOS==null||this.form.productLimitedTimeDTOS.length<=0){
          this.$message({
            type: 'danger',
            message: "至少需要添加一个产品！！"
          });
          flag=false;
          return;
        }

        this.form.productLimitedTimeDTOS.forEach(productLimitedTime => {
          productLimitedTime.startTime=this.activity.startTime/1000
          productLimitedTime.endTime=this.activity.endTime/1000
          productLimitedTime.discountWay=this.activity.discountWay
          productLimitedTime.activeObject=this.activity.activeObject
          productLimitedTime.full=this.activity.full * 100
          productLimitedTime.reduce=this.activity.reduce * 100
        })

        if(flag){
          productLimitedTimeAdd(this.form).then(response => {
            if(response.status==1){
              this.$message({
                type: 'success',
                message: '创建成功！'
              });
              window.location.href="#/marketing/snapped-up"
            }else{
              this.$message({
                type: 'danger',
                message: response.message
              });
            }
          })
        }

      }
    }
  }
</script>

<style scoped>

</style>
