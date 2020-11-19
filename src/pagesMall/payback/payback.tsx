import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./payback.scss";
import { repayment } from "@/api/customer"
import utils from '@/utils/utils'
export default class Index extends Component {

  state = {
    array: [],
    amount: '',
    unpayAmount: '',
    memberId: '', lines: '', timeLimit: '',
    nowLimit: '',
    custName: '', mobilePhoneNumber: '', headImage: ''
  };
  componentDidMount() {
    console.log(this.$router.params)
    const { memberId, lines, timeLimit, nowLimit, unpayAmount, custName, mobilePhoneNumber, headImage } = this.$router.params
    this.setState({ memberId, lines, timeLimit, nowLimit, unpayAmount, custName: custName != 'undefined' ? custName : '', mobilePhoneNumber, headImage: headImage != 'undefined' ? headImage : '' })
  }
  getmoney(e) {
    this.setState({ amount: e.detail.value })
  }
  async save() {
    let { memberId, amount } = this.state
    var params = { memberId, amount: utils.mul(amount, 100) }
    if (Number(amount) > 0) {
      if (!amount) {
        Taro.showToast({
          title: '请输入还账金额',
          icon: 'none'
        })
        return
      }
    } else {
      Taro.showToast({
        title: '当前店铺不存在欠款账期',
        icon: 'none'
      })
      return
    }
    const res = await repayment(params)
    var pages = Taro.getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2];
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '还账成功',
        icon: 'none'
      })
      setTimeout(() => {
        if (prepage.route == 'pagesMall/credit-client/credit-client') {
          Taro.navigateBack()
        } else {
          Taro.navigateBack({
            delta: 2
          })
        }
      }, 1000);
    }
  }
  showvalue() {
    const { unpayAmount } = this.state
    if (Number(unpayAmount) > 0) {
      this.setState({ amount: unpayAmount })
    } else {
      Taro.showToast({
        title: '当前店铺不存在欠款账期',
        icon: 'none'
      })
    }
  }

  config: Config = {
    navigationBarTitleText: "还账"
  };
  render() {
    let { headImage, custName, mobilePhoneNumber, lines, timeLimit, unpayAmount, nowLimit, amount } = this.state
    return (
      <View className='content'>
        <View className='content-a'>
          <View className='content-a-name'>
            <Image className='content-a-name-pic' src={headImage}></Image>
            <View className='content-a-name-user'>{custName}<Text className='content-a-name-user-t'>({mobilePhoneNumber})</Text></View>
          </View>
          <View className='content-statis'>
            <View className='statis-a'>
              <Text>金额上限(元)</Text>
              <Text>{lines}</Text>
            </View>
            <View className='statis-a'>
              <Text>结算账期(天)</Text>
              <Text>{timeLimit}</Text>
            </View>
            <View className='statis-a'>
              <Text>未支付账期金额(元)</Text>
              <Text className='orange'>{unpayAmount}</Text>
            </View>
            <View className='statis-a'>
              <Text>当前账期(天)</Text>
              <Text className='orange'>{nowLimit}</Text>
            </View>
          </View>
        </View>

        <View className='payfor'>
          <View >请输入还账金额</View>
          <View className='paycontent'>
            <View>￥</View>
            <Input value={amount} onInput={this.getmoney}></Input>
            <Text onClick={this.showvalue}>还清</Text>
          </View>
        </View>
        <View className='btn' onClick={this.save}>确定</View>
      </View>
    );
  }
}
