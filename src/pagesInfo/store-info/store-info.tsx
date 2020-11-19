import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Switch,
  Picker,
  OfficialAccount 
} from "@tarojs/components";
import { Dialog } from '@/components/common'

import DatetimePicker from "@/components/datetime-picker";
import { storeDetail, upDataDetail, apiWXfollowCodeImage } from "@/api/userInfo";
import { uodataPic, listbylist } from "@/api/login"
import "./store-info.scss";

export default class Index extends Component {

  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    photos: [],
    pics: [],
    isShow: true,
    isShow1: true,
    ischeck: true,
    startTime: '',
    srartTxt: true,
    endTime: '',
    endTxt: true,
    storeInfo: '',
    voucherImage: [],
    name: '',
    businessTime: '',
    address: '',
    personInCharge: '',
    mobile: '',
    info: '',
    isDate: false,
    isDate1: false,
    pics1: [], 
    voucherImage1: [],
    isOrderInvoice: false,
    isOpenMessageNotice: false,
    buslist: [],
    followCodeImage: '',
    imageTempPath: '',
    isShowFollowCodeImage: false,
    stytemInfo: {
      windowWidth: 375,
      windowHeight: 607
    }
  };
  config: Config = {
    navigationBarTitleText: "店铺信息"
  };
  componentDidMount() {
    this.getList()
    var date = new Date()
    let dateHours = date.getHours();               //获取小时
    let dateMinutes = date.getMinutes();           //获取分钟
    var now = dateHours + ':' + dateMinutes
    this.setState({ now })
    // 获取公众号二维码
    this.getWXfollowCodeImage()
    // this.setState({ stytemInfo: Taro.getSystemInfoSync() })
  }
  
  getList = async () => {
    const res = await storeDetail()
    if (res.data.code == 20000) {
      const storeInfo = res.data.data
      const { voucherImage, voucherImage1 } = this.state
      voucherImage.push(storeInfo.logoIconUrl)
      voucherImage1.push(storeInfo.wxQrcode)
      const time = storeInfo.businessTime.split('-')
      console.log(storeInfo)
      this.getBustype(storeInfo.categoryName)
      this.setState({
        storeInfo,
        name: storeInfo.name,
        businessTime: storeInfo.businessTime,
        address: storeInfo.address,
        personInCharge: storeInfo.personInCharge,
        mobile: storeInfo.mobile,
        info: storeInfo.info,
        voucherImage,
        voucherImage1,
        startTime: time[0],
        endTime: time[1],
        srartTxt: false,
        endTxt: false,
        isOrderInvoice: storeInfo.isOrderInvoice,
        isOpenMessageNotice: storeInfo.isOpenMessageNotice,
      })
    }
  }
  // 获取公众号二维码
  async getWXfollowCodeImage() {
    let res = await apiWXfollowCodeImage()
    this.setState({ followCodeImage: res.data.data.value })
    this.drawFollowCodeImage(res.data.data.value )
  }

  onShowfollowCodeImage(state) {
    if (state && !this.state.followCodeImage) {
      Taro.showToast({title: '后台未配置公众号二维码', icon: 'none'})
      return
    }
    this.setState({isShowFollowCodeImage: state})
  }

  // 图片上传
  chooseImage() {
    var _this = this
    var { pics, voucherImage } = this.state
    const promiseArray = []
    Taro.chooseImage({
      count: 3 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
        if (tempFilesSize <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
          const imgSrc = res.tempFilePaths;
          pics = pics.concat(imgSrc);
          var promise = uodataPic(imgSrc[0], { imageType: "afterSale" });
          promiseArray.push(promise)
        } else {
          Taro.showToast({
            title: '上传图片不能大于1M',
            icon: 'none'
          })
        }
        Taro.showLoading({
          title: "上传图片中..."
        });
        Promise.all(promiseArray)
          .then(result => {
            console.log("[result] :", result);
            for (let res of result) {
              voucherImage.push(res.data.data.imageUrl);
            }
            _this.setState({ voucherImage: voucherImage })
            Taro.hideLoading();
          })
          .catch(err => {
            console.error("upload err :", err);
            Taro.hideLoading();
          });
        if (pics.length >= 1) {
          _this.setState({ isShow: false })
        } else {
          _this.setState({ isShow: true })
        }
        _this.setState({ pics: pics })
      },
    })
  }
  //删除图片
  deleteImg(e) {
    var pics = this.state.voucherImage;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setState({ voucherImage: pics });
    if (pics.length < 1) {
      this.setState({ isShow: true })
    }
  }

  uploadImg(callback) {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
        if (tempFilesSize <= 3000000) { 
          Taro.showLoading({
            title: "上传图片中..."
          });
          try {
            Taro.hideLoading()
            let result = await uodataPic(res.tempFilePaths[0], { imageType: "afterSale" });
            console.log(result)
            callback(result.data.data.imageUrl)
          } catch (error) {
            Taro.hideLoading()
          }
        } else {
          Taro.showToast({
            title: '上传图片不能大于3M',
            icon: 'none'
          })
        }
        
      }
    })
  }

  // 客服二维码
  chooseImage1() {
    var _this = this
    var { pics1, voucherImage1 } = this.state
    const promiseArray = []
    Taro.chooseImage({
      count: 3 - pics1.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
        if (tempFilesSize <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
          const imgSrc = res.tempFilePaths;
          pics1 = pics1.concat(imgSrc);
          var promise = uodataPic(imgSrc[0], { imageType: "afterSale" });
          promiseArray.push(promise)
        } else {
          Taro.showToast({
            title: '上传图片不能大于2M',
            icon: 'none'
          })
        }
        Taro.showLoading({
          title: "上传图片中..."
        });
        Promise.all(promiseArray)
          .then(result => {
            console.log("[result] :", result);
            for (let res of result) {
              voucherImage1.push(res.data.data.imageUrl);
            }
            _this.setState({ voucherImage1: voucherImage1 })
            Taro.hideLoading();
          })
          .catch(err => {
            console.error("upload err :", err);
            Taro.hideLoading();
          });
        if (pics1.length >= 1) {
          _this.setState({ isShow1: false })
        } else {
          _this.setState({ isShow1: true })
        }
        _this.setState({ pics1: pics1 })
      },
    })
  }
  //删除二维码
  deleteImg1(e) {
    var pics1 = this.state.voucherImage1;
    var index = e.currentTarget.dataset.index;
    pics1.splice(index, 1);
    this.setState({ voucherImage1: pics1 });
    if (pics1.length < 1) {
      this.setState({ isShow1: true })
    }
  }

  // 点击修改
  oncheckinfo() {
    this.setState({ ischeck: false })
  }

  // 店铺名称
  getstorename(e) {
    this.setState({ name: e.detail.value })
  }
  // 选择接单时间
  onDateChange() {
    this.setState({ isDate: true })
    // this.setState({ startTime: e.detail.value, srartTxt: false })
  }
  // 结束时间
  onendDateChange() {
    this.setState({ isDate1: true })
    // this.setState({ endTime: e.detail.value, endTxt: false })
  }
  // 地址
  getstoreaddress(e) {
    this.setState({ address: e.detail.value })
  }
  // 联系人
  getname(e) {
    this.setState({ personInCharge: e.detail.value })
  }
  // 手机号
  getphone(e) {
    this.setState({ mobile: e.detail.value })
  }
  // 店铺详情
  getstoreinfo(e) {
    this.setState({ info: e.detail.value })
  }
  // 上传
  async uploadLoader() {
    const { isOrderInvoice, voucherImage, voucherImage1, name, startTime, endTime, address, personInCharge, mobile, info, storeInfo } = this.state
    if (voucherImage.length == 0) {
      Taro.showToast({
        title: '请上传店铺头像',
        icon: 'none'
      })
      return
    }
    if (!name || !address || !personInCharge || !mobile || !info) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    if (!startTime || !endTime) {
      Taro.showToast({
        title: '请选择接单时间',
        icon: 'none'
      })
      return
    }

    const params = {
      isOpenMessageNotice: this.state.isOpenMessageNotice,
      isOrderInvoice,
      logoIconUrl: voucherImage[0],
      name,
      businessTime: startTime + '-' + endTime,
      address, personInCharge, mobile, info,
      wxQrcode: voucherImage1[0],
      businessName: storeInfo.businessName, 
      categoryId: storeInfo.categoryId,
      categoryName: storeInfo.categoryName,
      businessLicenseUrl: storeInfo.businessLicenseUrl,
      facadeUrl: storeInfo.facadeUrl
    }
    if (!params.businessName) {
      Taro.showToast({
        title: '请输入企业名称',
        icon: 'none'
      })
      return 
    }
    if (!params.categoryId) {
      Taro.showToast({
        title: '请选择经营种类',
        icon: 'none'
      })
      return 
    }

    if (this.state.isOpenMessageNotice) {
      let loginRes = await Taro.login()
      console.log(loginRes)
      params.code = loginRes.code
    }
    const res = await upDataDetail(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: res.data.message,
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1500);
    }
  }

  datehide() {
    this.setState({ isDate: false })
  }
  // 隐藏弹窗
  cancel() {
    this.setState({ isDate: false });
  }
  cancel1() {
    this.setState({ isDate1: false });
  }

  onInput(e) {
    // console.log(e)
  }
  // 选择开始时间
  confirm(e) {
    console.log(e)
    if (!e) {
      this.setState({ startTime: this.state.startTime });
    } else {
      this.setState({ startTime: e, isDate: false, isDate1: true });
    }
  }
  // 选择结束时间
  confirm1(e) {
    console.log(e)
    if (!e) {
      this.setState({ endTime: this.state.startTime });
    } else {
      this.setState({ endTime: e, isDate1: false });
    }
  }

  switch1Change(e) {
    console.log(e)
    this.setState({ isOrderInvoice: e.detail.value ? true : false })
  }

  switchOrderMsgChange(e) {
    console.log(e)
    this.setState({ isOpenMessageNotice: e.detail.value ? true : false })
  }

  // 获取经营种类列表
  getBustype = async (busname) => {
    const type = 20
    const res = await listbylist(type)
    if (res.data.code == 20000) {
      let buslist = res.data.data
      this.setState({ buslist })
      if (busname) {
        buslist.map(item => {
          if (item.name == busname) {
            let busid = item.id
            this.setState({ busid })
          }
        })
      }
    }
  }

  showbus(e) {
    const { buslist, storeInfo } = this.state
    const index = e.detail.value
    const busname = buslist[index].name
    const id = buslist[index].id
    storeInfo.categoryName = busname
    storeInfo.categoryId = id
    this.setState({ storeInfo })
  }

  drawFollowCodeImage(imgPath) {
    let that = this;
    console.log(this.state.imageurl + imgPath)
    const context = Taro.createCanvasContext('canvas-image', this)
    Taro.getImageInfo({
      src: this.state.imageurl + imgPath
    }).then(res => {
      
      context.drawImage(res.path, 0, 0, 200, 200);

      context.draw(false, () => {
        Taro.canvasToTempFilePath({
          canvasId: 'canvas-image',
          width: 200,
          height: 200,
          destWidth: 200,
          destHeight: 200,
          success: function (res2) {
            console.log('drawFollowCodeImage==>', res2.tempFilePath)
            // 获得图片临时路径
            that.setState({imageTempPath: res2.tempFilePath})
          }
        })
      });
    })
  }
  // 保存二维码
  saveImage() {
    // 查看是否授权
    Taro.getSetting({
      complete() {}
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


  render() {
    const { storeInfo, imageurl, isDate, isDate1, startTime, endTime, voucherImage, voucherImage1, 
      ischeck, buslist, 
      isOrderInvoice,
      name, businessTime, address, personInCharge, mobile, info,
      stytemInfo
     } = this.state
    return (
      <Block>
        {isDate && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="time"
              value={startTime}
              cancel={this.cancel.bind(this)}
              confirm={this.confirm.bind(this)}
              input={this.onInput}
              currentDate={startTime}
            ></DatetimePicker>
          </View>
        )}
        {isDate1 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className='pickdata'
              type="time"
              value={endTime}
              cancel={this.cancel1.bind(this)}
              confirm={this.confirm1.bind(this)}
              input={this.onInput1}
              currentDate={endTime}
            ></DatetimePicker>
          </View>
        )}
        <View className='set'>
          {ischeck ? (
            <View>
              <View className='set-row'>
                <Text>企业名称</Text>
                <Text>{storeInfo.businessName}</Text>
              </View>
              <View className='set-row'>
                <Text>经营种类</Text>
                <Text>{storeInfo.categoryName}</Text>
              </View>
              <View className='set-row'>
                <Text>门店正面照</Text>
                { storeInfo.businessLicenseUrl ? (
                  <Image className='pic' mode='aspectFit' src={imageurl + storeInfo.businessLicenseUrl} onClick={() => {
                    Taro.previewImage({
                      current: imageurl + storeInfo.businessLicenseUrl,
                      urls: [imageurl + storeInfo.businessLicenseUrl]
                    })
                  }}></Image>)
                  : (
                  <View className='no-img'>
                    <Text className='iconfont icon-tupian'></Text>
                  </View>
                 )}
              </View>
              <View className='set-row'>
                <Text>有效期至</Text>
                <Text>{storeInfo.endDate}</Text>
              </View>
              <View className='set-row martop'>
                <Text>店铺首页图</Text>
                { storeInfo.facadeUrl ? (<Image className='pic' mode='aspectFit' src={imageurl + storeInfo.facadeUrl} 
                  onClick={() => {
                    Taro.previewImage({
                      current: imageurl + storeInfo.facadeUrl,
                      urls: [imageurl + storeInfo.facadeUrl]
                    })
                  }}></Image>) 
                : (
                  <View className='no-img'>
                    <Text className='iconfont icon-tupian'></Text>
                  </View>
                 )}
              </View>
              <View className='set-row'>
                <Text>店铺头像</Text>
                {storeInfo.logoIconUrl ? (
                  <Image className='pic' src={imageurl + storeInfo.logoIconUrl} onClick={() => {
                    Taro.previewImage({
                      current: imageurl + storeInfo.logoIconUrl,
                      urls: [imageurl + storeInfo.logoIconUrl]
                    })
                  }}></Image>
                ) : (
                    <Image className='pic' src={Taro.getStorageSync('imgHostItem')+'avtor.png'}></Image>
                  )}
              </View>
              <View className='set-row'>
                <Text>店铺名称</Text>
                <Text>{name}</Text>
              </View>
              <View className='set-row'>
                <Text>接单时间</Text>
                <Text>{businessTime}</Text>
              </View>
              <View className='set-row'>
                <Text>店铺地址</Text>
                <Text>{address}</Text>
              </View>
              <View className='set-row'>
                <Text>联系人</Text>
                <Text>{personInCharge}</Text>
              </View>
              <View className='set-row'>
                <Text>联系电话</Text>
                <Text>{mobile}</Text>
              </View>
              <View className='set-row'>
                <Text>店铺介绍</Text>
                <Text>{info}</Text>
              </View>
              <View className='set-row'>
                <Text>是否支持开票</Text>
                <Switch color="orange" checked={isOrderInvoice ? true : false} disabled />
              </View>
              <View className='set-row'>
                <Text>是否开启新订单提醒</Text>
                <Switch color="orange" checked={this.state.isOpenMessageNotice ? true : false} disabled />
              </View>
              <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">注：新订单提醒功能需要先关注公众号 
                <Text style='color: rgb(255, 165, 0); padding: 6px;' onClick={() => { this.onShowfollowCodeImage(true) }}>点击查看二维码</Text>
              </View>
              <View className='set-row martop'>
                <Text>客服二维码</Text>
                {storeInfo.wxQrcode ? (
                  <Image className='pic' src={imageurl + storeInfo.wxQrcode} onClick={() => {
                    Taro.previewImage({
                      current: imageurl + storeInfo.wxQrcode,
                      urls: [imageurl + storeInfo.wxQrcode]
                    })
                  }}></Image>
                ) : (
                    // <Image className='pic' src={wx.getStorageSync('imgHostItem')+'avtor.png'}></Image>
                    <View className='no-img'>
                      <Text className='iconfont icon-tupian'></Text>
                    </View>
                  )}
              </View>
            </View>
          ) : (
              <View>
                <View className='set-row'>
                  <Text>企业名称</Text>
                  <Input value={storeInfo.businessName} onInput={(e) => { 
                    storeInfo.businessName = e.detail.value
                    this.setState({ storeInfo })
                  }}></Input>
                </View>
                <View className='set-row'>
                  <Text>经营种类</Text>
                  <View>
                    <Picker
                      style='display: inline-block'
                      mode="selector"
                      range={buslist}
                      rangeKey="name"
                      onChange={e => {
                        this.showbus(e)
                      }}
                      >
                      <View className="picker__inner">
                        {storeInfo.categoryName ? (
                          <Text className="value">{storeInfo.categoryName}</Text>
                        ) : (
                            <Text className='pic1'>请选择经营种类</Text>
                          )}
                        <Text className='qcfont qc-icon-chevron-right'/>
                      </View>
                    </Picker>
                  </View>
                </View>
                <View className='set-row'>
                  <Text>门店正面照</Text>
                  { storeInfo.businessLicenseUrl ? (
                  <View className='weui-uploader__file'>
                    <Image className='pic' mode='aspectFit' src={imageurl + storeInfo.businessLicenseUrl}></Image>
                    <Image className="delete" src={Taro.getStorageSync('imgHostItem')+'delete1.png'} onClick={() => { 
                      storeInfo.businessLicenseUrl = ''
                      this.setState({ storeInfo }) 
                     }}></Image>
                  </View>)
                  : (
                  <View className="weui-uploader__input-box">
                    <View className="weui-uploader__input" onClick={() => { 
                      this.uploadImg((value) => { 
                        storeInfo.businessLicenseUrl = value
                        this.setState({ storeInfo }) 
                      })
                     }}></View>
                  </View>
                  )}
                </View>
                <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">建议尺寸：750*440，大小不超过2M</View>
                <View className='set-row martop'>
                  <Text>店铺首页图</Text>
                  { storeInfo.facadeUrl ? (
                  <View className='weui-uploader__file'>
                    <Image className='pic' mode='aspectFit' src={imageurl + storeInfo.facadeUrl}></Image>
                    <Image className="delete" src={Taro.getStorageSync('imgHostItem')+'delete1.png'} onClick={() => { 
                      storeInfo.facadeUrl = ''
                      this.setState({ storeInfo }) 
                     }}></Image>
                  </View>)
                  : (
                  <View className="weui-uploader__input-box">
                    <View className="weui-uploader__input" onClick={() => { 
                      this.uploadImg((value) => { 
                        storeInfo.facadeUrl = value
                        this.setState({ storeInfo }) 
                      })
                     }}></View>
                  </View>
                  )}
                </View>
                <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">建议尺寸：750*440，大小不超过2M</View>
                <View className='set-row'>
                  <Text>店铺头像</Text>
                  <View className="weui-uploader__bd">
                    {voucherImage.length > 0 && (
                      <View className="weui-uploader__files">
                        {voucherImage.map((item, index) => {
                          return (
                            <View className="weui-uploader__file">
                              <Image className="weui-uploader__img" src={imageurl + item} data-src={item} data-index={index}></Image>
                              <Image className="delete" src={Taro.getStorageSync('imgHostItem')+'delete1.png'} onClick={this.deleteImg}></Image>
                            </View>
                          )
                        })}
                      </View>
                    )}
                    {voucherImage.length == 0 && (
                      <View className="weui-uploader__input-box">
                        <View className="weui-uploader__input" onClick={this.chooseImage}></View>
                      </View>
                    )}
                  </View>
                  {/* <Image className='pic' src={wx.getStorageSync('imgHostItem')+'guoyu-917_180.png'}></Image> */}
                </View>
                <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">建议尺寸：100*100，大小不超过2M</View>
                <View className='set-row'>
                  <Text>店铺名称</Text>
                  <Input value={name} onInput={this.getstorename}></Input>
                </View>
                {/* <View className='set-row'>
                  <Text>店铺首页图</Text>
                  <Image className='pic' mode='aspectFit' src={imageurl + storeInfo.facadeUrl}></Image>
                  <View className="weui-uploader__input-box">
                    <View className="weui-uploader__input" onClick={this.chooseImage1}></View>
                  </View>
                </View> */}
                <View className='set-row'>
                  <Text>接单时间</Text>
                  <View style="display:flex">
                    <View onClick={this.onDateChange}>
                      <View>{this.state.startTime}</View>
                    </View>-

                    <View onClick={this.onendDateChange}>
                      <View>{this.state.endTime}</View>
                    </View>
                  </View>
                </View>
                <View className='set-row'>
                  <Text>店铺地址</Text>
                  <Input value={address} onInput={this.getstoreaddress}></Input>
                </View>
                <View className='set-row'>
                  <Text>联系人</Text>
                  <Input value={personInCharge} onInput={this.getname}></Input>
                </View>
                <View className='set-row'>
                  <Text>联系电话</Text>
                  <Input value={mobile} onInput={this.getphone}></Input>
                </View>
                <View className='set-row'>
                  <Text>店铺介绍</Text>
                  <Input value={info} onInput={this.getstoreinfo}></Input>
                </View>
                <View className='set-row'>
                  <Text>是否支持开票</Text>
                  <Switch color="orange" onChange={this.switch1Change} checked={isOrderInvoice ? true : false} />
                </View>
                <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">关闭后，买家将看不到是否开票等信息</View>
                
                <View className='set-row'>
                  <Text>是否开启新订单提醒</Text>
                  <Switch color="orange" onChange={this.switchOrderMsgChange} checked={this.state.isOpenMessageNotice ? true : false} />
                </View>
                <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">注：新订单提醒功能需要先关注公众号 
                  <Text style='color: rgb(255, 165, 0); padding: 6px;' onClick={() => { this.onShowfollowCodeImage(true) }}>点击查看二维码</Text>
                </View>
                <View className='set-row martop'>
                  <Text>客服二维码</Text>
                  <View className="weui-uploader__bd">
                    {voucherImage1.length > 0 && (
                      <View className="weui-uploader__files">
                        {voucherImage1.map((item, index) => {
                          return (
                            <View className="weui-uploader__file">
                              <Image className="weui-uploader__img" src={imageurl + item} data-src={item} data-index={index}></Image>
                              <Image className="delete" src={Taro.getStorageSync('imgHostItem')+'delete1.png'} onClick={this.deleteImg1}></Image>
                            </View>
                          )
                        })}
                      </View>
                    )}
                    {voucherImage1.length == 0 && (
                      <View className="weui-uploader__input-box">
                        <View className="weui-uploader__input" onClick={this.chooseImage1}></View>
                      </View>
                    )}
                  </View>
                  {/* <Image className='pic' src={wx.getStorageSync('imgHostItem')+'guoyu-917_180.png'}></Image> */}
                </View>
                <View style="color: #888;padding: 15rpx 20rpx; font-size: 24rpx;">建议尺寸：120*120，大小不超过2M</View>
              </View>
            )}
        </View>
        <View style="margin-top: 30rpx;">
          <OfficialAccount />
        </View>
        <View style='height:200rpx'></View>
        {ischeck ? (
          <View className='btn' onClick={this.oncheckinfo}>
            <Text>修改</Text>
          </View>
        ) : (
            <View className='btn' onClick={this.uploadLoader}>
              <Text>保存</Text>
            </View>
          )}
          {/* this.state.isShowFollowCodeImage} */}
        <Dialog
          visible={this.state.isShowFollowCodeImage}
          onClick={() => { this.setState({ isShowFollowCodeImage: false }) }}
          position="center">
          <View className="codeImage-dialog">
          <View 
            className='iconfont icon-shanchu close-icon' 
            onClick={() => {
              this.setState({ isShowFollowCodeImage: false})
            }}></View>
            <Image className='followCodeImage' src={ imageurl + this.state.followCodeImage } />
            <View className='down-btns' onClick={() => { this.saveImage() }}>保存到手机</View>
          </View>
        </Dialog>
        {/* <canvas canvas-id='canvas-image' style={'position: fixed;top: -10000px;left: -10000px;'+`width: ${stytemInfo.windowWidth}px;height: ${stytemInfo.windowHeight}px;`}></canvas> */}
        <canvas canvas-id='canvas-image' style='position: fixed;top: -10000px;left: -10000px;width: 400px;height: 400px;'></canvas>
      </Block >
    );
  }
}
