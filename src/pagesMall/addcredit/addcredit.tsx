import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  RadioGroup,
  Label,
  Radio
} from "@tarojs/components";
import "./addcredit.scss";
import { fuzzyList, addcharge, updataCharg } from "@/api/customer"
import utils from '@/utils/utils'

export default class Index extends Component {

  state = {
    datalist: [],
    memberId: '',
    day: '',
    price: '',
    paymentDaysId: '', id: '',
    lines: '', timeLimit: '', mobilePhoneNumber: '',
    isshow: false,
    remark: ''
  };
  componentDidMount() {
    const { paymentDaysId, memberId, lines, timeLimit, mobilePhoneNumber, remark } = this.$router.params
    console.log(remark)
    if (paymentDaysId) {
      this.setState({ paymentDaysId, id: memberId, price: lines, day: timeLimit, mobilePhoneNumber, remark })
    }
  }
  getPhone(e) {
    const phone = e.detail.value
    this.searchphone(phone)
  }
  searchphone = async (phone) => {
    const res = await fuzzyList(phone)
    this.setState({ isshow: true })
    const datalist = res.data.data
    if (datalist.length > 0) {
      this.setState({ datalist })
    } else {
      this.setState({ datalist: [] })
    }
  }
  checkRadio(e) {
    console.log(e)
    const index = e.detail.value
    const { datalist } = this.state
    const memberId = datalist[index].id
    this.setState({ memberId })
  }
  // 天数
  getday(e) {
    this.setState({ day: e.detail.value })
  }
  // 金额
  getPrice(e) {
    this.setState({ price: parseInt(e.detail.value) })
  }
  // 备注
  getmark(e) {
    this.setState({ remark: e.detail.value })
  }
  // 新增
  async addconfirm() {
    const { memberId, day, price, remark } = this.state
    if (!memberId || !day || !price) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    const params = { memberId, timeLimit: day, lines: utils.mul(price, 100), remark }
    const res = await addcharge(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '添加成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }
  // 修改
  async insertconfirm() {
    const { memberId, day, price, paymentDaysId, id, remark } = this.state
    const params = {
      id: paymentDaysId,
      memberId: memberId ? memberId : id,
      timeLimit: day,
      lines: utils.mul(price, 100),
      remark
    }
    if (!params.memberId || !params.timeLimit || !params.lines) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    const res = await updataCharg(params)
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
  config: Config = {
    navigationBarTitleText: "添加账期客户"
  };
  render() {
    let { paymentDaysId, mobilePhoneNumber, isshow, datalist, remark, day, price,  } = this.state
    return (
      <Block>
        <View className='content-a'>
          <Text>客户手机号</Text>
          <View className='content-input'>
            {paymentDaysId ? (
              <Input placeholder='请输入手机号' value={mobilePhoneNumber} disabled onInput={this.getPhone}></Input>
            ) : (
                <Input placeholder='请输入手机号' value={mobilePhoneNumber} onInput={this.getPhone}></Input>
              )}

            <Text>搜索</Text>
          </View>
        </View>
        {/* 搜索到的用户 */}
        {isshow && (
          <Block>
            {datalist.length > 0 ? (
              <RadioGroup className='radio-con' onChange={this.checkRadio}>
                {datalist.map((item, index) => {
                  return (
                    <Label>
                      <View className='search-list'>
                        <Radio value={index}></Radio>
                        <Image src={item.headImage}></Image>
                        <Text>{item.name}({item.mobilePhoneNumber})</Text>
                      </View>
                    </Label>
                  )
                })}
              </RadioGroup>
            ) : (
                <View className='radio-con center'>无数据</View>
              )}
          </Block>
        )}

        <View className='content-a'>
          <Text>结算账期(天)</Text>
          <View className='content-day'>
            <Input placeholder='请输入天数' type='number' value={day} onInput={this.getday}></Input>
            {/* <View className='qcfont qc-icon-chevron-right'></View> */}
          </View>
        </View>
        <View className='content-a marno'>
          <Text>金额上限(元)</Text>
          <View className='content-day'>
            <Input placeholder='请输入金额' type='number' value={price} onInput={this.getPrice}></Input>
            {/* <View className='qcfont qc-icon-chevron-right'></View> */}
          </View>
        </View>
        <View className='content-a marno martop'>
          <Text>用户备注名</Text>
          <View className='content-day'>
            <Input placeholder='请输入备注名' value={remark} onInput={this.getmark}></Input>
            {/* <View className='qcfont qc-icon-chevron-right'></View> */}
          </View>
        </View>
        <View className='confirm-order' >
          {!paymentDaysId ? (
            <View className='btn' onClick={this.addconfirm}>
              <View>+ 确定添加</View>
            </View>
          ) : (
              <View className='btn' onClick={this.insertconfirm}>
                <View>确认修改</View>
              </View>
            )}

        </View>
      </Block>
    );
  }
}
