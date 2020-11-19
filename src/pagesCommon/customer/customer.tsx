import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
} from "@tarojs/components";
import "./customer.scss";

export default class Index extends Component {

  state = {

  };
  // 去到订单客户
  gocust() {
    Taro.navigateTo({
      url: '../../pagesMall/soldcust/soldcust'
    })
  }
  // 去到账期客户
  gocredit() {
    Taro.navigateTo({
      url: '../../pagesMall/credit-client/credit-client'
    })
  }
  // 去到潜在客户
  gopotent() {
    Taro.navigateTo({
      url: '../../pagesMall/order-client/order-client'
    })
  }
  config: Config = {
    navigationBarTitleText: "客户管理"
  };
  render() {
    return (
      <Block>
        <View className='set'>
          <View className='set-row' onClick={this.gocust}>
            <View className='gtset'>
              <Text>订单客户</Text>
            </View>
            <Image src={Taro.getStorageSync('imgHostItem')+'qt_125.png'}></Image>
          </View>
          <View className='set-row' onClick={this.gocredit}>
            <View className='gtset'>
              <Text>账期客户</Text>
            </View>
            <Image src={Taro.getStorageSync('imgHostItem')+'qt_125.png'}></Image>
          </View>
          <View className='set-row' onClick={this.gopotent}>
            <View className='gtset'>
              <Text>潜在客户</Text>
              <Text style='color:#999;'>(把本店铺商品加入购物车)</Text>
            </View>
            <Image src={Taro.getStorageSync('imgHostItem')+'qt_125.png'}></Image>
          </View>
        </View>
      </Block>
    );
  }
}
