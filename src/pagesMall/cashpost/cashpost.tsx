import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./cashpost.scss";
import { getmoneyAnnual } from '@/api/userInfo'
import { array } from "prop-types";

export default class Index extends Component {
  // 去到账户金额明细
  goaccount() {
    Taro.navigateTo({
      url: '../account-list/account-list'
    })
  }
  state = {
    array: {}
  };
  getparse(num) {
    let money = parseFloat(num / 100).toFixed(2)
    return money
  }
  componentDidShow() {
    getmoneyAnnual().then(res => {
      const array = res.data.data
      array.surplusMoney = this.getparse(array.surplusMoney)
      array.midSurplusMoney = this.getparse(array.midSurplusMoney)
      array.serviceCost = this.getparse(array.serviceCost)
      this.setState({ array: array })
    })
  }
  gocoast() {
    Taro.navigateTo({
      url: '../covercost/covercost'
    })
  }
  config: Config = {
    navigationBarTitleText: "保证金"
  };
  render() {
    return (
      <Block>
        <View className='amount'>
          <View className='amount-a'>保证金(元)</View>
          <View className='amount-b'>{array.surplusMoney}</View>
          <View className='amount-a'>账期订单交易服务费<Text style='color:#000'>{array.serviceCost}</Text>元</View>
          <View className='amount-c'><Text onClick={this.gocoast}>交易服务费汇总明细</Text></View>
        </View>
        <View className='tips'>注：保证金低于50%即{array.midSurplusMoney}元，平台将冻结交易，请控制好保证金额</View>
        <View className='btn' onClick={() => { Taro.navigateTo({ url: '../margin/margin' }) }}>缴纳保证金</View>
      </Block>
    );
  }
}
