import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Textarea,
  Image
} from "@tarojs/components";
import "./remark.scss";
import { uodataPic } from "@/api/login"
import { addremark, getRemark } from "@/api/order"
// import { AtImagePicker } from 'taro-ui'
import { IMG_HOST } from '@/config'

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: "订单备注"
  }

  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    // 本地照片
    voucherImage: [],
    // 接口返回照片
    beforeImage: [],
    isShow: true,
    id: '',
    storeRemark: '',
    isUpdate: false
  };
  componentDidMount() {
    let id = this.$router.params.id
    let isUpdate = false
    this.setState({ id })
    getRemark(id).then(res => {
      let { images, storeRemark } = res.data.data
      if (images) {
        images = images.split('_')
        isUpdate = true
      } else {
        images = []
      }
      this.setState({ storeRemark, beforeImage: images, isUpdate })
    })
  }
  // 图片上传
  chooseImage() {
    let _this = this
    let { voucherImage, beforeImage } = this.state
    const promiseArray: Array<object> = []
    Taro.chooseImage({
      count: Math.abs(voucherImage.length + beforeImage.length - 9), // 最多可以选择的图片张数 9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        // tempFilePaths
        res.tempFiles.forEach((img, i) => {
          //获取图片的大小，单位B
          if (img.size <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
            let promise = uodataPic(res.tempFilePaths[i], { imageType: "sellerOrderRemark" });
            promiseArray.push(promise)
          } else {
            Taro.showToast({
              title: '上传图片不能大于2M',
              icon: 'none'
            })
          }
        })
        Taro.showLoading({
          title: "上传中"
        });
        Promise.all(promiseArray)
          .then(result => {
            console.log("[result] :", result);
            for (let res of result) {
              voucherImage.push(res.data.data.imageUrl);
            }
            _this.setState({ voucherImage: voucherImage })
            console.log(voucherImage)
            Taro.hideLoading();
          })
          .catch(err => {
            console.error("upload err :", err);
            Taro.hideLoading();
          });
      },
    })
  }
  //删除图片
  deleteImg = (index) => (e) => {
    e.stopPropagation()
    let voucherImage = this.state.voucherImage;
    voucherImage.splice(index, 1);
    this.setState({ voucherImage: voucherImage });
  }
  // 备注
  getTxt(e) {
    this.setState({ storeRemark: e.detail.value || '' })
  }

  async confirm() {
    const { id, storeRemark, voucherImage, beforeImage } = this.state
    let images = ''
    if (beforeImage && beforeImage.length > 0) {
      images = beforeImage.join('_')
    }
    if (voucherImage && voucherImage.length > 0) {
      if (images) images += '_'
      images += voucherImage.join('_')
    }
    const params = { id, storeRemark, images: images }
    const res = await addremark(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '备注添加成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }

  onChange (files, type, index) {
    console.log(files, type, index) 
    let _this = this
    let { voucherImage } = this.state
    const promiseArray: Array<object> = []
    // 删除操作
    if (type === 'remove') {
      voucherImage.splice(index, 1)
      this.state.files.splice(index, 1)
      this.setState({
        voucherImage,
        files: this.state.files
      })
      return
    }
    // 新增上传操作
    files.forEach((img, i) => {
      //获取图片的大小，单位B
      if (img.file.size <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
        let promise = uodataPic(img.url, { imageType: "sellerOrderRemark" });
        promiseArray.push(promise)
      } else {
        Taro.showToast({
          title: '图片不能大于2M',
          icon: 'none'
        })
      }
    })
    Taro.showLoading({
      title: "上传中"
    });
    Promise.all(promiseArray)
      .then(result => {
        console.log("[result] :", result);
        for (let res of result) {
          voucherImage.push(res.data.data.imageUrl);
        }
        Taro.hideLoading();
        console.log(voucherImage)
        let list = voucherImage.map(item => {
          return {
            url: IMG_HOST + item
          }
        })
        _this.setState({
          files: _this.state.files.concat(list),
          voucherImage: voucherImage,
        })
      })
      .catch(err => {
        console.error("upload err :", err);
        Taro.hideLoading();
      });
  }

  render() {
    const { storeRemark, voucherImage, beforeImage, isUpdate } = this.state
    return (
      <Block>
        <View className='good-pic'>
          <View>
            <Text>备注图片
            <Text className='order-pic'>(最多可上传9张商品主图)</Text></Text>
          </View>
          <View className="weui-uploader__bd">
            <View className="weui-uploader__files">
            {/* 线上照片 */}
            {beforeImage.map((item, index) => {
                return (
                  <View class="weui-uploader__file">
                    <Image class="weui-uploader__img" 
                      mode='aspectFit' 
                      src={IMG_HOST + item} 
                      data-src={item} 
                      data-index={index}
                      onClick={() => {
                        Taro.previewImage({
                          current: IMG_HOST + item,
                          urls: beforeImage.map(img => IMG_HOST + img)
                        })
                      }}></Image>
                    {/* <Text className='iconfont icon-shanchu delete' onClick={ this.deleteImg(index) }></Text> */}
                  </View>
                )
              })}
            {/* 本地新增的照片 */}
              {voucherImage.map((item, index) => {
                return (
                  <View class="weui-uploader__file">
                    <Image class="weui-uploader__img" 
                      mode='aspectFit' 
                      src={IMG_HOST + item} 
                      data-src={item} 
                      data-index={index}
                      onClick={() => {
                        Taro.previewImage({
                          current: IMG_HOST + item,
                          urls: voucherImage.map(img => IMG_HOST + img)
                        })
                      }}></Image>
                    <Text className='iconfont icon-shanchu delete' onClick={ this.deleteImg(index) }></Text>
                  </View>
                )
              })}
            </View>
            {voucherImage.length + beforeImage.length < 9 && (
              <View className="weui-uploader__input-box ">
                <View className="weui-uploader__input" onClick={this.chooseImage}></View>
              </View>
            )}
          </View>
          {/* <AtImagePicker
            mode='aspectFit'
            length={4}
            count={Math.abs(voucherImage.length - 9)}
            files={this.state.files}
            onChange={this.onChange.bind(this)}
          /> */}
        </View>
        <View className='set'>
          <Textarea cols="20" maxlength='300' value={storeRemark} placeholder='填写您要备注的内容吧~（限300字）' onInput={this.getTxt}></Textarea>
          <View className='btn' onClick={this.confirm}>
            <Text>保存</Text>
          </View>
        </View>
      </Block>
    );
  }
}
