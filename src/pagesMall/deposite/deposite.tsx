import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Textarea
} from "@tarojs/components";
import "./deposite.scss";
import { drawinfo, deposit } from "@/api/pay"
import utils from '@/utils/utils'
export default class Index extends Component {

  state = {
    isremark: false,
    allmoney: '',
    bankRecord: '', withdrawableMoney: '', amount: '', note: '', bankNumber: ''
  };
  config: Config = {
    navigationBarTitleText: "提现"
  };
  componentDidShow() {
    this.getinfo()
  }
  getinfo = async () => {
    const res = await drawinfo()
    if (res.data.code == 20000) {
      let { bankRecord, withdrawableMoney, bankNumber } = res.data.data
      if (bankRecord) {
        bankNumber = bankRecord.bankNumber.slice(-4)
      }
      this.setState({ bankNumber, bankRecord, withdrawableMoney: parseFloat(withdrawableMoney / 100).toFixed(2) })
    }
  }
  // 输入提现金额
  getmoney(e) {
    this.setState({ amount: e.detail.value })
  }
  // 备注
  getremark(e) {
    this.setState({ note: e.detail.value })
  }
  // 全部提现
  getall() {
    this.setState({ allmoney: this.state.withdrawableMoney })
  }


  // 确认提现
  async confirm() {
    const { amount, bankRecord, note } = this.state
    if (!bankRecord) {
      Taro.showToast({
        title: '请先设置银行卡信息',
        icon: 'none'
      })
      return
    }
    // if (Number(amount) > 5000) {
    //   Taro.showToast({
    //     title: '提现金额不能超过5000',
    //     icon: 'none'
    //   })
    //   return
    // }
    const params = { note, amount: utils.mul(amount, 100), bankNumber: bankRecord.bankNumber, receiverName: bankRecord.receiverName }
    const res = await deposit(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: res.data.message,
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000);
    }
  }

  gotoInfo() {
    const { bankRecord } = this.state
    if (bankRecord) {
      Taro.navigateTo({ url: '../bankinfo/bankinfo?id=' + bankRecord.id })
    } else {
      Taro.navigateTo({ url: '../bankinfo/bankinfo' })
    }
  }

  addremark() {
    this.setState({ isremark: true })
  }
  render() {
    const { bankRecord, bankNumber, withdrawableMoney, allmoney, isremark } = this.state
    return (
      <Block>
        <View className='post'>可提现余额：￥{withdrawableMoney}</View>
        <View className='account'>
          <Text>到账账户</Text>
          <View className='post-a'>
            {bankRecord ? (
              <View className='post-b' onClick={this.gotoInfo}>
                <View className='post-c'>
                  尾号{bankNumber}
                </View>
                <Text>1-3个工作日到账</Text>
              </View>
            ) : (
                <View className='post-b' onClick={this.gotoInfo}>
                  <View style='margin-top:7px;'>去设置银行卡信息</View>
                </View>
              )}

            <View className='qcfont qc-icon-chevron-right'></View>
          </View>
        </View>

        <View className='price'>
          <Text className='price-a'>提现金额</Text>
          <View className='price-b'>
            <View className='price-d'>
              <Text>￥</Text>
              <Input placeholder='请输入提现金额' value={allmoney} onInput={this.getmoney}></Input>
            </View>
            <Text onClick={this.getall}>全部提现</Text>
          </View>
          {!isremark && (
            <Text className='price-c' onClick={this.addremark}>添加备注</Text>
          )}
        </View>
        {isremark && (
          <Textarea className='area' placeholder='请填写备注信息(限100字)' maxlength='100' onInput={this.getremark}></Textarea>
        )}
        <View className='btn' onClick={this.confirm}>
          <Text>确定提现</Text>
        </View>
        <View className='regard' onClick={() => { Taro.navigateTo({ url: '../../pagesInfo/protocol/protocol?type=WITHDRAWAL_STORE_FAQ' }) }}>
          <Image src={Taro.getStorageSync('imgHostItem')+'gy-icon_27.png'}></Image>
          <Text>相关问题</Text>
        </View>
      </Block>
    );
  }
}
