<template>
  <div class="app-container" style="min-width: 1250px">
    <el-form :model="form" label-width="80px" ref="form">
      <el-row>
        <el-form-item :required="true" label="产品分类">
          <el-select :disabled="pageType=='cat'" placeholder="请选择二级分类" v-model="levelTwoCategoryID">
            <el-option
              :key="item.categoryID"
              :label="item.categoryName"
              :value="item.categoryID"
              v-for="item in categoryLevelTwoList"
            ></el-option>
          </el-select>
          <el-select
            :disabled="pageType=='cat'"
            placeholder="请选择三级分类"
            v-model="levelThreeCategoryID"
          >
            <el-option
              :key="item.categoryID"
              :label="item.categoryName"
              :value="item.categoryID"
              v-for="item in categoryLevelThreeList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="产品编号">
            <el-input :disabled="pageType=='cat'" v-model="form.product.productCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="产品标题">
            <el-input :disabled="pageType=='cat'" v-model="form.product.productName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="产品简介">
            <el-input
              maxlength="200"
              :disabled="pageType=='cat'"
              type="textarea"
              v-model="form.product.productDescription"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="主图视频">
            <el-col :span="4">
              <update-video
                :disabled="pageType=='cat'"
                :id="1"
                :img-type="10"
                :img-url="form.product.titleVideo"
                @add-image="addVideo($event)"
                @remove-image="removeVideo($event)"
              />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :required="true" label="产品图片">
            <el-row>
              <el-col :span="4">
                <update-img
                  :disabled="pageType=='cat'"
                  :id="1"
                  :img-type="1"
                  :img-url="form.product.titleImg"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :disabled="pageType=='cat'"
                  :id="2"
                  :img-type="2"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=1?form.commonImage[0].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :disabled="pageType=='cat'"
                  :id="3"
                  :img-type="2"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=2?form.commonImage[1].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :disabled="pageType=='cat'"
                  :id="4"
                  :img-type="2"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=3?form.commonImage[2].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :disabled="pageType=='cat'"
                  :id="5"
                  :img-type="2"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=4?form.commonImage[3].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
            </el-row>
            <span style="color: #c2c2c2">*最多可以上传五张图片,第一张为产品主图,建议尺寸800*800像素,附件建议尺寸750*500像素,大小均不超过3M</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="产品详情">
            <tinymce
              :height="300"
              v-if="pageType!='cat'"
              v-model="form.productDetail.appDescription"
            />
            <div
              style="max-height: 300px;overflow-y:auto;"
              v-else
              v-html="form.productDetail.appDescription"
            ></div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="产品规格">
            <el-button :disabled="pageType=='cat'" @click="addStandard" type="primary">添加规格</el-button>
            <el-row>
              <el-row :gutter="10">
                <el-col :span="4">尺寸</el-col>
                <el-col :span="4">原价</el-col>
                <el-col :span="4">批发价</el-col>
                <el-col :span="12">颜色</el-col>
              </el-row>
              <el-row
                :gutter="10"
                style="margin-bottom: 10px"
                v-for="(item,index) in standardList"
                :key="index"
                v-if="standardList!=null&&standardList.length>0"
              >
                <el-col :span="4">
                  <el-input
                    :disabled="pageType=='cat'"
                    placeholder="例 1.5*2.0"
                    v-model="item.standard"
                  ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-input
                    :disabled="pageType=='cat'"
                    placeholder="例 1200"
                    v-model="item.bandPrice"
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <el-input
                    :disabled="pageType=='cat'"
                    placeholder="例 1200"
                    v-model="item.tradePrice "
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="11">
                  <el-row
                    :gutter="10"
                    v-for="(productStandardsColour,productStandardsColourIndex) in item.productStandardsColours"
                    :key="productStandardsColourIndex"
                    v-if="item.productStandardsColours!=null&&item.productStandardsColours.length>0"
                  >
                    <el-col :span="3">
                      <update-img-for-standards
                        :disabled="pageType=='cat'"
                        :id="productStandardsColour.tempId"
                        :img-type="5"
                        :img-url="productStandardsColour.colourImage"
                        @add-image="addStandardsColourImage($event)"
                      />
                    </el-col>
                    <el-col :span="9">
                      <el-input
                        :disabled="pageType=='cat'"
                        placeholder="例 象牙白"
                        v-model="productStandardsColour.colourName"
                      ></el-input>
                    </el-col>
                    <el-col :span="8">
                      <el-input
                        :disabled="pageType=='cat'"
                        placeholder="库存"
                        v-model="productStandardsColour.productStockNum"
                      >
                        <template slot="append">件</template>
                      </el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        @click="removeProductStandardsColour(item,productStandardsColourIndex)"
                        circle
                        icon="el-icon-delete"
                        type="danger"
                        v-if="pageType!='cat'"
                      ></el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-button
                      @click="addProductStandardsColour(item)"
                      circle
                      icon="el-icon-plus"
                      type="primary"
                      v-if="pageType!='cat'"
                    ></el-button>
                  </el-row>
                </el-col>

                <el-col :span="1">
                  <el-button @click="removeStandard(index)" type="danger" v-if="pageType!='cat'">删除</el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="产品类型">
            <el-radio-group :disabled="pageType=='cat'" v-model="form.product.isSpecialGoods ">
              <el-radio :label="2">普通产品</el-radio>
              <el-radio :label="1">会员专属产品</el-radio>
              <el-select
                :disabled="pageType=='cat'"
                v-if="form.product.isSpecialGoods === 1"
                v-model="form.product.vipProductType"
                value="1"
              >
                <el-option :key="1" :value="1" label="专享好物"></el-option>
                <el-option :key="2" :value="2" label="99元专区"></el-option>
              </el-select>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="售后服务">
            <span style="font-size: 13px;color:#8b8b8b ">
              从家具产品交货之日起,严格执行国家有关家具产品的三包规定执行,提供优质的售后服务。
              <br />(定制产品不退还,请联系客服进行维修)
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item :required="true" label="上架时间">
            <el-radio-group :disabled="pageType=='cat'" v-model="form.product.state">
              <el-radio :label="1">立即上架</el-radio>
              <el-radio :label="3">放入仓库</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="10" :span="24">
          <el-form-item>
            <el-button @click="back">返回</el-button>
            <el-button @click="onSubmit" type="primary" v-if="pageType=='new'">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addProduct, productDetail } from "@/api/product";
import { categoryLevelTwoListByPage } from "@/api/category";
import UpdateImg from "./UpdateImg";
import UpdateImgForStandards from "./UpdateImgForStandards";
import Tinymce from "@/components/Tinymce";
import UpdateVideo from "./UpdateVideo";

export default {
  components: { UpdateImg, UpdateImgForStandards, Tinymce, UpdateVideo },

  data() {
    return {
      imgs: [
        {
          imageUrl: "",
          id: 1,
          uid: undefined,
          imgType: 1,
        },
        {
          imageUrl: "",
          id: 2,
          uid: undefined,
          imgType: 2,
        },
        {
          imageUrl: "",
          id: 3,
          uid: undefined,
          imgType: 2,
        },
        {
          imageUrl: "",
          id: 4,
          uid: undefined,
          imgType: 2,
        },
        {
          imageUrl: "",
          id: 5,
          uid: undefined,
          imgType: 2,
        },
      ],
      content: ``,
      proID: undefined,
      levelTwoCategoryID: "",
      levelThreeCategoryID: "",
      categoryLevelTwoList: [],
      categoryLevelThreeList: [],
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
        product: {
          productCode: "",
          state: 1,
          levelThreeCategoryID: "",
          levelTwoCategoryID: "",
          levelOneCategoryID: 1,
          productName: "",
          productDescription: "",
          isSpecialGoods: 2,
          vipProductType: 1,
          titleImg: "",
          titleVideo: "",
        },
        productDetail: { appDescription: "" },
        commonImages: [],
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
    pageType: {
      type: String,
      default: "new",
    },
    productId: {
      type: Number,
      default: undefined,
    },
  },
  watch: {
    levelTwoCategoryID: {
      handler(newName, oldName) {
        if (newName != oldName) {
          this.form.product.levelTwoCategoryID = newName;
          this.getLevelTwoCategoryIDList(newName);
        }
        // ...
      },
      immediate: true,
    },
    levelThreeCategoryID: {
      handler(newName, oldName) {
        if (newName != oldName) {
          this.form.product.levelThreeCategoryID = newName;
        }
        // ...
      },
      immediate: true,
    },
  },
  created() {
    this.getCategoryLevelTwoListByPage();
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
          this.form.product = response.data;
          this.form.productDetail = response.data.productDetail;
          this.form.commonImage = response.data.commonImage;
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
            });
          }
          this.standardList = response.data.productStandards;
          this.levelTwoCategoryID = response.data.levelTwoCategoryID;
          this.levelThreeCategoryID = response.data.levelThreeCategoryID;
        }
      });
    },
    onSubmit() {
      var form = this.form;
      let flag = true;
      console.log(JSON.stringify(form));
      if (
        form.product.levelThreeCategoryID == null ||
        form.product.levelThreeCategoryID == ""
      ) {
        this.$message({
          type: "danger",
          message: "请选择产品分类！！",
        });
        flag = false;
        return;
      }

      if (form.product.productName == null || form.product.productName == "") {
        this.$message({
          type: "danger",
          message: "请填写产品标题！！",
        });
        flag = false;
        return;
      }
      if (
        form.product.productDescription == null ||
        form.product.productDescription == ""
      ) {
        this.$message({
          type: "danger",
          message: "请填写产品简介！！",
        });
        flag = false;
        return;
      }
      if (
        form.productDetail.appDescription == null ||
        form.productDetail.appDescription == ""
      ) {
        this.$message({
          type: "danger",
          message: "请填写产品详情！！",
        });
        flag = false;
        return;
      }
      if (this.imgs == null || this.imgs.length == 0) {
        this.$message({
          type: "danger",
          message: "请上传产品图片！！",
        });
        flag = false;
        return;
      }
      form.commonImages = [];
      this.imgs.forEach((item) => {
        if (item.imgType == 1) {
          form.product.titleImg = item.imageUrl;
        }
        if (item.imgType == 2) {
          if (item.imageUrl != "") {
            form.commonImages.push({ imageUrl: item.imageUrl });
          }
        }
      });
      if (form.commonImages == null || form.commonImages.length == 0) {
        this.$message({
          type: "danger",
          message: "请上传产品附图！！",
        });
        flag = false;
        return false;
      }
      if (form.product.titleImg == null || form.product.titleImg == "") {
        this.$message({
          type: "danger",
          message: "请上传产品主图！！",
        });
        flag = false;
        return false;
      }
      // if (form.product.titleVideo == null || form.product.titleVideo == "") {
      //   this.$message({
      //     type: "danger",
      //     message: "请上传产品视频！！",
      //   });
      //   flag = false;
      //   return false;
      // }
      if (this.standardList == null || this.standardList.length == 0) {
        this.$message({
          type: "danger",
          message: "请添加产品规格！！",
        });
        flag = false;
        return false;
      }
      form.productStandardsDTOS = [];
      this.standardList.forEach((item) => {
        if (item.standard == null || item.standard == "") {
          this.$message({
            type: "danger",
            message: "请填写产品规格尺寸！！",
          });
          flag = false;
          return false;
        }
        if (item.bandPrice != null && item.bandPrice != "") {
          // item.bandPrice = item.bandPrice * 100;
        } else {
          this.$message({
            type: "danger",
            message: "请填写产品规格原价！！",
          });
          flag = false;
          return false;
        }
        if (item.tradePrice != null && item.tradePrice != "") {
          // item.tradePrice = item.tradePrice * 100;
        } else {
          this.$message({
            type: "danger",
            message: "请填写产品规格批发价！！",
          });
          flag = false;
          return false;
        }
        let productStandardsDTO = {
          bandPrice: item.bandPrice,
          productStandardsColours: [],
          standard: item.standard,
          state: item.state,
          tradePrice: item.tradePrice,
        };
        item.productStandardsColours.forEach((productStandardsColour) => {
          if (
            productStandardsColour.colourImage == null ||
            productStandardsColour.colourImage == ""
          ) {
            this.$message({
              type: "danger",
              message: "请上传产品规格颜色图片！！",
            });
            flag = false;
            return false;
          }
          if (
            productStandardsColour.colourName == null ||
            productStandardsColour.colourName == ""
          ) {
            this.$message({
              type: "danger",
              message: "请填写产品规格颜色！！",
            });
            flag = false;
            return false;
          }
          if (
            productStandardsColour.productStockNum == null ||
            productStandardsColour.productStockNum == ""
          ) {
            this.$message({
              type: "danger",
              message: "请填写产品规格颜色库存！！",
            });
            flag = false;
            return false;
          }
          productStandardsDTO.productStandardsColours.push({
            colourImage: productStandardsColour.colourImage,
            colourName: productStandardsColour.colourName,
            productStockNum: productStandardsColour.productStockNum,
            state: productStandardsColour.state,
          });
        });
        form.productStandardsDTOS.push(productStandardsDTO);
      });
      console.log('*****', form);
      if (flag) {
        this.form.productStandardsDTOS.forEach((item) => {
          if (item.bandPrice != null && item.bandPrice != "") {
            item.bandPrice = item.bandPrice * 100;
          }
          if (item.tradePrice != null && item.tradePrice != "") {
            item.tradePrice = item.tradePrice * 100;
          }
        })
        addProduct(form).then((response) => {
          if (response.status == 1) {
            this.$message({
              type: "success",
              message: "创建成功！",
            });
            this.back();
          } else {
            this.$message({
              type: "danger",
              message: response.message,
            });
          }
        });
      }
    },
    getLevelTwoCategoryIDList(levelOneCategoryID) {
      if (
        this.categoryLevelTwoList != null &&
        this.categoryLevelTwoList.length > 0
      ) {
        this.categoryLevelTwoList.forEach((item) => {
          if (item.categoryID == levelOneCategoryID) {
            this.categoryLevelThreeList = item.productCategoryLevelThrees;
            return;
          }
        });
      }
    },
    getCategoryLevelTwoListByPage() {
      categoryLevelTwoListByPage().then((response) => {
        if (response.data.list.length > 0) {
          this.categoryLevelTwoList = response.data.list;
        }
        if (this.pageType == "cat") {
          this.getProductDetail();
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
    addImage(img) {
      this.imgs[img.id - 1] = img;
      console.log("ss", img.id - 1, this.imgs);
    },
    removeImage(img) {
      this.imgs[img.id - 1] = img;
      console.log("ss", img.id - 1, this.imgs);
    },
    addVideo(video) {
      console.log(video);
      this.form.product.titleVideo = video.imageUrl;

      // this.imgs[img.id - 1] = img
      // console.log('ss', img.id - 1, this.imgs)
    },
    removeVideo(video) {
      console.log(video);
      this.form.product.titleVideo = "";
      // this.imgs[img.id - 1] = img
      // console.log('ss', img.id - 1, this.imgs)
    },
  },
};
</script>
