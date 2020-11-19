import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Input,
  Label,
  Radio,
  RadioGroup
} from "@tarojs/components";
import "./alter.scss";
import { adjust } from "@/api/order"
import utils from '@/utils/utils'

export default class Index extends Component {
  state = {
    total: '', trans: '', id: '', type: '', price: '', newtotal: ''
  };
  componentDidMount() {
    Taro.setStorageSync('isalterRep', 'yes')
    console.log(this.$router.params)
    const { total, trans, id } = this.$router.params
    this.setState({ total, trans, id, newtotal: total })
  }
  singlechange(e) {
    this.setState({ type: e.detail.value })
  }
  // 降价金额
  getedprice(e) {
    let price = e.detail.value
    let { total } = this.state
    price = utils.mul(price, 100)
    total = utils.mul(total, 100)
    total = total - price
    this.setState({ price, newtotal: parseFloat(total / 100).toFixed(2) })
  }
  // 涨价金额
  getaddprice(e) {
    let price = e.detail.value
    let { total } = this.state
    price = utils.mul(price, 100)
    total = utils.mul(total, 100)
    total = total + price
    this.setState({ price, newtotal: parseFloat(total / 100).toFixed(2) })
  }
  // 确认
  async getSave() {
    let { type, price, id } = this.state
    price = parseInt(price)
    if (type < 0) {
      price = '-' + price
    } else {
      price = '+' + price
    }
    const params = { id, adjustAmount: price }
    const res = await adjust(params)
    if (res.data.code == 20000) {
      Taro.setStorageSync('isalterRep', 'no')
      Taro.showToast({
        title: ' 改价成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }
  config: Config = {
    navigationBarTitleText: "修改价格"
  };
  render() {
    return (
      <Block>
        <View className='content'>
          <View className='shop-t'>商品总价：<Text style='font-weight:bold;color:#FF671E;margin-left:10rpx;'>￥{total}</Text></View>
          <RadioGroup onChange={this.singlechange}>
            <Label className='radio-list__label '>
              <View className="the_list_label">
                <View>
                  <Radio className='radio-list__radio' value='-1'></Radio>
                  <Text>降价</Text>
                </View>
                <Input placeholder='请输入金额' type='digit' onInput={this.getedprice}></Input>
              </View>
            </Label>
            <Label className='radio-list__label '>
              <View className="the_list_label">
                <View>
                  <Radio className='radio-list__radio' value='1'></Radio>
                  <Text>涨价</Text>
                </View>
                <Input placeholder='请输入金额' type='digit' onInput={this.getaddprice}></Input>
              </View>
            </Label>
          </RadioGroup>
          <View className='shop-t borno'>快递费：￥{trans} <Text style='color:#999;'> (丰盈配送不能修改)</Text></View>

        </View>
        <View className='shop-r'>总计：<Text style='color:#FF671E;font-weight:bold;'>￥{newtotal}</Text></View>
        <View className='btn' onClick={this.getSave}>
          <Text>确定修改</Text>
        </View>
      </Block>
    );
  }
}
