import Taro, { Component, Config } from '@tarojs/taro';
import { Block, View, Text, Image, Input, Swiper, SwiperItem, Navigator } from '@tarojs/components';
import './auth-msg.scss';
import { getOrderPreview } from '@/api/login';

export default class Index extends Component {
  state = {
    name: '',
    password: ''
  };
  config: Config = {
    navigationBarTitleText: '丰盈鲜生店铺'
  };
  componentWillUnmount() {
    Taro.removeStorageSync('phone')
  }
  componentDidShow() {
    let phone = Taro.getStorageSync('phone')
    if (phone) {
      this.setState({ name: phone })
    }
  }
  singlechange(e) {
    console.log(e);
    this.setState({ isfor: e.detail.value });
  }
  getName(e) {
    this.setState({ name: e.detail.value });
  }
  getPasswd(e) {
    this.setState({ password: e.detail.value });
  }
  login() {
    const { name, password } = this.state;
    const params = { username: name, password };
    this.reg(params);
  }
  reg = async params => {
    const res = await getOrderPreview(params);
    if (res.data.code == 20000) {
      Taro.setStorageSync('storeId', res.data.data.storeId)
      // await testlogin()
      Taro.switchTab({
        url: '../../pages/home/index'
      });
    }
  };
  goPhone() {
    Taro.navigateTo({
      url: '../phone-login/phone-login'
    })
  }
  render() {
    return (
      <View style='flex-direction:column;border-top:1px solid #eee;'>
        <View className='logo'>
          <Image src={wx.getStorageSync('imgHostItem')+'fyex-v.png'}></Image>
        </View>
        <View className='input-content'>
          <View className='input-row'>
            <Image src={wx.getStorageSync('imgHostItem')+'username.png'}></Image>
            <Input placeholder='请输入账号' value={name} onInput={this.getName}></Input>
          </View>
          <View className='input-row'>
            <Image src={wx.getStorageSync('imgHostItem')+'passward.png'}></Image>
            <Input placeholder='请输入密码' onInput={this.getPasswd} type='password'></Input>
          </View>
          <View className='forget'>
            <Text onClick={this.goPhone}>忘记密码？去设置</Text>
          </View>
        </View>
        <View className='btn' onClick={this.login}>
          <Text>下一步</Text>
        </View>
      </View>
    );
  }
}
