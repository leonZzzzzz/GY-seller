import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./replacement.scss";
import { orderList, supplierOrder, mentCancel } from "@/api/order"

export default class Index extends Component {
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    curSwiperIdx: 0,
    pageNum: 1,
    order: [],
    duringMs1: '',
    clock: '',
    endTimeList: [],
    countDownArr: [],
    djsTime: 30,
    orderNo: ''
  };
  componentWillUnmount() {
    clearInterval(this.state.duringMs1);
  }
  componentDidHide() {
    clearInterval(this.state.duringMs1)
  }
  componentDidShow() {
    const isalter = Taro.getStorageSync('isalter')
    const isalterRep = Taro.getStorageSync('isalterRep')
    if (!isalter) {
      this.setState({ order: [] })
      Taro.showLoading()
      this.getOrderList(this.state.pageNum, this.state.curSwiperIdx, this.state.orderNo)
    } else {
      if (isalterRep == 'no') {
        this.setState({ order: [] })
        Taro.showLoading()
        this.getOrderList(this.state.pageNum, this.state.curSwiperIdx, this.state.orderNo)
      }
    }
    Taro.removeStorageSync('isalter')
    Taro.removeStorageSync('isalterRep')

  }
  // 获取订单列表
  getOrderList = async (pageNum, curSwiperIdx, orderNo) => {
    const params = { pageNum: pageNum, pageSize: 20, supplementStatus: curSwiperIdx, orderNo: orderNo, isSupplementary: 1 }
    const res = await orderList(params)
    Taro.hideLoading()
    const orderlist = res.data.data.list
    const order = this.state.order
    const endTimeList = []
    orderlist.map(item => {
      // item.money = parseFloat((Number(item.totalAmount) - Number(item.couponPayAmount)) / 100).toFixed(2)
      item.totalAmount = parseFloat(item.totalAmount / 100).toFixed(2)
      item.transportAmount = parseFloat(item.transportAmount / 100).toFixed(2)
      item.couponPayAmount = parseFloat(item.couponPayAmount / 100).toFixed(2)
      item.storeCouponPayAmount = parseFloat(item.storeCouponPayAmount / 100).toFixed(2)
      item.needPayTotalAmount = parseFloat(item.needPayTotalAmount / 100).toFixed(2)
      item.totalcoupon = Number(item.storeCouponPayAmount) + Number(item.couponPayAmount)
      item.totalcoupon = parseFloat(item.totalcoupon).toFixed(2)
      const orderItems = item.orderItems;
      orderItems.map(list => {
        list.price = parseFloat(list.price / 100).toFixed(2)
      })
      order.push(item)
    })
    this.setState({ order: order, countDownArr: order })
    // if (curSwiperIdx == 0) {
    //   console.log(curSwiperIdx)
    this.count_down()
    // }
  }
  // 切换头部分类
  swichSwiperItem(e) {
    const curSwiperIdx = e.currentTarget.dataset.idx
    this.setState({ curSwiperIdx: curSwiperIdx, pageNum: 1, order: [], countDownArr: [] })
    Taro.showLoading()
    this.getOrderList(1, curSwiperIdx, this.state.orderNo)
  }
  // 触底加载更多
  onReachBottom() {
    this.state.pageNum++;
    Taro.showLoading({ title: '加载中' })
    this.getOrderList(this.state.pageNum, this.state.curSwiperIdx, this.state.orderNo)
  }
  // 确认补单
  onconfirm(id) {
    Taro.showModal({
      content: '确认补单？',
      success: (res => {
        if (res.confirm) {
          this.supplier(id)
        }
      })
    })
  }
  supplier = async (id) => {
    const res = await supplierOrder(id)
    if (res.data.code == 20000) {
      this.setState({ order: [] })
      Taro.showToast({
        title: '已确认补单',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.showLoading()
        this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
      }, 1000);
    }
  }
  count_down() {
    var that = this;
    that.state.duringMs1 = setInterval(function () {
      var orders = that.state.countDownArr;
      for (var i = 0; i < orders.length; i++) {
        var create_time = orders[i].supplementExpireTime;
        //计算剩余时间差值
        var leftTime = (new Date(create_time).getTime()) - (new Date().getTime());
        if (leftTime > 0) {
          var left_time = that.date_format(leftTime)
          console.log(left_time)
          orders[i].left_time = left_time
        } else {
          //移除超时未支付的订单
          // orders.splice(i, 1);
        }
      }
      that.setState({
        countDownArr: orders
      });
    }, 1000)
  }

  /* 格式化倒计时 */
  date_format(s) {
    var min = parseInt(s / 1000 / 60 % 60, 10);
    var sec = parseInt(s / 1000 % 60, 10);
    min = this.add(min);
    sec = this.add(sec);
    return min + ':' + sec;
  }
  /* 分秒位数补0 */
  add(num) {
    return num < 10 ? "0" + num : num
  }


  getvalue(e) {
    this.setState({ orderNo: e.detail.value })
  }

  // 搜索
  getSearch() {
    this.setState({ order: [] })
    Taro.showLoading()
    this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
  }


  // 订单关闭
  ordercancel(id) {
    Taro.showModal({
      content: '确认关闭订单',
      success: (res => {
        if (res.confirm) {
          this.cancel(id)
        }
      })
    })
  }
  cancel = async (id) => {
    const res = await mentCancel(id)
    if (res.data.code == 20000) {
      this.setState({ order: [] })
      Taro.showToast({
        title: '订单已关闭',
        icon: 'none'
      })
      Taro.showLoading()
      this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
    }
  }


  config: Config = {
    navigationBarTitleText: "补单处理"
  };
  render() {
    const { order, curSwiperIdx, countDownArr } = this.state
    return (
      <View>
        <View className='content-fixed'>
          <View className="search">
            <Input placeholder='搜索订单号' onInput={this.getvalue}></Input>
            <View onClick={this.getSearch}>搜索</View>
          </View>
          <scroll-View scroll-x='true' class="nav-header-View" scroll-into-View="{{curSwiperIdx=='5'?'listReturn':''}}">
            <View className="header-col-View {{curSwiperIdx == '0' ? 'show-border-bottom' : '' }}" data-idx='0' onClick={this.swichSwiperItem}>
              <Text>待处理</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '1' ? 'show-border-bottom' : '' }}" data-idx='1' onClick={this.swichSwiperItem}>
              <Text>已确认</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '-1' ? 'show-border-bottom' : '' }}" data-idx='-1' onClick={this.swichSwiperItem}>
              <Text>已取消</Text>
            </View>
          </scroll-View>
        </View>

        <View style="margin-top:176rpx;">
          {order.length > 0 ? (
            <Block>
              {order.map((item, index) => {
                return (
                  <View className="content">
                    <View className='content-order'>
                      <View>
                        {item.isAccounPeriod && (
                          <Text className='charge'>(账期{item.accounPeriod}天结算)</Text>
                        )}
                        {item.isSupplementary && (
                          <Text className='charge'>补单</Text>
                        )}
                        <Text style="display:block">订单号:{item.orderNo}</Text>
                      </View>

                      <View className='content-time'>
                        <Text>{item.supplementStatusName}</Text>

                        <Text>{item.createTime}</Text>
                      </View>
                    </View>
                    <View className='con-list'>
                      {item.orderItems.map((pro, pindex) => {
                        return (
                          <View className='content-con' onClick={() => { Taro.navigateTo({ url: '../order-detail/order-detail?id=' + item.id + '&replacetype=' + curSwiperIdx }) }}>
                            <Image className='order-img' src={imageurl + pro.iconUrl}></Image>
                            <View className="order-detail">
                              <Text>{pro.name}</Text>
                              {pro.specs && (
                                <View className="order-price">
                                  <Text>规格：{pro.specs}</Text>
                                </View>
                              )}

                              <View className='order-name'>
                                <View className="reper">
                                  <Text>￥</Text>
                                  <Text className="repe-a">{pro.price}</Text>
                                </View>
                                <Text>x{pro.qty}{pro.qty}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      })}

                    </View>
                    <View className='content-total'>共
                    <Text>{item.orderItems.length}</Text>件商品
                    {item.transportAmount != '0.00' && (
                        <Text style='margin-left:10rpx;'>物流服务费￥{item.transportAmount}</Text>
                      )}
                      {item.totalcoupon > 0 && (
                        <Text style='margin-left:10rpx;'>优惠券￥{item.totalcoupon > 0 ? item.totalcoupon : '0.00'}  </Text>
                      )}
                      <Text style='margin-left:10rpx;'>合计￥{item.needPayTotalAmount}</Text>

                    </View>
                    <View className='order-pro'>
                      <View className='order-user'>
                        <Image src={item.buyerHeader}></Image>
                        <Text>{item.buyerName}</Text>
                      </View>
                      {curSwiperIdx == '0' && (
                        <View className='order-btn'>
                          <Text onClick={() => { this.ordercancel(item.id) }}>关闭</Text>
                          <Text onClick={() => { this.onconfirm(item.id) }}>确认补单{countDownArr[index].left_time}</Text>
                        </View>
                      )}

                    </View>
                  </View>
                )
              })}
            </Block>
          ) : (
              <View className="no-data-view">
                <Image
                  src={require("../../images/item/qt_89.png")}
                  mode="widthFix"
                  className="no-data-image"
                ></Image>
                <View className="mText" className="no-data-text">
                  此分类没有订单
                    </View>
              </View>
            )}
        </View>
      </View>
    );
  }
}
