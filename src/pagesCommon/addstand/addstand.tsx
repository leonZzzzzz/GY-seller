import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./addstand.scss";
import { prodParam } from "@/api/goodsMan"

export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    })
  }
  state = {
    data: [],
    products: [],
    paramValue: '',
    productParams: []
  };
  componentDidMount() {
    const { id, productParams } = this.$router.params
    if (productParams) {
      this.setState({ productParams: JSON.parse(productParams) })
    }
    this.getList(id)
  }
  getList = async (id) => {
    const params = { parentId: 0, categoryId: id }
    const res = await prodParam(params)
    const data = res.data.data
    console.log(data)
    let productParams = Taro.getStorageSync('productParams')
    if (productParams) {
      productParams = productParams
    } else {
      productParams = this.state.productParams
    }
    if (productParams) {
      data.map(item => {
        productParams.map(list => {
          if (item.id == list.paramCategoryId) {
            item.paramValue = list.paramValue
          }
        })
      })
    }
    this.setState({ data })
  }
  getField(e, index) {
    const data = this.state.data
    data[index].paramValue = e.detail.value
    console.log(data)
    this.setState({ data, paramValue: e.detail.value })
  }

  save() {
    const { products, data } = this.state
    console.log
    data.map(item => {
      let list = {}
      if (item.paramValue) {
        list.paramName = item.name
        list.paramValue = item.paramValue
        list.paramCategoryId = item.id
        products.push(list)
      }
    })
    Taro.setStorageSync('productParams', products)
    Taro.navigateBack({ delta: 1 })
  }
  config: Config = {
    navigationBarTitleText: "商品参数"
  };
  render() {
    const { data } = this.state
    return (
      <Block>
        <View className='set'>
          {data.length > 0 ? (
            <Block>
              {data.map((item, index) => {
                return (
                  <View className='set-row'>
                    <Text>{item.name}</Text>
                    <View className='set-input'>
                      <Input placeholder={'请输入' + item.name} value={item.paramValue} onInput={(e) => { this.getField(e, index) }}></Input>
                      {(item.name == '净重' || item.name == '皮重' || item.name == '重量') && (
                        <Text>公斤</Text>
                      )}
                    </View>
                  </View>
                )
              })}
            </Block>
          ) : (
              <View></View>
            )}


          {/* <View className='set-row'>
            <Text>颜色</Text>
            <View className='set-input'>
              <Input placeholder='请输入颜色' onInput={this.getColor}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>皮重</Text>
            <View className='set-input'>
              <Input placeholder='请输入皮重' onInput={this.getTare}></Input>
              <Text>kg</Text>
            </View>
          </View>
          <View className='set-row'>
            <Text>净重</Text>
            <View className='set-input'>
              <Input placeholder='请输入净重' onInput={this.getSuttle}></Input>
              <Text>kg</Text>
            </View>
          </View> */}
          <View className='btn' onClick={this.save}>
            <Text>保存</Text>
          </View>
        </View>
      </Block>
    );
  }
}
