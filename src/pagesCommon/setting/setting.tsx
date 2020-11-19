import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Swiper,
  SwiperItem,
  Navigator
} from "@tarojs/components";
import "./setting.scss";

export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    })
  }
  state = {

  };
  config: Config = {
    navigationBarTitleText: "选择城市"
  };
  render() {
    return (
      <Block>
        <View className='set'>
          <View className='set-row'>
            <Text>当前手机号</Text>
            <Text className='phone'>13655555555</Text>
          </View>
          <View className='set-row' onClick={this.gopasswod}>
            <Text>支付密码</Text>
            <View className='gtset'>
              <Text>未设置 </Text>
              <Image src={wx.getStorageSync('imgHostItem') + 'gy-icon_112.png'}></Image>
            </View>
          </View>
          <View className='btn'>
            <Text>退出登录</Text>
          </View>

        </View>
        <View className='version'><Text>版本信息：V1.2.5</Text></View>
      </Block>
    );
  }
}
