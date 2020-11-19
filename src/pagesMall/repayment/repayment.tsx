import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./repayment.scss";
import { record } from "@/api/customer"

export default class Index extends Component {

  state = {
    array: [],
    memberId: '',
    allPayAmount: '',
    custName: '',
    mobilePhoneNumber: '',
    headImage: '',
    unpayAmount: '',
    pageNum: 1
  };
  componentDidMount() {
    const { memberId, allPayAmount, custName, mobilePhoneNumber, headImage, unpayAmount } = this.$router.params
    this.setState({ pageNum: 1, memberId, allPayAmount, custName: custName != 'undefined' ? custName : '', mobilePhoneNumber, headImage: headImage != 'undefined' ? headImage : '', unpayAmount })
    this.getdetail(memberId)
  }
  getdetail = async (memberId) => {
    const params = { pageNum: this.state.pageNum, pageSize: 15, memberId }
    const res = await record(params)
    const list = res.data.data.list
    const array = this.state.array
    list.map(item => {
      item.amount = parseFloat(item.amount / 100).toFixed(2)
      // item.unpayAmount = parseFloat(item.unpayAmount / 100).toFixed(2)
      array.push(item)
    })
    this.setState({ array })
  }
  onReachBottom() {
    this.state.pageNum++
    this.getdetail(this.state.memberId)
  }
  config: Config = {
    navigationBarTitleText: "还账记录"
  };
  render() {
    return (
      <Block>
        <View className='content'>
          <View className='content-a'>
            <View className='content-a-name'>
              <Image className='content-a-name-pic' src={headImage}></Image>
              <View className='content-a-name-user'>{custName}<Text className='content-a-name-user-t'>({mobilePhoneNumber})</Text></View>
            </View>
            <View className='content-statis'>
              <View className='statis-a'>
                <Text>累计账期金额(元)</Text>
                <Text>{allPayAmount}</Text>
              </View>
              <View className='statis-a'>
                <Text>未支付账期金额(元)</Text>
                <Text className='orange'>{unpayAmount}</Text>
              </View>

            </View>
          </View>
          <View className='content-b'>
            <View className='content-title'>
              <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_31.png'}></Image>
              <Text>还账列表</Text>
              <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_33.png'}></Image>
            </View>
            {array.length > 0 ? (
              <Block>
                {array.map(item => {
                  return (
                    <View className='con-row'>
                      <Text>￥{item.amount}</Text>
                      <View className='con-col'>
                        <Text>{item.payType == 'offline' ? "线下支付" : "线上支付"}</Text>
                        <View>{item.createTime}</View>
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
      </Block>
    );
  }
}
