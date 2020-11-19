import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./covercost.scss";
import { coverservice } from "@/api/customer"

export default class Index extends Component {

  state = {
    array: [],
    memberId: '',
    allPayAmount: '',
    custName: '',
    mobilePhoneNumber: '',
    headImage: '',
    unpayAmount: '',
    pageNum: 1,
    totalAmount: '',
    periodTotal: '',
    nomalTotal: ''
  };
  format(value) {
    let money = parseFloat(value / 100).toFixed(2)
    return money
  }
  componentDidMount() {
    this.getdetail()
  }
  getdetail = async () => {
    const params = { pageNum: this.state.pageNum, pageSize: 15 }
    const res = await coverservice(params)
    const { list, totalAmount, periodTotal, nomalTotal } = res.data.data
    const array = this.state.array
    list.map(item => {
      item.amount = parseFloat(item.amount / 100).toFixed(2)
      // item.unpayAmount = parseFloat(item.unpayAmount / 100).toFixed(2)
      array.push(item)
    })
    this.setState({ array, totalAmount: this.format(totalAmount), periodTotal: this.format(periodTotal), nomalTotal: this.format(nomalTotal) })
  }
  onReachBottom() {
    this.state.pageNum++
    this.getdetail()
  }
  config: Config = {
    navigationBarTitleText: "交易服务费汇总明细"
  };
  render() {
    return (
      <Block>
        <View className='content'>
          <View className='content-a'>
            <View className='content-title'>
              <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_31.png'}></Image>
              <Text>合计</Text>
              <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_33.png'}></Image>
            </View>
            <View className='content-statis'>
              <View className='statis-a'>
                <Text>{totalAmount}</Text>
                <Text>总交易服务费</Text>
                <Text>(元)</Text>
              </View>
              <View className='statis-a'>
                <Text >{periodTotal}</Text>
                <Text>账期订单</Text>
                <Text>(元)</Text>
              </View>
              <View className='statis-a'>
                <Text >{nomalTotal}</Text>
                <Text>普通订单</Text>
                <Text>(元)</Text>
              </View>
            </View>
          </View>
          <View className='content-b'>
            <View className='content-title'>
              <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_31.png'}></Image>
              <Text>服务费列表</Text>
              <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_33.png'}></Image>
            </View>
            {array.length > 0 ? (
              <Block>
                {array.map(item => {
                  return (
                    <View className='con-row'>
                      <View className='con-col left'>
                        <Text>{item.name}</Text>
                        <View>{item.createTime}</View>
                      </View>
                      <View className='con-col right'>
                        <Text>￥{item.amount}</Text>
                        <View>{item.serviceTypeName}</View>
                      </View>

                    </View>
                  )
                })}
              </Block>
            ) : (
                <View className='nolist'>暂无还账记录</View>
              )}
          </View>
        </View>
      </Block >
    );
  }
}
