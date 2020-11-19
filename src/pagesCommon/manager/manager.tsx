import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input,
  ScrollView
} from "@tarojs/components";
import "./manager.scss";
import { orderList, orderDelive, orderCancel, printLabelGetOrderItems } from "@/api/order"
import { printLabel } from "@/api/printer"
import { Dialog } from '@/components/common'
import { AtInputNumber } from 'taro-ui'

export default class Index extends Component {
  // 添加商品
  createTrade() {
    Taro.navigateTo({
      url: '../addgoods/addgoods'
    })
  }
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    curSwiperIdx: 1,
    pageNum: 1,
    order: [],
    orderNo: '',
    total: '',
    labelState: false,
    labelModel: {
      value: 1
    },
    curtOrder: {
      orderItems: []
    },
  };
  componentDidMount() {
    const isalter = Taro.getStorageSync('isalter')
    if (!isalter) {
      this.setState({ order: [] })
      this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
    }
    Taro.removeStorageSync('isalter')
  }
  // 获取订单列表
  getOrderList = async (pageNum, curSwiperIdx, orderNo) => {
    const params = { pageNum: pageNum, pageSize: 20, status: curSwiperIdx, orderNo: orderNo }
    const res = await orderList(params)
    if (curSwiperIdx == 1) {
      this.setState({ total: res.data.data.total })
    }
    const orderlist = res.data.data.list
    const order = this.state.order
    // if (orderlist.length > 0) {
    orderlist.map(item => {
      item.totalAmount = parseFloat(item.totalAmount / 100).toFixed(2)
      item.needPayTotalAmount = parseFloat(item.needPayTotalAmount / 100).toFixed(2)
      item.transportAmount = parseFloat(item.transportAmount / 100).toFixed(2)
      // item.storeCouponPayAmount = parseFloat(item.storeCouponPayAmount / 100).toFixed(2)
      // item.couponPayAmount = parseFloat(item.couponPayAmount / 100).toFixed(2)
      item.totalcoupon = Number(item.storeCouponPayAmount) + Number(item.couponPayAmount)
      item.totalcoupon = parseFloat(item.totalcoupon / 100).toFixed(2)
      const orderItems = item.orderItems;
      orderItems.map(list => {
        list.price = parseFloat(list.price / 100).toFixed(2)
      })
      order.push(item)
    })
    // } 
    this.setState({ order: order })
  }
  // 切换头部分类
  swichSwiperItem(e) {
    const curSwiperIdx = e.currentTarget.dataset.idx
    this.setState({ curSwiperIdx: curSwiperIdx, pageNum: 1, order: [] })
    this.getOrderList(1, curSwiperIdx, this.state.orderNo)
  }
  // 发货
  getDeliver(id) {
    Taro.showModal({
      content: '确认发货？',
      success: (res => {
        if (res.confirm) {
          this.confirm(id)
        }
      })
    })
  }

  confirm = async (id) => {
    const res = await orderDelive(id)
    if (res.data.code == 20000) {
      this.setState({ order: [] })
      Taro.showToast({
        title: '发货成功',
        icon: 'none'
      })
      this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
    }
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
    const res = await orderCancel(id)
    if (res.data.code == 20000) {
      this.setState({ order: [] })
      Taro.showToast({
        title: '订单已关闭',
        icon: 'none'
      })
      this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
    }
  }
  // 触底加载更多
  onReachBottom() {
    this.state.pageNum++;
    this.getOrderList(this.state.pageNum, this.state.curSwiperIdx, this.state.orderNo)
  }
  getvalue(e) {
    this.setState({ orderNo: e.detail.value })
  }

  // 搜索
  getSearch() {
    this.setState({ order: [] })
    this.getOrderList(1, this.state.curSwiperIdx, this.state.orderNo)
  }
  // 配送信息
  distInfo(id) {
    Taro.navigateTo({
      url: '../information/information?id=' + id
    })
  }

  // 显示/关闭打标签弹窗
  onShowPrintLabel(state, item) {
    let curtOrder = {}
    if (state) {
      curtOrder = JSON.parse(JSON.stringify(item))
      curtOrder.orderItems = []
      this.getOrderItems(item.id)
    } else {
      curtOrder = { orderItems: [] }
    }
    this.setState({
      labelState: state,
      curtOrder: curtOrder
    })
  }

  // 获取订单未退款订单项
  getOrderItems = async (orderId) => {
    const res = await printLabelGetOrderItems({ orderId })
    this.state.curtOrder.orderItems = res.data.data
    this.setState({ curtOrder: this.state.curtOrder })
  }

  // 打标签
  onPrintLabel = async () => {
    let { curtOrder, labelModel, order } = this.state
    let data = {}
    if (this.state.curtOrder.printCount) {
      data = {
        orderId: curtOrder.id,
        printCount: labelModel.value,
        packageQty: curtOrder.printCount
      }
    } else {
      data = {
        orderId: curtOrder.id,
        printCount: labelModel.value,
        packageQty: labelModel.value
      }
    }

    Taro.showLoading({ title: 'loading' })
    await printLabel(data)
    Taro.showToast({ title: '已发出打印请求' })
    let index = order.findIndex(item => item.id == curtOrder.id)
    console.log(order, index)
    if (order[index]) {
      if (!order[index].printCount) order[index].printCount = labelModel.value
      // else order[index].printCount += labelModel.value
    }
    this.setState({ order: order, labelModel: { value: 1 } })
  }

  config: Config = {
    navigationBarTitleText: "订单管理"
  };
  render() {
    const { order, curSwiperIdx, total, curtOrder, labelModel } = this.state
    console.log('curtOrder', curtOrder, labelModel)
    return (
      <View>
        <View className='content-fixed'>
          <View className="search">
            <Input placeholder='搜索订单号' onInput={this.getvalue}></Input>
            <View onClick={this.getSearch}>搜索</View>
          </View>
          <scroll-View scroll-x='true' class="nav-header-View" scroll-into-View="{{curSwiperIdx=='5'?'listReturn':''}}">
            <View className="header-col-View {{curSwiperIdx == '0' ? 'show-border-bottom' : '' }}" data-idx='0' onClick={this.swichSwiperItem}>
              <Text>待付款</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '1' ? 'show-border-bottom' : '' }}" data-idx='1' onClick={this.swichSwiperItem}>
              {curSwiperIdx == 1 ? (
                <Text>待发货({total})</Text>
              ) : (
                  <Text>待发货</Text>
                )}
            </View>
            <View className="header-col-View {{curSwiperIdx == '2' ? 'show-border-bottom' : '' }}" data-idx='2' onClick={this.swichSwiperItem}>
              <Text>已发货</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '3' ? 'show-border-bottom' : '' }}" data-idx='3' onClick={this.swichSwiperItem}>
              <Text>已收货</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '10' ? 'show-border-bottom' : '' }}" data-idx='10' onClick={this.swichSwiperItem}>
              <Text>已完成</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '-1' ? 'show-border-bottom' : '' }}" data-idx='-1' onClick={this.swichSwiperItem}>
              <Text>已取消</Text>
            </View>
          </scroll-View>
        </View>

        <View style="margin-top:176rpx;">
          {order.length > 0 ? (
            <Block>
              {order.map(item => {
                return (
                  <View className="content" key={item.id} >
                    <View className='content-order'>
                      <View>
                        {item.isAccounPeriod && (
                          <Text className='charge'>(账期{item.accounPeriod}天结算)</Text>
                        )}
                        {item.isSupplementary && (
                          <Text className='charge'>补单</Text>
                        )}
                        <Text style="display:block;font-size:26rpx;">订单号:{item.orderNo}</Text>
                      </View>

                      <View className='content-time'>
                        <Text>{item.statusName}</Text>
                        <Text>{item.createTime}</Text>
                      </View>
                    </View>
                    <View className='con-list'>
                      {item.orderItems.map((pro, pindex) => {
                        return (
                          <View className='content-con' key={String(pindex)} onClick={() => { Taro.navigateTo({ url: '../order-detail/order-detail?id=' + item.id + '&istype=' + curSwiperIdx }) }}>
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
                                <Text>x{pro.qty}{pro.unit}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      })}

                    </View>
                    <View className='content-total'>共
                    <Text>{item.orderItems.length}</Text>件商品
                    <Text style='margin-left:10rpx;'>物流服务费￥{item.transportAmount}  优惠券￥{Number(item.totalcoupon) > 0 ? item.totalcoupon : '0.00'}    合计￥{item.needPayTotalAmount}</Text>
                      {item.adjustAmount && (
                        <Text>  调整价格:{item.adjustAmount}</Text>
                      )}
                    </View>
                    <View className='order-pro'>
                      <View className='order-user'>
                        <Image src={item.buyerHeader}></Image>
                        <Text>{item.buyerName}</Text>
                      </View>
                      {curSwiperIdx == '0' && (
                        <View className='order-btn'>
                          <Text onClick={() => { Taro.navigateTo({ url: '../alter/alter?trans=' + item.transportAmount + '&total=' + item.totalAmount + '&id=' + item.id }) }}>改价</Text>
                          <Text onClick={() => { this.ordercancel(item.id) }}>关闭</Text>
                          <Text onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + item.id }) }}>卖家备注</Text>
                        </View>
                      )}
                      {curSwiperIdx == '1' && (
                        <View className='order-btn colorIdx'>
                          <Text onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + item.id }) }}>卖家备注</Text>
                          <Text onClick={() => {
                            this.onShowPrintLabel(true, item)
                          }}>打印标签</Text>
                          {item.deliveryWay == 'platformsend' && (
                            <Text onClick={() => { this.distInfo(item.id) }}>配送信息</Text>
                          )}
                          <Text className='greenColor' onClick={() => { this.getDeliver(item.id) }}>发货</Text>
                        </View>
                      )}
                      {(curSwiperIdx == '2' || curSwiperIdx == '10') && (
                        <View className='order-btn colorIdx'>
                          <Text onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + item.id }) }}>卖家备注</Text>
                          {item.deliveryWay == 'platformsend' && (
                            <Text onClick={() => { this.distInfo(item.id) }}>配送信息</Text>
                          )}
                        </View>
                      )}
                      {curSwiperIdx == '-1' && (
                        <View className='order-btn'>
                          <Text onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + item.id }) }}>卖家备注</Text>
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
                <View className="no-data-text">
                  此分类没有订单
                    </View>
              </View>
            )}

        </View>

        <Dialog
          visible={this.state.labelState}
          position="center">
          <View className="label-dialog">
            <View className='label-header'>
              <Text
                className='close-icon'
                onClick={() => {
                  this.setState({ labelState: false, curtOrder: {}, labelModel: { value: 1 } })
                }}>X</Text>
              <Text>{this.state.curtOrder.printCount ? '补打标签' : '初次打标签'}</Text>
            </View>
            <View className='label-body'>
              <View className='pro-box'>
                <ScrollView
                  className='scrollview'
                  scrollY
                  scrollWithAnimation
                  style="height: 120rpx;"
                >
                  {curtOrder && curtOrder.orderItems && curtOrder.orderItems.map((pro, index) =>
                    <View className='row' key={String(index)}>
                      <Text>{pro.name}</Text>
                      <Text className='unit'>x{pro.qty}{pro.unit}</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
              {this.state.curtOrder.printCount && <View className='label-form-title'>已打标签{this.state.curtOrder.printCount}个</View>}
              {this.state.curtOrder.printCount && (
                <View className='label-form'>
                  <View className=''>打包货物共</View>
                  <View className=''>
                    <AtInputNumber
                      // disabled
                      min={1}
                      step={1}
                      value={this.state.curtOrder.printCount}
                      onChange={(value) => {
                        this.state.curtOrder.printCount = value
                        this.setState({ curtOrder: this.state.curtOrder })
                      }}
                    />
                  </View>
                </View>
              )}
              <View className='label-form'>
                <View className=''>需打印标签</View>
                <View className=''>
                  <AtInputNumber
                    min={1}
                    step={1}
                    value={this.state.labelModel.value}
                    onChange={(value) => {
                      this.state.labelModel.value = value
                      this.setState({ labelModel: this.state.labelModel })
                    }}
                  />
                </View>
              </View>
            </View>
            <View className='label-btns'>
              <View className='l-btn cancel-btn' onClick={() => {
                this.setState({ labelState: false, curtOrder: {}, labelModel: { value: 1 } })
              }}>取消</View>
              <View className='l-btn confirm-btn' onClick={() => { this.onPrintLabel() }}>确定</View>
            </View>
          </View>
        </Dialog>
      </View>
    );
  }
}
