import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';
import { audit, checkAccount } from '@/api/login';
import { response, needStoreIdRequest } from '../../utils/interceptors';
Taro.addInterceptor(response);
export default class Index extends Component {
  state = {
    istype: '3',
    notPassMsg: ''
  };
  componentDidShow() {
    let query = this.$router.params
    console.log('推荐人电话', query)
    // let query = { scene: '15899996666' }
    if (query.scene) {
      let queryArr = query.scene.split('_')
      console.log(queryArr)
      Taro.setStorageSync('recMobile', queryArr[0])
    }
    this.getaudit();
  }
  getaudit = async () => {
    const res = await audit();
    if (res.data.code == 20000) {
      this.setState({ istype: res.data.data.auditStatus, notPassMsg: res.data.data.notPassMsg });
    }
  };
  async getlogin() {
    const res = await checkAccount();
    if (res.data.code == 20000) {
      Taro.showModal({
        content: res.data.message,
        showCancel: false,
        success: res => {
          if (res.confirm) {
          }
        }
      });
    }
  }
  // 不通过
  getnopass() {
    const content = this.state.notPassMsg
    Taro.navigateTo({
      url: '../../pagesCommon/store-enter/store-enter?type=revise' + '&notPassMsg=' + content
    });
  }
  render() {
    const { istype } = this.state
    return (
      <View>
        <View className='iconfont gy-icon-tuikuan'></View>
        <View className='logo'>
          <Image src={Taro.getStorageSync('imgHostItem') + 'fyex-v.png'}></Image>
        </View>

        <View
          className='wxlogin'
          onClick={() => {
            Taro.navigateTo({ url: '../../pagesCommon/auth-msg/auth-msg' });
          }}>
          <Text className='text'>已有账号登录</Text>
        </View>
        {istype == '3' && (
          <View
            className='phonelogin'
            onClick={() => {
              Taro.navigateTo({ url: '../../pagesCommon/store-enter/store-enter' });
            }}>
            <Text className='text'>我要入驻</Text>
          </View>
        )}
        {istype == '0' && (
          <View className='phonelogin'>
            <Text className='text'>入驻审核中</Text>
          </View>
        )}
        {istype == '1' && (
          <View className='phonelogin' onClick={this.getlogin}>
            <Text className='text'>审核通过，点击获取登陆账号</Text>
          </View>
        )}
        {istype == '2' && (
          <View
            className='phonelogin'
            onClick={this.getnopass}>
            <Text className='text'>审核不通过，请修改后提交</Text>
          </View>
        )}
        {/* <View>
        <View className='back'></View>
        <View className='model'>
          <Image src={wx.getStorageSync('imgHostItem')+'delete.png'}></Image>
          <View>入驻审核通过</View>
          <View>您的入驻资料已通过审核，登陆账号:666666，登陆密码:222222，请妥善保管</View>
        </View>
      </View> */}
      </View>
    );
  }
}
