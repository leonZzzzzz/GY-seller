import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./margin.scss";
import { payAnnualMoney } from "@/api/userInfo"
import utils from '@/utils/utils'
export default class Index extends Component {

  state = {
    amount: ''
  };
  getmoney(e) {
    this.setState({ amount: e.detail.value })
  }
  // 去支付
  async getpay() {
    Taro.showLoading({ title: '' })
    const params = { amount: utils.mul(this.state.amount, 100) }
    const res = await payAnnualMoney(params)
    Taro.hideLoading()
    const payData = res.data.data
    const arr = {
      'timeStamp': payData.timeStamp,
      'nonceStr': payData.nonceString,
      'package': payData.pack,
      'signType': payData.signType,
      'paySign': payData.paySign
    }
    var obj = Object.assign({
      success: res => this._onPaySuccess(res),
      fail: err => this._onPayFail(err)
    }, arr);
    Taro.requestPayment(obj)
  }

  // 支付成功
  _onPaySuccess(res) {
    if (res.errMsg == 'requestPayment:ok') {
      Taro.navigateBack({ delta: 1 })
    }
  }
  // 支付失败
  _onPayFail(err) {
    console.log(err)
    Taro.showModal({
      title: '支付失败',
      content: '支付失败，请重新支付',
      // cancelColor: '#FF0000',
      showCancel: false,
      confirmText: '好的',
      success: function (res) {

      },
    });
  }
  config: Config = {
    navigationBarTitleText: "收银台"
  };
  render() {
    return (
      <Block>
        <View className='set'>
          <View className='set-row'>
            <Text>需付金额</Text>
            <View className='set-money'>
              <Input placeholder='请输入保证金额' onInput={this.getmoney}></Input>
            </View>
          </View>
          {/* <View className='set-row' onClick={this.gopasswod}> */}
          <View className='set-row'>
            <View>
              <Image src={Taro.getStorageSync('imgHostItem')+'qt_59.png'}></Image>
              <Text className='wxpay'>微信支付</Text>
            </View>

          </View>
          <View className='btn' onClick={this.getpay}>
            <Text>去支付</Text>
          </View>
        </View>
      </Block>
    );
  }
}
