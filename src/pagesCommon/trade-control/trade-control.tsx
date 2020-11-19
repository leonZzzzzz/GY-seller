import Taro, { Component, Config, showModal } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  ScrollView
} from "@tarojs/components";
import "./trade-control.scss";
import { goodsList, sellGoods, getStoreClass } from "@/api/goodsMan"

export default class Index extends Component {
  // 添加商品
  createTrade() {
    Taro.navigateTo({
      url: '../addgoods/addgoods'
    })
  }
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    tradeList: [],
    trade: [],
    curSwiperIdx: 0,
    pageNum: '1',
    name: '',
    storeCate: [],
    categoryId: ''
  };
  componentDidShow() {
    let changeData = Taro.getStorageSync('changeData')
    console.log(changeData)
    let addData = Taro.getStorageSync('addData')
    let { tradeList } = this.state
    if (changeData && changeData.id) {
      tradeList.map(item => {
        if (item.id == changeData.id) {
          item.name = changeData.name
          item.qty = changeData.qty
          item.supplierPrice = parseFloat(changeData.supplierPrice / 100).toFixed(2)
          item.price = parseFloat(changeData.price / 100).toFixed(2)
        }
      })
      console.log(tradeList)
      this.setState({ tradeList })
    }
    if (addData && addData.name) {
      this.setState({ tradeList: [], trade: [] })
      this.getGoodlist(1, this.state.curSwiperIdx, this.state.name, this.state.categoryId)
    }
    Taro.removeStorageSync('changeData')
    Taro.removeStorageSync('addData')
    Taro.removeStorageSync('productParams')
    Taro.removeStorageSync('storeCategoryId')
    Taro.removeStorageSync('storeCategoryName')
    Taro.removeStorageSync('productParams')
    Taro.removeStorageSync('editorContent')
    Taro.removeStorageSync('standList')
    Taro.removeStorageSync('arrayItem')
    Taro.removeStorageSync('totaldata')
    this.upStoreClass()
  }

  componentDidMount() {
    Taro.removeStorageSync('storeCategoryId')
    Taro.removeStorageSync('storeCategoryName')
    Taro.removeStorageSync('productParams')
    Taro.removeStorageSync('editorContent')
    Taro.removeStorageSync('standList')
    Taro.removeStorageSync('arrayItem')
    Taro.removeStorageSync('totaldata')
    const isalter = Taro.getStorageSync('isalter')
    if (!isalter) {
      this.setState({ tradeList: [], trade: [] })
      this.getGoodlist(1, this.state.curSwiperIdx, this.state.name, this.state.categoryId)
    }
    Taro.removeStorageSync('isalter')
  }
  getGoodlist = async (pageNum, idx, name, categoryId) => {
    const params = {
      pageNum: pageNum, pageSize: 20, salesStatus: idx, name: name, categoryId
    }
    const res = await goodsList(params)
    const tradeList = res.data.data.list
    const trade = this.state.trade
    tradeList.map(item => {
      const rollingImgUrl = item.rollingImgUrl
      const rollimg = rollingImgUrl.split('_');
      item.rollimg = rollimg
      item.price = parseFloat(item.price / 100).toFixed(2)
      item.supplierPrice = parseFloat(item.supplierPrice / 100).toFixed(2)
      trade.push(item)
    })
    this.setState({ tradeList: trade })
  }
  // 获取店铺分类
  upStoreClass = async () => {
    const res = await getStoreClass()
    let storeCate = res.data.data
    let a = { id: '', name: '全部' }
    storeCate.unshift(a)
    this.setState({ storeCate })
  }
  // 切换分类
  swichSwiperItem(e) {
    const idx = e.currentTarget.dataset.idx
    const pageNum = '1'
    this.setState({ curSwiperIdx: Number(idx), pageNum: '1', trade: [] })
    this.getGoodlist(pageNum, idx, this.state.name, this.state.categoryId)

  }
  // 页面滚动
  onPageScroll(e) {
    // console.log(e)
    // Taro.setStorageSync('scrollTop', e.scrollTop)
    // this.setState({ scrollTop: e.scrollTop })
  }
  // 触底加载更多
  onReachBottom() {
    this.state.pageNum++;
    this.getGoodlist(this.state.pageNum, this.state.curSwiperIdx, this.state.name, this.state.categoryId)
  }
  //  上架、下架
  async soldout(type, id) {
    if (type == 1) {
      Taro.showModal({
        content: '确认上架？',
        success: (res => {
          if (res.confirm) {
            this.putaway(type, id)
          }
        })
      })
    } else {
      Taro.showModal({
        content: '确认下架？',
        success: (res => {
          if (res.confirm) {
            this.putaway(type, id)
          }
        })
      })
    }
  }
  putaway = async (type, id) => {
    const params = { ids: id, isSell: type == 1 ? true : false }
    var { tradeList } = this.state
    const res = await sellGoods(params)
    if (res.data.code == 20000) {
      if (type == 1) {
        Taro.showToast({
          title: '上架成功',
          icon: 'none'
        })
      } else {
        Taro.showToast({
          title: '下架成功',
          icon: 'none'
        })
      }
      tradeList.forEach((item, index) => {
        if (item.id == id) {
          tradeList.splice(index, 1)
        }
      })
      this.setState({ tradeList })
      // this.setState({ tradeList: [], pageNum: 1, trade: [] })
      // this.getGoodlist(1, this.state.curSwiperIdx, this.state.name, this.state.categoryId)
    }
  }
  getValue(e) {
    this.setState({ name: e.detail.value })
  }
  search() {
    this.setState({ tradeList: [], pageNum: 1, trade: [] })
    this.getGoodlist(1, this.state.curSwiperIdx, this.state.name, this.state.categoryId)
  }
  // 选择店铺分类
  chooseStore(id) {
    this.setState({ categoryId: id })
    this.setState({ tradeList: [], pageNum: 1, trade: [] })
    this.getGoodlist(1, this.state.curSwiperIdx, this.state.name, id)
  }

  config: Config = {
    navigationBarTitleText: "商品管理"
  };
  render() {
    const { tradeList, imageurl, curSwiperIdx, storeCate, categoryId } = this.state
    return (
      <View>
        <View className='content-fixed'>
          <View className="search">
            <Input placeholder='搜索商品名称' onInput={this.getValue}></Input>
            <View onClick={this.search}>搜索</View>
          </View>
          <ScrollView scroll-x='true' className="nav-header-View" scroll-into-View="{{curSwiperIdx=='5'?'listReturn':''}}">
            <View className="header-col-View {{curSwiperIdx == 0 ? 'show-border-bottom' : '' }}" data-idx='0' onClick={this.swichSwiperItem}>
              <Text>出售中</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == 1 ? 'show-border-bottom' : '' }}" data-idx='1' onClick={this.swichSwiperItem}>
              <Text>已售罄</Text>
            </View>
            <View className="header-col-View {{curSwiperIdx == 2 ? 'show-border-bottom' : '' }}" data-idx='2' onClick={this.swichSwiperItem}>
              <Text>仓库中</Text>
            </View>
          </ScrollView>
        </View>

        <View style="width:100%;margin-top:176rpx;display:flex;">
          <View className='storeclass'>
            {storeCate.map(item => {
              return (
                <View className={categoryId == item.id ? 'viewback' : ''} onClick={() => { this.chooseStore(item.id) }}>
                  <Text>{item.name}</Text>
                </View>
              )
            })}

          </View>
          {tradeList.length > 0 ? (
            <View style='width:610rpx;margin-left:140rpx;'>
              {tradeList.map((item, index) => {
                return (
                  <View className="order-content" key={String(index)}>
                    <Image src={imageurl + item.rollimg[0]}></Image>
                    <View className="order-detail">
                      <Text>{item.name}</Text>
                      <View className="order-price">
                        <Text className="order-a">已售 {item.salesQty ? item.salesQty : '0'}</Text>
                        <Text className="order-a">收藏 {item.collectQty ? item.collectQty : '0'}</Text>
                        <Text>库存 {item.qty}</Text>
                      </View>
                      <View className='order-name'>
                        <View style="flex-direction:column;">
                          <View className="reper">
                            <Text>￥</Text>
                            <Text className="repe-a">{item.price}</Text>
                          </View>
                          {Number(item.supplierPrice) && (
                            <View className="cost">
                              <Text>成本价:￥{item.supplierPrice}</Text>
                            </View>
                          )}


                        </View>
                        <View className="btns">
                          {curSwiperIdx == 2 ? (
                            <Text className='btnsup' onClick={() => { this.soldout(1, item.id) }}>上架</Text>
                          ) : (
                              <Text className='btnsdown' onClick={() => { this.soldout(2, item.id) }}>下架</Text>
                            )}
                          <Text onClick={() => { Taro.navigateTo({ url: '../editgoods/editgoods?id=' + item.id }) }}>编辑</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
              <View style='height:55px'></View>
            </View>
          ) : (
              <View className="no-data-view">
                <Image
                  src={require("../../images/item/qt_89.png")}
                  mode="widthFix"
                  className="no-data-image"
                ></Image>
                <View className="no-data-text">此分类没有商品</View>
              </View>
            )}
        </View>

        <View className='btn' onClick={this.createTrade}>
          <Text>+ 添加商品</Text>
        </View>
      </View>
    );
  }
}
