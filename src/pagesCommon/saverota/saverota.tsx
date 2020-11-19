import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Picker
} from "@tarojs/components";
import "./saverota.scss";
import DatetimePicker from "@/components/datetime-picker";
import { addBanner, updatabanner } from "@/api/banner"
import { uodataPic } from "@/api/login"


export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    })
  }
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    startTime: '',
    endTime: '',
    srartTxt: true,
    endTxt: true,
    selector: [{ name: '不跳转', type: 'noskip' }, { name: '商品', type: 'product' }],
    selectorChecked: '',
    isgodetail: false,
    isShow: true,
    pics: [],
    photos: [],
    sort: '',
    skipType: '',
    skipLinks: '',
    voucherImage: [],
    isDate: false,
    isDate1: false,
    currentDate: '',
    currentDate1: '',
    selDate: '',
    selDate1: '',
    productname: '',
    type: '',
    storeType: '',
    id: '',
    now: new Date(),
    now1: new Date()
  };
  config: Config = {
    navigationBarTitleText: "添加轮播图"
  };
  componentDidShow() {
    const skipLinks = Taro.getStorageSync('id')
    const productname = Taro.getStorageSync('name')
    this.setState({ skipLinks, productname })
  }
  componentDidMount() {
    const item = JSON.parse(this.$router.params.item)
    console.log(item)
    const type = this.$router.params.type
    const { voucherImage } = this.state
    const imgLinks = item.imgLinks
    voucherImage.push(imgLinks)
    console.log(voucherImage)
    this.setState({
      id: item.id,
      type,
      voucherImage,
      skipType: item.skipType,
      skipLinks: item.skipLinks,
      storeType: item.type,
      selDate: item.startTime,
      selDate1: item.endTime,
      sort: item.sortNum,
      selectorChecked: item.skipType == 'noskip' ? '不跳转' : '商品',
      isgodetail: item.skipType == 'noskip' ? false : true,
      productname: item.productName
    })
    const currentDate = new Date().getTime();
    const newDate = this.getLocalTime(currentDate);
    this.setState({ currentDate: newDate });
  }
  getLocalTime(nS) {
    //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
    // d.cTime = 1539083829787
    let date = new Date(nS);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let h = date.getHours();
    if (h < 10) {
      h = "0" + h;
    }
    let m = date.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    let s = date.getSeconds()
    if (s < 10) {
      s = "0" + s;
    }
    let day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    date = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    return date;
  }
  // 选择日期
  // onDateChange = e => {
  //   this.setState({
  //     startTime: e.detail.value,
  //     srartTxt: false
  //   })
  // }
  // onendDateChange(e) {
  //   this.setState({
  //     endTime: e.detail.value,
  //     endTxt: false
  //   })
  // }
  // 选择跳转至
  onChange = e => {
    var val = e.detail.value
    this.setState({
      selectorChecked: this.state.selector[val].name,
      skipType: this.state.selector[val].type,
      isgodetail: val == 0 ? false : true
    })
  }
  // 图片上传
  chooseImage() {
    var _this = this
    var { pics, voucherImage } = this.state
    const promiseArray = []
    Taro.chooseImage({
      count: 8 - pics.length, // 最多可以选择的图片张数，默认9
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
            title: '上传图片不能大于2M',
            icon: 'none'
          })
        }
        Taro.showLoading({
          title: "上传图片中..."
        });
        Promise.all(promiseArray)
          .then(result => {
            for (let res of result) {
              voucherImage.push(res.data.data.imageUrl);
            }
            _this.setState({ voucherImage: voucherImage })
            Taro.hideLoading();
          })
          .catch(err => {
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
    console.log(e)
    var pics = this.state.voucherImage;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setState({ voucherImage: pics });
    if (pics.length < 1) {
      this.setState({ isShow: true })
    }
  }
  onDateChange() {
    this.setState({ isDate: true });
  }
  onDateChange1() {
    this.setState({ isDate1: true });
  }
  cancel() {
    this.setState({ isDate: false });
  }
  cancel1() {
    this.setState({ isDate1: false });
  }
  datehide() {
    this.setState({ isDate: false });
  }
  // 选择日期
  confirm(e) {
    console.log(e)
    if (!e) {
      this.setState({ isDate: this.state.currentDate });
    } else {
      const selDate = this.getLocalTime(e);
      this.setState({ selDate, isDate: false });
    }
  }
  confirm1(e) {
    if (!e) {
      this.setState({ isDate1: this.state.currentDate1 });
    } else {
      const selDate1 = this.getLocalTime(e);
      this.setState({ selDate1, isDate1: false });
    }
  }
  // 排序
  sortData(e) {
    this.setState({ sort: e.detail.value })
  }
  // 保存
  async save() {
    let { voucherImage, selDate, selDate1, sort, skipType, skipLinks } = this.state
    if (voucherImage.length == 0) {
      Taro.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (!selDate || !selDate1 || !sort || !skipType) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    if (skipType == 'product') {
      if (!skipLinks) {
        Taro.showToast({
          title: '请将信息填写完整',
          icon: 'none'
        })
        return
      }
    }
    const params = { imgLinks: voucherImage[0], startTime: selDate, endTime: selDate1, sortNum: sort, skipType, skipLinks }
    const res = await addBanner(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '添加成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }

  // 修改
  async resent() {
    let { pics, id, storeType, voucherImage, selDate, selDate1, sort, skipType, skipLinks } = this.state
    sort == 0 ? JSON.stringify(sort) : sort

    if (voucherImage.length == 0) {
      Taro.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    const params = {
      id, type: storeType,
      imgLinks: voucherImage[0],
      startTime: selDate, endTime: selDate1,
      sortNum: sort, skipType, skipLinks
    }
    console.log(params)
    console.log(sort, JSON.stringify(sort))
    if (!selDate || !selDate1 || !skipType || !sort) {
      Taro.showToast({
        title: '请将信息填写完整1',
        icon: 'none'
      })
      return
    } else {
      if (skipType == 'product') {
        if (!skipLinks) {
          Taro.showToast({
            title: '请将信息填写完整',
            icon: 'none'
          })
          return
        }
      }
    }

    // const params = {
    //   id, type: storeType,
    //   imgLinks: voucherImage[0],
    //   startTime: selDate, endTime: selDate1,
    //   sortNum: sort, skipType, skipLinks
    // }
    const res = await updatabanner(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '修改成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
    Taro.removeStorageSync('id')
    Taro.removeStorageSync('name')
  }

  componentWillUnmount() {
    Taro.removeStorageSync('id')
    Taro.removeStorageSync('name')
  }
  render() {
    const { voucherImage, isDate, isDate1, now, now1, imageurl, isgodetail, selDate, selDate1, isShow, selectorChecked, productname, type, sort } = this.state
    return (
      <Block>
        {isDate && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={now}
              cancel={this.cancel.bind(this)}
              confirm={this.confirm.bind(this)}
              input={this.onInput}
              currentDate={now}
            ></DatetimePicker>
          </View>
        )}
        {isDate1 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={now1}
              cancel={this.cancel1.bind(this)}
              confirm={this.confirm1.bind(this)}
              currentDate={now1}
            ></DatetimePicker>
          </View>
        )}
        <View>
          <View className='dist-apply'>
            <View className="weui-uploader__bd">
              <View className="weui-uploader__files">
                {voucherImage.map((item, index) => {
                  return (
                    <View className="weui-uploader__file">
                      <Image className="weui-uploader__img" src={imageurl + item} data-src={item} data-index={index}></Image>
                      <Image className="delete" src={require("../../images/item/delete1.png")} data-index={index} onClick={this.deleteImg.bind(this)}></Image>
                    </View>
                  )
                })}
              </View>

              {isShow && (
                <Block>
                  {voucherImage.length < 1 && (
                    <View className="weui-uploader__input-box ">
                      <View className="weui-uploader__input" onClick={this.chooseImage}></View>
                      <View className='addbanner'>上传轮播图</View>
                    </View>
                  )}
                </Block>
              )}
            </View>
          </View>
        </View>
        <View style='color: #888;font-size: 26rpx;padding: 10rpx 25rpx;background: #f6f6f6;'>建议尺寸：750*320，大小不超过2M</View>
        <View className='set-row'>
          <Text>开始时间</Text>
          <View className='set-money'>
            {selDate ? (
              <View className='picker' onClick={this.onDateChange}>{selDate}</View>
            ) : (
                <View className='picker' onClick={this.onDateChange}>请选择开始时间</View>
              )}
            {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
          </View>
        </View>
        <View className='set-row'>
          <Text>结束时间</Text>
          <View className='set-money'>
            {selDate1 ? (
              <View className='picker' onClick={this.onDateChange1}>{selDate1}</View>
            ) : (
                <View className='picker' onClick={this.onDateChange1}>请选择结束时间</View>
              )}
            {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
          </View>
        </View>
        <View className='set'>
          <View className='set-row'>
            <Text>排序</Text>
            <View className='set-money'>
              <Input placeholder='请输入（数值越大排序越前）' placeholderClass='pcolor' value={sort} onInput={this.sortData}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>跳转至</Text>
            <View className='set-money'>
              <Picker className='pick-choose' mode='selector' rangeKey={'name'} range={this.state.selector} onChange={this.onChange}>
                {selectorChecked == '' && (
                  <View className="picker">请选择</View>
                )}
                {selectorChecked != '' && (
                  <View>{this.state.selectorChecked}</View>
                )}

              </Picker>
              {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
            </View>
          </View>
          {isgodetail && (
            <View className='set-row' onClick={() => { Taro.navigateTo({ url: '../select-goods/select-goods' }) }}>
              <Text>跳转商品</Text>
              <View className='set-money'>
                {productname ? (
                  <View>{productname}</View>
                ) : (
                    <View className='pcolor'>请选择商品</View>
                  )}

                <Image src={wx.getStorageSync('imgHostItem')+'qt_125.png'}></Image>
              </View>
            </View>
          )}
          {type == 'edit' ? (
            <View className='btn' onClick={this.resent}>
              <Text>修改</Text>
            </View>
          ) : (
              <View className='btn' onClick={this.save}>
                <Text>保存</Text>
              </View>
            )}

        </View>
      </Block >
    );
  }
}
