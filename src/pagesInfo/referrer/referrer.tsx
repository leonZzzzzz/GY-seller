import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Image
} from "@tarojs/components";
import "./referrer.scss";
import { recommendUser } from "@/api/userInfo"

export default class Index extends Component {

  state = {
    type: 'store',
    data: '',
    phone: Taro.getStorageSync('phone')
  };
  config: Config = {
    navigationBarTitleText: "我要推荐"
  };
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    console.log('999', this.state.phone)
    const res = await recommendUser(this.state.type)
    if (res.data.code == 20000) {
      const data = res.data.data
      data.reward = parseFloat(data.reward / 100)
      data.factor = parseFloat(data.factor / 100)
      this.setState({ data: res.data.data })
    }
  }
  onShareAppMessage(e) {
    //这个分享的函数必须写在入口中，写在子组件中不生效
    return {
      title: '丰盈鲜生店铺',
      path: '/pages/authorize/index?jump=1&scene=' + this.state.phone,
      success: function (res) {
        console.log(res);
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
  // 分享
  onshare() {
    return {
      title: '邀请您入驻丰盈鲜生店铺',
      path: '/pages/authorize/index?jump=1&scene=' + this.state.phone,
      success: function (res) {

      }
    }
  }
  render() {
    return (
      <Block>
        <View>
          <Image src={wx.getStorageSync('imgHostItem') + 'recomm.png'}></Image>
          <View className='title-money'>现金<View className='wait'>{data.reward}</View>元等你拿</View>
          <View className='rule'>
            <View className='rule-a'>— 推荐规则 —</View>
            <View className='rule-b'>
              <View>1.分享丰盈鲜生店铺小程序给推荐人；</View>
              <View>2.被推荐人入驻平台时在推荐人处填写您的手机号；</View>
              <View>3.被推荐人缴纳年费和保证金，并且交易订单金额达到{data.factor}元，平台将赠送您{data.reward}元奖励，进账到您的可提现金额账户。</View>
            </View>

            <Button className='btn' open-type='share' onClick={this.onshare}>
              <View>分享给好友</View>
            </Button>
          </View>
        </View>
      </Block>
    );
  }
}
