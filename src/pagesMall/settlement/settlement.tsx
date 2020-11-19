import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./settlement.scss";
import { settlementAmount } from "@/api/store"

export default class Index extends Component {

  state = {
    pageNum: 1,
    lists: [],
    array: [],
    isport: false
  };
  componentDidShow() {
    this.setState({ pageNum: 1 })
    Taro.showLoading()
    this.getlist()
  }
  getlist = async () => {
    const params = { pageNum: this.state.pageNum, pageSize: 15 }
    const res = await settlementAmount(params)
    Taro.hideLoading()
    this.setState({ isport: true })
    if (res.data.code == 20000) {
      const array = res.data.data.list
      const lists = this.state.lists
      if (array.length > 0) {
        array.map(item => {
          // item.amount = Number(item.nowPrice) - Number(item.supplierPrice)
          item.needPayAmount = parseFloat(item.needPayAmount / 100).toFixed(2)
          item.orderChargeAmount = parseFloat(item.orderChargeAmount / 100).toFixed(2)
          lists.push(item)
        })
      }
      this.setState({ lists })
    }
  }
  onReachBottom() {
    this.state.pageNum++
    this.getlist()
  }
  config: Config = {
    navigationBarTitleText: "待结算金额明细"
  };
  render() {
    const { isport, lists } = this.state
    return (
      <Block>
        {isport && (
          <Block>
            {lists.length > 0 ? (
              <Block>
                {lists.map(item => {
                  return (
                    <View className='account'>
                      <View className='account-list left'>
                        <Text>{item.name}</Text>
                        <Text>{item.type}</Text>
                      </View>
                      <View className='account-list'>
                        <Text>{item.needPayAmount} 元</Text>
                        <Text className='list-b'>交易服务费：{item.orderChargeAmount}元</Text>
                        <Text>{item.createTime}</Text>
                      </View>
                    </View>
                  )
                })}
              </Block>
            ) : (
                <View className="no-data-view">
                  <Image
                    src={require("../../images/item/qt_89.png")}
                    mode="widthFix"
                    className="no-data-image"
                  ></Image>
                  <View className="mText" className="no-data-text">
                    暂无明细
                    </View>
                </View >
              )}
          </Block>
        )}
      </Block>
    );
  }
}
