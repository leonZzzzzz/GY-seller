import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./candraw.scss";
import { walletinfo } from "@/api/pay"

export default class Index extends Component {
  // 去到账户金额明细
  goaccount() {
    Taro.navigateTo({
      url: '../account-list/account-list'
    })
  }

  state = {
    withdrawableMoney: '', waitSettlementMoney: '', withdrawMsg: []
  };
  componentDidShow() {
    this.getinfo()
  }
  getinfo = async () => {
    // const res = await drawinfo()

    const res = await walletinfo()
    if (res.data.code == 20000) {
      let { withdrawableMoney, waitSettlementMoney, withdrawMsg } = res.data.data
      this.setState({ withdrawableMoney: parseFloat(withdrawableMoney / 100).toFixed(2), waitSettlementMoney: parseFloat(waitSettlementMoney / 100).toFixed(2), withdrawMsg: withdrawMsg || [] })
    }
  }

  config: Config = {
    navigationBarTitleText: "我的账户"
  };
  render() {
    let { withdrawableMoney, waitSettlementMoney, withdrawMsg } = this.state
    return (
      <Block>
        <View className='amount'>
          <View className='amount-a'>可提现金额(元)</View>
          <View className='amount-b'>{withdrawableMoney}</View>
          <View className='amount-a'>待结算金额<Text style='color:#000'>{waitSettlementMoney}</Text>元</View>
          <View className='amount-d'>
            <Text onClick={this.goaccount}>账户金额明细</Text>
          </View>
        </View>
        {/* <View className='tips'>注：用户每日仅可提现一次，每次不超过5000元</View> */}
        <View className='tips'>注：{
          withdrawMsg && withdrawMsg.map((item, index) => {
            return <Text key={String(index)} style='padding-right: 5px;'>{item}</Text>
          })}
        </View>
        <View className='btn' onClick={() => { Taro.navigateTo({ url: '../deposite/deposite' }) }}>提现</View>
      </Block>
    );
  }
}
