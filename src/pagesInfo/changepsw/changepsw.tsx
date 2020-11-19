import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text
} from "@tarojs/components";
import "./changepsw.scss";
import { updataPsd } from "@/api/userInfo"

export default class Index extends Component {

  state = {
    password: '', newPassword: '', confirmPassword: ''
  };
  config: Config = {
    navigationBarTitleText: "修改登录密码"
  };
  getoldpsd(e) {
    this.setState({ password: e.detail.value })
  }
  getnewpsd(e) {
    this.setState({ newPassword: e.detail.value })
  }
  getagainpsd(e) {
    this.setState({ confirmPassword: e.detail.value })
  }
  async confirm() {
    const { password, newPassword, confirmPassword } = this.state
    const params = { password, newPassword, confirmPassword }
    const res = await updataPsd(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '重置密码成功',
        icon: 'success'
      })
      Taro.navigateTo({
        url: '../../pagesCommon/auth-msg/auth-msg'
      })
    }
  }

  render() {
    return (
      <Block>
        <View style='margin-top:15rpx;'>
          <View className='password'>
            <Text>原密码</Text>
            <Input placeholder='请输入原密码' type='password' onInput={this.getoldpsd}></Input>
          </View>
          <View className='password'>
            <Text>新密码</Text>
            <Input placeholder='请输入新密码' type='password' onInput={this.getnewpsd}></Input>
          </View>
          <View className='password'>
            <Text>重复新密码</Text>
            <Input placeholder='确认新密码' type='password' onInput={this.getagainpsd}></Input>
          </View>
        </View>
        <View className='btn' onClick={this.confirm}>确认修改</View>
      </Block>
    );
  }
}
