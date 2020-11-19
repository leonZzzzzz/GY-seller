import Taro, { Component, Config, startDeviceMotionListening } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./goods-common.scss";
import { uodataPic } from "@/api/login"
// import { listBytype, addGoods, prodLevel } from "@/api/goodsMan"

export default class Index extends Component {
  state = {
    showname: false,
    showValue: false,
    name: '',
    value: '',
    valueData: [''],
    standList: [{ name: '', value: [''] }],
    totaldata: '',
    productItems: []
  };

  componentDidShow() {
    let productParams = Taro.getStorageSync('productParams')
    let standList = Taro.getStorageSync('standList')
    let totaldata = Taro.getStorageSync('totaldata')
    let productItems = Taro.getStorageSync('productItems')
    // 修改商品 ----》 修改规格
    if (productItems && productItems.length > 0) {
      standList = []
      let spec1Name = productItems[0].spec1Name
      let valueList = productItems.map(item => item.spec1Value)
      standList = [{name: spec1Name, value: valueList}]
      console.log(standList)
    }
    this.setState({ productParams, standList: standList ? standList : this.state.standList, totaldata: totaldata ? totaldata : '', productItems })
  }
  
  componentWillUnmount() {}

  getGoodsname(e) {
    this.setState({ name: e.detail.value })
  }
  // 获取规格
  getStandKey(e) {
    this.setState({ spec1Name: e.detail.value })
  }
  // 规格值
  getStandvalue(e) {
    this.setState({ spec1Value: e.detail.value })
  }
  // 售价
  getSell(e) {
    this.setState({ price: e.detail.value })
  }
  // 库存
  getrepert(e) {
    this.setState({ qty: e.detail.value })
  }
  // 重量
  getWeight(e) {
    this.setState({ weight: e.detail.value })
  }
  // 成本价
  getSupper(e) {
    this.setState({ supplierPrice: e.detail.value })
  }
  // 原价
  orignPrice(e) {
    this.setState({ origPrice: e.detail.value })
  }
  // 最低起订量
  getLowest(e) {
    this.setState({ minOrderQuantity: e.detail.value })
  }
  // 商品编码
  getCode(e) {
    this.setState({ number: e.detail.value })
  }
  // 卖点
  getsellPoint(e) {
    this.setState({ introduce: e.detail.value })
  }
  //  显示库存
  switch1Change(e) {
    this.setState({ isQtyDisplay: e.detail.value })
  }
  // 是否显示销量
  switch2Change(e) {
    this.setState({ isSalesQtyDisplay: e.detail.value })
  }
  // 选择开售日期
  onDateChange(e) {
    this.setState({ startTime: e.detail.value, startTxt: true })
  }
  // 选择开售时间
  onDateChangetime(e) {
    this.setState({ times: e.detail.value, timeTxt: true })
  }
  // 添加规格
  addCommon() {
    this.setState({ showname: true, valueData: [''] })
  }

  // 输入规格名
  getspacName(e) {
    let { standList } = this.state
    let { oneindex } = e.currentTarget.dataset
    standList[oneindex].name = e.detail.value
    this.setState({ standList })
  }
  // 输入规格值
  getspacValue(e) {
    let { standList } = this.state
    let value = e.detail.value
    let { index, oneindex } = e.currentTarget.dataset
    standList[oneindex].value[index] = value
    // valueData[index] = value
    this.setState({ standList })
  }
  // 新增规格值
  evenValue(standidx) {
    const { standList } = this.state
    var a = ''
    standList[standidx].value.push(a)
    this.setState({ standList })
  }


  // 新建规格名
  // clickAddName() {
  //   const name = this.state.name
  //   if (!name) {
  //     Taro.showToast({
  //       title: '请填写规格名',
  //       icon: 'none'
  //     })
  //     return
  //   }
  //   this.setState({ showname: false, showValue: true, valueData: [] })
  // }
  hideName() {
    this.setState({ showname: false })
  }
  // hideValue() {
  //   this.setState({ showValue: false })
  // }
  // 新建规格值
  // clickAddValue() {
  //   const { value, valueData } = this.state
  //   if (!value) {
  //     Taro.showToast({
  //       title: '请填写规格值',
  //       icon: 'none'
  //     })
  //     return
  //   }
  //   valueData.push(value)
  //   this.setState({ valueData, value: '' })
  // }

  // 添加规格
  preserve() {
    const { name, valueData, standList } = this.state
    var b = { name: '', value: [''] }
    standList.push(b)
    this.setState({ standList })
    console.log(standList)
  }
  // 删除规格
  cancelList(index) {
    const { standList } = this.state
    if (standList.length < 2) {
      // this.setState({ showname: false })
      Taro.showToast({
        title: '至少保留一组规格',
        icon: 'none'
      })
    } else {
      standList.splice(index, 1)
      this.setState({ standList })
    }
    console.log(standList)
  }
  // 保存
  conserve() {
    const { standList } = this.state
    let a = 0, b = 0, length = 0
    standList.map(item => {
      if (item.name) {
        a++
      }
      length += item.value.length
      item.value.map(list => {
        if (list) {
          b++
        }
      })
    })
    if (a < standList.length) {
      Taro.showToast({
        title: '请填写规格名',
        icon: 'none'
      })
      return
    }
    if (b < length) {
      Taro.showToast({
        title: '您还有请规格值未填写',
        icon: 'none'
      })
      return
    }
    // let valueList:Array<string> = standList[0].value
    let productItems = this.state.productItems
    // if (valueList.length > productItems.length) {
    //   for (let i = productItems.length; i++; i > valueList.length) {
    //     let valueItem = valueList[i]
    //     productItems.push({spec1Name: standList[0].name, spec1Value: valueItem})
    //   }
    // } 
    // if (valueList.length < productItems.length) {
    //   productItems.splice(-1, productItems.length - valueList.length)
    //   // for (let i = productItems.length; i--; i<= valueList.length) {
    //   //   productItems.splice(i, 1)
    //   // }
    // }
    // Taro.setStorageSync('productItems', productItems)
    this.setState({ standList, showValue: false, showname: false, name: '', value: '', valueData: [], productItems })
  }

  // 设置规格明细
  goDetailList() {
    const standList = this.state.standList
    Taro.setStorageSync('standList', standList)
    Taro.navigateTo({
      url: '../stand-detail/stand-detail?standList=' + JSON.stringify(standList),
      success: () => {
        // Taro.removeStorage({ key: 'totaldata'})
        // Taro.removeStorage({key: 'productItems'})
      }
    })
  }
  // 删除规格
  deletalist(index) {
    let standList = this.state.standList
    standList.splice(index, 1)
    if (!JSON.stringify(standList[0])) {
      standList = [{ name: '', value: [''] }]
    }
    this.setState({ standList, totaldata: '' })
  }
  // 删除规格值
  cancelDelete(standidx, itemindex) {
    const { standList } = this.state
    let value = standList[standidx].value
    if (value.length < 2) {
      Taro.showToast({
        title: '规格最少需要一个属性值',
        icon: 'none'
      })
      return
    }
    value.splice(itemindex, 1)
    // valueData.splice(index, 1)
    this.setState({ standList })
  }

  config: Config = {
    navigationBarTitleText: "规格商品"
  };
  render() {
    const { showname, standList, totaldata } = this.state
    return (
      <Block>
        {standList[0].name && (
          <View className='common'>
            {standList.map((item, index) => {
              return (
                <Block>
                  {item.name && (
                    <View className='content'>
                      <View className='common-row'>
                        <View className='common-row-key'>规格名</View>
                        <View className='common-row-name'>{item.name}</View>
                      </View>
                      <View className='common-row'>
                        <View className='common-row-key'>规格值</View>
                        <View className='common-row-name'>
                          {item.value.map((val, index) => {
                            return (
                              <View className='common-val'>{val},</View>
                            )
                          })}
                        </View>
                      </View>
                      <View className='common-row' onClick={() => { this.deletalist(index) }}>
                        <Image className='common-row-img' src={wx.getStorageSync('imgHostItem')+'cancel.png'}></Image>
                        <View>删除</View>
                      </View>
                    </View>
                  )}
                </Block>
              )
            })}

            <View className='tip'>设置库存/价格等规格明细</View>
            {totaldata ? (
              <View className='common-row' onClick={this.goDetailList}>
                <View className='common-row-key'>规格明细</View>
                <View className='install'>
                  <View>已设置，点击查看</View>
                  <View className='qcfont qc-icon-chevron-right'></View>
                </View>
              </View>
            ) : (
                <View className='common-row' onClick={this.goDetailList}>
                  <View className='common-row-key'>规格明细</View>
                  <View className='install'>
                    <View>请设置</View>
                    <View className='qcfont qc-icon-chevron-right'></View>
                  </View>
                </View>
              )}
          </View>
        )}

        {standList.length < 4 && (
          <View className='adds' onClick={this.addCommon}>
            <Image src={wx.getStorageSync('imgHostItem')+'gy-icon_111.png'}></Image>
            <Text>添加规格</Text>
          </View>
        )}

        {/* 规格名model */}
        {showname && (
          <View className='spacname'>
            <View className='spac-model'></View>
            <View className='space-enter'>
              <View className='space-title'>
                <View className='space-title-a'>新建规格</View>
                <View onClick={this.hideName}>X</View>
              </View>
              {standList.map((stand, standidx) => {
                return (
                  <View className='speclist'>
                    {/* <Image onClick={() => { this.cancelList(standidx) }} src={wx.getStorageSync('imgHostItem')+'cancel.png'}></Image> */}
                    <View style='width:650rpx'>
                      <View className='space-input'>
                        <Text>规格名:</Text>
                        <Input placeholder='输入规格名' data-oneindex={standidx} value={stand.name} onBlur={this.getspacName}></Input>
                      </View>
                      <View className='space-input'>
                        <Text>规格值:</Text>
                        <View className='valuelist'>
                          {stand.value.map((item, itemindex) => {
                            return (
                              <View className='valuelist-val'>
                                <Input placeholder='输入规格值' data-index={itemindex} data-oneindex={standidx} value={item} onInput={this.getspacValue}></Input>
                                <Image onClick={() => { this.cancelDelete(standidx, itemindex) }} src={wx.getStorageSync('imgHostItem')+'cancel.png'}></Image>
                              </View>
                            )
                          })}
                          {/* <View className='addValue' onClick={() => { this.evenValue(standidx) }}>+</View> */}
                          <View className='addValue' onClick={() => { this.evenValue(standidx) }} >+ 规格值</View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
              {standList.length < 1 && (
                <Text onClick={this.preserve} className='addspec'>添加规格</Text>
              )}

              {/* <View className='nameBtn' onClick={this.clickAddName}>新建该规格名</View> */}
              <View className='valueBtn' onClick={this.conserve}>保存</View>
            </View>
          </View>
        )}

        {/* {showValue && (
          <View className='spacname'>
            <View className='spac-model'></View>
            <View className='space-enter'>
              <View className='space-title'>
                <View className='space-title-a'>新建规格值</View>
                <View onClick={this.hideValue}>X</View>
              </View>
              <View className='space-input'>
                <Input placeholder='输入规格值' value={value} onInput={this.getspacValue}></Input>
              </View>
              {valueData.length > 0 && (
                <View className='spacevalue'>
                  {valueData.map((item, itemindex) => {
                    return (
                      <View className='spacerow'>
                        <Text>{item}</Text>
                        <Image onClick={() => { this.cancelDelete(itemindex) }} src={wx.getStorageSync('imgHostItem')+'cancel.png'}></Image>
                      </View>
                    )
                  })}
                </View>
              )}
              <View className='nameBtn' onClick={this.clickAddValue}>新建该规格值</View>
              <View className='valueBtn' onClick={this.conserve}>保存</View>
            </View>
          </View>
        )} */}
      </Block>
    );
  }
}
