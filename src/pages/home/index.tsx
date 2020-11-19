import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Block } from "@tarojs/components";
import { AtBadge } from 'taro-ui'

// import Taro, { Component, Config } from "@tarojs/taro";
// import {
//   Block,
//   View,
//   Text,
//   Image
// } from "@tarojs/components";
import "./index.scss";
import { storeHome } from "@/api/userInfo"
import { audit } from '@/api/login';
import { authorize } from '@/api/common';
import { IMG_HOST } from "@/config";

export default class Index extends Component {

  state = {
    datalist: {},
    istype: '',
    toptitle: ''
  };
  onShareAppMessage() {
    return {
      title: '丰盈e鲜店铺',
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  getaudit = async () => {
    const res = await audit();
    if (res.data.code == 20000) {
      const istype = res.data.data.auditStatus
      this.setState({ istype });
    }
  };

  componentDidShow() {
    Taro.removeStorageSync('changeData')
    Taro.removeStorageSync('addData')
    // this.getaudit()
    this.setState({ datalist: {} })
    this.login()
  }
  // 静默授权
  async login() {
    const code = await Taro.login();
    console.log(code)
    Taro.setStorageSync('code', code.code)
    //重新授权
    const res = await authorize({ code: code.code });
    const { memberId, sessionId, isAutoLogin, storeId } = res.data.data;
    if (!isAutoLogin) {
      Taro.showModal({
        title: '温馨提示',
        content: '您还没有登录，请先登录后才能管理您的店铺',
        confirmText: '去登录',
        confirmColor: '#1bbc3d'
      }).then(res => {
        if (res.confirm) {
          Taro.redirectTo({ url: '/pages/authorize/index' })
        }
      })
    } else {
      this.getHomeList()
    }
    Taro.setStorageSync('memberId', memberId);
    Taro.setStorageSync('sessionId', sessionId);
    Taro.setStorageSync('storeId', storeId);
  }

  getHomeList = async () => {
    const res = await storeHome()
    this.setState({ toptitle: res.data.data.topTitle })
    // 后台说不用管年费的逻辑，只要是0或-1就去交保证金
    if (res.data.data.storeStatus == '0' || res.data.data.storeStatus == '-1') {
      Taro.showModal({
        content: res.data.data.topTitle,
        showCancel: false,
        success: (res => {
          if (res.confirm) {
            // 交保证金
            this.toDeposit('earnest')
          }
        })
      })
    } else if (res.data.data.storeStatus == '1') {
      const data = res.data.data
      // data.relTotalAmount = parseFloat(data.relTotalAmount / 100).toFixed(2)
      data.relTotalAmount = this.format(data.relTotalAmount)
      data.mustAmount = this.format(data.mustAmount)
      data.orderRelAmount = this.format(data.orderRelAmount)
      data.paymentAmount = this.format(data.paymentAmount)
      data.cashAmount = this.format(data.cashAmount)
      data.settlementAmount = this.format(data.settlementAmount)
      data.surplusMoney = this.format(data.surplusMoney)
      data.annualMoney = this.format(data.annualMoney)
      this.setState({ datalist: data })
    }
  }
  format(value) {
    let money = parseFloat(value / 100).toFixed(2)
    return money
  }
  // getpay() {
  //   Taro.showModal({
  //     title: '删除图片',
  //     content: '缴纳年费或保证金',
  //     showCancel: true,//是否显示取消按钮
  //     cancelText: "缴年费",//默认是“取消”
  //     cancelColor: 'skyblue',//取消文字的颜色
  //     confirmText: "缴保证金",//默认是“确定”
  //     confirmColor: 'skyblue',//确定文字的颜色
  //     success: function (res) {
  //       if (res.cancel) {
  //         //点击取消,默认隐藏弹框
  //         Taro.navigateTo({ url: '../../pagesCommon/deposit/deposit' })
  //       } else {
  //         Taro.navigateTo({ url: '../../pagesCommon/deposit/deposit' })
  //       }
  //     },
  //     fail: function (res) { },//接口调用失败的回调函数
  //     complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
  //   })
  // }
  showtips() {
    Taro.showToast({
      title: '缴纳金后才可使用全部功能哦',
      icon: 'none'
    })
  }
  // 年费
  goaunnal() {
    Taro.navigateTo({ url: '../../pagesCommon/deposit/deposit?comType=annual' })
  }
  // 去缴纳年费或保证金
  toDeposit(comType) {
    Taro.navigateTo({ url: '/pagesCommon/deposit/deposit?comType=' + comType })
  }
  // 去可提现金额
  gocandraw() {
    Taro.navigateTo({
      url: '../../pagesMall/candraw/candraw'
    })
  }
  // 跳商品管理
  commControl() {
    Taro.navigateTo({
      url: '../../pagesCommon/trade-control/trade-control'
    })
  }

  // 跳转到订单管理页面
  orderManager() {
    Taro.navigateTo({
      url: '../../pagesCommon/manager/manager'
    })
  }
  // 跳转补单页面
  relacement() {
    Taro.navigateTo({
      url: '../../pagesCommon/replacement/replacement'
    })
  }
  // 退款订单
  refundorder() {
    Taro.navigateTo({
      url: '../../pagesCommon/refund-order/refund-order'
    })
  }
  // 客户管理
  custmanager() {
    Taro.navigateTo({
      url: '../../pagesCommon/customer/customer'
    })
  }

  // 跳转到领券页面
  gocoupons() {
    Taro.navigateTo({
      url: '../../pagesCommon/coupons/coupons'
    })
  }
  // 跳转指轮播图管理
  gobanner() {
    Taro.navigateTo({
      url: '../../pagesCommon/addBanner/addBanner'
    })
  }
  goinvoiced() {
    Taro.navigateTo({
      url: '../../pagesCommon/invoiced/invoiced'
    })
  }
  // 打印机
  goprinter() {
    Taro.navigateTo({ url: '../../pagesCommon/printer/list/index' })
  }
  // 店铺分类
  gostoreList() {
    Taro.navigateTo({ url: '../../pagesCommon/store-list/storelist' })
  }
  config: Config = {
    "navigationBarTitleText": "丰盈e鲜店铺",
    "navigationBarTextStyle": "white",
    "navigationBarBackgroundColor": "#333744",
    "backgroundColor": "#333744",
    "backgroundColorTop": "#333744",
    "backgroundColorBottom": "#333744"
  };
  render() {
    const { datalist, toptitle } = this.state
    return (
      <Block>
        <View className="container column color">
          <View className='funds' onClick={() => { Taro.navigateTo({ url: '../../pagesMall/practice/practice' }) }}>
            <Text className="con-a">今日实收金额(元)</Text>
            <Text className="con-b">{datalist.relTotalAmount ? datalist.relTotalAmount : '0.00'}</Text>
            <Text className="con-c">订单共{datalist.totalNum ? datalist.totalNum : '0'}笔</Text>
          </View>
          <View className="perform per-money">
            {toptitle == '' ? (
              <View className="perform-a perform-title" onClick={() => { Taro.navigateTo({ url: '../../pagesMall/receivable/receivable' }) }}>
                <Text>应收金额(元)</Text>
                <Text>{datalist.mustAmount ? datalist.mustAmount : '0.00'}</Text>
              </View>
            ) : (
                <View className="perform-a perform-title" onClick={this.showtips}>
                  <Text>应收金额(元)</Text>
                  <Text>{datalist.mustAmount ? datalist.mustAmount : '0.00'}</Text>
                </View>
              )}

            {toptitle == '' ? (
              <View className="perform-a perform-title" onClick={() => { Taro.navigateTo({ url: '../../pagesMall/gross/gross' }) }}>
                <Text>订单毛利(元)</Text>
                <Text>{datalist.orderRelAmount ? datalist.orderRelAmount : '0.00'}</Text>
              </View>
            ) : (
                <View className="perform-a perform-title" onClick={this.showtips}>
                  <Text>订单毛利(元)</Text>
                  <Text>{datalist.orderRelAmount ? datalist.orderRelAmount : '0.00'}</Text>
                </View>
              )}

            {toptitle == '' ? (
              <View className="perform-a perform-title" onClick={() => { Taro.navigateTo({ url: '../../pagesMall/exchange/exchange' }) }}>
                <Text>账期金额(元)</Text>
                <Text>{datalist.paymentAmount ? datalist.paymentAmount : '0.00'}</Text>
              </View>
            ) : (
                <View className="perform-a perform-title" onClick={this.showtips}>
                  <Text>账期金额(元)</Text>
                  <Text>{datalist.paymentAmount ? datalist.paymentAmount : '0.00'}</Text>
                </View>
              )}

            {toptitle == '' ? (
              <View className="perform-a perform-title" onClick={() => { this.toDeposit('annual') }}>
                <Text>年费(元)</Text>
                <Text>{datalist.annualMoney ? datalist.annualMoney : '0.00'}</Text>
              </View>
            ) : (
                <View className="perform-a perform-title" onClick={this.showtips}>
                  <Text>年费(元)</Text>
                  <Text>{datalist.annualMoney ? datalist.annualMoney : '0.00'}</Text>
                </View>
              )}

          </View>
        </View>
        {/* onClick={() => { Taro.navigateTo({ url: '../../pagesCommon/deposit/deposit' }) }} */}
        {toptitle != '' && (
          <View className="cash" onClick={() => { this.toDeposit('earnest') }}>
            <Text>缴纳保证金后可使用全部功能</Text>
            <Text>去支付 ></Text>
          </View>
        )}

        {toptitle == '' ? (
          <Block>
            <View className="container column padd">
              <View className='store-view'>
                <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_31.png'}></Image>
                <Text>店铺概览</Text>
                <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_33.png'}></Image>
              </View>
              <View className="perform overView">
                <View className="perform-a per-b" onClick={this.gocandraw}>
                  <Text>{datalist.cashAmount ? datalist.cashAmount : '0.00'}</Text>
                  <Text>可提现金额</Text>
                  <Text>(元)</Text>
                </View>
                <View className="perform-a per-b" onClick={() => { Taro.navigateTo({ url: '../../pagesMall/settlement/settlement' }) }}>
                  <Text>{datalist.settlementAmount ? datalist.settlementAmount : '0.00'}</Text>
                  <Text>待结算金额(元)</Text>
                  <Text>(未完成订单)</Text>
                </View>
                <View className="perform-a per-b" onClick={() => { Taro.navigateTo({ url: '../../pagesMall/cashpost/cashpost' }) }}>
                  <Text>{datalist.surplusMoney ? datalist.surplusMoney : '0.00'}</Text>
                  <Text>保证金</Text>
                  <Text>(元)</Text>
                </View>
              </View>
              <View className="perform overView">
                <View className="perform-a number" onClick={this.candraw}>
                  <Text>累计客户数 <Text className='num'>{datalist.totalMemberNum}</Text></Text>
                  <View className='iconguyu icon-guyuliwu'></View>
                </View>
                <View className="perform-a number">
                  <Text>近3个月客户数 <Text className='num'>{datalist.threeMonthMemberNum}</Text></Text>
                </View>
                <View className="perform-a number">
                  <Text>在架商品数 <Text className='num'>{datalist.onlineProductNum}</Text></Text>
                </View>
              </View>
            </View>
            <View className="container six">
              <View className="flex">
                <View className="flex-box" onClick={this.commControl}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont5.png'}></Image>
                  <Text>商品管理</Text>
                </View>
                <View className="flex-box" onClick={this.orderManager}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont3.png'}></Image>
                  <Text>订单管理</Text>
                  {datalist.pdNum && datalist.pdNum.backOrderNum > 0 && (
                    // <View>{datalist.pdNum.backOrderNum}</View>
                    <View className='number'>
                      <AtBadge value={datalist.pdNum.backOrderNum} />
                    </View>
                  )}
                </View>
                <View className="flex-box" onClick={this.relacement}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont1.png'}></Image>
                  <Text>补单处理</Text>
                  {datalist.pdNum && datalist.pdNum.supplementOrderNum > 0 && (
                    // <View>{datalist.pdNum.supplementOrderNum}</View>
                    <View className='number'>
                      <AtBadge value={datalist.pdNum.supplementOrderNum} />
                    </View>
                  )}
                </View>
                <View className="flex-box" onClick={this.refundorder}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont6.png'}></Image>
                  <Text>退款订单</Text>
                  {datalist.pdNum && datalist.pdNum.afterSalesOrderNum > 0 && (
                    // <View>{datalist.pdNum.afterSalesOrderNum}</View>
                    <View className='number'>
                      <AtBadge value={datalist.pdNum.afterSalesOrderNum} />
                    </View>
                  )}
                </View>
                <View className="flex-box" onClick={this.gostoreList}>
                  <Image src={IMG_HOST + '/attachments/null/b2a0a5eb0a5f4e639c4a362e41d532a8.png'}></Image>
                  <Text>店铺分类</Text>
                </View>
                <View className="flex-box" onClick={this.custmanager}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont2.png'}></Image>
                  <Text>客户管理</Text>
                </View>
                <View className="flex-box" onClick={this.gocoupons}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont7.png'}></Image>
                  <Text>优惠券管理</Text>
                </View>
                <View className="flex-box" onClick={this.gobanner}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont4.png'}></Image>
                  <Text>轮播图管理</Text>
                </View>
                <View className="flex-box" onClick={this.goprinter}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfontPrinter.png'}></Image>
                  <Text>打印机管理</Text>
                </View>
                <View className="flex-box" onClick={this.goinvoiced}>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont88.png'}></Image>
                  <Text>开具发票</Text>
                  {datalist.pdNum && datalist.pdNum.orderInvoiceNum > 0 && (
                    // <View>{datalist.pdNum.orderInvoiceNum}</View>
                    <View className='number'>
                      <AtBadge value={datalist.pdNum.orderInvoiceNum} />
                    </View>
                  )}
                </View>

              </View>
            </View>
          </Block>
        ) : (
            <Block>
              <View className="container column padd">
                <View className='store-view'>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_31.png'}></Image>
                  <Text>店铺概览</Text>
                  <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_33.png'}></Image>
                </View>
                <View className="perform overView">
                  <View className="perform-a per-b" onClick={this.showtips}>
                    <Text>{datalist.cashAmount}</Text>
                    <Text>可提现金额</Text>
                    <Text>(元)</Text>
                  </View>
                  <View className="perform-a per-b" onClick={this.showtips}>
                    <Text>{datalist.settlementAmount}</Text>
                    <Text>待结算金额(元)</Text>
                    <Text>(未完成订单)</Text>
                  </View>
                  <View className="perform-a per-b" onClick={this.showtips}>
                    <Text>{datalist.surplusMoney}</Text>
                    <Text>保证金</Text>
                    <Text>(元)</Text>
                  </View>
                </View>
                <View className="perform overView">
                  <View className="perform-a number" onClick={this.showtips}>
                    <Text>累计客户数 <Text className='num'>{datalist.totalMemberNum}</Text></Text>
                    <View className='iconguyu icon-guyuliwu'></View>
                  </View>
                  <View className="perform-a number">
                    <Text>近3个月客户数 <Text className='num'>{datalist.threeMonthMemberNum}</Text></Text>
                  </View>
                  <View className="perform-a number">
                    <Text>在架商品数 <Text className='num'>{datalist.onlineProductNum}</Text></Text>
                  </View>
                </View>
              </View>
              <View className="container six">
                <View className="flex">
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont5.png'}></Image>
                    <Text>商品管理</Text>
                  </View>
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont3.png'}></Image>
                    <Text>订单管理</Text>
                  </View>
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont1.png'}></Image>
                    <Text>补单处理</Text>
                  </View>
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont6.png'}></Image>
                    <Text>退款订单</Text>
                  </View>
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont2.png'}></Image>
                    <Text>客户管理</Text>
                  </View>
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont7.png'}></Image>
                    <Text>优惠券管理</Text>
                  </View>
                  <View className="flex-box" onClick={this.showtips}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'iconfont4.png'}></Image>
                    <Text>轮播图管理</Text>
                  </View>
                </View>
              </View>
            </Block>
          )}

      </Block>
    );
  }
}
