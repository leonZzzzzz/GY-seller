import Taro, { Component, Config, showLoading } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  ScrollView,
  Swiper,
  SwiperItem,
  Navigator
} from "@tarojs/components";
import "./refund-order.scss";
import { refundList } from "@/api/order"

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
    orderNo: ''
  };
  componentDidShow() {
    const isalter = Taro.getStorageSync('isalter')
    const isalterRep = Taro.getStorageSync('isalterRep')
    if (!isalter) {
      this.setState({ array: [], lists: [], pageNum: 1 })
      this.getList(1, this.state.curSwiperIdx, this.state.orderNo)
    } else {
      if (isalterRep == 'no') {
        this.setState({ array: [], lists: [], pageNum: 1 })
        this.getList(1, this.state.curSwiperIdx, this.state.orderNo)
      }
    }
    Taro.removeStorageSync('isalter')
    Taro.removeStorageSync('isalterRep')
  }
  getList = async (pageNum, curSwiperIdx, orderNo) => {
    const params = { pageNum: pageNum, pageSize: 20, status: curSwiperIdx, orderNo: orderNo }
    const res = await refundList(params)
    Taro.hideLoading()
    if (res.data.code == 20000) {
      const lists = res.data.data.list
      const array = this.state.array
      lists.map(item => {
        item.transportAmount = parseFloat(item.transportAmount / 100).toFixed(2)
        item.orderAmount = parseFloat(item.orderAmount / 100).toFixed(2)
        item.needRefundAmount = parseFloat(item.needRefundAmount / 100).toFixed(2)
        const afterSalesItemList = item.afterSalesItemList
        afterSalesItemList.map(val => {
          val.price = parseFloat(val.price / 100).toFixed(2)
        })
        array.push(item)
      })
      this.setState({ lists: array })
    }
  }
  // 切换分类
  swichSwiperItem(e) {
    const idx = e.currentTarget.dataset.idx
    this.setState({ curSwiperIdx: idx, array: [], pageNum: 1 })
    this.getList(1, idx, this.state.orderNo)
  }
  onReachBottom() {
    this.state.pageNum++;
    Taro.showLoading({
      title: '正在加载'
    })
    this.getList(this.state.pageNum, this.state.curSwiperIdx, this.state.orderNo)
  }


  getvalue(e) {
    this.setState({ orderNo: e.detail.value })
  }

  // 搜索
  getSearch() {
    this.setState({ array: [] })
    this.getList(1, this.state.curSwiperIdx, this.state.orderNo)
  }
  config: Config = {
    navigationBarTitleText: "退款订单"
  };
  render() {
    const { lists, curSwiperIdx, imageurl } = this.state
    return (
      <View>
        <View className='content-fixed'>
          <View className="search">
            <Input placeholder='搜索订单号' onInput={this.getvalue}></Input>
            <View onClick={this.getSearch}>搜索</View>
          </View>
          <ScrollView scroll-x className="nav-header-View" scroll-into-View={curSwiperIdx == '5' ? 'listReturn' : ''}>
            <View className="header-col-View {{curSwiperIdx == '1' ? 'show-border-bottom' : '' }}" data-idx='1' onClick={this.swichSwiperItem}>
              <Text>待处理</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '2' ? 'show-border-bottom' : '' }}" data-idx='2' onClick={this.swichSwiperItem}>
              <Text>同意退款</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == '-1' ? 'show-border-bottom' : '' }}" data-idx='-1' onClick={this.swichSwiperItem}>
              <Text>拒绝退款</Text>
            </View>
          </ScrollView>
        </View>

        <View style="margin-top:176rpx;">
          {lists.length > 0 ? (
            <Block>
              {lists.map(item => {
                return (
                  <View className="content" key={item.id}>
                    <View className='content-order'>
                      <Text>订单号:{item.orderNo}
                        {/* <Text className='charge'>(账期七天结算)</Text> */}
                      </Text>
                      <View className='content-time'>
                        <Text>{item.statusName}</Text>
                        <Text>{item.createTime}</Text>
                      </View>
                    </View>
                    <View className='con-list'>
                      {item.afterSalesItemList.map(pro => {
                        return (
                          <View className='content-con' key={pro.id} onClick={() => { Taro.navigateTo({ url: '../dispose-refund/dispose-refund?id=' + pro.orderAfterSalesId + '&type=' + curSwiperIdx }) }}>
                            <Image className='order-img' src={imageurl + pro.icon}></Image>
                            <View className="order-detail">
                              <Text>{pro.name}</Text>
                              {pro.spec && (
                                <View className="order-price">
                                  <Text>{pro.spec}</Text>
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
                    <View className='content-total'>共<Text>{item.afterSalesItemList.length}</Text>件商品
                    <Text style='margin-left:10rpx;'>
                        {/* 物流服务费￥{item.transportAmount} */}
                      合计￥{item.needRefundAmount}</Text>
                    </View>
                    <View className='order-pro'>
                      <View className='order-user'>
                        <Image src={item.buyerHeader}></Image>
                        <Text>{item.buyerName}</Text>
                      </View>
                      <View className='order-btn'>
                        <Text onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + item.orderId }) }}>卖家备注</Text>
                      </View>
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
                  此分类没有数据
                    </View>
              </View>
            )}

        </View>
      </View>
    );
  }
}
