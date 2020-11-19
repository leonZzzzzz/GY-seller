import Taro from "@tarojs/taro";
import { IMG_HOST } from '@/config';

const drawImageData = function (user: any, bgUrl: string, QRCodeUrl: string) {
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
          text: `${user.personInCharge}`,
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
              left: '80rpx',
              width: '590rpx',
              fontSize: '30rpx',
              color: '#F78926',
              textAlign: 'center',
              lineHeight: '45rpx',
              maxLines: 2
            }
          ]
        },

        // 店铺名称
        {
          type: 'text',
          text: user.storeName,
          css: [
            {
              top: `340rpx`,
              left: '120rpx',
              width: '530rpx',
              fontSize: '50rpx',
              fontWeight: 'bold',
              color: '#1bbc3d',
              textAlign: 'center',
              lineHeight: '45rpx',
              maxLines: 2
            }
          ]
        },
        {
          type: 'text',
          text: '● 品质优良，价格美丽，不容错过',
          css: [
            {
              top: `440rpx`,
              left: '100rpx',
              width: '550rpx',
              fontSize: '28rpx',
              // color: '#1bbc3d',
              color: '#3a3a3a',
              textAlign: 'left',
              lineHeight: '45rpx',
              maxLines: 2
            }
          ]
        },
        {
          type: 'text',
          text: '● 购买方便，服务到位，省时省力省心购！',
          css: [
            {
              top: `490rpx`,
              left: '100rpx',
              width: '550rpx',
              fontSize: '28rpx',
              color: '#3a3a3a',
              textAlign: 'left',
              lineHeight: '45rpx',
              maxLines: 2
            }
          ]
        },
        {
          type: 'text',
          text: '● ' + user.storeInfo,
          css: [
            {
              top: `550rpx`,
              left: '100rpx',
              width: '550rpx',
              fontSize: '28rpx',
              color: '#3a3a3a',
              textAlign: 'left',
              lineHeight: '45rpx',
              maxLines: 2
            }
          ]
        },

        // 小程序码
        QRCodeUrl && {
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

console.log(typeof drawImageData)
export default drawImageData;

