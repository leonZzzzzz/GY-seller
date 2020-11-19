import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Textarea
} from "@tarojs/components";
import "./bankinfo.scss";
import { bankinfo, addbankcard, updatabank } from "@/api/pay"

export default class Index extends Component {

  state = {
    isremark: false,
    receiverName: '',
    bankNumber: '',
    id: ''
  };
  config: Config = {
    navigationBarTitleText: "银行卡信息"
  };
  componentDidMount() {
    console.log(this.$router.params)
    const id = this.$router.params.id
    if (id) {
      this.getbank(id)
      this.setState({ id })
    }

  }
  getbank = async (id) => {
    const res = await bankinfo(id)
    if (res.data.code == 20000) {
      const { receiverName, bankNumber } = res.data.data
      this.setState({ receiverName, bankNumber })
    }
  }
  // 修改银行卡信息
  async resart() {
    const { id, receiverName, bankNumber } = this.state
    const params = { id, receiverName, bankNumber }
    const res = await updatabank(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '修改成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }

  getname(e) {
    this.setState({ receiverName: e.detail.value })
  }
  getcard(e) {
    this.setState({ bankNumber: e.detail.value })
  }
  async confirm() {
    const { receiverName, bankNumber } = this.state
    if (!receiverName || !bankNumber) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    const params = { receiverName, bankNumber }
    const res = await addbankcard(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '保存成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }


  addremark() {
    this.setState({ isremark: true })
  }
  render() {
    return (
      <Block>
        <View className='account martop'>
          <Text>姓名</Text>
          <View className='post-a'>
            <Input placeholder='请输入收款人真实姓名' value={receiverName} onInput={this.getname}></Input>
          </View>
        </View>
        <View className='account'>
          <Text>卡号</Text>
          <View className='post-a'>
            <Input placeholder='请输入储蓄卡号' type='number' maxLength='20' value={bankNumber} onInput={this.getcard}></Input>
          </View>
        </View>
        {/* <View className='account'>
          <Text>银行</Text>
          <View className='post-a'>
            <Input placeholder='请选择银行'></Input>
            <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
          </View>
        </View> */}

        {id ? (
          <View className='btn' onClick={this.resart}>
            <Text>修改</Text>
          </View>
        ) : (
            <View className='btn' onClick={this.confirm}>
              <Text>保存</Text>
            </View>
          )}


      </Block>
    );
  }
}
