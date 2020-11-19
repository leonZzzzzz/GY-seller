import Taro, { Component, Config } from '@tarojs/taro';
import { Block, View, Text } from '@tarojs/components';
import './setting.scss';
import { loginOut } from '@/api/login';

export default class Index extends Component {
  state = {};
  config: Config = {
    navigationBarTitleText: '设置'
  };
  logout() {
    Taro.showModal({
      content: '退出登录后会影响使用喔，确定退出？',
      success: res => {
        if (res.confirm) {
          this.getout();
          Taro.removeStorageSync('memberId')
          // Taro.removeStorageSync('sessionId')
          Taro.removeStorageSync('istype')
          Taro.removeStorageSync('storeId')
        }
      }
    });
  }
  getout = async () => {
    const res = await loginOut();
    if (res.data.code == 20000) {
      Taro.navigateBack({ delta: 1 });
    }
  };
  render() {
    return (
      <Block>
        <View style='margin-top:15rpx;'>
          <View className='password'>
            <Text>登录密码</Text>
            <View
              className='check'
              onClick={() => {
                Taro.navigateTo({ url: '../changepsw/changepsw' });
              }}>
              <Text>修改</Text>
              <View className='qcfont qc-icon-chevron-right'></View>
            </View>
          </View>
          <View className='password'>
            <Text>版本信息</Text>
            <View className='check'>
              <Text>1.2.5</Text>
            </View>
          </View>
        </View>
        <View className='btn' onClick={this.logout}>
          退出登录
        </View>
      </Block>
    );
  }
}
