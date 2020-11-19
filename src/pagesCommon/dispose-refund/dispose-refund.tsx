import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
} from "@tarojs/components";
import "./dispose-refund.scss";
import { refundDetail, consentApply, consentRefund } from "@/api/order"
import utils from '@/utils/utils'

export default class Index extends Component {
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    ismodel: false,
    datalist: {},
    refundAmount: '', type: '',
    duringMs: '1',
    Loadingtime: '',
    clock: '',
    proofImgUrl: [],
    isagree: false,
    orderId: ''
  };
  componentDidShow() {
    Taro.setStorageSync('isalter', true)
    const { id, type } = this.$router.params
    this.setState({ type, orderId: id })
    this.getRefundDetail(id)
  }
  componentDidHide() {
    clearInterval(Number(this.state.Loadingtime))
  }
  componentWillUnmount() {
    clearInterval(Number(this.state.Loadingtime))
  }

  getRefundDetail(id) {
    const { type } = this.state;
    refundDetail(id).then(res => {
      if (res.data.code == 20000) {
        const datalist = res.data.data
        datalist.orderAmount = parseFloat(datalist.orderAmount / 100).toFixed(2)
        datalist.remainRefundAmount = parseFloat(datalist.remainRefundAmount / 100).toFixed(2)
        datalist.defaultRefundAmount = parseFloat(datalist.defaultRefundAmount / 100).toFixed(2)
        datalist.transportCouponAmount = parseFloat(datalist.transportCouponAmount / 100).toFixed(2)
        datalist.refundAmountTotal = parseFloat(datalist.refundAmountTotal / 100).toFixed(2)
        datalist.orderItemRefundAmount = parseFloat(datalist.orderItemRefundAmount / 100).toFixed(2)
        datalist.transportDiscountAmount = parseFloat(datalist.transportDiscountAmount / 100).toFixed(2)

        datalist.couponstotal = datalist.couponPayAmount + datalist.storeCouponPayAmount
        datalist.couponstotal = parseFloat(datalist.couponstotal / 100).toFixed(2)
        let proofImgUrl = []
        if (datalist.proofImgUrl) {
          proofImgUrl = datalist.proofImgUrl.split(',')
        }
        if (datalist.sellerImageRemarks) {
          datalist.sellerImageRemarks = datalist.sellerImageRemarks.split('_')
        }
        if (this.state.type == 1) {
          this.count_down(datalist.createTime)
        } else {
          clearInterval(Number(this.state.Loadingtime))
          console.log('clearInterval')
          console.log(this.state.type)
        }
        this.setState({ datalist, refundAmount: datalist.defaultRefundAmount, proofImgUrl })
      }
    })
  }

  // 同意申请
  async getconsent() {
    const res = await consentApply(this.state.datalist.id)
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalter', false)
      Taro.showToast({ title: '已同意申请', icon: 'none' })
      this.setState({ isagree: true, type: 2 })
      this.getRefundDetail(this.state.orderId)
    }
  }
  // 获取卖家输入的退款金额
  getMoney(e) {
    this.setState({ refundAmount: e.detail.value })
  }
  // 同意退款
  agreenref() {
    this.setState({ ismodel: true })
  }
  async confirmRefund() {
    Taro.showModal({
      content: '您确定要退还' + this.state.refundAmount + '元?',
      success: (resp) => {
        if (resp.confirm) {
          this.referr()
        }
      }
    })

  }
  referr = async () => {
    Taro.showLoading()
    const params = { afterSaleOrderId: this.state.datalist.id, refundAmount: utils.mul(this.state.refundAmount, 100) }
    const res = await consentRefund(params)
    Taro.hideLoading()
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalter', false)
      Taro.showToast({
        title: '退款成功',
        icon: 'none'
      })
      setTimeout(() => {
        this.setState({ ismodel: false })
        this.componentDidShow()
      }, 1000);
    }
  }
  cancel() {
    this.setState({ ismodel: false })
  }

  /* 毫秒级倒计时 */
  count_down(startTime) {
    var that = this;
    console.log('count_down')
    const Loadingtime = setInterval(() => {
      if (this.state.duringMs > 0) {
        var time = new Date(startTime.replace(/-/g, '/'));
        // console.log(time)
        var b = 10080; //分钟数
        time.setMinutes(time.getMinutes() + b, time.getSeconds(), 1000);
        // var d = new Date(time)
        // var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        // console.log(datetime)
        var duringMs = ((time.getTime()) - (new Date()).getTime()) / 1000;
        var clock1 = that.dayTime(duringMs);
        this.setState({ duringMs })
        // 渲染倒计时时钟
        if (duringMs > 0) {
          that.setState({
            clock: clock1
          });
        } else {
          that.setState({
            clock: "退款时间已截止"
          });
          return;
        }
      } else {
        clearInterval(Number(this.state.Loadingtime))
      }
    }, 1000);
    this.setState({ Loadingtime })
  }


  /* 格式化倒计时 */

  dayTime(bb) {
    var day = parseInt(bb / 86400);
    var time = parseInt((bb - (day * 86400)) / 3600);
    var min = parseInt((bb - (time * 3600 + day * 86400)) / 60)
    var sinTime = time * 3600 + min * 60 + day * 86400
    var sinTimeb;
    var sin1 = parseInt((bb - sinTime))
    var thisTime = this.addEge(day) + "天" + this.addEge(time) + ":" + this.addEge(min) + ":" + this.addEge(sin1);
    bb <= 0 ? thisTime = "0天00:00:00" : thisTime
    return thisTime
  }

  /* 分秒位数补0 */
  addEge(a) {
    return a < 10 ? a = "0" + a : a = a
  }

  // 点击图片预览
  previewImg(e) {
    console.log(e)
    var imagelist = [];
    var index = e.currentTarget.dataset.index;
    var imgArr = this.state.datalist.sellerImageRemarks;
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
    navigationBarTitleText: "退款处理"
  };
  render() {
    const { datalist, proofImgUrl, imageurl, ismodel, type, isagree, refundAmount, duringMs, clock } = this.state
    return (
      <Block>
        {/* 弹出框 */}
        {ismodel && (
          <View className='refund-model'>
            <View className='layer'></View>
            <View className='model-content'>
              <View className='cancel' onClick={this.cancel}><Image src={Taro.getStorageSync('imgHostItem') + 'delete.png'}></Image></View>
              <View className='model-title'>同意给买家退款</View>
              <View className='model-input'><Input placeholder='请输入金额' onInput={this.getMoney}></Input>元</View>
              <View className='model-btn' onClick={this.confirmRefund}>确定</View>
            </View>
          </View>
        )}

        {/* 弹出框 end*/}

        {datalist.sellerRemarks && (
          <View className='set'>
            {/* <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_13.png'}></Image> */}
            <View>备注：{datalist.sellerRemarks}</View>
            <View style='display:flex'>
              {datalist.sellerImageRemarks && (
                <Block>
                  {datalist.sellerImageRemarks.map((img, index) => {
                    return (
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
        {datalist.statusValue != 0 && (
          <View className='torf'>
            <View><Text className='orange'>若你同意：</Text>申请将达成并发送退货地址给买家</View>
            <View><Text className='orange'>若你拒绝：</Text>买家可重新发起退款申请</View>
            {type == 1 && (
              <Block>
                {duringMs > 0 ? (
                  <Block>
                    {isagree ? (
                      <View>已同意买家申请</View>
                    ) : (
                        <View>若你在<Text className='orange'>{clock}</Text>内未处理，则视为默认同意退款申请</View>
                      )}
                  </Block>
                ) : (
                    <View>已同意买家申请</View>
                  )}
              </Block>
            )}
            {type == 2 && (
              <View>已同意买家申请</View>
            )}
            {type == -1 && (
              <View>已拒绝买家申请</View>
            )}

          </View>
        )}

        <View className='content'>
          <View className='content-order title'>
            <Text>订单编号：{datalist.orderNumber}</Text>
            <Text>{datalist.status}</Text>
          </View>

          <View className='content-order list'>
            <Text>买家电话</Text>
            <Text>{datalist.mobile}</Text>
          </View>
          <View className='content-order list'>
            <Text>可退款金额</Text>
            <Text className='orange'>￥{datalist.remainRefundAmount}（退款时可更改）</Text>
          </View>
          <View className='content-order list'>
            <Text>订单金额</Text>
            <Text>￥{datalist.orderAmount}</Text>
          </View>
          <View className='content-order list'>
            <Text>退款商品金额</Text>
            <Text>￥{datalist.orderItemRefundAmount}</Text>
          </View>
          {datalist.couponstotal != '0.00' && (
            <View className='content-order list'>
              <Text>优惠券金额</Text>
              <Text>-￥{datalist.couponstotal}</Text>
            </View>
          )}
          {datalist.transportCouponAmount != '0.00' && (
            <View className='content-order list'>
              <Text>运费抵扣</Text>
              <Text>-￥{datalist.transportCouponAmount}</Text>
            </View>
          )}
          {datalist.transportDiscountAmount != '0.00' && (
            <View className='content-order list'>
              <Text>运费补贴</Text>
              <Text>-￥{datalist.transportDiscountAmount}</Text>
            </View>
          )}
          <View className='content-order list'>
            <Text>已退金额</Text>
            <Text style='color:#1BBC3D'>￥{datalist.refundAmountTotal}</Text>
          </View>

          <View className='content-order list'>
            <Text>申请时间</Text>
            <Text>{datalist.createTime}</Text>
          </View>
          <View className='content-order list'>
            <Text>退款原因</Text>
            <Text>{datalist.reasonType}</Text>
          </View>
          <View className='content-order list'>
            <Text>备注信息</Text>
            <Text>{datalist.reason}</Text>
          </View>
        </View>
        <View className='pic-content'>
          <Text>图片举证</Text>
          <View className='pic'>
            {proofImgUrl.map(item => {
              return (
                <Image src={imageurl + item} onClick={() => {
                  Taro.previewImage({
                    current: imageurl + item,
                    urls: proofImgUrl.map(img => imageurl + img)
                  })
                }}></Image>
              )
            })}
          </View>
        </View>
        {type == 1 && (
          <Block>
            {datalist.statusValue == 1 && (
              <View className='confirm-order'>
                <View className='btn'>
                  <View onClick={() => { Taro.navigateTo({ url: '../turn-refund/turn-refund?id=' + datalist.id }) }}>拒绝买家申请</View>
                  <View onClick={this.getconsent}>同意买家申请</View>
                </View>
              </View>
            )}
          </Block>

        )}
        {(type == 2 && datalist.statusValue != 0) && (
          <View className='confirm-order'>
            <View className='btn'>
              <View className='agreen' onClick={this.agreenref}>同意退款</View>
            </View>
          </View>
        )}

      </Block>
    );
  }
}
