import Taro, { Component, Config } from '@tarojs/taro';
import { Block, View, Text, Image, Input, Swiper, SwiperItem, Navigator } from '@tarojs/components';
import './salesite.scss';
import { returnAddress, getSalesAddress } from '@/api/address';

export default class Index extends Component {
  state = {
    address: '',
    username: '',
    phone: '',
    addressList: ''
  };
  config: Config = {
    navigationBarTitleText: '退货地址'
  };
  componentDidMount() {
    this.getsale()
  }
  // 获取退货地址
  getsale = async () => {
    const res = await getSalesAddress()
    if (res.data.code == 20000) {
      this.setState({ addressList: res.data.data ? res.data.data : '' })
      if (res.data.data) {
        const addressList = res.data.data
        this.setState({ username: addressList.consignee, address: addressList.address, phone: addressList.phoneNum })
      }

    }
  }
  getAddress(e) {

    this.setState({ address: e.detail.value });
  }
  getName(e) {
    this.setState({ username: e.detail.value });
  }
  getphone(e) {
    this.setState({ phone: e.detail.value });
  }
  // 保存
  async save() {
    const { address, username, phone } = this.state;
    const params = { address, consignee: username, phoneNum: phone };
    const res = await returnAddress(params);
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '退货地址保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000);
    }
  }
  // 修改
  async updata(id) {
    const { address, username, phone } = this.state;
    const params = { id, address, consignee: username, phoneNum: phone };
    const res = await returnAddress(params);
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '退货地址保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000);
    }
  }
  render() {
    const { address, username, phone, addressList } = this.state
    return (
      <Block>
        <View className='setrow'>
          <Text>退货地址</Text>
          <Input placeholder='请输入退货地址' value={address} onInput={this.getAddress}></Input>
        </View>
        <View className='setrow'>
          <Text>收货人</Text>
          <Input placeholder='请输入收货人' value={username} onInput={this.getName}></Input>
        </View>
        <View className='setrow'>
          <Text>联系方式</Text>
          <Input placeholder='请输入联系方式' value={phone} onInput={this.getphone}></Input>
        </View>
        {addressList ? (
          <View className='btn' onClick={() => { this.updata(addressList.id) }}>
            <Text>修改</Text>
          </View>
        ) : (
            <View className='btn' onClick={() => { this.save() }}>
              <Text>保存</Text>
            </View>
          )}
      </Block>
    );
  }
}
