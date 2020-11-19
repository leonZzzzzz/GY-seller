import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Picker, PickerView, PickerViewColumn
} from "@tarojs/components";
import "./account-list.scss";
import { searchlistflow } from "@/api/pay"
import { toPriceYuan } from '@/utils/format'
import data from "@/pagesCommon/store-enter/data";

export default class Index extends Component {

  state = {
    value: '0',
    showpicker: false,
    selector: ['按月选择', '按日选择'],
    selectorChecked: '按月选择',
    startdateSel: '', enddateSel: '',
    monthdateSel: '',
    monthpicker: true, daypicker: false,

    pageNum: '1',
    lists: [],
    collectdata: {}
  };

  // 选择月日
  onChange = e => {
    console.log(e)
    let now = this.state.selector[e.detail.value]
    let monthpicker = false, daypicker = false
    if (now == '按月选择') {
      monthpicker = true,
        daypicker = false
    } else {
      monthpicker = false,
        daypicker = true
    }
    this.setState({
      value: e.detail.value,
      showpicker: true,
      selectorChecked: now,
      monthpicker, daypicker
    })
  }

  // 月份选择
  onmonthChange(e) {
    this.setState({ monthdateSel: e.detail.value })
  }
  // 日期选择
  onstartDateChange = e => {
    this.setState({
      startdateSel: e.detail.value
    })
  }
  onendDateChange = e => {
    this.setState({
      enddateSel: e.detail.value
    })
  }
  // 搜索
  searchData = async () => {
    const { value, selectorChecked, monthdateSel, startdateSel, enddateSel } = this.state
    this.setState({ pageNum: 1, lists: [] })
    this.getlist(1, monthdateSel)
    // let params = {}
    // if (value == '0') {
    //   params = { dateType: 'month', monthTime: monthdateSel + '-01' }
    // } else {
    //   params = { dateType: 'day', startTime: startdateSel, endTime: enddateSel }
    // }
    // const res = await searchlistflow(params)
    // if (res.data.code == 20000) {
    //   const lists = res.data.data.list
    //   if (lists.length > 0) {
    //     lists.map(item => {
    //       item.amount_2 = parseFloat(item.amount / 100).toFixed(2)
    //       if (Number(item.amount) > 0) {
    //         item.amount_2 = '+' + item.amount_2
    //       }
    //     })
    //   }
    //   this.setState({ lists })
    // }
  }

  componentDidMount() {
    var date = new Date();
    var year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month
    } else {
      month = month
    }
    let monthdateSel = year + '-' + month
    this.setState({ monthdateSel })
    this.getlist(this.state.pageNum, monthdateSel)
  }
  getlist = async (pageNum, monthdateSel) => {
    const { value, startdateSel, enddateSel } = this.state
    let params = {}
    if (value == '0') {
      params = { pageNum, dateType: 'month', monthTime: monthdateSel + '-01' }
    } else if (value == '1') {
      params = { pageNum, dateType: 'day', startTime: startdateSel, endTime: enddateSel }
    } else {
      params = { pageNum }
    }
    const res = await searchlistflow(params)
    if (res.data.code == 20000) {
      const data = res.data.data.list
      const lists = this.state.lists
      if (data.length > 0) {
        data.map(item => {
          item.amount_2 = parseFloat(item.amount / 100).toFixed(2)
          if (Number(item.amount) > 0) {
            item.amount_2 = '+' + item.amount_2
          }
          lists.push(item)
        })
      }
      this.setState({ lists, collectdata: res.data.data })
    }
  }
  onReachBottom() {
    this.state.pageNum++;
    this.getlist(this.state.pageNum, this.state.monthdateSel)
  }

  gojump(businessType, type, id, businessId) {
    if (businessType == 'order') {
      if (type == 'merchant_refund') {
        Taro.navigateTo({ url: '../../pagesCommon/dispose-refund/dispose-refund?id=' + id })
      } else if (type == 'income') {
        Taro.navigateTo({ url: '../../pagesCommon/order-detail/order-detail?id=' + businessId })
      }
    }
  }
  config: Config = {
    navigationBarTitleText: "账户金额明细"
  };
  render() {
    let { lists, collectdata } = this.state
    return (
      <Block>
        <View className='pichoose'>
          <Picker mode='selector' className='selector' range={this.state.selector} onChange={this.onChange}>
            <Text className='selectorpicker'>
              {this.state.selectorChecked}
            </Text>
            <Image className='selectorimage' src={Taro.getStorageSync('imgHostItem') + 'qt_111.png'}></Image>
          </Picker>
          {monthpicker && (
            <View>
              <Picker className='daypic-one' mode='date' fields='month' onChange={this.onmonthChange}>
                <View className='picker'>
                  {this.state.monthdateSel ? this.state.monthdateSel : '选择月份'}
                </View>
              </Picker>
            </View>
          )}

          {daypicker && (
            <View className='daypic'>
              <Picker className='daypic-one' mode='date' onChange={this.onstartDateChange}>
                <View className='picker'>
                  {this.state.startdateSel ? this.state.startdateSel : '开始时间'}
                </View>
              </Picker>
              <Text>至</Text>
              <Picker mode='date' className='daypic-one' onChange={this.onendDateChange}>
                <View className='picker'>
                  {this.state.enddateSel ? this.state.enddateSel : '结束时间'}
                </View>
              </Picker>
            </View>
          )}
          {/* {showpicker && (
            <View className='search' onClick={this.searchData}>搜索</View>
          )} */}
          <View className='search' onClick={this.searchData}>搜索</View>
        </View>
        {lists.length > 0 && (
          <View style='display:flex;flex-direction:row;font-size:26rpx;justify-content:space-between;padding:0px 20rpx 20rpx 20rpx'>
            {collectdata.income != 0 && <Text>合计收入：{toPriceYuan(collectdata.income)}</Text>}
            {collectdata.refund != 0 && <Text>合计退款：{toPriceYuan(collectdata.refund)}</Text>}
            {collectdata.withdraw != 0 && <Text>合计提现：{toPriceYuan(collectdata.withdraw)}</Text>}
          </View>
        )}

        {lists.length > 0 ? (
          <Block>
            {lists.map(item => {
              return (
                <View className='account' onClick={() => { this.gojump(item.businessType, item.type, item.refundId, item.businessId) }}>
                  <View className='account-list left'>
                    {item.type == 'income' ? (
                      <Block>
                        {item.businessType == 'recommend' ? (
                          <Text>推荐奖励</Text>
                        ) : (
                            <Text>收入</Text>
                          )}
                      </Block>

                    ) : (
                        <Block>
                          {item.type == 'consume' ? (
                            <Text>消费</Text>
                          ) : (
                              <Block>
                                {item.type == 'merchant_refund' ? (
                                  <Text>退款</Text>
                                ) : (
                                    item.type == 'order' ? <Text>订单</Text>
                                      : <Text>{item.detail}</Text>
                                  )}
                              </Block>

                            )}
                        </Block>

                      )}
                    <Text className='detail-text'>{item.detail}</Text>
                  </View>
                  <View className='account-list'>
                    <View>{item.amount_2} 元  </View>
                    {item.realAmount >= 0 && item.realAmount && <Text className='realAmount'>到账:{toPriceYuan(item.realAmount)}元</Text>}
                    {item.realAmount >= 0 && item.realAmount && <Text className='realAmount'>手续费:{toPriceYuan(item.poundage)}元</Text>}
                    {item.orderChargeAmount && (
                      <Text className='realAmount'>交易服务费:{toPriceYuan(item.orderChargeAmount)}元</Text>
                    )}
                    <Text>{item.createTime}</Text>
                  </View>
                </View>

              )
            })}
            {lists.length >= 99 &&
              <View className="no-data-view">
                <View className="no-data-text">仅显示最近99条记录，更多请登录PC端查看</View>
              </View >
            }
          </Block>
        ) : (
            <View className="no-data-view">
              <Image
                src={require("../../images/item/qt_89.png")}
                mode="widthFix"
                className="no-data-image"
              ></Image>
              {/* <View className="no-data-text">
                  此分类没有商品
                    </View> */}
            </View >
          )}

      </Block>
    );
  }
}
