
import { Block, View } from '@tarojs/components'
import Taro, { Component } from "@tarojs/taro";
import './editor.scss'
import { IMG_HOST } from "@/config"

class GoodsEditor extends Component {
  config = {
    navigationBarTitleText: "商品详情",
    usingComponents: {
      "my-editor": "../../components/editor/editor"
    }
  }

  state = {
    formats: {},
    readOnly: false,
    editorContent: '',
    iscontent: false,
    imgdata: [],
    voucherImage: []
  }

  componentDidShow() {
    const editorContent = Taro.getStorageSync('editorContent')
    this.setState({ editorContent })
    // if (editorContent) {
    //   WxParse.wxParse('article', 'html', editorContent, this.$scope, 5);
    //   this.setState({ editorContent, iscontent: true })
    // }
  }

  onStatusChange(e) {
    const formats = e.detail
    this.setState({ formats })
  }

  getValue(e) {
    console.log(e.detail.detail)
    let detail = e.detail.detail
    let editorContent = detail.html
    let { voucherImage } = this.state
    let imgdata = []
    if (voucherImage.length > 0) {
      let ops = detail.delta.ops
      ops.map(item => {
        if (item.insert.image) {
          var img = item.insert.image
          imgdata.push(img)
        }
      })
      let newimg = ''
      voucherImage.map((item, index) => {
        newimg = IMG_HOST + item
        imgdata.map((val, idx) => {
          if (index == idx) {
            editorContent = editorContent.replace(val, newimg)
          }
        })
      })
      this.setState({ editorContent, imgdata })
    } else {
      this.setState({ editorContent })
    }
  }

  // 保存
  confirm() {
    let { editorContent } = this.state
    Taro.setStorageSync('editorContent', editorContent)
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000);
  }

  // 修改详情
  insert() {
    this.setState({ iscontent: false, editorContent: '', voucherImage: [] })
  }

  render() {
    return (
      <Block>
        <my-editor onMyinput={this.getValue} content={this.state.editorContent} />
        <View className='btn' onClick={this.confirm}>保存</View>
        {/* {iscontent ? (
          // <View className='Editcontent'>
          //   <import src='../../components/wxParse/wxParse.wxml' />
          //   <template is='wxParse' data='{{wxParseData:article.nodes}}' />
          // </View>
        ) : (
            <View className="container">
              <Editor
                id="editor"
                className="ql-container"
                placeholder={placeholder}
                onInput={this.getValue}
                onStatuschange={this.onStatusChange}
                onReady={this.onEditorReady}
              ></Editor>
            </View>
          )}
        {iscontent ? (
          <View className='btn' onClick={this.insert}>修改</View>
        ) : (
            <View className='btn' onClick={this.confirm}>保存</View>
          )} */}
      </Block>
    )
  }
}

export default GoodsEditor
