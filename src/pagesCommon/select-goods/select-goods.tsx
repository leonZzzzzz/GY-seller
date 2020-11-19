import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Swiper,
  SwiperItem,
  Navigator
} from "@tarojs/components";
import "./select-goods.scss";
import { goodsList } from "@/api/goodsMan"

export default class Index extends Component {

  state = {
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    pageNum: 1,
    trade: [],
    tradeList: []
  };
  onReachBottom() {
    this.state.pageNum++;
    this.getGoodlist(this.state.pageNum)
  }
  componentDidMount() {
    this.getGoodlist(1)
  }
  getGoodlist = async (pageNum) => {
    const params = {
      pageNum: pageNum, pageSize: 20, salesStatus: 0
    }
    const res = await goodsList(params)
    const tradeList = res.data.data.list
    console.log(tradeList)
    const trade = this.state.trade
    tradeList.map(item => {
      item.price = parseFloat(item.price / 100).toFixed(2)
      trade.push(item)
    })
    this.setState({ tradeList: trade })
  }
  chooseProd(id, name) {
    Taro.setStorageSync('id', id)
    Taro.setStorageSync('name', name)
    Taro.navigateBack({ delta: 1 })
  }
  config: Config = {
    navigationBarTitleText: "选择商品"
  };
  render() {
    const { tradeList } = this.state
    return (
      <View>
        <View className="content">
          <View className='con-list'>
            {tradeList.map(item => {
              return (
                <View className='content-con'>
                  <Image className='order-img' src={imageurl + item.iconUrl}></Image>
                  <View className="order-detail">
                    <Text>{item.name}</Text>
                    {/* <View className="order-price">
                  <Text>规格：10-11斤/件</Text>
                </View> */}
                    <View className='order-name'>
                      <View className="reper">
                        <Text>￥</Text>
                        <Text className="repe-a">{item.price}</Text>
                      </View>
                      <Text className='choose' onClick={() => { this.chooseProd(item.id, item.name) }}>选择</Text>
                    </View>
                  </View>
                </View>
              )
            })}


          </View>
        </View>
      </View>
    );
  }
}
