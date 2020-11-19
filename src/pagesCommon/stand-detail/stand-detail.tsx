import Taro, { Component, Config, startDeviceMotionListening } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Input,
  Picker
} from "@tarojs/components";
import "./stand-detail.scss";
import utils from '@/utils/utils'

export default class Index extends Component {
  state = {
    units: ['斤', '件', '袋', '箱', '瓶', '包'],
    standList: [],
    newstandlist: [],
    array: {},
    saveList: [],
    totaldata: [],
    productItems: [],
    onlist: false,
    unit: '斤'
  };
  componentDidShow() {
    console.log('componentDidShow')
    let standList = this.$router.params.standList
    if (standList && standList != 'undefined') {
      standList = JSON.parse(standList)
      this.setState({ standList })
    }
    // 新增规格时查看规格
    const totaldata = Taro.getStorageSync('totaldata')
    if (totaldata) {
      totaldata.map(item => {
        item.price = Number(item.price / 100)
        item.origPrice = Number(item.origPrice / 100)
        item.supplierPrice = Number(item.supplierPrice / 100)
        item.weight = Number(item.weight / 1000)
      })
      this.setState({ totaldata, saveList: totaldata, newstandlist: totaldata })
    } else {
      if (standList && standList != 'undefined') {
        this.getCircul(standList)
      }
    }

    //编辑规格明细时的数据
    // let productItems = this.$router.params.productItems
    let productItems = Taro.getStorageSync('productItems')
    const { saveList } = this.state
    if (productItems && productItems != 'undefined') {
      // productItems = JSON.parse(productItems)
      productItems.map(item => {
        let a = {}
        item.price = Number(item.price / 100)
        item.origPrice = Number(item.origPrice / 100)
        item.supplierPrice = Number(item.supplierPrice / 100)
        item.weight = Number(item.weight / 1000)
        // item.minOrderQuantity = Number(item.lockVersion / 1000)
        a.price = item.price
        a.origPrice = item.origPrice
        a.supplierPrice = item.supplierPrice
        a.weight = item.weight
        a.minOrderQuantity = item.minOrderQuantity
        a.number = item.number
        a.qty = item.qty
        saveList.push(a)
      })
      this.setState({ productItems, newstandlist: productItems, saveList: productItems })
    }
  } 

  componentWillUnmount() {
    // Taro.removeStorage({key: 'standList'})
    // Taro.removeStorage({key: 'productItems'})
    // Taro.removeStorage({ key: 'totaldata'})
  }

  getCircul(list) {
    if (list[0].value) {
      list = list.map(e => {
        return e = e.value
      })
    }
    if (list.length == 1) {
      this.setState({ newstandlist: list[0] })
      // return list[0];
    } else if (list.length == 2) {
      let newlist = []
      for (let i = 0; i < list[0].length; i++) {
        for (let k = 0; k < list[1].length; k++) {
          newlist.push([].concat(list[0][i], list[1][k]))
        }
      }
      list[0] = newlist
      list.splice(1, 1)
      this.setState({ newstandlist: list[0] })
    } else if (list.length == 3) {
      let newlist = []
      for (let i = 0; i < list[0].length; i++) {
        for (let k = 0; k < list[1].length; k++) {
          for (let j = 0; j < list[2].length; j++) {
            newlist.push([].concat(list[0][i], list[1][k], list[2][j]))
          }
        }
      }
      list[0] = newlist
      list.splice(1, 1)
      this.setState({ newstandlist: list[0] })
    } else if (list.length == 4) {
      let newlist = []
      for (let i = 0; i < list[0].length; i++) {
        for (let k = 0; k < list[1].length; k++) {
          for (let j = 0; j < list[2].length; j++) {
            for (let m = 0; m < list[3].length; m++) {
              newlist.push([].concat(list[0][i], list[1][k], list[2][j], list[3][m]))
            }

          }
        }
      }
      list[0] = newlist
      list.splice(1, 1)
      this.setState({ newstandlist: list[0] })
    }
    console.log(list[0])
    const array = list[0]
    if (typeof array[0] == 'string') {
      this.setState({ onlist: true })
    } else {
      this.setState({ onlist: false })
    }
    const length = Number(list[0].length)
    const saveList = new Array(length).join(',').split(',')
    saveList.map((item, index) => {
      item = "{" + item + "}"
      item = JSON.parse(item)
      item.unit = '斤'
      saveList.push(item)
    })
    const len = saveList.length / 2
    this.setState({ saveList: saveList.slice(-len) })
    console.log(saveList.slice(-len))
  }
  // 单位
  // getUnit(e, index, val) {
  // const { array, saveList } = this.state
  // array.index = index
  // const unit = e.detail.value
  // saveList[index].unit = unit
  // this.setState({ saveList, unit })
  // }
  chooseunit(e) {
    const index = e.currentTarget.dataset.vindex
    // const val = e.currentTarget.dataset.val
    const { array, saveList, units } = this.state
    array.index = index
    const unitindex = e.detail.value
    const unit = units[unitindex]
    saveList[index].unit = unit
    this.setState({ saveList, unit })
    console.log(saveList)
  }
  // 售价
  getSell(e, index, val) {
    const { array, saveList } = this.state
    array.index = index
    const price = e.detail.value
    saveList[index].price = price
    saveList[index].seqNum = index
    if (typeof val == 'string') {
      saveList[index].spec1Value = val
    } else {
      if (val.length == 2) {
        saveList[index].spec1Value = val[0]
        saveList[index].spec2Value = val[1]
      } else if (val.length == 3) {
        saveList[index].spec1Value = val[0]
        saveList[index].spec2Value = val[1]
        saveList[index].spec3Value = val[2]
      } else if (val.length == 4) {
        saveList[index].spec1Value = val[0]
        saveList[index].spec2Value = val[1]
        saveList[index].spec3Value = val[2]
        saveList[index].spec4Value = val[3]
      }
    }
    this.setState({ saveList })
  }
  // 库存
  getrepert(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const qty = e.detail.value
    saveList[index].qty = qty
    this.setState({ saveList })
  }
  // 重量
  getWeight(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const weight = e.detail.value
    saveList[index].weight = weight
    this.setState({ saveList })
  }
  // 成本价
  getSupper(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const supplierPrice = e.detail.value
    saveList[index].supplierPrice = supplierPrice
    this.setState({ saveList })
  }
  // 原价
  orignPrice(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const origPrice = e.detail.value
    saveList[index].origPrice = origPrice
    this.setState({ saveList })
  }
  // 最低起订量
  getLowest(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const minOrderQuantity = e.detail.value
    saveList[index].minOrderQuantity = minOrderQuantity
    this.setState({ saveList })
  }
  // 商品编码
  getCode(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const number = e.detail.value
    saveList[index].number = number
    this.setState({ saveList })
  }

  // 保存
  confirm() {
    const { standList, saveList } = this.state
    console.log(saveList)
    let arrayItem = {}
    let a = 0
    saveList.map(item => {
      item.price = utils.mul(item.price, 100)
      item.origPrice = utils.mul(item.origPrice, 100)
      item.supplierPrice = utils.mul(item.supplierPrice, 100)
      if (item.unit == '斤') {
        item.weight = 500
      } else {
        item.weight = utils.mul(item.weight, 1000)
      }

      if (!item.number) {
        item.number = '0'
      }
      if (standList.length == 1) {
        item.spec1Name = standList[0].name
        arrayItem.spec1Name = standList[0].name
        arrayItem.spec1Value = (standList[0].value).join('_')
      }
      if (standList.length == 2) {
        item.spec1Name = standList[0].name
        item.spec2Name = standList[1].name
        arrayItem.spec1Name = standList[0].name
        arrayItem.spec2Name = standList[1].name
        arrayItem.spec1Value = (standList[0].value).join('_')
        arrayItem.spec2Value = (standList[1].value).join('_')
      }
      if (standList.length == 3) {
        item.spec1Name = standList[0].name
        item.spec2Name = standList[1].name
        item.spec3Name = standList[2].name
        arrayItem.spec1Name = standList[0].name
        arrayItem.spec2Name = standList[1].name
        arrayItem.spec3Name = standList[2].name
        arrayItem.spec1Value = (standList[0].value).join('_')
        arrayItem.spec2Value = (standList[1].value).join('_')
        arrayItem.spec3Value = (standList[2].value).join('_')
      }
      if (standList.length == 4) {
        item.spec1Name = standList[0].name
        item.spec2Name = standList[1].name
        item.spec3Name = standList[2].name
        item.spec4Name = standList[3].name
        arrayItem.spec1Name = standList[0].name
        arrayItem.spec2Name = standList[1].name
        arrayItem.spec3Name = standList[2].name
        arrayItem.spec4Name = standList[3].name
        arrayItem.spec1Value = (standList[0].value).join('_')
        arrayItem.spec2Value = (standList[1].value).join('_')
        arrayItem.spec3Value = (standList[2].value).join('_')
        arrayItem.spec4Value = (standList[3].value).join('_')
      }

      // item.price = Number(item.price * 100)
      // item.origPrice = Number(item.origPrice * 100)
      // item.supplierPrice = Number(item.supplierPrice * 100)

      if (item.price && item.qty && item.weight && item.supplierPrice >= 0 && item.unit) {
        a++
      }
      if (a < saveList.length) {
        Taro.showToast({
          title: '还有信息没有填写完整喔~',
          icon: 'none'
        })
        return
      } else {
        Taro.setStorageSync('totaldata', saveList)
        Taro.setStorageSync('arrayItem', arrayItem)
        Taro.showToast({
          title: '保存成功',
          icon: 'none'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1000);
      }

      // if (!item.price || !item.qty || !item.weight || !item.supplierPrice) {
      //   Taro.showToast({
      //     title: '还有信息没有填写完整喔~',
      //     icon: 'none'
      //   })
      // } else {
      //   Taro.setStorageSync('totaldata', saveList)
      //   Taro.setStorageSync('arrayItem', arrayItem)
      //   Taro.showToast({
      //     title: '保存成功',
      //     icon: 'none'
      //   })
      //   setTimeout(() => {
      //     Taro.navigateBack()
      //   }, 1000);
      // }
    })
  }
  config: Config = {
    navigationBarTitleText: "规格明细"
  };
  render() {
    const { newstandlist, standList, totaldata, onlist, saveList } = this.state
    return (
      <View className="add-a">
        <View>
          {newstandlist.map((val, valindex) => {
            return (
              <View className='sku-row'>
                <View className='common-title'>
                  {totaldata.length > 0 ? (
                    <Block>
                      <View className='val-col'>
                        <View>  {val.spec1Name} ： </View>
                        {val.spec2Name && (
                          < View>  {val.spec2Name} : </View>
                        )}
                        {val.spec3Name && (
                          < View>  {val.spec3Name} : </View>
                        )}
                        {val.spec4Name && (
                          < View>  {val.spec4Name} : </View>
                        )}
                      </View>
                      <View className='val-col'>
                        <View style="color:#FF671E">  {val.spec1Value}</View>
                        {val.spec2Value && (
                          <View style="color:#FF671E">  {val.spec2Value}</View>
                        )}
                        {val.spec3Value && (
                          <View style="color:#FF671E">  {val.spec3Value}</View>
                        )}
                        {val.spec4Value && (
                          <View style="color:#FF671E">  {val.spec4Value}</View>
                        )}
                      </View>
                    </Block>
                  ) : (
                      <Block>
                        {productItems.length == 0 ? (//正常新增规格
                          <Block>
                            <View className='val-col'>
                              {standList.map((item, itemindex) => {
                                return (
                                  <View>{item.name}：</View>
                                )
                              })}
                            </View>
                            {onlist ? (
                              <View style="color:#FF671E">{val}</View>
                            ) : (
                                <View className='val-col'>
                                  {val.map(v => {
                                    return (
                                      <View style="color:#FF671E">{v}</View>
                                    )
                                  })}
                                </View>
                              )}
                          </Block>
                        ) : (//编辑规格
                            <Block>
                              <View className='val-col'>
                                <View>  {val.spec1Name} ： </View>
                                {val.spec2Name && (
                                  < View>  {val.spec2Name} : </View>
                                )}
                                {val.spec3Name && (
                                  < View>  {val.spec3Name} : </View>
                                )}
                                {val.spec4Name && (
                                  < View>  {val.spec4Name} : </View>
                                )}
                              </View>
                              <View className='val-col'>
                                <View style="color:#FF671E">  {val.spec1Value}</View>
                                {val.spec2Value && (
                                  <View style="color:#FF671E">  {val.spec2Value}</View>
                                )}
                                {val.spec3Value && (
                                  <View style="color:#FF671E">  {val.spec3Value}</View>
                                )}
                                {val.spec4Value && (
                                  <View style="color:#FF671E">  {val.spec4Value}</View>
                                )}
                              </View>
                            </Block>
                          )}
                      </Block>
                    )}
                </View>
                <View className='goods'>
                  <Text>单位</Text>
                  <View className='order-write'>
                    <Picker style='width:100%' mode='selector' range={units} data-vindex={valindex} data-val={val} onChange={(e) => { this.chooseunit(e) }}>
                      {saveList[valindex].unit ? (
                        <View style='width:100%' className='picker'>{saveList[valindex].unit}</View>
                      ) : (
                          <View style='width:100%' className='picker'>请选择</View>
                        )}
                    </Picker>
                    {/* <Input placeholder='不填默认为斤' type='digit' placeholderClass='place' value={val.unit} onInput={(e) => (this.getUnit(e, valindex, val))}></Input> */}
                  </View>
                </View>
                <View className='goods'>
                  <Text><Text className='red'>*</Text>售价</Text>
                  <View className='order-write'>
                    <Input placeholder='请输入售价' type='digit' placeholderClass='place' value={val.price} onBlur={(e) => (this.getSell(e, valindex, val))}></Input>
                    <View>元/{saveList[valindex].unit}</View>
                  </View>
                </View>
                <View className='goods'>
                  <Text><Text className='red'>*</Text>库存</Text>
                  <View className='order-write'>
                    <Input placeholder='请输入库存' type='number' placeholderClass='place' value={val.qty} onInput={(e) => (this.getrepert(e, valindex))}></Input>
                    <View>{saveList[valindex].unit}</View>
                  </View>
                </View>
                {saveList[valindex].unit != '斤' && (
                  <View className='goods'>
                    <Text><Text className='red'>*</Text>重量</Text>
                    <View className='order-write'>
                      <Input placeholder='用于计算配送物流费' diabled type='digit' placeholderClass='place' value={val.weight} onInput={(e) => (this.getWeight(e, valindex))}></Input>
                      <View>公斤/{saveList[valindex].unit}</View>
                    </View>
                  </View>
                )}

                <View className='goods'>
                  <Text><Text className='red'>*</Text>成本价</Text>
                  <View className='order-write'>
                    <Input placeholder='请输入成本价' type='digit' placeholderClass='place' value={val.supplierPrice} onInput={(e) => (this.getSupper(e, valindex))}></Input>
                    <View>元/{saveList[valindex].unit}</View>
                  </View>
                </View>
                <View className='goods'>
                  <Text>原价</Text>
                  <View className='order-write'>
                    <Input placeholder='请输入原价' type='digit' placeholderClass='place' value={val.origPrice} onInput={(e) => (this.orignPrice(e, valindex))}></Input>
                    <View>元/{saveList[valindex].unit}</View>
                  </View>
                </View>
                <View className='goods'>
                  <Text>最低起订量</Text>
                  <View className='order-write'>
                    <Input placeholder='请输入数量' type='number' placeholderClass='place' value={val.minOrderQuantity} onInput={(e) => (this.getLowest(e, valindex))}></Input>
                    <View>{saveList[valindex].unit}</View>
                  </View>
                </View>
                <View className='goods'>
                  <Text>商品编码</Text>
                  <View className='order-write'>
                    <Input placeholder='如不输入系统将自动生成' type='number' placeholderClass='place' value={val.number} onInput={(e) => (this.getCode(e, valindex))}></Input>
                  </View>
                </View>
                {/* <View className='bc' onClick={() => { this.save(valindex, val) }}>保存</View> */}
              </View>
            )
          })}
        </View>
        <View style='height:100px;'></View>
        {/* {productItems.length == 0 && ( */}
        <View className='save' onClick={this.confirm}>保存</View>
        {/* )} */}
      </View>
    );
  }
}
