import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Swiper,
  SwiperItem,
  Navigator,
  Textarea
} from "@tarojs/components";
import "./turn-refund.scss";
import { refuseRefund } from '@/api/order'

export default class Index extends Component {

  state = {
    id: '', refuseReason: ''
  };
  componentDidMount() {
    Taro.setStorageSync('isalterRep', 'yes')
    const { id } = this.$router.params
    console.log(id)
    this.setState({ id })
  }
  getvalue(e) {
    this.setState({ refuseReason: e.detail.value })
  }
  async confirm() {
    let { refuseReason, id } = this.state
    if (!refuseReason) {
      Taro.showToast({
        title: '请填写拒绝理由',
        icon: 'none'
      })
      return
    }
    const params = { afterSaleOrderId: id, refuseReason }
    const res = await refuseRefund(params)
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalterRep', 'no')
      Taro.navigateBack({ delta: 1 })
    }
  }
  config: Config = {
    navigationBarTitleText: "退款处理"
  };
  render() {
    return (
      <Block>
        <View className='tips'>建议你与买家商议后再确定是否拒绝退款。如你拒绝退款，买家可重新发起退款申请</View>
        <View className='set'>
          <Textarea cols="20" placeholder='请填写你的拒绝理由' onInput={this.getvalue}></Textarea>
          <View className='btn' onClick={this.confirm}>
            <Text>确认拒绝</Text>
          </View>
        </View>
      </Block>
    );
  }
}
