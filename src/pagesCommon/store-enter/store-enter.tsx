import Taro, { Component, Config } from "@tarojs/taro";
import {
  View,
  Text,
  Image,
  Input,
  Checkbox,
  CheckboxGroup,
  Picker
} from "@tarojs/components";
import "./store-enter.scss";
import regionData from "./data";
import { listbylist, joinStore, uodataPic, allowView, updataStore, verilPhone } from "@/api/login"
const app = Taro.getApp()
export default class Index extends Component {
  nextstep() {
    Taro.navigateTo({
      url: '../auth-msg/auth-msg'
    })
  }
  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    pics: [],
    pics1: [],
    pics2: [],
    photos: [],
    isShow: true,
    isShow1: true,
    isShow2: true,
    buslist: [],
    isbus: false,
    busname: '',
    busid: '',
    storename: '',
    businessName: '',
    address: '',
    personInCharge: '',
    mobile: '',
    inviterMobile: '',
    ischecked: ["1"],
    files: [],
    voucherImage: [],
    voucherImage1: [],
    voucherImage2: [],
    region: {
      province: [],
      city: [],
      area: []
    },
    model: {},
    type: '',
    id: '',
    notPassMsg: '',
    code: '',
    timer: '',
    countDownNum: '获取验证码',
  };
  componentDidMount() {
    var recMobile = Taro.getStorageSync('recMobile')
    if (recMobile) {
      this.setState({ inviterMobile: recMobile })
    }
    const { type, notPassMsg } = this.$router.params
    this.setState({ type, notPassMsg })
    if (type) {
      allowView().then(res => {
        let data = res.data.data
        let { voucherImage, voucherImage1, voucherImage2, model } = this.state
        voucherImage.push(data.idCardFrontUrl)
        voucherImage1.push(data.idCardBackUrl)
        voucherImage2.push(data.businessLicenseUrl)
        model.province = data.province
        model.city = data.city
        model.area = data.area
        this.setState({
          id: data.id,
          storename: data.name,
          businessName: data.businessName,
          busname: data.categoryName,
          address: data.address,
          personInCharge: data.personInCharge,
          model,
          mobile: data.mobile,
          inviterMobile: data.inviterMobile,
          voucherImage,
          voucherImage1,
          voucherImage2,
          isShow: false,
          isShow1: false,
          isShow2: false
        })
        this.getBustype(data.categoryName)
      })
    } else {
      this.getBustype('')
    }
    let region = this.state.region
    region.province = this.getAreaList("province");
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
    const { buslist } = this.state
    const index = e.detail.value
    const busname = buslist[index].name
    const id = buslist[index].id
    this.setState({ busname, busid: id })
  }
  chooseBus(id, name) {
    this.setState({ isbus: false, busname: name, busid: id })
  }
  getStorename(e) {
    this.setState({ storename: e.detail.value })
  }
  getbussName(e) {
    this.setState({ businessName: e.detail.value })
  }
  getstoreAdress(e) {
    this.setState({ address: e.detail.value })
  }
  getusername(e) {
    this.setState({ personInCharge: e.detail.value })
  }
  getPhone(e) {
    this.setState({ mobile: e.detail.value })
  }
  getcommon(e) {
    this.setState({ inviterMobile: e.detail.value })
  }
  // 输入验证码
  getcode(e) {
    this.setState({ code: e.detail.value })
  }
  checkItem(e) {
    const value = e.detail.value
    this.setState({ ischecked: value })
  }
  // 获取验证码
  async getVeril() {
    let { mobile } = this.state
    if (!mobile) {
      Taro.showToast({
        title: '请先输入手机号',
        icon: 'none'
      })
      return
    } else {
      if (!(/^1[3456789]\d{9}$/.test(mobile))) {
        Taro.showToast({
          title: '手机号码有误，请重填',
          icon: 'none'
        })
        return;
      }
    }
    const params = { phone: mobile, codeType: 'joinStore' }
    await verilPhone(params)
    let that = this
    let countDownNum = 60
    that.setState({
      timer: setInterval(function () {
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setState({
          countDownNum: countDownNum + 's'
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.state.timer);
          that.setState({
            countDownNum: '获取验证码'
          })
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 1000)
    })
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);		// 清除计时器
  }
  // 提交
  confirm() {
    const { code, type, id, model, ischecked, inviterMobile, mobile, personInCharge, address, businessName, storename, busid, pics, pics1, pics2, voucherImage, voucherImage1, voucherImage2 } = this.state
    if (!code || !storename || !businessName || !busid || !personInCharge || !address) {
      Taro.showToast({
        title: '请将信息填写完整', icon: 'none'
      })
      return
    }
    if (!mobile) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    } else {
      if (!(/^1[3456789]\d{9}$/.test(mobile))) {
        Taro.showToast({
          title: '手机号码有误，请重填',
          icon: 'none'
        })
        return;
      }
    }
    if (voucherImage.length == 0 || voucherImage1.length == 0) {
      Taro.showToast({ title: '您还有图片没有上传', icon: 'none' })
      return
    }
    if (ischecked.length == 0) {
      Taro.showToast({
        title: '请先勾选条款',
        icon: 'none'
      })
      return
    }
    if (type) {
      const params = {
        code,
        codeType: 'joinStore',
        id,
        province: model.province,
        city: model.city,
        area: model.area,
        name: storename,
        businessName,
        categoryId: busid,
        personInCharge,
        mobile,
        address,
        inviterMobile,
        idCardFrontUrl: voucherImage[0],
        idCardBackUrl: voucherImage1[0],
        businessLicenseUrl: voucherImage2.length > 0 ? voucherImage2[0] : ''
      }
      this.updatasave(params)
    } else {
      const params = {
        code,
        codeType: 'joinStore',
        province: model.province,
        city: model.city,
        area: model.area,
        name: storename,
        businessName,
        categoryId: busid,
        personInCharge,
        mobile,
        address,
        inviterMobile,
        idCardFrontUrl: voucherImage[0],
        idCardBackUrl: voucherImage1[0],
        businessLicenseUrl: voucherImage2.length > 0 ? voucherImage2[0] : ''
      }
      this.getsave(params)
    }
  }

  // 店铺入驻
  getsave = async (params) => {
    const res = await joinStore(params)
    if (res.data.code == 20000) {
      Taro.setStorageSync('istype', '1')
      Taro.showToast({
        title: res.data.message,
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({
          delta: 1
        })
      }, 1500);
    }
  }
  // 入驻资料修改
  updatasave = async (params) => {
    const res = await updataStore(params)
    if (res.data.code == 20000) {
      Taro.setStorageSync('istype', '1')
      Taro.showToast({
        title: res.data.message,
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({
          delta: 1
        })
      }, 1500);
    }
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
    var pics = this.state.voucherImage;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setState({ voucherImage: pics });
    if (pics.length < 1) {
      this.setState({ isShow: true })
    }
  }
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
  //删除图片
  deleteImg1(e) {
    var pics1 = this.state.voucherImage1;
    var index = e.currentTarget.dataset.index;
    pics1.splice(index, 1);
    this.setState({ voucherImage1: pics1 });
    if (pics1.length < 1) {
      this.setState({ isShow1: true })
    }
  }
  chooseImage2() {
    var _this = this
    var { pics2, voucherImage2 } = this.state
    const promiseArray = []
    Taro.chooseImage({
      count: 3 - pics2.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
        if (tempFilesSize <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
          const imgSrc = res.tempFilePaths;
          pics2 = pics2.concat(imgSrc);
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
              voucherImage2.push(res.data.data.imageUrl);
            }
            _this.setState({ voucherImage2: voucherImage2 })
            Taro.hideLoading();
          })
          .catch(err => {
            console.error("upload err :", err);
            Taro.hideLoading();
          });
        if (pics2.length >= 1) {
          _this.setState({ isShow2: false })
        } else {
          _this.setState({ isShow2: true })
        }
        _this.setState({ pics2: pics2 })
      },
    })
  }
  //删除图片
  deleteImg2(e) {
    var pics2 = this.state.voucherImage2;
    var index = e.currentTarget.dataset.index;
    pics2.splice(index, 1);
    this.setState({ voucherImage2: pics2 });
    if (pics2.length < 1) {
      this.setState({ isShow2: true })
    }
  }
  // 选择省市区
  onPickerChange(e: any, type: "province" | "city" | "area") {
    const region = this.state.region
    const model = this.state.model
    let index = e.detail.value;
    let item = region[type][index];
    let code = item.code;
    model[type] = item.name;
    if (type === "province") {
      model.city = "";
      model.area = "";
      region.area = [];
      region.city = this.getAreaList("city", code.slice(0, 2));
    } else if (type === "city") {
      model.area = "";
      region.area = this.getAreaList("area", code.slice(0, 4));
    }
    this.setState({ model, region })
  }
  getAreaList(
    type: "province" | "city" | "area",
    code?: string
  ): any[] {
    let result: any = [];
    if (type !== "province" && !code) {
      return result;
    }
    const list = regionData[`${type}_list`];
    result = Object.keys(list).map(code => ({
      code,
      name: list[code]
    }));
    if (code) {
      result = result.filter((item: any) => item.code.indexOf(code) === 0);
    }
    return result;
  }

  gopro() {
    Taro.navigateTo({ url: '../../pagesInfo/protocol/protocol?type=STORE_TOS' })
  }
  config: Config = {
    navigationBarTitleText: "店铺入驻"
  };
  render() {
    const { buslist, busname, isShow, notPassMsg, region, model,
      voucherImage, storename, businessName, address,
      personInCharge, mobile, countDownNum, code, inviterMobile, imageurl,
      isShow1, isShow2, voucherImage1, voucherImage2, type } = this.state
    return (
      <View style="flex-direction:column;">
        {notPassMsg && (
          <View className='errormsg'>{notPassMsg}</View>
        )}

        <View className='store-info'>店铺信息</View>
        <View className='content'>
          <View className='content-row'>
            <Text>店铺名称</Text>
            <View className='store-name'><Input placeholder='请输入店铺名称' value={storename} onInput={this.getStorename}></Input></View>
          </View>
          <View className='content-row'>
            <Text>企业名称</Text>
            <View className='store-name'><Input placeholder='请输入企业名称' value={businessName} onInput={this.getbussName}></Input></View>
          </View>
          <View className='content-row'>
            <Text>经营种类</Text>
            <View className='store-name'>
              <Picker
                className="picker"
                mode="selector"
                range={buslist}
                rangeKey="name"
                onChange={e => {
                  this.showbus(e);
                }}
              >
                <View className="picker__inner">
                  {busname ? (
                    <Text className="value">{busname}</Text>
                  ) : (
                      <Text className='pic1'>请选择经营种类</Text>
                    )}
                  <Text className="iconfont icon-arrow-right rotate" />
                </View>
              </Picker>
              <View className='qcfont qc-icon-chevron-right'></View>
            </View>
          </View>
          <View className='content-row'>
            <Text>省份</Text>
            <View className='store-name'>
              <Picker
                className="picker"
                mode="selector"
                range={region.province}
                rangeKey="name"
                onChange={e => {
                  this.onPickerChange(e, "province");
                }}
              >
                <View className="picker__inner">
                  {model.province ? (
                    <Text className="value">{model.province}</Text>
                  ) : (
                      <Text className='pic1'>请选择省份</Text>
                    )}
                  <Text className="iconfont icon-arrow-right rotate" />
                </View>
              </Picker>
              <View className='qcfont qc-icon-chevron-right'></View>
            </View>
          </View>
          <View className='content-row'>
            <Text>城市</Text>
            <View className='store-name'>
              <Picker
                className="picker"
                mode="selector"
                range={region.city}
                rangeKey="name"
                onChange={e => {
                  this.onPickerChange(e, "city");
                }}
              >
                <View className="picker__inner">
                  {model.city ? (
                    <Text className="value">{model.city}</Text>
                  ) : (
                      <Text className='pic1'>请选择城市</Text>
                    )}
                  <Text className="iconfont icon-arrow-right rotate" />
                </View>
              </Picker>
              <View className='qcfont qc-icon-chevron-right'></View>
            </View>
          </View>
          <View className='content-row'>
            <Text>区/县/镇</Text>
            <View className='store-name'>
              <Picker
                className="picker"
                mode="selector"
                range={region.area}
                rangeKey="name"
                onChange={e => {
                  this.onPickerChange(e, "area");
                }}
              >
                <View className="picker__inner">
                  {model.area ? (
                    <Text className="value">{model.area}</Text>
                  ) : (
                      <Text className='pic1'>请选择区域</Text>
                    )}
                  <Text className="iconfont icon-arrow-right rotate" />
                </View>
              </Picker>
              <View className='qcfont qc-icon-chevron-right'></View>
            </View>
          </View>
          <View className='content-row'>
            <Text>店铺地址</Text>
            <View className='store-name'><Input placeholder='请输入地址' value={address} onInput={this.getstoreAdress}></Input></View>
          </View>
          <View className='content-row'>
            <Text>联系人</Text>
            <View className='store-name'><Input placeholder='请输入姓名' value={personInCharge} onInput={this.getusername}></Input></View>
          </View>
          <View className='content-row'>
            <Text>联系电话</Text>
            <View className='store-name1'>
              <Input placeholder='请输入电话' value={mobile} onInput={this.getPhone}></Input>
              {countDownNum == '获取验证码' ? (
                <Text onClick={this.getVeril}>{countDownNum}</Text>
              ) : (
                  <Text>{countDownNum}</Text>
                )}
            </View>
          </View>
          <View className='content-row'>
            <Text>验证码</Text>
            <View className='store-name'><Input placeholder='请输入验证码' value={code} onInput={this.getcode}></Input></View>
          </View>
          <View className='content-row borno'>
            <Text>推荐人</Text>
            <View className='store-name'><Input placeholder='请输入推荐人手机号(选填)' value={inviterMobile} onInput={this.getcommon}></Input></View>
          </View>
        </View>
        <View className='store-info'>证件上传</View>
        <View className='content'>
          <View style='padding:30rpx;'>
            <Text>经营者身份证</Text>
            <View className='card-img'>
              <View className="weui-uploader__bd">
                <View className="weui-uploader__files">
                  {voucherImage.map((item, index) => {
                    return (
                      <View className="weui-uploader__file">
                        <Image className="weui-uploader__img" src={imageurl + item} data-src={item} data-index={index}></Image>
                        <Image className="delete" src={require('../../images/item/delete1.png')} data-index={index} onClick={this.deleteImg}></Image>
                      </View>
                    )
                  })}
                </View>
                {isShow && (
                  <View className='card-col' onClick={this.chooseImage}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'card2.png'}></Image>
                    <Text>点击拍摄/上传人像面</Text>
                  </View>
                )}
              </View>

              <View className="weui-uploader__bd">
                <View className="weui-uploader__files">
                  {voucherImage1.map((item, index) => {
                    return (
                      <View className="weui-uploader__file">
                        <Image className="weui-uploader__img" src={imageurl + item} data-src={item} data-index={index}></Image>
                        <Image className="delete" src={require('../../images/item/delete1.png')} data-index={index} onClick={this.deleteImg1}></Image>
                      </View>
                    )
                  })}
                </View>
                {isShow1 && (
                  <View className='card-col' onClick={this.chooseImage1}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'card1.png'}></Image>
                    <Text>点击拍摄/上传国徽面</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style='padding:0 30rpx 30rpx 30rpx;'>
            <Text>门店正面照</Text>
            <View className='card-img borno'>
              <View className="weui-uploader__bd">
                <View className="weui-uploader__files">
                  {voucherImage2.map((item, index) => {
                    return (
                      <View className="weui-uploader__file">
                        <Image className="weui-uploader__img" src={imageurl + item} data-src={item} data-index={index}></Image>
                        <Image className="delete" src={require('../../images/item/delete1.png')} data-index={index} onClick={this.deleteImg2}></Image>
                      </View>
                    )
                  })}
                </View>
                {isShow2 && (
                  <View className='card-col' onClick={this.chooseImage2}>
                    <Image src={Taro.getStorageSync('imgHostItem') + 'business.png'}></Image>
                    <Text>点击拍摄/上传门店正面照</Text>
                  </View>
                )}
              </View>

            </View>
          </View>
        </View>
        <View className='tips'>
          <CheckboxGroup onChange={this.checkItem}>
            <Checkbox value='1' checked></Checkbox>
          </CheckboxGroup>
          <View onClick={this.gopro} >
            <Text>我已阅读并接受<Text style='color:#FF840B;'>《丰盈e鲜服务条款》</Text></Text>
          </View>
        </View>
        <View style="height:80px;"></View>
        {type ? (
          <View className='btn' onClick={this.confirm}>
            <Text>修改</Text>
          </View>
        ) : (
            <View className='btn' onClick={this.confirm}>
              <Text>提交</Text>
            </View>
          )}
      </View>
    );
  }
}
