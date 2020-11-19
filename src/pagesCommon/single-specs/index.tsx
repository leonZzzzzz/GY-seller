import Taro, { Component, Config, } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Input,
  Picker,
  Image
} from "@tarojs/components";
import "./index.scss";
import utils from '@/utils/utils'

export default class Index extends Component {
  state = {
    units: ['斤', '件', '袋', '箱', '瓶', '包', '个', '盒', '罐'],
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
    // let standList = this.$router.params.standList
    // if (standList && standList != 'undefined') {
    //   standList = JSON.parse(standList)
    //   this.setState({ standList })
    // }
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
      return
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
    }
    this.setState({ saveList })
  }
  // 规格名
  inputSpecsName(e, index) {
    const { array, saveList } = this.state
    // array.index = index
    const spec1Name = e.detail.value
    // saveList[index].spec1Name = spec1Name
    saveList.map(item => {
      item.spec1Name = spec1Name
    })
    this.setState({ saveList })
  }

  // 规格值
  inputSpecsValue(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const spec1Value = e.detail.value
    saveList[index].spec1Value = spec1Value
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
    // const {standList, saveList } = this.state
    let saveList = JSON.parse(JSON.stringify(this.state.saveList))
    console.log(saveList)
    let arrayItem = {}
    if (saveList.length === 0) {
      Taro.setStorageSync('totaldata', ['已删除'])
      Taro.setStorageSync('arrayItem', arrayItem)
      Taro.showToast({
        title: '保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 500);
    }
    let a = 0
    let flag = true;
    saveList.map(item => {
      item.price = utils.mul(item.price, 100)
      item.origPrice = utils.mul(item.origPrice, 100)
      item.supplierPrice = utils.mul(item.supplierPrice, 100)
      item.qty = Number(item.qty)
      if (item.unit == '斤') {
        item.weight = 500
      } else {
        item.weight = utils.mul(item.weight, 1000)
      }

      if (!item.minOrderQuantity && item.minOrderQuantity !== 0) {
        item.minOrderQuantity = 1
      }

      if (!item.origPrice) {
        item.origPrice = 0
      }

      if (!item.number) {
        item.number = '0'
      }
      if (saveList.length > 0) {
        arrayItem.spec1Name = saveList[0].spec1Value
        let valueList = saveList.map(value => value.spec1Value)
        arrayItem.spec1Value = valueList.join('_')
      }
      // item.price = Number(item.price * 100)
      // item.origPrice = Number(item.origPrice * 100)
      // item.supplierPrice = Number(item.supplierPrice * 100)
      if (!item.spec1Name) {
        Taro.showToast({
          title: '规格名还没填写喔~',
          icon: 'none'
        })
        flag = false
      }
      if (!item.spec1Value) {
        console.log(1111111)
        Taro.showToast({
          title: '规格值还没填写喔~',
          icon: 'none'
        })
        flag = false
      }
      if (item.price && item.qty && item.weight && item.supplierPrice && item.unit) {
        a++
      }
    })
    if (a < saveList.length) {
      Taro.showToast({
        title: '还有信息没有填写完整喔~',
        icon: 'none'
      })
      flag = false
      return
    }
    if (flag) {
      Taro.setStorageSync('totaldata', saveList)
      Taro.setStorageSync('arrayItem', arrayItem)
      Taro.showToast({
        title: '保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500);
    }
  }
  config: Config = {
    navigationBarTitleText: "规格明细"
  };
  render() {
    const { saveList } = this.state
    return (
      <View className="add-a">
        <View>
          {saveList.length > 0 && (
            <View className='specs-name'>
              <Text style='margin-right: 40rpx;'>规格名: </Text>
              <Input style='flex: 1;text-align: left; font-size: 32rpx; color: #333;'
                placeholder='请输入规格名'
                placeholderClass='place'
                value={saveList[0].spec1Name}
                onInput={(e) => { this.inputSpecsName(e, 0) }}
              ></Input>
              {/* onBlur={(e) => (this.inputSpecsName(e, 0))} */}
            </View>
          )}
          {saveList.map((val, valindex) => {
            return (
              <View className='sku-row' key={String(valindex)}>
                <View className='common-title'>
                  <Block>
                    <View className='val-col'>
                      <View className='row-specs-name'>{val.spec1Name} ： </View>
                    </View>
                    <View className='val-col row-specs-value'>
                      {/* <View style="color:#FF671E">{val.spec1Value}</View> */}
                      <Input className='specs-value-input'
                        style="color:#FF671E;"
                        placeholder='请输入规格值'
                        placeholderClass='place'
                        value={val.spec1Value}
                        onBlur={(e) => (this.inputSpecsValue(e, valindex))}></Input>
                      <Image className='delete-img' src={wx.getStorageSync('imgHostItem') + 'cancel.png'} onClick={() => {
                        saveList.splice(valindex, 1)
                        this.setState({ saveList })
                      }}></Image>
                    </View>
                  </Block>
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
                    <Input placeholder='不填写默认为 0' type='digit' placeholderClass='place' value={val.origPrice} onInput={(e) => (this.orignPrice(e, valindex))}></Input>
                    <View>元/{saveList[valindex].unit}</View>
                  </View>
                </View>
                <View className='goods'>
                  <Text>最低起订量</Text>
                  <View className='order-write'>
                    <Input placeholder='不填写默认为 1' type='number' placeholderClass='place' value={val.minOrderQuantity} onInput={(e) => (this.getLowest(e, valindex))}></Input>
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
          {saveList.length > 0 && (
            <View className='addSpecsValue' onClick={() => {
              let spec1NameStr = saveList[0] ? saveList[0].spec1Name : ''
              let unitStr = saveList[0] ? saveList[0].unit : ''
              saveList.push({
                spec1Name: spec1NameStr,
                spec1Value: '',
                unit: unitStr
              })
              this.setState({ saveList: saveList })
            }}>+ 添加规格值</View>
          )}
        </View>
        {saveList.length == 0 && <View className='addSpecsValue' onClick={() => {
          saveList.push({
            spec1Name: '',
            spec1Value: '',
            unit: "斤"
          })
          this.setState({ saveList: saveList })
        }}>+ 添加规格</View>}
        <View style='height:100px;'></View>
        {/* {productItems.length == 0 && ( */}
        <View className='save' onClick={this.confirm}>保存</View>
        {/* )} */}
      </View>
    );
  }
}
