import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image, Form, Button } from "@tarojs/components";
import "./index.scss";
import { myuseinfo } from "@/api/userInfo"
import { authorize } from "@/api/login"


export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: '丰盈e鲜店铺'
  };
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    serveGroup: [
      {
        id: 8,
        title: "店铺信息",
        url: "../../pagesInfo/store-info/store-info",
        icon: "../../images/myicon/gy-icon_20.png"
      },
      {
        id: 8,
        title: "配送方式",
        url: "../../pagesInfo/distway/distway",
        icon: "../../images/myicon/gy-icon_21.png"
      },
      // {
      //   id: 8,
      //   title: "退货地址",
      //   url: "../../pagesInfo/salesite/salesite",
      //   icon: "../../images/myicon/guyu-me-7.png"
      // },
      {
        id: 8,
        title: "关于我们",
        url: "../../pagesInfo/aboutUs/aboutUs",
        icon: "../../images/myicon/gy-icon_22.png"
      },
      {
        id: 8,
        title: "设置",
        url: "../../pagesInfo/setting/setting",
        icon: "../../images/myicon/gy-icon_23.png"
      },
    ],
    storedetail: '',
    storeId: ''
  }
  componentDidShow() {
    this.login()
    const storeId = Taro.getStorageSync('storeId')
    this.setState({ storeId })

  }
  // 静默授权
  async login() {
    const rescode = await Taro.login();
    console.log('999999', rescode.code)
    const synccode = Taro.getStorageSync('code')
    const code = synccode ? synccode : rescode.code
    //重新授权
    const res = await authorize(code);
    const { memberId, sessionId, isAutoLogin, storeId } = res.data.data;
    if (!isAutoLogin) {
      Taro.showModal({
        title: '温馨提示',
        content: '您还没有登录，请先登录后才能管理您的店铺',
        confirmText: '去登录',
        confirmColor: '#1bbc3d'
      }).then(res => {
        if (res.confirm) {
          Taro.redirectTo({ url: '/pages/authorize/index' })
        }
      })
      // Taro.redirectTo({ url: '/pages/authorize/index' })
    } else {
      this.getuerInfo()
    }
    Taro.setStorageSync('memberId', memberId);
    Taro.setStorageSync('sessionId', sessionId);
    Taro.setStorageSync('storeId', storeId);
  }
  getuerInfo = async () => {
    const res = await myuseinfo()
    console.log(res)
    if (res.data.code == 20000) {
      Taro.setStorageSync('phone', res.data.data.mobile)
      this.setState({ storedetail: res.data.data })
    } else {
      this.setState({ storedetail: '' })
    }
  }
  render() {
    const { serveGroup, storedetail, imageurl, storeId } = this.state
    console.log(storedetail)
    return (
      <View className="personal">
        <View className="circle"></View>
        <View className="personal-content">
          <View className="personal-content__user">
            {storeId ? (
              <View className="personal-content__user-info">
                <Image
                  src={imageurl + storedetail.logoIconUrl}
                  className="personal-content__user-img"
                ></Image>
                <View className="personal-content__user-name">
                  <Text>{storedetail.personInCharge}</Text>
                  <Text>{storedetail.mobile}</Text>
                </View>
              </View>
            ) : (
                <View className="personal-content__user-info" onClick={() => { Taro.navigateTo({ url: '../../pagesCommon/auth-msg/auth-msg' }) }}>
                  <View className="personal-content__user-img"></View>
                  <View className="personal-content__user-name">立刻登录</View>
                </View>
              )}

            {storedetail.topTitle != '' && (
              <View className='cash' onClick={() => { Taro.navigateTo({ url: '../../pagesCommon/deposit/deposit' }) }}>
                <Text>缴纳年费和保证金后可使用全部功能</Text>
                <Text>去支付 ></Text>
              </View>
            )}

          </View>
        </View>

        {/* <QcMenuCard> */}
        <View className="my-detail-msg">
          <View className="my-detail-gro">
            {serveGroup.map((item: any) => {
              return (
                <View
                  className="my-gro-img"
                  key={item.id}
                  onClick={() => {
                    Taro.navigateTo({
                      url: item.url
                    });
                  }}>
                  <View className='row'>
                    <Image src={item.icon}></Image>
                    {/* <View className={`qcfont ${item.icon}`} /> */}
                    <View>{item.title}</View>
                  </View>
                  <Text className="image-one qc-menu-card__icon qcfont qc-icon-chevron-right" />
                </View>
              );
            })}
          </View>
        </View>

        <View className="my-detail-gro">
          <View className="my-gro-img borno" onClick={() => { Taro.navigateTo({ url: '../../pagesInfo/referrer/referrer' }) }}>
            <View className='row'>
              <Image src='../../images/myicon/gy-icon_24.png'></Image>
              {/* <View className={`qcfont ${item.icon}`} /> */}
              <View>推荐新档口获得平台奖励</View>
            </View>
            <Text className="image-one qc-menu-card__icon qcfont qc-icon-chevron-right" />
          </View>
        </View>
        <View className="my-detail-gro">
          <View className="my-gro-img borno" onClick={() => { Taro.navigateTo({ url: '../../pagesInfo/invite/invite' }) }}>
            <View className='row'>
              {/* <Image src={wx.getStorageSync('imgHostItem')+'invite.png'}></Image> */}
              <Image src={Taro.getStorageSync('imgHostItem') + 'invite.png'}></Image>
              {/* <View className={`qcfont ${item.icon}`} /> */}
              <View>邀请好友购买</View>
            </View>
            <Text className="image-one qc-menu-card__icon qcfont qc-icon-chevron-right" />
          </View>
        </View>
        <View className="my-detail-gro">
          <View className="my-gro-img borno" onClick={() => { Taro.navigateTo({ url: '../../pagesInfo/shareCoupon/index' }) }}>
            <View className='row'>
              <Image src={Taro.getStorageSync('imgHostItem') + 'invite.png'}></Image>
              <View>邀请领券</View>
            </View>
            <Text className="image-one qc-menu-card__icon qcfont qc-icon-chevron-right" />
          </View>
        </View>
      </View>
    );
  }

}



