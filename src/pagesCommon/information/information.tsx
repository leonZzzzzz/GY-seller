import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image
} from "@tarojs/components";
import "./information.scss";
import { getByOrderId } from "@/api/order"

export default class Index extends Component {


  state = {
    info: ''
  };

  componentDidShow() {
    const id = this.$router.params.id
    // this.setState({ id: this.$router.params.id })
    getByOrderId(id).then(res => {
      if (res.data.code == 20000) {
        if (!res.data.data.driverName) {
          Taro.showToast({ title: '您还没有绑定司机信息', icon: 'none' })
        }
        this.setState({ info: res.data.data })
      }
    })
  }
  callphone(phone) {
    Taro.makePhoneCall({
      phoneNumber: phone
    });
  }
  config: Config = {
    navigationBarTitleText: "配送信息"
  };
  render() {
    const { info } = this.state
    return (
      <Block>
        <View className='set'>
          <View className='set-row'>
            <Text>车牌号</Text>
            <Text className='phone'>{info.driverCarNumber}</Text>
          </View>
          <View className='set-row'>
            <Text>司机姓名</Text>
            <Text className='phone'>{info.driverName}</Text>
          </View>
          <View className='set-row'>
            <Text>司机电话</Text>
            <Text className='phone' onClick={() => { this.callphone(info.driverPhoneNumber) }}>{info.driverPhoneNumber}</Text>
          </View>

        </View>
      </Block>
    );
  }
}
