import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image
} from "@tarojs/components";
import "./deposit.scss";
import { payMoney, payAnnualMoney } from "@/api/userInfo"
// import { } from "@/api/order"
import utils from '@/utils/utils'
export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    })
  }
  state = {
    annualMoney: '', earnestLevel: '', totlamoney: '',
    comType: ''
  };
  componentDidMount() {
    const comType = this.$router.params.comType
    this.setState({ comType })
    this.getmoney(comType)
  }
  getmoney = async (comType) => {
    const res = await payMoney()
    if (res.data.code == 20000) {
      let { annualMoney, earnestLevel } = res.data.data
      annualMoney = (utils.chu(annualMoney, 100)).toFixed(2)
      earnestLevel = (utils.chu(earnestLevel, 100)).toFixed(2)
      let totlamoney = utils.add(Number(annualMoney), Number(earnestLevel))
      if (comType == 'earnest') {
        totlamoney = earnestLevel
      } else {
        totlamoney = annualMoney
      }
      this.setState({ annualMoney, earnestLevel, totlamoney })
    }
  }
  // 选择支付内容
  singlechange(e) {
    console.log(e)
    let comType = e.detail.value
    let { annualMoney, earnestLevel, totlamoney } = this.state
    if (comType == 'earnest') {
      totlamoney = earnestLevel
    } else {
      totlamoney = annualMoney
    }
    this.setState({ comType, annualMoney, earnestLevel, totlamoney })
  }
  // 去支付
  async getpay() {
    Taro.showLoading({
      title: 'loading',
    })
    const params = { type: 'annual', amount: utils.mul(this.state.totlamoney, 100), comType: this.state.comType }
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
    const { annualMoney, earnestLevel, comType } = this.state
    return (
      <Block>
        <View className='set'>
          <View className='set-row'>
            {comType == 'annual' && (
              <Text style='line-height:70rpx;'>需付年费</Text>
            )}
            {comType == 'earnest' && (
              <Text style='line-height:70rpx;'>需付保证金</Text>
            )}
            <Text className='phone'>￥{comType == 'annual' ? annualMoney : earnestLevel}</Text>
            {/* <View className='set-money'>
              <Text className='set-part'>(年费{annualMoney}+保证金{earnestLevel})</Text>
            </View> */}
          </View>
          {/* <View className='toptips'>请选择支付内容</View>
          <View className='set-row'>
            <RadioGroup onChange={this.singlechange} className='groupcheck'>
              {Number(annualMoney) > 0 && (
                <Label className='radio-list__label'>
                  <View className="the_list_label labelbor">
                    <Text>年费</Text>
                    <Radio className='radio-list__radio' value='annual'></Radio>
                  </View>
                </Label>
              )}
              {Number(earnestLevel) > 0 && (
                <Label className='radio-list__label'>
                  <View className="the_list_label">
                    <Text>保证金</Text>
                    <Radio className='radio-list__radio' value='earnest' checked></Radio>
                  </View>
                </Label>
              )}
            </RadioGroup>
          </View> */}
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
