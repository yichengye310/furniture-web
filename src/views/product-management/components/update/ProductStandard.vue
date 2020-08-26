<template>
  <div class="app-container" style="min-width: 1250px">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="20">
          <el-form-item label="产品规格" :required="true">
            <el-button @click="addStandard" type="primary">添加规格</el-button>
            <el-row>
              <el-row :gutter="10">
                <el-col :span="4">尺寸</el-col>
                <el-col :span="4">原价</el-col>
                <el-col :span="4">批发价</el-col>
                <el-col :span="12">颜色</el-col>
              </el-row>
              <el-row
                :gutter="10"
                v-if="standardList!=null&&standardList.length>0"
                v-for="(item,index) in standardList"
                :key="index"
                style="margin-bottom: 10px"
              >
                <el-col :span="4">
                  <el-input placeholder="例 1.5*2.0" v-model="item.standard"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-input placeholder="例 1200" v-model="item.bandPrice">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <el-input placeholder="例 1200" v-model="item.tradePrice ">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="11">
                  <el-row
                    :gutter="10"
                    v-if="item.productStandardsColours!=null&&item.productStandardsColours.length>0"
                    v-for="(productStandardsColour,productStandardsColourIndex) in item.productStandardsColours"
                  >
                    <el-col :span="3">
                      <update-img-for-standards
                        :img-type="5"
                        :id="productStandardsColour.tempId"
                        :img-url="productStandardsColour.colourImage"
                        @add-image="addStandardsColourImage($event)"
                      />
                    </el-col>
                    <el-col :span="9">
                      <el-input placeholder="例 象牙白" v-model="productStandardsColour.colourName"></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input placeholder="库存" v-model="productStandardsColour.productStockNum">
                        <template slot="append">件</template>
                      </el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        type="danger"
                        @click="removeProductStandardsColour(item,productStandardsColourIndex)"
                        icon="el-icon-delete"
                        circle
                      ></el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-button
                      type="primary"
                      @click="addProductStandardsColour(item)"
                      icon="el-icon-plus"
                      circle
                    ></el-button>
                  </el-row>
                </el-col>

                <el-col :span="1">
                  <el-button type="danger" @click="removeStandard(index)">删除</el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" :offset="10">
          <el-form-item>
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { updateProductStandards, productDetail } from "@/api/product";
import UpdateImg from "../UpdateImg";
import UpdateImgForStandards from "../UpdateImgForStandards";
import Tinymce from "@/components/Tinymce";
export default {
  components: { UpdateImg, UpdateImgForStandards, Tinymce },

  data() {
    return {
      standardList: [
        {
          bandPrice: "",
          productStandardsColours: [
            {
              tempId: "tempId" + new Date().getTime(),
              colourImage: "",
              colourName: "",
              productStockNum: "",
              state: 1,
            },
          ],
          standard: "",
          state: 1,
          tradePrice: "",
        },
      ],
      form: {
        productID: undefined,
        productStandardsDTOS: [
          {
            bandPrice: "",
            productStandardsColours: [
              {
                colourImage: "",
                colourName: "默认",
                productStockNum: "",
                state: 1,
              },
            ],
            standard: "",
            state: 1,
            tradePrice: "",
          },
        ],
      },
    };
  },
  props: {
    productId: {
      type: Number,
      default: undefined,
    },
  },
  created() {
    this.getProductDetail();
  },
  methods: {
    //返回上一层
    back() {
      this.$emit("back");
    },
    //获取产品详情
    getProductDetail() {
      let queryParam = { productID: this.productId };
      productDetail(queryParam).then((response) => {
        if (response.status == 1) {
          this.form.productID = this.productId;
          if (
            response.data.productStandards != null &&
            response.data.productStandards.length > 0
          ) {
            response.data.productStandards.forEach((item) => {
              if (item.bandPrice != null && item.bandPrice != 0) {
                item.bandPrice = item.bandPrice / 100;
              }
              if (item.tradePrice != null && item.tradePrice != 0) {
                item.tradePrice = item.tradePrice / 100;
              }
              item.productStandardsColours.forEach((productStandardsColour) => {
                productStandardsColour.tempId = "tempId" + new Date().getTime();
              });
            });
          }
          this.standardList = response.data.productStandards;
        }
      });
    },
    onSubmit() {
      if (this.standardList == null || this.standardList.length == 0) {
        this.$message({
          type: "danger",
          message: "请添加产品规格！！",
        });
        return;
      }
      this.form.productStandardsDTOS = [];
      this.standardList.forEach((item) => {
        let productStandardsDTO = {
          bandPrice:
            item.bandPrice != null && item.bandPrice != 0
              ? item.bandPrice * 100
              : item.bandPrice,
          productStandardsColours: [],
          standard: item.standard,
          state: item.state,
          tradePrice:
            item.tradePrice != null && item.tradePrice != 0
              ? item.tradePrice * 100
              : item.tradePrice,
        };
        item.productStandardsColours.forEach((productStandardsColour) => {
          productStandardsDTO.productStandardsColours.push({
            colourImage: productStandardsColour.colourImage,
            colourName: productStandardsColour.colourName,
            productStockNum: productStandardsColour.productStockNum,
            state: productStandardsColour.state,
          });
        });
        this.form.productStandardsDTOS.push(productStandardsDTO);
      });
      /* 验证 */
      this.form.productStandardsDTOS.forEach(item => {
        if (item.standard==null||item.standard=='') {
          this.$message({
            type: 'danger',
            message: "请填写尺寸！！"
          });
          throw new Error('请填写尺寸！！')
        }
        if (item.bandPrice==null||item.bandPrice=='') {
          this.$message({
            type: 'danger',
            message: "请填写原价！！"
          });
          throw new Error('请填写原价！！')
        }
        if (item.tradePrice==null||item.tradePrice=='') {
          this.$message({
            type: 'danger',
            message: "请填写批发价！！"
          });
          throw new Error('请填写批发价！！')
        }
        item.productStandardsColours.forEach(child => {
          if (child.colourImage==null||child.colourImage=='') {
            this.$message({
              type: 'danger',
              message: "请上传图片！！"
            });
            throw new Error('请上传图片！！')
          }
          if (child.colourName==null||child.colourName=='') {
            this.$message({
              type: 'danger',
              message: "请填写颜色名称！！"
            });
            throw new Error('请填写颜色名称！！')
          }
          if (child.productStockNum==null||child.productStockNum=='') {
            this.$message({
              type: 'danger',
              message: "请填写库存！！"
            });
            throw new Error('请填写库存！！')
          }
        })
      })
      console.log(this.form);
      updateProductStandards(this.form).then((response) => {
        if (response.status == 1) {
          this.$message({
            type: "success",
            message: "修改成功！",
          });
        } else {
          this.$message({
            type: "danger",
            message: response.message,
          });
        }
      });
    },
    addStandard() {
      this.standardList.push({
        bandPrice: "",
        productStandardsColours: [
          {
            tempId: "tempId" + new Date().getTime(),
            colourImage: "",
            colourName: "默认",
            productStockNum: "",
            state: 1,
          },
        ],
        standard: "",
        state: 1,
        tradePrice: "",
      });
    },
    addProductStandardsColour(item) {
      const productStandardsColour = {
        tempId: "tempId" + new Date().getTime(),
        colourImage: "",
        colourName: "默认",
        productStockNum: "",
        state: 1,
      };
      if (item.productStandardsColours != null) {
        item.productStandardsColours.push(productStandardsColour);
      } else {
        item.productStandardsColours = [productStandardsColour];
      }
    },
    removeProductStandardsColour(item, index) {
      if (item.productStandardsColours.length <= 1) {
        this.$message.error("至少保留一种规格颜色!");
      } else {
        item.productStandardsColours.splice(index, 1);
      }
    },
    removeStandard(index) {
      if (this.standardList.length <= 1) {
        this.$message.error("至少保留一种规格颜色!");
      } else {
        this.standardList.splice(index, 1);
      }
    },
    addStandardsColourImage(img) {
      console.log(img);
      this.standardList.forEach((standard, index) => {
        standard.productStandardsColours.forEach(
          (productStandardsColour, index) => {
            if (productStandardsColour.tempId == img.tempId) {
              productStandardsColour.colourImage = img.imageUrl;
              return true;
            }
          }
        );
      });
      console.log("ss", this.standardList);
    },
  },
};
</script>
