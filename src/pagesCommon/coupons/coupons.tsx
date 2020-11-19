import Taro, { Component, Config, showLoading } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  ScrollView,
} from "@tarojs/components";
import "./coupons.scss";
import classnames from 'classnames'
import { couponList, abortcoupon, usercoupon } from "@/api/coupon";

export default class Index extends Component {
  // 添加商品
  createTrade() {
    Taro.navigateTo({
      url: '../addgoods/addgoods'
    })
  }
  state = {
    curSwiperIdx: 1,
    couponlist: [],
    coupons: [],
    pageNum: 1,
  };
  componentDidShow() {
    var pages = Taro.getCurrentPages();//页面指针数组 
    var prepage = pages[pages.length - 2];//上一页面指针 
    console.log(prepage.route)
    this.setState({ coupons: [] })
    const { pageNum, curSwiperIdx } = this.state
    this.getCoupons(pageNum, curSwiperIdx)
  }
  getCoupons = async (pageNum, curSwiperIdx) => {
    const params = { pageNum: pageNum, pageSize: 10, status: curSwiperIdx }
    const res = await couponList(params)
    const coupons = this.state.coupons
    Taro.hideLoading()
    if (res.data.code == 20000) {
      const couponlist = res.data.data.list
      if (couponlist.length > 0) {
        couponlist.map(item => {
          item.couponAmount = parseFloat(item.couponAmount / 100)
          item.couponOrderAmount = parseFloat(item.couponOrderAmount / 100)
          item.validstartTime = item.couponValidTime.split(' ')
          item.validendTime = item.couponExpireTime.split(' ')
          coupons.push(item)
        })
      }

      this.setState({ couponlist: coupons })
    }
  }
  // 切换分类
  swichSwiperItem(e) {
    const curSwiperIdx = e.currentTarget.dataset.idx
    this.setState({ curSwiperIdx, pageNum: 1, coupons: [] })
    this.getCoupons(1, curSwiperIdx)
  }
  onReachBottom() {
    this.state.pageNum++
    Taro.showLoading({ title: '加载中' })
    this.getCoupons(this.state.pageNum, this.state.curSwiperIdx)
  }
  // 优惠券详情
  godetail(item) {
    Taro.setStorageSync('selectCoupon', item)
    Taro.navigateTo({
      // url: '../creatCoupon/creatCoupon?item=' + JSON.stringify(item) + '&type=edit'
      url: '../creatCoupon/creatCoupon?type=edit'
    })
  }
  // 禁用
  forBid(id) {
    Taro.showModal({
      content: '确定要禁用吗？',
      success: (res => {
        if (res.confirm) {
          this.stop(id)
        }
      })
    })
  }
  stop = async (id) => {
    const res = await abortcoupon(id)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '此优惠券已停用',
        icon: 'none'
      })
      setTimeout(() => {
        this.setState({ curSwiperIdx: 3, coupons: [] })
        this.getCoupons(this.state.pageNum, '3')
      }, 1000);
    }
  }
  // 启用
  initiate(id) {
    Taro.showModal({
      content: '确定要启用吗？',
      success: (res => {
        if (res.confirm) {
          this.start(id)
        }
      })
    })
  }
  start = async (id) => {
    const res = await usercoupon(id)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '此优惠券已启用',
        icon: 'none'
      })
      setTimeout(() => {
        this.setState({ curSwiperIdx: 1, coupons: [] })
        this.getCoupons(this.state.pageNum, '1')
      }, 1000);
    }
  }
  // 新建优惠券
  createcoupon() {
    Taro.navigateTo({ url: '../creatCoupon/creatCoupon' })
    this.setState({ curSwiperIdx: 2 })
  }
  config: Config = {
    navigationBarTitleText: "优惠券管理"
  };
  render() {
    const { couponlist, curSwiperIdx } = this.state
    return (
      <View>
        <View className='content-fixed'>
          <ScrollView scroll-x='true' className="nav-header-View" scroll-into-View={curSwiperIdx == 5 ? 'listReturn' : ''}>
            <View className={classnames('header-col-View', curSwiperIdx == 1 && 'show-border-bottom')} data-idx={1} onClick={this.swichSwiperItem}>
              <Text data-idx={1}>进行中</Text>
            </View>
            <View className={classnames('header-col-View', curSwiperIdx == 2 && 'show-border-bottom')} data-idx={2} onClick={this.swichSwiperItem}>
              <Text data-idx={2}>未开始</Text>
            </View>
            <View className={classnames('header-col-View', curSwiperIdx == 3 && 'show-border-bottom')} data-idx={3} onClick={this.swichSwiperItem}>
              <Text data-idx={3}>已失效</Text>
            </View>
          </ScrollView>
        </View>

        <View style="margin:0 10rpx;margin-top:100rpx;margin-bottom:150px">
          {couponlist.length > 0 ? (
            <Block>
              {couponlist.map((item, index) => {
                return (
                  <View className='coupon' key={String(index)}>
                    {curSwiperIdx == 1 && (
                      <Image src={Taro.getStorageSync('imgHostItem') + 'green1.png'} onClick={() => { this.godetail(item) }}></Image>
                    )}
                    {curSwiperIdx == 2 && (
                      <Image src={Taro.getStorageSync('imgHostItem') + 'yellow1.png'} onClick={() => { this.godetail(item) }}></Image>
                    )}
                    {curSwiperIdx == 3 && (
                      <Image src={Taro.getStorageSync('imgHostItem') + 'red1.png'} onClick={() => { this.godetail(item) }}></Image>
                    )}

                    <View className='coupon-list'>
                      <View className={curSwiperIdx == 3 ? 'cou-coupon' : 'cou-price'}>
                        {curSwiperIdx == 2 ? (
                          <Block>
                            <View className='cou-p-a' onClick={() => { this.godetail(item) }}><Text style='font-size:26rpx;'>￥</Text>{item.couponAmount}</View>
                            <View className='cous' onClick={() => { this.godetail(item) }}>{item.ruleName}</View>
                          </Block>
                        ) : (
                            <Block>
                              <View className='cou-p-a'><Text style='font-size:26rpx;'>￥</Text>{item.couponAmount}</View>
                              <View className='cous'>{item.ruleName}</View>
                            </Block>
                          )}
                        {curSwiperIdx == 1 && (
                          <View className='user' onClick={() => { this.forBid(item.id) }}>停用</View>
                        )}
                        {curSwiperIdx == 2 && (
                          <View className='user1' onClick={() => { this.initiate(item.id) }}>启用</View>
                        )}

                      </View>
                      {curSwiperIdx == 2 ? (
                        <View className='cou-dist' onClick={() => { this.godetail(item) }}>
                          <Text className='dist-a'>{item.couponTitle}</Text>
                          <Text className='dist-b'>有效期：{item.validstartTime[0]}至{item.validendTime[0]}</Text>
                          <Text className='dist-c'>●已领取/剩余：{item.receivedQuantity}/{item.totalQuantity - item.receivedQuantity}</Text>
                          <Text className='dist-c'>●已使用：{item.usedQuantity}</Text>
                        </View>
                      ) : (
                          <View className='cou-dist'>
                            <Text className='dist-a'>{item.couponTitle}</Text>
                            <Text className='dist-b'>有效期：{item.validstartTime[0]}至{item.validendTime[0]}</Text>
                            <Text className='dist-c'>●已领取/剩余：{item.receivedQuantity}/{item.totalQuantity - item.receivedQuantity}</Text>
                            <Text className='dist-c'>●已使用：{item.usedQuantity}</Text>
                          </View>
                        )}
                    </View>
                  </View>
                )
              })}
            </Block>
          ) : (
              <View className="no-data-view">
                <Image
                  src={Taro.getStorageSync('imgHostItem') + 'qt_89.png'}
                  mode="widthFix"
                  className="no-data-image"
                ></Image>
                <View className="no-data-text">此分类还没有优惠券</View>
              </View>
            )}
        </View>

        <View className='btn' onClick={this.createcoupon}>
          <Text>新建优惠券</Text>
        </View>
      </View>
    );
  }
}
