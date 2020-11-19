import Taro, { Component, Config, showLoading } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Swiper,
  SwiperItem,
  Navigator
} from "@tarojs/components";
import "./invoiced.scss";
import { refundList, getinvoice, finishInvoice } from "@/api/order"

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
    lists: [],
    array: [],
    invoice: 'apply',
    orderNo: ''
  };
  componentDidShow() {
    this.setState({ array: [], lists: [], pageNum: 1 })
    this.getList(1, this.state.invoice, this.state.orderNo)
  }
  getList = async (pageNum, invoice, orderNo) => {
    const params = { pageNum: pageNum, pageSize: 20, status: 10, invoice: invoice, orderNo: orderNo }
    const res = await getinvoice(params)
    Taro.hideLoading()
    if (res.data.code == 20000) {
      const lists = res.data.data.list
      const array = this.state.array
      lists.map(item => {
        item.needPayTotalAmount = parseFloat(item.needPayTotalAmount / 100).toFixed(2)
        item.transportAmount = parseFloat(item.transportAmount / 100).toFixed(2)
        item.totalcoupon = Number(item.storeCouponPayAmount) + Number(item.couponPayAmount)
        item.totalcoupon = parseFloat(item.totalcoupon / 100).toFixed(2)

        // item.transportAmount = parseFloat(item.transportAmount / 100).toFixed(2)
        // item.orderAmount = parseFloat(item.orderAmount / 100).toFixed(2)
        // item.needRefundAmount = parseFloat(item.needRefundAmount / 100).toFixed(2)
        const orderItems = item.orderItems
        orderItems.map(val => {
          val.price = parseFloat(val.price / 100).toFixed(2)
        })
        array.push(item)
      })
      this.setState({ lists: array })
    }
  }
  // 切换分类
  swichSwiperItem(e) {
    const invoice = e.currentTarget.dataset.idx
    this.setState({ invoice, array: [], pageNum: 1 })
    this.getList(1, invoice, this.state.orderNo)
  }
  onReachBottom() {
    this.state.pageNum++;
    Taro.showLoading({
      title: '正在加载'
    })
    this.getList(this.state.pageNum, this.state.invoice, this.state.orderNo)
  }


  getvalue(e) {
    this.setState({ orderNo: e.detail.value })
  }

  // 搜索
  getSearch() {
    this.setState({ array: [] })
    this.getList(1, this.state.invoice, this.state.orderNo)
  }
  // 开票
  async makeout(orderId) {
    Taro.showModal({
      content: '确定开票完成？',
      success: (res => {
        if (res.confirm) {
          finishInvoice(orderId).then(res => {
            if (res.data.code == 20000) {
              Taro.showToast({
                title: '开票成功',
                icon: 'none'
              })
              this.setState({ array: [], lists: [] })
              setTimeout(() => {
                this.getList(1, this.state.invoice, this.state.orderNo)
              }, 1500)
            }
          })
        }
      })
    })
  }
  config: Config = {
    navigationBarTitleText: "发票管理"
  };
  render() {
    const { lists, } = this.state
    return (
      <View>
        <View className='content-fixed'>
          <View className="search">
            <Input placeholder='搜索订单号' onInput={this.getvalue}></Input>
            <View onClick={this.getSearch}>搜索</View>
          </View>
          <scroll-View scroll-x='true' class="nav-header-View" scroll-into-View="{{curSwiperIdx=='5'?'listReturn':''}}">
            <View className="header-col-View {{invoice == 'apply' ? 'show-border-bottom' : '' }}" data-idx='apply' onClick={this.swichSwiperItem}>
              <Text>待开票</Text>
            </View>
            <View className="header-col-View {{invoice == 'finish' ? 'show-border-bottom' : '' }}" data-idx='finish' onClick={this.swichSwiperItem}>
              <Text>已开票</Text>
            </View>
          </scroll-View>
        </View>

        <View style="margin-top:176rpx;">
          {lists.length > 0 ? (
            <Block>
              {lists.map(item => {
                return (
                  <View className="content">
                    <View className='content-order'>
                      <Text>订单号:{item.orderNo}
                        {/* <Text className='charge'>(账期七天结算)</Text> */}
                      </Text>
                      <View className='content-time'>
                        {/* <Text>{item.statusName}</Text> */}
                        <Text>{item.createTime}</Text>
                      </View>
                    </View>
                    <View className='con-list'>
                      {item.orderItems.map(pro => {
                        return (
                          <View className='content-con'>
                            <Image className='order-img' src={imageurl + pro.iconUrl}></Image>
                            <View className="order-detail">
                              <Text>{pro.name}</Text>
                              {pro.specs && (
                                <View className="order-price">
                                  <Text>{pro.specs}</Text>
                                </View>
                              )}

                              <View className='order-name'>
                                <View className="reper">
                                  <Text>￥</Text>
                                  <Text className="repe-a">{pro.price}</Text>
                                </View>
                                <Text>x{pro.qty}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      })}
                    </View>
                    <View className='content-total'>共<Text>{item.orderItems.length}</Text>件商品 <Text style='margin-left:10rpx;'>物流服务费￥{item.transportAmount} 优惠券￥{item.totalcoupon}   合计￥{item.needPayTotalAmount}</Text></View>
                    <View className='invoice'>
                      <View>发票抬头：{item.invoiceName}
                        {item.taxNumber ? (
                          <Text className='invoicetype'>公司</Text>
                        ) : (
                            <Text className='invoicetype'>个人</Text>
                          )}
                      </View>
                      {item.taxNumber && (
                        <View>发票税号：{item.taxNumber}</View>
                      )}
                      <View>电子邮箱：{item.email}</View>
                    </View>
                    <View className='order-pro'>
                      <View className='order-user'>
                        <Image src={item.buyerHeader}></Image>
                        <Text>{item.buyerName}</Text>
                      </View>
                      {invoice == 'apply' && (
                        <View className='order-btn'>
                          <Text onClick={() => { this.makeout(item.id) }}>开票完成</Text>
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
                  此分类没有数据
                    </View>
              </View>
            )}

        </View>
      </View>
    );
  }
}
