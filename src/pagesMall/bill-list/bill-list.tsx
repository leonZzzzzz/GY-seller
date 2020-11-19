import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./bill-list.scss";
import { paymentdetail } from "@/api/customer"

export default class Index extends Component {

  state = {
    array: [],
    memberId: '',
    unpayAmount: '',
    paymentDaysId: '', lines: '', timeLimit: '', nowLimit: '',
    custName: '', mobilePhoneNumber: '', headImage: '',
    allPayAmount: ''
  };
  componentDidMount() {
    console.log(this.$router.params)
    const { allPayAmount, paymentDaysId, lines, timeLimit, nowLimit, custName, mobilePhoneNumber, headImage, memberId, unpayAmount } = this.$router.params
    this.setState({ allPayAmount, unpayAmount, memberId, lines, timeLimit, nowLimit, custName: custName != 'undefined' ? custName : '', mobilePhoneNumber, headImage: headImage != 'undefined' ? headImage : '' })
    this.getdetail(paymentDaysId)
  }
  getdetail = async (paymentDaysId) => {
    const res = await paymentdetail(paymentDaysId)
    const array = res.data.data.list
    array.map(item => {
      item.totalAmount = parseFloat(item.totalAmount / 100).toFixed(2)
    })
    this.setState({ array })
  }
  config: Config = {
    navigationBarTitleText: "账期明细"
  };
  render() {
    const { paymentDaysId, lines, timeLimit, nowLimit, custName, mobilePhoneNumber, headImage, memberId, unpayAmount } = this.state
    return (
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
            <Text>账单列表</Text>
            <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_33.png'}></Image>
          </View>
          {array.length > 0 ? (
            <Block>
              {array.map(item => {
                return (
                  <View className='con-row'>
                    <Text>￥{item.totalAmount}</Text>
                    <View className='con-col'>

                      <Text>{item.status == 3 ? "已支付" : "未支付"}</Text>
                      <View>{item.createTime}</View>
                    </View>
                  </View>
                )
              })
              }
            </Block>
          ) : (
              <View className='nolist'>暂无还账记录</View>
            )}

        </View>
        <View style='height:150rpx'></View>
        <View className='confirm-order' onClick={() => {
          Taro.navigateTo({
            url: '../payback/payback?memberId=' + memberId + '&lines=' + lines + '&unpayAmount=' + unpayAmount + '&custName=' + custName + '&mobilePhoneNumber=' + mobilePhoneNumber + '&headImage=' + headImage + '&timeLimit=' + timeLimit + '&nowLimit=' + nowLimit
          })
        }}>
          <View className='btn'>
            <View>还账</View>
          </View>
        </View>
      </View>
    );
  }
}
