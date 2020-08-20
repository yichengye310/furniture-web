<template>
  <div class="app-container" style="min-width: 1250px">
    <el-form :model="form" label-width="120px" ref="form">
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="优惠券类型">
            <el-select v-model="form.couponType">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in couponTypeList">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="优惠券名称">
            <el-input v-model="form.couponName" maxlength="16" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="有效时间">
            <el-date-picker
              placeholder="开始日期"
              type="date"
              v-model="form.couponBeginTime">
            </el-date-picker>
            <el-date-picker
              placeholder="结束日期"
              type="date"
              v-model="form.couponEndTime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="发放方式">
            <el-radio-group v-model="form.deliveryWay">
              <el-radio :label="1" value="1">系统发放</el-radio>
              <el-radio :label="2" value="2">手动领取</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="使用条件">
            <el-radio-group v-model="form.discountType">
              <el-radio :label="1" value="1">满减</el-radio>
              <el-radio :label="2" value="2">直接抵扣</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="form.discountType===1">
        <el-row>
          每笔订单中此优惠券指定货品金额满
          <el-input style="width: 150px" v-model="form.discountLimit">
            <template slot="append">元</template>
          </el-input>
          使用
        </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="优惠券描述">
            <el-input style="width: 500px;" type="textarea" maxlength="10" show-word-limit v-model="form.couponDescription"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="单张面值">
            <el-row>
              <el-input style="width: 200px" v-model="form.couponAmount">
                <template slot="append">元</template>
              </el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="单人领取数量">
            <el-row>
              <el-input style="width: 200px" v-model="form.gainedNumLimit">
                <template slot="append">个</template>
              </el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="发行数量">
            <el-row>
              <el-input style="width: 200px" v-model="form.couponTotalNumber">
                <template slot="append">张</template>
              </el-input>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="使用对象">
            <el-row>
              <el-radio-group v-model="form.destination">
                <el-radio :label="0" value="0">全部用户</el-radio>
                <el-radio :label="1" value="1">普通用户</el-radio>
                <el-radio :label="2" value="2">会员</el-radio>
                <el-radio :label="3" value="3">经销商</el-radio>
                <el-radio :label="4" value="4">商家</el-radio>
              </el-radio-group>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="30">
          <el-form-item :required="true" label="优惠券来源">
            <el-row>
              <el-radio-group v-model="form.couponReleaseWindow">
                <el-radio :label="1" value="1">会员充值</el-radio>
                <el-radio :label="2" value="2">直播领取</el-radio>
                <el-radio :label="3" value="3">商品详情页</el-radio>
              </el-radio-group>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="10" :span="30">
          <el-form-item>
            <el-button @click="back">返回</el-button>
            <el-button @click="onSubmit" v-if="pageType === 'new'" type="primary">提交</el-button>
            <el-button @click="onSubmitUpdate" v-if="pageType === 'update'" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { addCoupon, getCouponDetail, updateCoupon } from '@/api/marketing'

  export default {
    name: 'CouponDetail',
    props: ['pageType', 'couponId'],
    data() {
      return {
        coupon: null,
        form: {
          couponType: 1,
          destination: 0,
          couponReleaseWindow: 1
        },
        couponTypeList: [
          {
            label: '活动优惠券',
            value: 1
          }, {
            label: '会员优惠券',
            value: 2
          }, {
            label: '直播优惠券',
            value: 3
          }
        ],
        destinationList: [
          {
            label: '全部用户',
            value: 0
          }, {
            label: '普通用户',
            value: 1
          }, {
            label: '经销商',
            value: 3
          }, {
            label: '商家',
            value: 4
          }
        ]
      }
    },
    created(){
      console.log(this.pageType)
      console.log(this.couponId)
      if (this.pageType === 'update') {
        getCouponDetail({
          couponID: this.couponId
        }).then((res)=>{
          console.log(JSON.stringify(res))
          if (res.status === 0) {
            this.form = res.data;
            this.form.couponAmount = this.form.couponAmount / 100
            this.form.discountLimit = this.form.discountLimit / 100
          }
        })
      }
    },
    methods: {
      back() {
        window.location.href = "#/marketing/coupon-management";
      },
      onSubmit() {
        let form = this.form
        let flag = true
        if (form.couponType == null || form.couponType == '' || form.couponType == undefined) {
          this.$message({
            type: 'danger',
            message: '请选择优惠券类型！！'
          })
          flag = false
          return
        }

        if (form.couponName == null || form.couponName === '' || form.couponName === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写优惠券名称！！'
          })
          flag = false
          return
        }

        if (form.couponBeginTime == null || form.couponBeginTime === '' || form.couponBeginTime === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写有效开始时间！！'
          })
          flag = false
          return
        }

        if (form.couponEndTime == null || form.couponEndTime === '' || form.couponEndTime === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写有效结束时间！！'
          })
          flag = false
          return
        }

        if (form.deliveryWay == null || form.deliveryWay === '' || form.deliveryWay === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写发放方式！！'
          })
          flag = false
          return
        }

        if (form.discountType == null || form.discountType === '' || form.discountType === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写使用条件！！'
          })
          flag = false
          return
        }

        if (form.discountType === 1) {
          if (form.discountLimit == null || form.discountLimit === '' || form.discountLimit === undefined) {
            this.$message({
              type: 'danger',
              message: '请填写满减限制金额！！'
            })
            flag = false
            return
          }
        }

        if (form.couponDescription == null || form.couponDescription === '' || form.couponDescription === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写优惠券描述！！'
          })
          flag = false
          return
        }

        if (form.couponAmount == null || form.couponAmount === '' || form.couponAmount === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写单张面值！！'
          })
          flag = false
          return
        }

        if (form.gainedNumLimit == null || form.gainedNumLimit === '' || form.gainedNumLimit === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写单人领取数量！！'
          })
          flag = false
          return
        }

        if (form.couponTotalNumber == null || form.couponTotalNumber === '' || form.couponTotalNumber === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写发行数量！！'
          })
          flag = false
          return
        }

        if (form.destination == null || form.destination === '' || form.destination === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写使用对象！！'
          })
          flag = false
          return
        }

        if (form.couponReleaseWindow == null || form.couponReleaseWindow === '' || form.couponReleaseWindow === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写优惠券来源！！'
          })
          flag = false
          return
        }
        console.log(form)
        form.couponBeginTime = new Date(form.couponBeginTime).getTime();
        form.couponEndTime = new Date(form.couponEndTime).getTime();
        if (flag) {
          let param = JSON.parse(JSON.stringify(form))
          param.couponAmount = +param.couponAmount * 100
          param.discountLimit = +param.discountLimit * 100
          addCoupon(param).then(response => {
            if (response.status === 0) {
              this.$message({
                type: 'success',
                message: response.message
              });
              this.back();
            } else {
              this.$message({
                type: 'danger',
                message: response.message
              })
            }
          })
        }
      },
      onSubmitUpdate() {
        let form = this.form
        let flag = true
        if (form.couponType == null || form.couponType == '' || form.couponType == undefined) {
          this.$message({
            type: 'danger',
            message: '请选择优惠券类型！！'
          })
          flag = false
          return
        }

        if (form.couponName == null || form.couponName === '' || form.couponName === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写优惠券名称！！'
          })
          flag = false
          return
        }

        if (form.couponBeginTime == null || form.couponBeginTime === '' || form.couponBeginTime === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写有效开始时间！！'
          })
          flag = false
          return
        }

        if (form.couponEndTime == null || form.couponEndTime === '' || form.couponEndTime === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写有效结束时间！！'
          })
          flag = false
          return
        }

        if (form.deliveryWay == null || form.deliveryWay === '' || form.deliveryWay === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写发放方式！！'
          })
          flag = false
          return
        }

        if (form.discountType == null || form.discountType === '' || form.discountType === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写使用条件！！'
          })
          flag = false
          return
        }

        if (form.discountType === 1) {
          if (form.discountLimit == null || form.discountLimit === '' || form.discountLimit === undefined) {
            this.$message({
              type: 'danger',
              message: '请填写满减限制金额！！'
            })
            flag = false
            return
          }
        }

        if (form.couponDescription == null || form.couponDescription === '' || form.couponDescription === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写优惠券描述！！'
          })
          flag = false
          return
        }

        if (form.couponAmount == null || form.couponAmount === '' || form.couponAmount === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写单张面值！！'
          })
          flag = false
          return
        }

        if (form.gainedNumLimit == null || form.gainedNumLimit === '' || form.gainedNumLimit === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写单人领取数量！！'
          })
          flag = false
          return
        }

        if (form.couponTotalNumber == null || form.couponTotalNumber === '' || form.couponTotalNumber === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写发行数量！！'
          })
          flag = false
          return
        }

        if (form.destination == null || form.destination === '' || form.destination === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写使用对象！！'
          })
          flag = false
          return
        }

        if (form.couponReleaseWindow == null || form.couponReleaseWindow === '' || form.couponReleaseWindow === undefined) {
          this.$message({
            type: 'danger',
            message: '请填写优惠券来源！！'
          })
          flag = false
          return
        }
        console.log(form)
        form.couponBeginTime = new Date(form.couponBeginTime).getTime();
        form.couponEndTime = new Date(form.couponEndTime).getTime();
        if (flag) {
          let param = JSON.parse(JSON.stringify(form))
          param.couponAmount = +param.couponAmount * 100
          param.discountLimit = +param.discountLimit * 100
          updateCoupon(param).then(response => {
            if (response.status === 0) {
              this.$message({
                type: 'success',
                message: response.message
              });
              this.back();
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
  }
</script>

<style scoped>

</style>
