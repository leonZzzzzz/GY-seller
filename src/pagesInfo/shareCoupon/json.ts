import Taro from "@tarojs/taro";
import { IMG_HOST } from '@/config';

const drawImageData = function (user: any, bgUrl: string, QRCodeUrl: string, coupons: any, couponUrls: Array<string>) {
  try {
    const config: any = {
      width: '750rpx',
      height: '1200rpx',
      background: '#ff5433',
      views: [
        
        // 背景图
        {
          type: 'image',
          url: `${IMG_HOST}${bgUrl}`,
          css: {
            bottom: '0rpx',
            left: '0rpx',
            width: '750rpx',
            height: '1200rpx'
          }
        },
        // 头像
        {
          type: 'image',
          url: /http/.test(user.storeLogo) ? user.storeLogo : `${IMG_HOST}${user.storeLogo}`,
          css: {
            top: '43rpx',
            left: '310rpx',
            width: '130rpx',
            height: '130rpx',
            borderRadius: '65rpx'
          }
        },
        // 用户名
        {
          type: 'text',
          text: `${user.personInCharge || user.storeName}`,
          css: [
            {
              top: `195rpx`,
              left: '0rpx',
              width: '750rpx',
              fontSize: '32rpx',
              fontWeight: 'bold',
              color: '#000',
              textAlign: 'center'
            }
          ]
        },
        // 分享语
        {
          type: 'text',
          text: user.title,
          css: [
            {
              top: `265rpx`,
              left: '120rpx',
              width: '530rpx',
              fontSize: '30rpx',
              color: '#F78926',
              textAlign: 'center',
              lineHeight: '45rpx',
              maxLines: 2
            }
          ]
        },

        // 优惠券
        ...createCoupon(coupons, couponUrls),

        // 小程序码
        {
          type: 'image',
          url: `${IMG_HOST}${QRCodeUrl}`,
          css: {
            top: '750rpx',
            left: '80rpx',
            width: '220rpx',
            height: '220rpx'
          }
        },
      ]
    };
    return config;


  } catch (error) {
    console.log(error)
    Taro.hideLoading()
  }
}

function createCoupon(coupons, couponUrls) {
  let itemHeight = 160 + 20 // 两张优惠券的 top 基数 
  let sigleTop = 75 //单张优惠券时 为达到居中在原来top上增加的TOP 

  if (!coupons || coupons.length === 0) return []
  if (coupons.length === 1) {
    let list = [
      // 优惠券1
      {
        type: 'image',
        url: `${IMG_HOST}${couponUrls[0]}`,
        css: {
          top: 330+sigleTop+'rpx',
          left: '100rpx',
          width: '550rpx',
          height: '160rpx',
          borderRadius: '10rpx'
        }
      },
      // 优惠券金额
      {
        type: 'text',
        text: '￥'+(coupons[0].couponAmount).toFixed(2),
        css: [
          {
            top: 370+sigleTop+'rpx',
            left: '100rpx',
            width: '200rpx',
            fontSize: '36rpx',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '45rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券规则
      {
        type: 'text',
        text: coupons[0].ruleName,
        css: [
          {
            top: 415+sigleTop+'rpx',
            left: '100rpx',
            width: '200rpx',
            fontSize: '22rpx',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '45rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券标题
      {
        type: 'text',
        text: coupons[0].ruleName,
        css: [
          {
            top: 345+sigleTop+'rpx',
            left: '320rpx',
            width: '346rpx',
            fontSize: '24rpx',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 1
          }
        ]
      },
      // 优惠券有效期
      {
        type: 'text',
        text: coupons[0].validstartTime+'至'+coupons[0].validendTime,
        css: [
          {
            // top: 380+sigleTop+'rpx',
            top: 390+sigleTop+'rpx',
            left: '320rpx',
            width: '346rpx',
            fontSize: '22rpx',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券领取数量
      {
        type: 'text',
        text: function () {
          let sum = coupons[0].receivedQuantity +'/'+ (coupons[0].totalQuantity - coupons[0].receivedQuantity)
          return '已领取/剩余: '+sum
        }(),
        css: [
          {
            // top: 420+sigleTop+'rpx',
            top: 440+sigleTop+'rpx',
            left: '320rpx',
            width: '346rpx',
            fontSize: '20rpx',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券已使用
      // {
      //   type: 'text',
      //   text: '已使用: '+coupons[0].usedQuantity || 0,
      //   css: [
      //     {
      //       top: 450+sigleTop+'rpx',
      //       left: '320rpx',
      //       width: '346rpx',
      //       fontSize: '20rpx',
      //       color: '#fff',
      //       textAlign: 'left',
      //       lineHeight: '40rpx',
      //     }
      //   ]
      // },
    ]
    return list
  } else {
    let list = [
      // 优惠券1
      {
        type: 'image',
        url: `${IMG_HOST}${couponUrls[0]}`,
        css: {
          top: '330rpx',
          left: '100rpx',
          width: '550rpx',
          height: '160rpx',
          borderRadius: '10rpx'
        }
      },
      // 优惠券金额
      {
        type: 'text',
        text: '￥'+(coupons[0].couponAmount).toFixed(2),
        css: [
          {
            top: `370rpx`,
            left: '100rpx',
            width: '200rpx',
            fontSize: '36rpx',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '45rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券规则
      {
        type: 'text',
        text: coupons[0].ruleName,
        css: [
          {
            top: `415rpx`,
            left: '100rpx',
            width: '200rpx',
            fontSize: '22rpx',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '45rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券标题
      {
        type: 'text',
        text: coupons[0].ruleName,
        css: [
          {
            top: `345rpx`,
            left: '320rpx',
            width: '346rpx',
            fontSize: '24rpx',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 1
          }
        ]
      },
      // 优惠券有效期
      {
        type: 'text',
        text: coupons[0].validstartTime+'至'+coupons[0].validendTime,
        css: [
          {
            // top: `380rpx`,
            top: `390rpx`,
            left: '320rpx',
            width: '346rpx',
            fontSize: '22rpx',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券领取数量
      {
        type: 'text',
        text: function () {
          let sum = coupons[0].receivedQuantity +'/'+ (coupons[0].totalQuantity - coupons[0].receivedQuantity)
          return '已领取/剩余: '+sum
        }(),
        css: [
          {
            // top: `420rpx`,
            top: `440rpx`,
            left: '320rpx',
            width: '346rpx',
            fontSize: '20rpx',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券已使用
      // {
      //   type: 'text',
      //   text: '已使用: '+coupons[0].usedQuantity || 0,
      //   css: [
      //     {
      //       top: `450rpx`,
      //       left: '320rpx',
      //       width: '346rpx',
      //       fontSize: '20rpx',
      //       color: '#fff',
      //       textAlign: 'left',
      //       lineHeight: '40rpx',
      //     }
      //   ]
      // },
      
      // 优惠券2
      {
        type: 'image',
        url: `${IMG_HOST}${couponUrls[1]}`,
        css: {
          top: 330+itemHeight+'rpx',
          left: '100rpx',
          width: '550rpx',
          height: '160rpx',
          borderRadius: '10rpx'
        }
      },
      // 优惠券金额
      {
        type: 'text',
        text: '￥'+(coupons[1].couponAmount).toFixed(2),
        css: [
          {
            top: 370+itemHeight+'rpx',
            left: '100rpx',
            width: '200rpx',
            fontSize: '36rpx',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '45rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券规则
      {
        type: 'text',
        text: coupons[1].ruleName,
        css: [
          {
            top: 415+itemHeight+'rpx',
            left: '100rpx',
            width: '200rpx',
            fontSize: '22rpx',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '45rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券标题
      {
        type: 'text',
        text: coupons[1].ruleName,
        css: [
          {
            top: 345+itemHeight+'rpx',
            left: '320rpx',
            width: '346rpx',
            fontSize: '24rpx',
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 1
          }
        ]
      },
      // 优惠券有效期
      {
        type: 'text',
        text: coupons[1].validstartTime+'至'+coupons[1].validendTime,
        css: [
          {
            // top: 380+itemHeight+'rpx',
            top: 390+itemHeight+'rpx',
            left: '320rpx',
            width: '346rpx',
            fontSize: '22rpx',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券领取数量
      {
        type: 'text',
        text: function () {
          let sum = coupons[1].receivedQuantity +'/'+ (coupons[1].totalQuantity - coupons[1].receivedQuantity)
          return '已领取/剩余: '+sum
        }(),
        css: [
          {
            // top: 420+itemHeight+'rpx',
            top: 440+itemHeight+'rpx',
            left: '320rpx',
            width: '346rpx',
            fontSize: '20rpx',
            color: '#fff',
            textAlign: 'left',
            lineHeight: '40rpx',
            maxLines: 2
          }
        ]
      },
      // 优惠券已使用
      // {
      //   type: 'text',
      //   text: '已使用: '+coupons[1].usedQuantity || 0,
      //   css: [
      //     {
      //       top: 450+itemHeight+'rpx',
      //       left: '320rpx',
      //       width: '346rpx',
      //       fontSize: '20rpx',
      //       color: '#fff',
      //       textAlign: 'left',
      //       lineHeight: '40rpx',
      //     }
      //   ]
      // },
    ]
    return list
  }
}

console.log(typeof drawImageData)
export default drawImageData;

