import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image
} from "@tarojs/components";
import "./addBanner.scss";
import { bannerList, deletebanner } from "@/api/banner";

export default class Index extends Component {

  state = {
    send_type: '2',
    bannerData: []
  };
  componentDidShow() {
    this.getBannerList()
  }
  getBannerList = async () => {
    const res = await bannerList()
    console.log(res.data)
    let { code, data } = res.data
    if (code == 20000) {
      this.setState({ bannerData: data.list })
    }
  }
  delete(id) {
    Taro.showModal({
      content: '确定要删除吗？',
      success: (res => {
        if (res.confirm) {
          this.getdelete(id)
        }
      })
    })
  }
  getdelete = async (id) => {
    const res = await deletebanner(id)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.getBannerList()
    }
  }
  config: Config = {
    navigationBarTitleText: "轮播图管理"
  };
  render() {
    return (
      <View className="product-confirm">
        {this.state.bannerData.map((item, index) => {
          return (
            <View className='banner'>
              <View className='pic'>
                <Image src={'https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com' + item.imgLinks}></Image>
                <View className='time'>
                  <Text>有效期：{item.startTime}-{item.endTime}</Text>
                  <Text>排序：{item.sortNum}</Text>
                </View>
              </View>
              {item.skipType != 'noskip' && (
                <View className='goto'><Text style='color:#9A9DA1'>跳转至：{item.productName}</Text></View>
              )}

              <View className='banner-btn'>
                <Text onClick={() => { this.delete(item.id) }}>删除</Text>
                <Text onClick={() => { Taro.navigateTo({ url: '../saverota/saverota?item=' + JSON.stringify(item) + '&type=edit' }) }}>编辑</Text>
              </View>
            </View>
          )
        })}

        <View style='height:150px'></View>
        <View className='confirm-order' onClick={() => { Taro.navigateTo({ url: '../saverota/saverota' }) }}>
          <View className='btn'>
            <View>添加轮播图</View>
          </View>
        </View>

      </View >
    );
  }
}
