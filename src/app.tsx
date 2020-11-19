import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import Index from './pages/index';
import { response, needStoreIdRequest } from './utils/interceptors';
import checkAppUpdate from './utils/check-app-update';
import './app.scss';
import { authorize, authorize1 } from '@/api/login';
import './styles/custom-variables.scss';  // 全局引入一次即可

Taro.addInterceptor(needStoreIdRequest);
Taro.addInterceptor(response);

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: ['pages/home/index', 'pages/authorize/index', 'pages/personal/index'],
    subPackages: [
      {
        root: 'pagesCommon',
        pages: [
          'store-enter/store-enter',
          'auth-msg/auth-msg',
          'setting/setting',
          'deposit/deposit',
          'trade-control/trade-control',
          'addgoods/addgoods',
          'editgoods/editgoods',
          'addstand/addstand',
          'manager/manager',
          'order-detail/order-detail',
          'alter/alter',
          'remark/remark',
          'replacement/replacement',
          'refund-order/refund-order',
          'dispose-refund/dispose-refund',
          'turn-refund/turn-refund',
          'customer/customer',
          'coupons/coupons',
          'creatCoupon/creatCoupon',
          'addBanner/addBanner',
          'saverota/saverota',
          'select-goods/select-goods',
          'goods-common/goods-common',
          'stand-detail/stand-detail',
          'single-specs/index',
          'editor/editor',
          'coupon-detail/coupon-detail',
          'information/information',
          'getPhone/getPhone',
          'phone-login/phone-login',
          'invoiced/invoiced',
          'printer/list/index',
          'store-list/storelist',
          'addclass/addclass'
        ]
      },
      {
        root: 'pagesMall',
        pages: [
          'soldcust/soldcust',
          'credit-client/credit-client',
          'bill-list/bill-list',
          'addcredit/addcredit',
          'order-client/order-client',
          'candraw/candraw',
          'account-list/account-list',
          'deposite/deposite',
          'bankinfo/bankinfo',
          'cashpost/cashpost',
          'margin/margin',
          'payback/payback',
          'repayment/repayment',
          'covercost/covercost',
          'practice/practice',
          'receivable/receivable',
          'gross/gross',
          'exchange/exchange',
          'settlement/settlement',
        ]
      },
      {
        root: 'pagesInfo',
        pages: [
          'store-info/store-info',
          'distway/distway',
          'salesite/salesite',
          'aboutUs/aboutUs',
          'setting/setting',
          'changepsw/changepsw',
          'referrer/referrer',
          'recom/recom',
          'protocol/protocol',
          'invite/invite',
          'shareCoupon/index',
        ]
      }
    ],
    window: {
      backgroundColor: '#f3f3f3',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '丰盈e鲜店铺',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      selectedColor: '#1BBC3D',
      color: '#000',
      list: [
        {
          text: '首页',
          pagePath: 'pages/home/index',
          iconPath: './images/tabbar/gy-icon_80.png',
          selectedIconPath: './images/tabbar/gy-icon_11.png'
        },
        {
          text: '我的',
          pagePath: 'pages/personal/index',
          iconPath: './images/tabbar/gy-icon_89.png',
          selectedIconPath: './images/tabbar/gy-icon_67.png'
        }
      ]
    }
  };

  globalData = {
    addressId: ''
  };
  componentDidMount() {
    checkAppUpdate();
    Taro.clearStorageSync();
    // this.getcode();
    // Taro.removeStorageSync('productParams')
    // Taro.removeStorageSync('totaldata')
    // Taro.removeStorageSync('id')
    // Taro.removeStorageSync('name')
    // Taro.removeStorageSync('editorContent')
    // Taro.removeStorageSync('standList')
    // Taro.removeStorageSync('arrayItem')
    // Taro.removeStorageSync('phone')
    Taro.setStorageSync('imgHostItem', 'https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com/public/item/')
  }

  componentWillMount() { }

  // 获取code后调用接口获取sessionkey和openid
  getcode() {
    Taro.login().then(res => {
      // this.getsession(res.code);
    });
  }
  getsession = async code => {
    const res = await authorize(code);
    if (res.data.code == 20000) {
      Taro.setStorageSync('sessionId', res.data.data.sessionId);
      Taro.setStorageSync('code', code);
      Taro.setStorageSync('openid', res.data.data.openId);
      // Taro.setStorageSync('memberid', res.data.data.memberId)
    }
    const res1 = await authorize1();
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById('app'));
