<template>
  <div class="app-container" style="min-width: 1250px">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="产品编号">
            <el-input v-model="form.productCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="产品标题" :required="true">
            <el-input v-model="form.productName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="产品简介" :required="true">
            <el-input type="textarea" v-model="form.productDescription"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="产品图片" :required="true">
            <el-row>
              <el-col :span="4">
                <update-img
                  :img-type="8"
                  :id="1"
                  :img-url="form!=null?form.activityImg:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :img-type="9"
                  :id="2"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=1?form.commonImage[0].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :img-type="9"
                  :id="3"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=2?form.commonImage[1].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :img-type="9"
                  :id="4"
                  :img-url="form!=null&&form.commonImage!=null&&form.commonImage.length>=3?form.commonImage[2].imageUrl:''"
                  @add-image="addImage($event)"
                  @remove-image="removeImage($event)"
                />
              </el-col>
              <el-col :span="4">
                <update-img
                  :img-type="9"
                  :id="5"
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
          <el-form-item label="产品详情" :required="true">
            <tinymce v-model="form.productLimitedTimeDetail.appDescription" :height="300" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="discountWay==2?22:20">
          <el-form-item label="产品规格" :required="true">
            <el-button @click="addStandard" type="primary">添加规格</el-button>
            <el-row>
              <el-row :gutter="10">
                <el-col :span="discountWay==2?3:4">尺寸</el-col>
                <el-col :span="discountWay==2?3:4">原价</el-col>
                <el-col :span="discountWay==2?3:4" v-if="discountWay==2">折后价</el-col>
                <el-col :span="discountWay==2?3:4">批发价</el-col>
                <el-col :span="12">颜色</el-col>
              </el-row>
              <el-row
                :gutter="10"
                v-if="standardList!=null&&standardList.length>0"
                v-for="(item,index) in standardList"
                :key="index"
                style="margin-bottom: 10px"
              >
                <el-col :span="discountWay==2?3:4">
                  <el-input placeholder="例 1.5*2.0" v-model="item.standard"></el-input>
                </el-col>
                <el-col :span="discountWay==2?3:4">
                  <el-input placeholder="例 1200" v-model="item.originalPrice">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="discountWay==2?3:4" v-if="discountWay==2">
                  <el-input placeholder="例 1200" v-model="item.discountPrice ">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="discountWay==2?3:4">
                  <el-input placeholder="例 1200" v-model="item.tradePrice ">
                    <template slot="append">元</template>
                  </el-input>
                </el-col>
                <el-col :span="11">
                  <el-row
                    :gutter="10"
                    v-if="item.productLimitedTimeStandardsColour!=null&&item.productLimitedTimeStandardsColour.length>0"
                    v-for="(productStandardsColour,productStandardsColourIndex) in item.productLimitedTimeStandardsColour"
                  >
                    <el-col :span="3">
                      <update-img-for-standards
                        :img-type="5"
                        :id="productStandardsColour.tempId"
                        :img-url="productStandardsColour.colourImage"
                        @add-image="addStandardsColourImage($event)"
                      />
                    </el-col>
                    <el-col :span="13">
                      <el-input placeholder="例 象牙白" v-model="productStandardsColour.colourName"></el-input>
                    </el-col>
                    <el-col :span="8">
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
        <el-col :span="10">
          <el-form-item label="限购数量" :required="true">
            <el-input v-model="form.limitNum">
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="单人限购" :required="true">
            <el-input v-model="form.personLimitNum">
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="售后服务" :required="true">
            <span style="font-size: 13px;color:#8b8b8b ">
              从家具产品交货之日起,严格执行国家有关家具产品的三包规定执行,提供优质的售后服务。
              <br />(定制产品不退还,请联系客服进行维修)
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" :offset="10">
          <el-form-item>
            <el-button @click="back">返回</el-button>
            <el-button v-if="pageType=='new'" type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { addProduct, productDetail } from "@/api/product";
// import { categoryLevelTwoListByPage } from '@/api/category'
import UpdateImg from "./UpdateImg";
import UpdateImgForStandards from "./UpdateImgForStandards";
import Tinymce from "@/components/Tinymce";
const formTemp = {
  productCode: "",
  status: 1,
  startTime: undefined,
  endTime: undefined,
  limitNum: undefined,
  personLimitNum: undefined,
  discountWay: undefined,
  full: undefined,
  reduce: undefined,
  activeObject: undefined,
  productName: "",
  productDescription: "",
  activityImg: "",
  productLimitedTimeDetail: { appDescription: "" },
  commonImages: [],
  productLimitedTimeStandardsDTOS: [
    {
      originalPrice: "",
      discountPrice: "",
      productLimitedTimeStandardsColour: [
        {
          tempId: "tempId" + new Date().getTime(),
          colourImage: "",
          colourName: "默认",
          state: 1,
        },
      ],
      standard: "",
      state: 1,
      tradePrice: "",
    },
  ],
};
const imgDemo = [
  {
    imageUrl: "",
    id: 1,
    uid: undefined,
    imgType: 8,
  },
  {
    imageUrl: "",
    id: 2,
    uid: undefined,
    imgType: 9,
  },
  {
    imageUrl: "",
    id: 3,
    uid: undefined,
    imgType: 9,
  },
  {
    imageUrl: "",
    id: 4,
    uid: undefined,
    imgType: 9,
  },
  {
    imageUrl: "",
    id: 5,
    uid: undefined,
    imgType: 9,
  },
];
export default {
  components: { UpdateImg, UpdateImgForStandards, Tinymce },
  data() {
    return {
      imgs: [
        {
          imageUrl: "",
          id: 1,
          uid: undefined,
          imgType: 8,
        },
        {
          imageUrl: "",
          id: 2,
          uid: undefined,
          imgType: 9,
        },
        {
          imageUrl: "",
          id: 3,
          uid: undefined,
          imgType: 9,
        },
        {
          imageUrl: "",
          id: 4,
          uid: undefined,
          imgType: 9,
        },
        {
          imageUrl: "",
          id: 5,
          uid: undefined,
          imgType: 9,
        },
      ],
      content: ``,
      proID: undefined,
      standardList: [
        {
          originalPrice: "",
          discountPrice: "",
          productLimitedTimeStandardsColour: [
            {
              tempId: "tempId" + new Date().getTime(),
              colourImage: "",
              colourName: "",
              state: 1,
            },
          ],
          standard: "",
          state: 1,
          tradePrice: "",
        },
      ],
      form: {
        productCode: "",
        status: 1,
        startTime: undefined,
        endTime: undefined,
        limitNum: undefined,
        personLimitNum: undefined,
        discountWay: undefined,
        full: undefined,
        reduce: undefined,
        activeObject: undefined,
        productName: "",
        productDescription: "",
        activityImg: "",
        productLimitedTimeDetail: { appDescription: "" },
        commonImages: [],
        productLimitedTimeStandardsDTOS: [
          {
            originalPrice: "",
            discountPrice: "",
            productLimitedTimeStandardsColour: [
              {
                tempId: "tempId" + new Date().getTime(),
                colourImage: "",
                colourName: "默认",
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
    productItem: {
      type: Object,
      default: undefined,
    },
    discountWay: {
      type: Number,
      default: undefined,
    },
  },
  watch: {
    productItem: {
      handler(newName, oldName) {
        if (newName != oldName) {
        }
        // ...
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.productItem != undefined) {
      this.form = JSON.parse(JSON.stringify(this.productItem));
      this.form.commonImage = this.form.commonImages;
      this.imgs = imgDemo;
      this.imgs[0] = {
        imageUrl: this.form.activityImg,
        id: 1,
        uid: new Date().getTime() + "tempId",
        imgType: 8,
      };
      if (this.form.commonImages != null && this.form.commonImages.length > 0) {
        this.form.commonImages.forEach((item, index) => {
          let img = {
            imageUrl: item.imageUrl,
            id: index + 2,
            uid: new Date().getTime() + "tempId",
            imgType: 9,
          };
          this.imgs[index + 1] = img;
        });
      }
      this.standardList = this.form.productLimitedTimeStandardsDTOS;
      if (this.standardList != null && this.standardList.length > 0) {
        this.standardList.forEach((item) => {
          if (item.originalPrice != null && item.originalPrice != 0) {
            item.originalPrice = item.originalPrice / 100;
          }
          if (item.discountPrice != null && item.discountPrice != 0) {
            item.discountPrice = item.discountPrice / 100;
          }
          if (item.tradePrice != null && item.tradePrice != 0) {
            item.tradePrice = item.tradePrice / 100;
          }
        });
      }
    } else {
      console.log(
        "mounted:" + JSON.stringify(this.form.productLimitedTimeStandardsDTOS)
      );
      // this.form = formTemp;
      this.form.commonImage = [];
      // this.imgs = imgDemo;
      this.standardList = this.form.productLimitedTimeStandardsDTOS;
    }
  },
  created() {
    // this.getCategoryLevelTwoListByPage()
    console.log("created: " + JSON.stringify(this.standardList));
  },
  methods: {
    //返回上一层
    back() {
      this.$emit("back-product-item");
      this.form = formTemp;
    },
    //获取产品详情
    getProductDetail() {},
    onSubmit() {
      var form = this.form;
      let flag = true;
      // if(form.product.levelThreeCategoryID==null||form.product.levelThreeCategoryID==""){
      //   this.$message({
      //     type: 'danger',
      //     message: "请选择产品分类！！"
      //   });
      //   flag=false;
      //   return;
      // }

      if (form.productName == null || form.productName == "") {
        this.$message({
          type: "danger",
          message: "请填写产品标题！！",
        });
        flag = false;
        return;
      }
      if (form.productDescription == null || form.productDescription == "") {
        this.$message({
          type: "danger",
          message: "请填写产品简介！！",
        });
        flag = false;
        return;
      }
      if (
        form.productLimitedTimeDetail.appDescription == null ||
        form.productLimitedTimeDetail.appDescription == ""
      ) {
        this.$message({
          type: "danger",
          message: "请填写产品详情！！",
        });
        flag = false;
        return;
      }
      if (form.limitNum == null || form.limitNum == "") {
        this.$message({
          type: "danger",
          message: "请填写限购数量！！",
        });
        flag = false;
        return;
      }
      if (form.personLimitNum == null || form.personLimitNum == "") {
        this.$message({
          type: "danger",
          message: "请填写单人限购数量！！",
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
        if (item.imgType == 8) {
          form.activityImg = item.imageUrl;
        }
        if (item.imgType == 9) {
          if (item.imageUrl != "") {
            form.commonImages.push({
              imageUrl: item.imageUrl,
              state: 1,
              flag: 5,
            });
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
      if (form.activityImg == null || form.activityImg == "") {
        this.$message({
          type: "danger",
          message: "请上传产品主图！！",
        });
        flag = false;
        return false;
      }
      if (this.standardList == null || this.standardList.length == 0) {
        this.$message({
          type: "danger",
          message: "请添加产品规格！！",
        });
        flag = false;
        return false;
      }
      form.productLimitedTimeStandardsDTOS = [];
      this.standardList.forEach((item) => {
        if (item.standard == null || item.standard == "") {
          this.$message({
            type: "danger",
            message: "请填写产品规格尺寸！！",
          });
          flag = false;
          return false;
        }
        if (item.originalPrice != null && item.originalPrice != "") {
          // item.originalPrice = item.originalPrice * 100;
        } else {
          this.$message({
            type: "danger",
            message: "请填写产品规格原价！！",
          });
          flag = false;
          return false;
        }
        if (this.discountWay == 2) {
          if (item.discountPrice != null && item.discountPrice != "") {
            // item.discountPrice = item.discountPrice * 100;
          } else {
            this.$message({
              type: "danger",
              message: "请填写产品规格折后价！！",
            });
            flag = false;
            return false;
          }
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
          originalPrice: item.originalPrice,
          productLimitedTimeStandardsColour: [],
          standard: item.standard,
          state: item.state,
          tradePrice: item.tradePrice,
        };
        console.log(JSON.stringify(item.productLimitedTimeStandardsColour));
        item.productLimitedTimeStandardsColour.forEach(
          (productStandardsColour) => {
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
            productStandardsDTO.productLimitedTimeStandardsColour.push({
              colourImage: productStandardsColour.colourImage,
              colourName: productStandardsColour.colourName,
              state: productStandardsColour.state,
            });
          }
        );
        form.productLimitedTimeStandardsDTOS.push(productStandardsDTO);
      });
      if (flag) {
        this.form.productLimitedTimeStandardsDTOS.forEach((item) => {
          if (item.bandPrice != null && item.bandPrice != "") {
            item.bandPrice = item.bandPrice * 100;
          }
          if (item.originalPrice != null && item.originalPrice != "") {
            item.originalPrice = item.originalPrice * 100;
          }
          // if (this.discountWay == 2) {
          //   if (item.discountPrice != null && item.discountPrice != "") {
          //     item.discountPrice = item.discountPrice * 100;
          //   }
          // }
        })
        if (this.productItem == undefined) {
          this.$emit("add-product", form);
        } else {
          this.$emit("edit-product", form);
        }
        this.form = formTemp;
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
    addStandard() {
      this.standardList.push({
        originalPrice: "",
        productLimitedTimeStandardsColour: [
          {
            tempId: "tempId" + new Date().getTime(),
            colourImage: "",
            colourName: "默认",
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
        state: 1,
      };
      if (item.productLimitedTimeStandardsColour != null) {
        item.productLimitedTimeStandardsColour.push(productStandardsColour);
      } else {
        item.productLimitedTimeStandardsColour = [productStandardsColour];
      }
    },
    removeProductStandardsColour(item, index) {
      console.log(item.productLimitedTimeStandardsColour.length);
      if (item.productLimitedTimeStandardsColour.length <= 1) {
        this.$message.error("至少保留一种规格颜色!");
      } else {
        item.productLimitedTimeStandardsColour.splice(index, 1);
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
      // console.log("image.tempId: " + img.tempId);
      console.log(JSON.stringify(this.standardList));
      this.standardList.forEach((standard, index) => {
        standard.productLimitedTimeStandardsColour.forEach(
          (productStandardsColour, index) => {
            console.log(
              "productStandardsColour.tempId: " +
                productStandardsColour.tempId +
                ", img.tempId: " +
                img.tempId
            );
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
  },
  beforeDestroy () {
    this.form = {
      productCode: "",
      status: 1,
      startTime: undefined,
      endTime: undefined,
      limitNum: undefined,
      personLimitNum: undefined,
      discountWay: undefined,
      full: undefined,
      reduce: undefined,
      activeObject: undefined,
      productName: "",
      productDescription: "",
      activityImg: "",
      productLimitedTimeDetail: { appDescription: "" },
      commonImages: [],
      productLimitedTimeStandardsDTOS: [
        {
          originalPrice: "",
          discountPrice: "",
          productLimitedTimeStandardsColour: [
            {
              tempId: "tempId" + new Date().getTime(),
              colourImage: "",
              colourName: "默认",
              state: 1,
            },
          ],
          standard: "",
          state: 1,
          tradePrice: "",
        },
      ],
    }
    this.imgs = [
      {
        imageUrl: "",
        id: 1,
        uid: undefined,
        imgType: 8,
      },
      {
        imageUrl: "",
        id: 2,
        uid: undefined,
        imgType: 9,
      },
      {
        imageUrl: "",
        id: 3,
        uid: undefined,
        imgType: 9,
      },
      {
        imageUrl: "",
        id: 4,
        uid: undefined,
        imgType: 9,
      },
      {
        imageUrl: "",
        id: 5,
        uid: undefined,
        imgType: 9,
      },
    ]
    this.standardList = [
      {
        originalPrice: "",
        discountPrice: "",
        productLimitedTimeStandardsColour: [
          {
            tempId: "tempId" + new Date().getTime(),
            colourImage: "",
            colourName: "",
            state: 1,
          },
        ],
        standard: "",
        state: 1,
        tradePrice: "",
      },
    ]
    console.log(this.form)
  }
};
</script>
