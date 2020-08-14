// 测试
// var api= 'https://test.ammsshop.com/admin-api'
// 正式
var api= 'https://www.ammsshop.com/admin-api'
var permission = [
  {
    code:'ProductManagement5345',
    id:'010000',
    name:'产品管理',
    children:[
      {
        code:'ForSale43246',
        id:'010100',
        name:'出售中',
        children:[
          {
            code:'ProductSearch5345',
            id:'010101',
            name:'产品搜索',
          },
          {
            code:'ProductView76657',
            id:'010102',
            name:'产品查看',
          },
          {
            code:'ProductOffTheShelf1234523',
            id:'010104',
            name:'产品下架',
          }]
      },
      {
        code:'NewProductRelease87453',
        id:'010200',
        name:'发布新品',
        children:[]
      },
      {
        code:'ProductWarehouse42343',
        id:'010300',
        name:'产品仓库',
        children:[
          {
            code:'ProductSearch',
            id:'010301',
            name:'产品搜索',
          },
          {
            code:'ProductEditor42352',
            id:'010303',
            name:'产品编辑',
          },
          {
            code:'ProductDelete',
            id:'010305',
            name:'产品删除',
          }]
      },
    ]
  },
  {
    code:'ProductGroup564521',
    id:'020000',
    name:'产品分组',
    children:[
      {
        code:'GroupManagement9402',
        id:'020100',
        name:'分组管理',
        children:[]
      },
    ]
  },
  {
    code:'OrderManagement753463',
    id:'030000',
    name:'订单管理',
    children:[
      {
        code:'ToBeDelivered432446',
        id:'030100',
        name:'待发货',
        children:[
          {
            id:'030101',
            code:'OrderSearch74532',
            name:'订单搜索',
          },
          {
            id:'030102',
            code:'OrderView52423',
            name:'订单查看',
          },
          {
            id:'030103',
            code:'OrderDelivery765527',
            name:'订单发货',
          }]
      },
      {
        code:'ToBeReceived634543',
        id:'030200',
        name:'待收货',
        children:[
          {
            id:'030201',
          code:'OrderSearch3423',
          name:'订单搜索',
        },
        {
          id:'030202',
          code:'OrderView76657',
          name:'订单详情',
        }]
      },
      {
        code:'OrderSelect42343',
        id:'030300',
        name:'订单查询',
        children:[
          {
           id:'030301',
          code:'OrderSearch4234',
          name:'订单搜索',
        },
        {
          id:'030302',
          code:'OrderView5345',
          name:'订单详情',
        }]
      },
      {
        code:'OrderCompleted42wqe3',
        id:'030400',
        name:'订单已完成',
        children:[
          {
            id:'030401',
          code:'OrderSearch4274',
          name:'订单搜索',
        },
        {
          id:'030402',
          code:'OrderView5365',
          name:'订单详情',
        },
        {
          id:'030403',
          code:'OrderDelete50343',
          name:'订单删除',
        }]
      },
      {
        id:'030500',
        code:'AfterSalesOrders422343',
        name:'售后订单',
        children:[
          {
            id:'030501',
          code:'OrderSearch43274',
          name:'订单搜索',
        },
        {
          id:'030502',
          code:'OrderView53615',
          name:'订单详情',
        },
        {
          id:'030503',
          code:'OrderProcess50345',
          name:'订单处理',
        }]
      },
    ]
  },
  {
    code:'Marketing7das63',
    name:'营销推广',
    id:'040000',
    children:[
      {
        id:'040100',
        code:'PosterMarketing235423',
        name:'海报营销',
        children:[
          {
            name:'添加海报',
            id:'040101',
            code:'AddPosterMarketing5421',
          },
          {
            name:'编辑海报',
            id:'040102',
            code:'EditPosterMarketing5222',
          },
          {
            name:'删除海报',
            id:'040103',
            code:'DeletePosterMarketing52574',
          },
        ]
      },
      {
        id:'040200',
        code:'HotRecommendation653463',
        name:'热门推荐',
        children:[
          {
          name:'添加推荐',
          id:'040201',
          code:'AddHotRecommendation5421',
        },
        {
          name:'编辑推荐',
          id:'040202',
          code:'EditHotRecommendation5222',
        },
          {
            name:'删除推荐',
            id:'040203',
            code:'DeleteHotRecommendation52574',
          },
        ]
      },
      {
        id:'040300',
        code:'SnappedUp63564',
        name:'限时抢购',
        children:[
          {
            name:'添加限时抢购',
            id:'040301',
            code:'AddSnappedUp524',
          },
          // {
          //   name:'查看抢购',
          //   id:'040302',
          //   code:'ViewPanicBuying52414',
          // },
          {
            name:'删除抢购',
            id:'040303',
            code:'DeletePanicBuying52574',
          },
        ]
      }, {
        id: '040400',
        code: 'coupon1234',
        name: '优惠券',
        children: [{
          name: '创建优惠券',
          id: '040401',
          code: 'addCoupon1234'
        }, {
          name: '编辑优惠券',
          id: '040402',
          code: 'editCoupon1234'
        }, {
          name: '终止优惠券',
          id: '040403',
          code: 'endCoupon1234'
        }, {
          name: '查询优惠券',
          id: '040404',
          code: 'SearchCoupon1234'
        }]
      }
    ]
  },
  {
    code:'CustomManagement1252',
    name:'定制管理',
    id:'070000',
    children:[
      {
        id:'070100',
        code:'CustomList673',
        name:'定制管理',
        children:[]
      },
    ]
  },
  {
    code:'AccountManagement432456',
    name:'权限管理',
    id:'050000',
    children:[
      {
        id:'050100',
        code:'RoleManagement5123233',
        name:'角色管理',
        children:[ {
          id:'050101',
          code:'AddRole23543',
          name:'添加角色',
        },
          {
            id:'050102',
            code:'Authorize7645',
            name:'授权',
          },
          {
            id:'050103',
            code:'deleteRole20412',
            name:'删除角色',
          },]
      },
      {
        id:'050200',
        code:'PageAccountManagement5233',
        name:'账户管理',
        children:[
          {
            id:'050201',
            code:'SearchAccount22343',
            name:'搜索账户',
          },
          {
            id:'050202',
            code:'AddAccount23573',
            name:'添加账户',
          },
          {
            id:'050203',
            code:'UpdateAccount2543',
            name:'编辑账户',
          },
          {
            id:'050204',
            code:'deleteAccount2043',
            name:'删除账户',
          },]
      },
    ]
  },
  {
    code:'UserManagement6452',
    name:'用户管理',
    id:'060000',
    children:[
      {
        id:'060100',
        code:'UserList6345',
        name:'用户列表',
        children:[{
          id:'060101',
          code:'Search5345',
          name:'用户搜索',
        }]
      },
    ]
  },
  {
    code:'LiveManagement6452',
    name:'直播管理',
    id:'070000',
    children:[
      {
        id:'070100',
        code: 'LiveList123',
        name:'直播列表',
        children:[{
          id:'070101',
          code:'ViewLiveProducts534',
          name:'查看商品',
        }]
      }, {
        id:'070200',
        code:'LiveList234',
        name:'商家列表',
        children:[{
          id:'070201',
          code:'AuthorizeLive1534',
          name:'授权商家直播',
        },{
          id:'070202',
          code:'SearchLiveUser123',
          name:'商家查询',
        }]
      }, {
        id:'070300',
        code:'LiveList345',
        name:'经销商列表',
        children:[{
          id:'070301',
          code:'AuthorizeLive2534',
          name:'授权经销商直播',
        },{
          id:'070302',
          code:'SearchLiveUser234',
          name:'经销商查询',
        }]
      }
    ]
  },
]

export default{
  apiUrl:function () {

    return api;

  },
  permission:function () {

    return permission;

  },

}