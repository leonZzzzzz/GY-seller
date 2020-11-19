import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image
} from "@tarojs/components";
import "./storelist.scss";
import { getstoreCategory, deleteStoreList } from "@/api/userInfo";

export default class Index extends Component {

  state = {
    send_type: '2',
    bannerData: [],
    pageNum: '1'
  };
  componentDidShow() {
    this.setState({ bannerData: [], pageNum: 1 })
    this.getBannerList(1)
  }
  getBannerList = async (pageNum) => {
    let params = { pageNum: pageNum, pageSize: 15, total: 0 }
    const res = await getstoreCategory(params)
    Taro.hideLoading()
    var data = res.data.data.list
    var bannerData = this.state.bannerData
    data.map(item => {
      bannerData.push(item)
    })
    this.setState({ bannerData })

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
  onReachBottom() {
    this.state.pageNum++;
    Taro.showLoading({
      title: '正在加载'
    })
    this.getBannerList(this.state.pageNum)
  }
  getdelete = async (id) => {
    const res = await deleteStoreList(id)
    this.setState({ bannerData: [] })
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '删除成功',
        icon: 'none'
      })
      this.getBannerList(1)
    }
  }
  config: Config = {
    navigationBarTitleText: "店铺分类"
  };
  render() {
    const { bannerData } = this.state
    return (
      <View className="product-confirm">
        {bannerData.length > 0 ? (
          bannerData.map((item, index) => {
            return (
              <View className='con'>
                <View className='banner' onClick={() => { Taro.navigateTo({ url: '../addclass/addclass?type=edit&list=' + JSON.stringify(item) }) }}>
                  <View>
                    <Text style='color:#999;margin-right:10rpx'>{item.seqNum}</Text>
                    <Text >{item.name}</Text>
                  </View>
                  <Text className='info'>{item.info}</Text>
                </View>
                <Image className='delete-img' src={wx.getStorageSync('imgHostItem') + 'cancel.png'} onClick={() => { this.delete(item.id) }}></Image>
              </View>

            )
          })
        ) : (
            <View className="no-data-view">
              <Image
                src={require("../../images/item/qt_89.png")}
                mode="widthFix"
                className="no-data-image"
              ></Image>
              <View className="no-data-text">
                还没有添加分类
                    </View>
            </View >
          )}


        <View style='height:100px'></View>
        <View className='confirm-order' onClick={() => { Taro.navigateTo({ url: '../addclass/addclass' }) }}>
          <View className='btn'>
            <View>添加分类</View>
          </View>
        </View>

      </View >
    );
  }
}
