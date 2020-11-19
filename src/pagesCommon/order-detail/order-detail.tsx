import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import ScaleImage from "@/components/scaleImage";
import "./order-detail.scss";
import { getOrderDetail, orderDelive, mentCancel, supplierOrder, getByOrderId } from "@/api/order"

export default class Index extends Component {

  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    send_type: '2',
    data: '',
    orderItems: [],
    id: '', istype: '', replacetype: ''
  };
  componentDidShow() {
    Taro.setStorageSync('isalter', true)
    const { id, istype } = this.$router.params
    let replacetype = this.$router.params.replacetype
    if (replacetype) {
      this.setState({ replacetype })
    }
    this.setState({ id, istype })
    this.getDetail(id)
  }
  getDetail = async (id) => {
    const res = await getOrderDetail(id)
    if (res.data.code == 20000) {
      const data = res.data.data
      data.storeCouponPayAmount = parseFloat(data.storeCouponPayAmount / 100).toFixed(2)
      data.productAmount = parseFloat(data.productAmount / 100).toFixed(2)
      data.transportAmount = parseFloat(data.transportAmount / 100).toFixed(2)
      data.couponPayAmount = parseFloat(data.couponPayAmount / 100).toFixed(2)
      data.needPayTotalAmount = parseFloat(data.needPayTotalAmount / 100).toFixed(2)
      data.adjustAmount = parseFloat(data.adjustAmount / 100).toFixed(2)
      data.transportDiscountAmount = parseFloat(data.transportDiscountAmount / 100).toFixed(2)
      if (data.transportCouponAmount) data.transportCouponAmount = parseFloat(data.transportCouponAmount / 100).toFixed(2)
      if (data.storeImageRemark) {
        data.storeImageRemark = data.storeImageRemark.split('_')
      }
      const orderItems = res.data.data.orderItems
      orderItems.map(item => {
        item.price = parseFloat(item.price / 100).toFixed(2)
      })
      this.setState({ data: data, orderItems })
    }
  }
  // 改价
  getcheck() {
    const { data } = this.state
    Taro.navigateTo({ url: '../alter/alter?trans=' + data.transportAmount + '&total=' + data.needPayTotalAmount + '&id=' + data.id })
  }

  // 发货
  getDeliver() {
    Taro.showModal({
      content: '确认发货？',
      success: (res => {
        if (res.confirm) {
          this.deliver()
        }
      })
    })
  }
  deliver = async () => {
    const res = await orderDelive(this.state.id)
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalter', false)
      Taro.showToast({
        title: '发货成功',
        icon: 'none'
      })
      Taro.navigateBack({ delta: 1 })
    }
  }
  // 配送信息
  distInfo() {
    Taro.navigateTo({
      url: '../information/information?id=' + this.state.id
    })

  }


  // 订单关闭
  ordercancel(id) {
    Taro.showModal({
      content: '确认关闭订单',
      success: (res => {
        if (res.confirm) {
          this.cancel(id)
        }
      })
    })
  }
  cancel = async (id) => {
    const res = await mentCancel(id)
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalter', false)
      this.setState({ data: {} })
      Taro.showToast({
        title: '订单已关闭',
        icon: 'none'
      })
      Taro.navigateBack({ delta: 1 })
    }
  }

  // 确认补单
  onconfirm(id) {
    Taro.showModal({
      content: '确认补单？',
      success: (res => {
        if (res.confirm) {
          this.supplier(id)
        }
      })
    })
  }
  supplier = async (id) => {
    const res = await supplierOrder(id)
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalter', false)
      this.setState({ order: [] })
      Taro.showToast({
        title: '已确认补单',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }
  // 点击图片预览
  previewImg(e) {
    console.log(e)
    var imagelist = [];
    var index = e.currentTarget.dataset.index;
    var imgArr = this.state.data.storeImageRemark;
    var imageurl = this.state.imageurl
    // var imgArr = data
    imgArr.forEach(item => {
      var img = imageurl + item
      imagelist.push(img);
    })
    console.log(imagelist)
    Taro.previewImage({
      current: imagelist[index],     //当前图片地址
      urls: imagelist             //所有要预览的图片的地址集合 数组形式
    })
  }
  config: Config = {
    navigationBarTitleText: "订单详情"
  };
  render() {
    const { data, imageurl } = this.state
    console.log(data.storeImageRemark)
    return (
      <View className="product-confirm">
        {data.storeRemark && (
          <View className='tips'>
            {/* <View className='qcfont qc-icon-qianbao'></View> */}
            <View>备注:{data.storeRemark}</View>
            <View style='display:flex;margin-top:5rpx'>
              {data.storeImageRemark && (
                <Block>
                  {data.storeImageRemark.map((img, index) => {
                    return (
                      // <View style='overflow:auto;'>
                      //   <ScaleImage imageSrc={imageurl + img} />
                      // </View>
                      <View className='imgList'>
                        <View className='imgList-li'>
                          <Image className='img' src={imageurl + img} data-index={index} onClick={(e) => { this.previewImg(e) }}></Image>
                        </View>
                      </View>
                    )
                  })}
                </Block>
              )}

            </View>
          </View>
        )}
        <View className='orderno'>
          <View>
            <Text className='state-a'>订单号：{data.orderNo}</Text>
            <View>
              {data.isAccounPeriod && (
                <Text className='charge'>账期结算({data.accounPeriod}天)</Text>
              )}
              {data.isSupplementary && (
                <Text className='charge'>补单</Text>
              )}

            </View>
            <View className='state-b'>
              <View>订单状态：<Text>{data.statusName}</Text></View>
              <View>创建时间:{data.createTime}</View>
              <View>付款时间:{data.payTime}</View>
            </View>
          </View>
          {/* <Image className='state-img' src={wx.getStorageSync('imgHostItem')+'nopay.png'}></Image> */}
        </View>
        {data.deliveryWay != 'takeout' && (
          <View className="address-wrap">
            <Image className='address-wrap-img' src={wx.getStorageSync('imgHostItem') + 'address.png'}></Image>
            <View className="address-wrap__info">
              <View className="address-wrap__user">
                <Text className="name">收货人：{data.receiver}</Text>
                <Text className="phone">{data.mobile}</Text>
              </View>
              <View className="address-wrap__add">地址：{data.address}</View>
            </View>
            {/* <View className='image-one qcfont qc-icon-chevron-right'></View> */}
          </View>
        )}


        <View className=''>
          <View className='content'>
            <View className='store-name'>{data.storeName}</View>
            {data.orderItems.map(item => {
              return (
                <View className='order-store'>
                  <Image className='order-store-img' src={imageurl + item.iconUrl}></Image>
                  <View className='order-store-name'>
                    <Text className='order-store-name-t'>{item.name}</Text>
                    {item.specs && (
                      <Text className='order-store-name-g'>{item.specs}</Text>
                    )}

                    <View className='order-store-price'>
                      <Text className='order-store-price-p'><Text style='font-size:24rpx;'>￥</Text>{item.price}</Text>
                      <Text className='order-store-price-n'>x{item.qty}{pro.unit}</Text>
                    </View>
                  </View>
                </View>
              )
            })}


          </View>
          {/* 配送方式 */}
          {data.deliveryWay == 'platformsend' && (
            <View className='totalprice'>
              <View className='dist nobor'>
                <Text className='dist-title'>配送方式</Text>
                <Text>丰盈配送</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>配送时间</Text>
                <Text>{data.expectDeliveryTime}</Text>
              </View>
              {/* <View className='dist'>
                <Text className='dist-title'>档口优惠</Text>
                <Text></Text>
              </View> */}
              <View className='dist'>
                <Text className='dist-title'>订单备注</Text>
                <Text>{data.remark}</Text>
              </View>
            </View>
          )}
          {data.deliveryWay == 'distribution' && (
            <View className='totalprice'>
              <View className='dist nobor'>
                <Text className='dist-title'>配送方式</Text>
                <Text>店铺配送</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>配送时间</Text>
                <Text>{data.expectDeliveryTime}</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>联系电话</Text>
                <Text>{data.storeCustomerPhone}</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>订单备注</Text>
                <Text>{data.remark}</Text>
              </View>
            </View>
          )}
          {data.deliveryWay == 'takeout' && (
            <View className='totalprice'>
              <View className='dist nobor'>
                <Text className='dist-title'>配送方式</Text>
                <Text>自提</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>自提地址</Text>
                <Text>{data.selfTakeAddress}</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>自提时间</Text>
                <Text>{data.expectDeliveryTime}</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>联系电话</Text>
                <Text>{data.storeCustomerPhone}</Text>
              </View>
              <View className='dist'>
                <Text className='dist-title'>订单备注</Text>
                <Text>{data.remark}</Text>
              </View>
            </View>
          )}

          <View className='totalprice'>
            <View className='dist nobor'>
              <Text className='dist-title'>商品金额</Text>
              <Text>￥{data.productAmount}</Text>
            </View>
            {data.transportAmount > 0 && (
              <View className='dist'>
                <Text>总物流服务费</Text>
                <Text>+￥{data.transportAmount}</Text>
              </View>
            )}

            {data.transportDiscountAmount > 0 && (
              <View className='dist'>
                <Text>运费补贴</Text>
                <Text>-￥{data.transportDiscountAmount}</Text>
              </View>
            )}

            {data.transportCouponAmount > 0 && (
              <View className='dist'>
                <Text>运费券</Text>
                <Text>-￥{data.transportCouponAmount}</Text>
              </View>)
            }
            {data.storeCouponPayAmount > 0 && (
              <View className='dist'>
                <Text>档口优惠</Text>
                <Text>-￥{data.storeCouponPayAmount}</Text>
              </View>
            )}
            {data.couponPayAmount > 0 && (
              <View className='dist'>
                <Text>平台优惠</Text>
                <Text>-￥{data.couponPayAmount}</Text>
              </View>
            )}

          </View>
          <View className='totalprice'>
            <View className='dist totals nobor'>
              <Text>合计</Text>
              <Text>￥{data.needPayTotalAmount}</Text>
            </View>
            {/* {data.adjustAmount && (
              <View className='dist totals nobor'>
                <Text>调整金额</Text>
                <Text>￥{data.adjustAmount}</Text>
              </View>
            )} */}

          </View>
        </View>

        <View className='confirm-order'>
          {istype == '0' && (
            <View className='btn'>
              <View onClick={this.getcheck}>改价</View>
              <View className='close' onClick={() => { this.ordercancel(data.id) }}>关闭</View>
              <View onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + data.id }) }}>卖家备注</View>
            </View>
          )}
          {istype == '1' && (
            <View className='btn'>
              <View onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + data.id }) }}>卖家备注</View>
              <View onClick={this.getDeliver}>立即发货</View>
            </View>
          )}
          {(istype == '2' || istype == '10') && (
            <View className='btn'>
              <View onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + data.id }) }} className={data.deliveryWay == 'platformsend' ? '' : 'wid'}>卖家备注</View>
              {data.deliveryWay == 'platformsend' && (
                <View onClick={this.distInfo}>配送信息</View>
              )}
            </View>
          )}
          {istype == '-1' && (
            <View className='btns' onClick={() => { Taro.navigateTo({ url: '../remark/remark?id=' + data.id }) }}>
              卖家备注
            </View>
          )}

          {replacetype == '0' && (
            <View className='btn'>
              <View className='close' onClick={() => { this.ordercancel(data.id) }}>关闭</View>
              <View onClick={() => { this.onconfirm(data.id) }}>确认补单</View>
            </View>
          )}

        </View>

      </View >
    );
  }
}
