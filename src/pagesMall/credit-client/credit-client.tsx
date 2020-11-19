import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input
} from "@tarojs/components";
import "./credit-client.scss";
import { payment, cancelCust } from "@/api/customer"

export default class Index extends Component {

  state = {
    list: [],
    phone: ''
  };
  componentDidShow() {
    this.getlist()
  }
  getlist = async () => {
    const res = await payment(this.state.phone)
    if (res.data.code == 20000) {
      const list = res.data.data.list
      list.map(item => {
        item.unpayAmount = parseFloat(item.unpayAmount / 100).toFixed(2)
        item.lines = parseFloat(item.lines / 100).toFixed(2)
        item.allPayAmount = parseFloat(item.allPayAmount / 100).toFixed(2)
      })
      this.setState({ list: list })
    }
  }
  // 取消/启用
  stopUse(e, id) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    const params = { status: type, paymentDaysId: id }
    if (type == 'normal') {
      Taro.showModal({
        content: '确定要启用该用户吗？',
        success: (res => {
          if (res.confirm) {
            this.stop(params)
          }
        })
      })
    } else {
      Taro.showModal({
        content: '确定要停用该用户吗？',
        success: (res => {
          if (res.confirm) {
            this.stop(params)
          }
        })
      })
    }

  }
  stop = async (params) => {
    const res = await cancelCust(params)
    if (res.data.code == 20000) {
      this.getlist()
    }
  }
  getvalue(e) {
    this.setState({ phone: e.detail.value })
  }
  search() {
    this.getlist()
  }
  config: Config = {
    navigationBarTitleText: "账期客户"
  };
  render() {
    const { list } = this.state
    return (
      <Block>
        <View className='cust-fixed'>
          <View className="search">
            <Input placeholder='搜索手机号' onInput={this.getvalue}></Input>
            <View onClick={this.search}>搜索</View>
          </View>
        </View>
        {list.length > 0 ? (
          <View className='content'>
            {list.map((item, index) => {
              return (
                <View className='content-a' key={String(index)}>
                  <View className='content-a-name'>
                    <Image className='content-a-name-pic' src={item.headImage}></Image>
                    <View className='content-a-name-user'>{item.custName}
                      <Text className='content-a-name-user-t'>({item.mobilePhoneNumber})</Text>
                      {item.remark && (
                        <Text className='content-a-name-user-name'>备注名：{item.remark}</Text>
                      )}
                    </View>

                  </View>
                  <View className='content-statis'>
                    <View className='statis-a'>
                      <Text>金额上限(元)</Text>
                      <Text>{item.lines}</Text>
                    </View>
                    <View className='statis-a'>
                      <Text>结算账期(天)</Text>
                      <Text>{item.timeLimit}</Text>
                    </View>
                    <View className='statis-a'>
                      <Text>未支付账期金额(元)</Text>
                      <Text className='orange'>{item.unpayAmount}</Text>
                    </View>
                    <View className='statis-a'>
                      <Text>当前账期(天)</Text>
                      <Text className='orange'>{item.nowLimit}</Text>
                    </View>

                  </View>
                  <View className='btns'>
                    {item.status == 'normal' ? (
                      <Text data-type='disable' onClick={(e) => { this.stopUse(e, item.paymentDaysId) }}>停用</Text>
                    ) : (
                        <Text data-type='normal' onClick={(e) => { this.stopUse(e, item.paymentDaysId) }}>启用</Text>
                      )}

                    <Text onClick={() => {
                      Taro.navigateTo({
                        url: '../addcredit/addcredit?paymentDaysId=' + item.paymentDaysId + '&memberId=' + item.memberId + '&mobilePhoneNumber=' + item.mobilePhoneNumber + '&lines=' + item.lines + '&timeLimit=' + item.timeLimit + '&remark=' + item.remark
                      })
                    }}>更改账期</Text>
                    {/* {item.unpayAmount ? ( */}
                    <Text className='btns-n' onClick={() => {
                      Taro.navigateTo({
                        url: '../bill-list/bill-list?paymentDaysId=' + item.paymentDaysId + '&memberId=' + item.memberId + '&custName=' + item.custName + '&mobilePhoneNumber=' + item.mobilePhoneNumber + '&lines=' + item.lines + '&timeLimit=' + item.timeLimit + '&unpayAmount=' + item.unpayAmount + '&headImage=' + item.headImage + '&remark=' + item.remark + '&nowLimit=' + item.nowLimit + '&allPayAmount=' + item.allPayAmount
                      })
                    }}>账期明细</Text>
                    {/* // ) : (
                    //     <Text className='btns-n' onClick={() => { Taro.navigateTo({ url: '../bill-list/bill-list?paymentDaysId=' + item.paymentDaysId + '&custName=' + item.custName + '&mobilePhoneNumber=' + item.mobilePhoneNumber + '&lines=' + item.lines + '&timeLimit=' + item.timeLimit + '&headImage=' + item.headImage + '&remark=' + item.remark }) }}>账期明细</Text>
                    //   )} */}
                    <Text onClick={() => {
                      Taro.navigateTo({
                        url: '../repayment/repayment?memberId=' + item.memberId + '&allPayAmount=' + item.allPayAmount + '&unpayAmount=' + item.unpayAmount + '&custName=' + item.custName + '&mobilePhoneNumber=' + item.mobilePhoneNumber + '&headImage=' + item.headImage
                      })
                    }}>还账记录</Text>

                    <Text className={item.nowLimit > item.timeLimit ? 'reds' : ' '} onClick={() => {
                      Taro.navigateTo({
                        url: '../payback/payback?memberId=' + item.memberId + '&lines=' + item.lines + '&unpayAmount=' + item.unpayAmount + '&custName=' + item.custName + '&mobilePhoneNumber=' + item.mobilePhoneNumber + '&headImage=' + item.headImage + '&timeLimit=' + item.timeLimit + '&nowLimit=' + item.nowLimit
                      })
                    }}>还账</Text>
                  </View>
                </View>
              )
            })}
          </View>
        ) : (
            <View className="no-data-view">
              <Image
                src={Taro.getStorageSync('imgHostItem') + 'qt_89.png'}
                mode="widthFix"
                className="no-data-image"
              ></Image>
              <View className="no-data-text">暂无账期客户</View>
            </View>
          )}

        <View style='height:150px'></View>
        <View className='confirm-order' onClick={() => { Taro.navigateTo({ url: '../addcredit/addcredit' }) }}>
          <View className='btn'>
            <View>+ 添加账期客户</View>
          </View>
        </View>
      </Block>
    );
  }
}
