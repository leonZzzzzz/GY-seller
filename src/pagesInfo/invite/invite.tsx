import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
} from "@tarojs/components";
import "./invite.scss";
import { WeChatcode } from "@/api/userInfo"
import util from '@/utils/utils';
import DrawImageData from './json';

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: "邀请好友购买",
    usingComponents: {
      painter: '../../components/painter/painter'
    }
  };

  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    type: 'store',
    stytemInfo: {
      windowWidth: 375
    },
    posterLoading: false,
    posterUrl: '',
    template: '',
    posterHeight: 0
  };

  componentWillMount() {
    let stytemInfo = Taro.getSystemInfoSync()
    let btnHeight = 90 * (stytemInfo.windowWidth / 750)
    this.setState({ stytemInfo: stytemInfo, posterHeight: stytemInfo.windowHeight - btnHeight })
  }
  componentDidMount() {
    Taro.showLoading()
    WeChatcode().then(res => {
      this.generatePoster(res.data.data)
    })
      .catch(() => {
        setTimeout(() => { Taro.hideLoading() }, 1500)
      })
  }

  componentDidShow() {
    console.log(DrawImageData)
  }

  async generatePoster(data) {
    this.setState({ posterVisible: true })
    console.log('memberInfo', data);
    if (!data.storeLogo && (!data.storeName || !data.personInCharge)) {
      const { userInfo } = (await Taro.getUserInfo()) as any;
      console.log('getUserInfo', userInfo);
      data.storeLogo = userInfo.avatarUrl;
      data.personInCharge = userInfo.nickName;
    }
    const bgUrl: string = '/public/poster/default.png';
    try {
      data.title = '我在丰盈e鲜注册了门店，快来逛逛吧！';
      // let template = DrawImageData(data, bgUrl, data.smallProgramUrl,)
      let template = DrawImageData(data, bgUrl, data.posterPath)
      this.setState({ template: template })
    } catch (err) {
      console.log(err)
      Taro.hideLoading();
      Taro.showToast({ title: '生成失败，请退出重试', icon: 'none' })
    }
  };

  handleImgOK(e: any) {
    console.log(e)
    Taro.hideLoading()
    console.warn('handleImgOK', e);
    this.setState({ posterLoading: false, posterUrl: e.detail.path });
  };

  // 保存海报
  saveImage() {
    // 查看是否授权
    Taro.getSetting({
      complete() {
      }
    }).then(res => {
      if (res.authSetting['scope.writePhotosAlbum']) {
        Taro.saveImageToPhotosAlbum({
          filePath: this.state.imageTempPath
        }).then(res => {
          console.log(res)
        })
      } else {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
        }).then(() => {
          Taro.saveImageToPhotosAlbum({
            filePath: this.state.imageTempPath
          }).then(res => {
            console.log(res)
          })
        })
      }
    }).catch((e) => {
      console.log(e)
    })
  }
  onshare() {
    return {
      title: '邀请您入驻丰盈e鲜店铺',
      path: '/pages/authorize/index?jump=1',
      success: function (res) {

      }
    }
  }

  async savePoster() {
    Taro.showLoading({
      title: '生成图片中',
      mask: true
    });
    this.setState({ posterLoading: true });
    try {
      const res = await Taro.saveImageToPhotosAlbum({
        filePath: this.state.posterUrl
      });
      console.log(res);
      Taro.hideLoading();
      Taro.showToast({
        title: '已保存到本地'
      });
      this.setState({ posterLoading: false })
    } catch (err) {
      this.setState({ posterLoading: false })
      console.log(err);
      Taro.hideLoading();
      if (/saveImageToPhotosAlbum/.test(err.errMsg)) util.checkAuthorizeWritePhotosAlbum();
      else {
        Taro.showToast({
          title: '取消保存，可重试',
          icon: 'none'
        });
      }
    }
  };

  render() {
    return (
      <Block>
        <View className='poster'>
          <View className='poster-wrap' style={`height: ${this.state.posterHeight}px;`}>{this.state.posterUrl && <Image src={this.state.posterUrl} />}</View>
          <painter palette={this.state.template} onImgOK={this.handleImgOK} style='position:fixed;top:-9999rpx' />
        </View>
        <View className='save-image' onClick={() => { this.savePoster() }}>{this.state.posterLoading ? '生成海报中...' : '保存到手机'}</View>
      </Block>
    );
  }
}
