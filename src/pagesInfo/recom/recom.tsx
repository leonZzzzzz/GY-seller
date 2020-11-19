import Taro, { Component, Config } from '@tarojs/taro';
import { deliveryway } from '@/api/address';
import { Block, View, Text, Picker } from '@tarojs/components';
import './recom.scss';
const app = Taro.getApp()

export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    });
  }
  state = {
    type: 'distribution',
    disDate: '',
    disStartTime: '',
    disEndTime: '',
    address: '',
    phone: '',
    id: ''
  };
  componentDidMount() {
    let { type, distime, phone, address } = this.$router.params;
    console.log(type)
    if (distime) {
      distime = distime.split('-')
      console.log(distime, phone)
      this.setState({ disStartTime: distime[0], disEndTime: distime[1] })
    }
    const id = this.$router.params.id;
    this.setState({ type: type, id: id ? id : '', phone: phone ? phone : '', address: address ? address : '' });
  }
  onDateChange(e) {
    this.setState({ disDate: e.detail.value });
  }
  onStartTimeChange(e) {
    this.setState({ disStartTime: e.detail.value });
  }
  onEndTimeChange(e) {
    this.setState({ disEndTime: e.detail.value });
  }
  getInput(e) {
    this.setState({ address: e.detail.value });
  }
  getPhone(e) {
    this.setState({ phone: e.detail.value });
  }
  // 保存
  async preserve() {
    const { id, type, disStartTime, disEndTime, address, phone } = this.state;
    const distime = disStartTime + '-' + disEndTime;
    var params = {};
    if (type == 'distribution') {
      params = {
        type: type,
        timeQuantum: distime,
        phoneNumber: phone,
        id: id
      };
    } else {
      params = {
        type: type,
        timeQuantum: distime,
        address: address,
        phoneNumber: phone,
        id: id
      };
    }
    const res = await deliveryway(params);
    if (res.data.code == 20000) {
      app.globalData.addressId = res.data.message
      Taro.navigateBack({ delta: 1 });
    }

  }

  config: Config = {
    navigationBarTitleText: '配送方式'
  };
  render() {
    const { type, phone, address } = this.state;
    return (
      <Block>
        {type == 'distribution' && (
          <View>
            {/* <View className='setrow'>
              <View>配送日期</View>
              <View>
                <Picker mode='date' onChange={this.onDateChange}>
                  <Text>{disDate}</Text>
                  <Image className='image' src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
                </Picker>
              </View>
            </View> */}
            <View className='setrow'>
              <View>配送时间</View>
              <View style='display:flex'>
                <View style='display:flex'>
                  <Picker mode='time' onChange={this.onStartTimeChange}>
                    {!disStartTime && <Text>选择开始时间</Text>}

                    <Text>{disStartTime}-</Text>
                  </Picker>
                  <Picker mode='time' onChange={this.onEndTimeChange}>
                    {!disEndTime && <Text>选择结束时间</Text>}

                    <Text>{disEndTime}</Text>
                  </Picker>
                </View>
                {/* <Image className='image' src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
              </View>
            </View>
            <View className='setrow'>
              <View>配送电话</View>
              <View>
                <Input placeholder='请输入手机号码' value={phone} onInput={this.getPhone}></Input>
              </View>
            </View>
          </View>
        )}
        {type == 'takeout' && (
          <View>
            {/* <View className='setrow'>
              <View>自提日期</View>
              <View>
                <Picker mode='date' onChange={this.onDateChange}>
                  <Text>{disDate}</Text>
                  <Image className='image' src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
                </Picker>
              </View>
            </View> */}

            <View className='setrow'>
              <View>自提时间</View>
              <View style='display:flex'>
                <View style='display:flex;'>
                  <Picker mode='time' onChange={this.onStartTimeChange}>
                    {!disStartTime && <Text>选择开始时间</Text>}

                    <Text>{disStartTime}-</Text>
                  </Picker>
                  <Picker mode='time' onChange={this.onEndTimeChange}>
                    {!disEndTime && <Text>选择结束时间</Text>}

                    <Text>{disEndTime}</Text>
                  </Picker>
                </View>
                {/* <Image className='image' src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
              </View>
            </View>
            <View className='setrow'>
              <View>自提电话</View>
              <View>
                <Input placeholder='请输入手机号码' value={phone} onInput={this.getPhone}></Input>
              </View>
            </View>
            <View className='setrow'>
              <View>自提地址</View>
              <View>
                <Input placeholder='请输入自提地址' value={address} onInput={this.getInput}></Input>
              </View>
            </View>

          </View>
        )}

        <View className='btn' onClick={this.preserve}>
          <Text>保存</Text>
        </View>
      </Block>
    );
  }
}
