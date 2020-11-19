//component/chooseImage/index.js
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtImagePicker, AtButton } from "taro-ui"

class ChooseImage extends Component {

    constructor() {
        super(...arguments);
        this.state = ({
            files: [],
            showUploadBtn: false,
            upLoadImg: []
        })
    }

    componentWillMount() {
        console.log(this.props.chooseImg)
        this.setState({
            files: this.props.chooseImg.files,
            showUploadBtn: this.props.chooseImgshowUploadBtn,
            upLoadImg: this.props.chooseImg.upLoadImg
        })
    }

    componentDidShow() { }

    componentDidHide() { }

    onChange(v, doType, index) { // doType代表操作类型，移除图片和添加图片,index为移除图片时返回的图片下标
        if (doType === 'remove') {
            this.setState((prevState) => {
                let oldSendImg = prevState.upLoadImg
                oldSendImg.splice(oldSendImg[index], 1) // 删除已上传的图片地址
                return ({
                    files: v,
                    upLoadImg: oldSendImg
                })
            }, () => {
                const { files } = this.state
                //this.setFatherUploadSrc()// 设置删除数据图片地址
                if (files.length === 3) {  // 最多三张图片 隐藏添加图片按钮
                    this.setState({
                        showUploadBtn: false
                    })
                } else if (files.length === 0) {
                    this.setState({
                        upLoadImg: []
                    })
                } else {
                    this.setState({
                        showUploadBtn: true
                    })
                }
            })
        } else {
            v.map((item, index) => {
                if (item.url.indexOf(".pdf") > -1 || item.url.indexOf(".PDF") > -1) {
                    v[index].url = require("../../assets/images/PDF.png")
                }
            })
            this.setState(() => {
                return ({
                    files: v
                })
            }, () => {
                const { files } = this.state
                if (files.length === 3) {  // 最多三张图片 隐藏添加图片按钮
                    this.setState({
                        showUploadBtn: false
                    })
                } else {
                    this.setState({
                        showUploadBtn: true
                    })
                }
            })
        }
    }
    // 选择失败回调
    onFail(mes) {
        console.log(mes)
    }
    // 点击图片回调
    onImageClick(index, file) {
        let imgs = []
        this.state.files.map((item, index) => {
            imgs.push(item.file.path)
        })
        if (imgs[index].indexOf(".pdf") > -1 || imgs[index].indexOf(".PDF") > -1) {
            Taro.downloadFile({
                url: imgs[index],
                success: function (res) {
                    let filePath = res.tempFilePath
                    Taro.openDocument({
                        filePath: filePath,
                        success: function (res) {
                            console.log('打开文档成功')
                        }
                    })
                }
            })
        } else {
            Taro.previewImage({
                //当前显示图片
                current: imgs[index],
                //所有图片
                urls: imgs
            })
        }
    }
    toUpload = () => {
        const { files } = this.state
        if (files.length > 0) {
            this.props.onFilesValue(files)
            const rootUrl = get('rootUrl') // 服务器地址
            const cookieData = Taro.getStorageSync('token')  // 图片上传需要单独写入token
            this.uploadLoader({ rootUrl, cookieData, path: files })
        } else {
            Taro.showToast({
                title: '请先点击+号选择图片',
                icon: 'none',
                duration: 2000
            })
        }
    }
    // 上传组件
    uploadLoader = (data) => {
        let that = this
        let i = data.i ? data.i : 0 // 当前所上传的图片位置
        let success = data.success ? data.success : 0//上传成功的个数
        let fail = data.fail ? data.fail : 0;//上传失败的个数
        Taro.showLoading({
            title: `正在上传第${i + 1}张`
        })
        //发起上传
        Taro.uploadFile({
            url: data.rootUrl + '/app/index/uploadFile',
            header: {
                'content-type': 'multipart/form-data',
                'cookie': 'token=' + data.cookieData // 上传需要单独处理cookie
            },
            name: 'file',
            filePath: data.path[i].url,
            success: (resp) => {
                //图片上传成功，图片上传成功的变量+1
                let resultData = JSON.parse(resp.data)
                if (resultData.code === "0") {
                    success++;
                    this.setState((prevState) => {
                        let oldUpload = prevState.upLoadImg
                        oldUpload.push(resultData.data)
                        return ({
                            upLoadImg: oldUpload
                        })
                    }, () => {
                        // setSate会合并所有的setState操作，所以在这里等待图片传完之后再调用设置url方法
                        /*
                        * 该处十分重要
                        **/
                        //this.setFatherUploadSrc()// 设置数据图片地址字段
                    })
                } else {
                    fail++;
                }
            },
            fail: () => {
                fail++;//图片上传失败，图片上传失败的变量+1
            },
            complete: () => {
                Taro.hideLoading()
                i++;//这个图片执行完上传后，开始上传下一张
                if (i == data.path.length) {   //当图片传完时，停止调用
                    Taro.showToast({
                        title: '上传成功',
                        icon: 'success',
                        duration: 2000
                    })
                    console.log('成功：' + success + " 失败：" + fail);
                } else {//若图片还没有传完，则继续调用函数
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadLoader(data);
                }
            }
        })
    }

    render() {
        const { showUploadBtn } = this.state
        return (
            <View>

                <AtImagePicker
                    multiple={false}
                    length={3}  //单行的图片数量
                    files={this.state.files}
                    onChange={this.onChange.bind(this)}
                    onFail={this.onFail.bind(this)}
                    onImageClick={this.onImageClick.bind(this)}
                    showAddBtn={showUploadBtn} //是否显示添加图片按钮
                />
                <AtButton type='primary' className='poof_submit_btn' onClick={this.toUpload}>上传图片</AtButton>
            </View>
        )
    }
}

export default ChooseImage