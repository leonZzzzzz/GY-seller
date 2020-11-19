import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./soldcust.scss";
import { ordercust, addOldCust, cancelOldCust } from "@/api/customer"

export default class Index extends Component {
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    orderlist: [],
    phone: '',
    orderBy: '',
    asc: '',
    asc1: '',
    isasc: false
  };
  componentDidMount() {
    const { orderBy, asc } = this.state
    this.getOrderList(orderBy, asc)
  }
  getOrderList = async (orderBy, asc) => {
    const params = { mobilePhoneNumber: this.state.phone, orderBy, asc }
    const res = await ordercust(params)
    const orderlist = res.data.data.list
    orderlist.map(item => {
      item.tradingAmount = parseFloat(item.tradingAmount / 100).toFixed(2)
    })
    this.setState({ orderlist })
  }
  getvalue(e) {
    this.setState({ phone: e.detail.value })
  }
  async search() {
    let { orderBy, asc, asc1 } = this.state
    asc = asc ? asc : asc1
    this.getOrderList(orderBy, asc)
  }
  // 切换金额和笔数
  filter(index) {
    let { orderBy, isasc, asc, asc1 } = this.state
    isasc = !isasc
    asc = isasc ? '1' : '0'
    asc1 = asc
    orderBy = index == 1 ? 'tradingAmount' : 'refundTotal', asc
    this.setState({ orderBy, isasc })
    if (orderBy == 'tradingAmount') {
      this.setState({ asc, asc1: '' })
      this.getOrderList(orderBy, asc)
    } else {
      this.setState({ asc1, asc: '' })
      console.log(asc1)
      this.getOrderList(orderBy, asc1)
    }

  }

  async onAddOldCust(memberId, index) {
    await addOldCust({ memberId })
    Taro.showToast({ title: '已标记' })
    this.state.orderlist[index].memberType = 'oldcust'
    this.state.orderlist[index].storeType = 'oldcust'
    this.getOrderList(this.state.orderBy, this.state.asc)
    // this.setState({
    //   orderlist: this.state.orderlist
    // })
  }

  async onCancelOldCust(memberId, index) {
    await cancelOldCust({ memberId })
    Taro.showToast({ title: '已取消' })
    this.state.orderlist[index].memberType = 'commomccust'
    this.state.orderlist[index].storeType = 'commomccust'
    this.getOrderList(this.state.orderBy, this.state.asc)
    // this.setState({
    //   orderlist: this.state.orderlist
    // })
    // console.log(this.state.orderlist)
  }

  config: Config = {
    navigationBarTitleText: "订单客户"
  };
  render() {
    let { asc, asc1, orderBy, orderlist } = this.state

    return (
      <Block>
        <View className='cust-fixed'>
          <View className="search">
            <Input placeholder='搜索手机号' onInput={this.getvalue}></Input>
            <View onClick={this.search}>搜索</View>
          </View>
          <View className='rank'>
            <View className='sorts' onClick={() => { this.filter(1) }}>
              <Text className={orderBy == 'tradingAmount' ? 'color' : ''}>累计消费金额</Text>
              <View className='sortimage'>
                {asc == '1' ? (
                  <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_22.png'}></Image>
                ) : (
                    <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_24.png'}></Image>
                  )}
                {asc == '0' ? (
                  <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_36.png'}></Image>
                ) : (
                    <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_38.png'}></Image>
                  )}

              </View>
            </View>
            <View className='sorts' onClick={() => { this.filter(2) }}>
              <Text className={orderBy == 'refundTotal' ? 'color' : ''}>退款笔数</Text>
              <View className='sortimage'>
                {asc1 == '1' ? (
                  <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_22.png'}></Image>
                ) : (
                    <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_24.png'}></Image>
                  )}
                {asc1 == '0' ? (
                  <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_36.png'}></Image>
                ) : (
                    <Image src={Taro.getStorageSync('imgHostItem') + 'gy-icon_38.png'}></Image>
                  )}
              </View>
            </View>
          </View>
        </View>
        {orderlist.length > 0 ? (
          <View className='content'>
            {orderlist.map((item, index) => {
              return (
                <View className='content-a' key={String(index)}>
                  <View className='content-a-name'>
                    <Image className='content-a-name-pic' src={item.headImage}></Image>
                    <View className='content-a-name-user'>{item.custName}
                      {item.mobilePhoneNumber && <Text className='content-a-name-user-t'>({item.mobilePhoneNumber})</Text>}
                      {item.storeType == 'oldcust'
                        ? <Text className='memberType-tag'>老客户</Text>
                        : item.memberType == 'newcust' ? <Text className='memberType-tag' stylr="color: rgb(255, 157, 53);">新客户</Text>
                          : item.memberType == 'oldcust' ? <Text className='memberType-tag'>老客户</Text>
                            : item.memberType == 'commomccust' ? <Text className='memberType-tag'>普通客户</Text>
                              : ''
                      }
                      {/* {item.memberType == 'newcust' ? <Text className='memberType-tag' stylr="color: rgb(255, 157, 53);">新客户</Text>
                        : item.memberType == 'oldcust' ? <Text className='memberType-tag'>老客户</Text>
                          : item.memberType == 'commomccust' ? <Text className='memberType-tag'>普通客户</Text>
                            : ''
                      } */}
                    </View>
                  </View>
                  <View className='content-statis'>
                    <View className='statis-a left'>
                      <Text>{item.tradingAmount}</Text>
                      <Text>累计消费金额(元)</Text>
                    </View>
                    <View className='statis-a'>
                      <Text>{item.refundTotal}</Text>
                      <Text>退款笔数</Text>
                    </View>
                  </View>
                  <View className='btns'>
                    {item.storeType == 'oldcust' ?
                      (<Text onClick={() => { this.onCancelOldCust(item.memberId, index) }}>取消老客户</Text>) :
                      (item.memberType == 'oldcust' ?
                        <Text onClick={() => { this.onCancelOldCust(item.memberId, index) }}>取消老客户</Text>
                        : <Text onClick={() => { this.onAddOldCust(item.memberId, index) }}>标记为老客户</Text>

                      )
                    }

                  </View>
                </View>
              )
            })}
          </View>
        ) : (
            <View className="no-data-view">
              <Image
                src={Taro.getStorageSync('imgHostItem') + 'qt_89.png'}
                mode="widthFix"
                className="no-data-image"
              ></Image>
              {/* <View className="mText" className="no-data-text">没有可领取的优惠券</View> */}
            </View>
          )}
      </Block>
    );
  }
}
