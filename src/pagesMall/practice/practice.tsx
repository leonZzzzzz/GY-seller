import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./practice.scss";
import { relTotalAmount } from "@/api/store"

export default class Index extends Component {

  state = {
    pageNum: 1
    , lists: [], array: [],
    isport: false
  };
  componentDidMount() {
    this.setState({ pageNum: 1 })
    Taro.showLoading()
    this.getlist()
  }
  getlist = async () => {
    const params = { pageNum: this.state.pageNum, pageSize: 15 }
    const res = await relTotalAmount(params)
    Taro.hideLoading()
    this.setState({ isport: true })
    if (res.data.code == 20000) {
      const array = res.data.data.list
      const lists = this.state.lists
      if (array.length > 0) {
        array.map(item => {
          item.amount = parseFloat(item.amount / 100).toFixed(2)
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
    navigationBarTitleText: "实收金额明细"
  };
  render() {
    const { isport } = this.state
    return (
      <Block>
        {isport && (
          <Block>
            {lists.length > 0 ? (
              <Block>
                {lists.map(item => {
                  return (
                    <View className='account'>
                      <Text>{item.name}</Text>
                      <View className='account-list'>
                        <Text>{item.amount} 元</Text>
                        <Text>{item.payTime}</Text>
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
                  <View className="mText" className="no-data-text">暂无明细 </View>
                </View >
              )}
          </Block>
        )}
      </Block>

    );
  }
}
