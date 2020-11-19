import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./phone-login.scss";
import { verilPhone, resetPassword } from "@/api/login"

export default class Index extends Component {

  state = {
    phone: '',
    mobileCode: '',
    timer: '',
    countDownNum: '获取验证码',
    confirmPassword: '',
    password: ''
  };
  placePhone(e) {
    this.setState({ phone: e.detail.value })
  }
  // 获取验证码
  async getVeril() {
    let { phone } = this.state
    if (!phone) {
      Taro.showToast({
        title: '请先输入手机号',
        icon: 'none'
      })
      return
    } else {
      if (!(/^1[3456789]\d{9}$/.test(phone))) {
        Taro.showToast({
          title: '手机号码有误，请重填',
          icon: 'none'
        })
        return;
      }
    }
    const params = { phone, codeType: 'resetStorePassword' }
    await verilPhone(params)
    let that = this
    let countDownNum = 60
    that.setState({
      timer: setInterval(function () {
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setState({
          countDownNum: countDownNum + 's'
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.state.timer);
          that.setState({
            countDownNum: '获取验证码'
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);		// 清除计时器
  }
  // 输入验证码
  inputVeril(e) {
    console.log(e)
    this.setState({ mobileCode: e.detail.value })
  }
  // 密码
  getpasswd(e) {
    this.setState({ password: e.detail.value })
  }
  // 确认密码
  getagainpasswd(e) {
    this.setState({ confirmPassword: e.detail.value })
  }
  // 提交
  async nextstep() {
    let { phone, mobileCode, confirmPassword, password } = this.state
    var reg = /^[A-Za-z0-9]\w{5,17}$/
    const params = {
      mobile: phone,
      code: mobileCode,
      confirmPassword,
      password,
      codeType: 'resetStorePassword'
    }
    if (!password) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    } else {
      if (!reg.test(password)) {
        Taro.showToast({
          title: '密码格式不正确',
          icon: 'none'
        })
        return;
      }
    }
    if (!confirmPassword) {
      Taro.showToast({
        title: '请确认密码',
        icon: 'none'
      })
      return
    } else {
      if (!reg.test(confirmPassword)) {
        Taro.showToast({
          title: '密码格式不正确',
          icon: 'none'
        })
        return;
      }
    }
    if (confirmPassword != password) {
      Taro.showToast({
        title: '密码和确认密码不一致',
        icon: 'none'
      })
      return
    }
    const res = await resetPassword(params)
    if (res.data.code == 20000) {
      Taro.setStorageSync('phone', phone)
      Taro.showToast({
        title: '密码已设置，去登录',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000);
    }
  }


  config: Config = {
    navigationBarTitleText: "手机号登录"
  };
  render() {
    const { countDownNum } = this.state
    return (
      <View style="flex-direction:column;">
        <View className='logo'><Image src={wx.getStorageSync('imgHostItem')+'fyex.png'}></Image></View>
        <View className='phone'>
          <Input placeholder='请输入手机号码' type='number' onInput={this.placePhone}></Input>
          {countDownNum == '获取验证码' ? (
            <Text onClick={this.getVeril}>{countDownNum}</Text>
          ) : (
              <Text>{countDownNum}</Text>
            )}
        </View>
        <View className='phone'>
          <Input placeholder='请输入验证码' type='number' onInput={this.inputVeril}></Input>
        </View>
        <View className='phone'>
          <Input placeholder='请输入不少于6位数的密码' type='password' onInput={this.getpasswd}></Input>
        </View>
        <View className='phone'>
          <Input placeholder='请确认密码' type='password' onInput={this.getagainpasswd}></Input>
        </View>
        <View className='hint'>请输入不少于6位数的密码，密码可包含26位大小写字母及数字</View>
        <View className='btn' onClick={this.nextstep}><Text>确定</Text></View>
      </View>
    );
  }
}
