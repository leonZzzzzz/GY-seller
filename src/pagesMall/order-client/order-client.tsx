import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./order-client.scss";
import { posentBus } from "@/api/customer"

export default class Index extends Component {

  state = {
    datalist: [], phone: ''
  };
  componentDidMount() {
    this.getlist()
  }
  getlist = async () => {
    const res = await posentBus(this.state.phone)
    this.setState({ datalist: res.data.data.list })
  }
  getvalue(e) {
    this.setState({ phone: e.detail.value })
  }
  search() {
    this.getlist()
  }
  config: Config = {
    navigationBarTitleText: "潜在客户"
  };
  render() {
    let { datalist } = this.state
    return (
      <Block>
        <View className='cust-fixed'>
          <View className="search">
            <Input placeholder='搜索手机号' onInput={this.getvalue}></Input>
            <View onClick={this.search}>搜索</View>
          </View>
        </View>
        {datalist.length > 0 ? (
          <View className='content'>
            {datalist.map((item, index) => {
              return (
                <View className='content-a' key={String(index)}>
                  <View className='content-a-name'>
                    <Image className='content-a-name-pic' src={item.headImage}></Image>
                    <View className='content-a-name-user'>{item.name}<Text className='content-a-name-user-t'>({item.mobilePhoneNumber})</Text></View>
                  </View>
                  <View className='cartnum'>购物车商品数<Text>{item.qty}</Text></View>
                </View>
              )
            })}
          </View>
        ) : (
            <View className="no-data-view">
              <Image
                src={Taro.getStorageSync('imgHostItem')+'qt_89.png'}
                mode="widthFix"
                className="no-data-image"
              ></Image>
              <View className="no-data-text">没有潜在客户</View>
            </View>
          )}
      </Block>
    );
  }
}
