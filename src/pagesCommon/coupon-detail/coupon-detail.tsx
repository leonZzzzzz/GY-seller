import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image
} from "@tarojs/components";
import "./coupon-detail.scss";
import DatetimePicker from "@/components/datetime-picker";
import { addcoupons } from "@/api/coupon"

export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    })
  }
  state = {
    ruleName: '',
    startTime: '',
    endTime: '',
    srartTxt: true,
    endTxt: true,
    isDate: false,
    isDate1: false,
    isDate2: false,
    isDate3: false,
    selDate: '',
    selDate1: '',
    selDate2: '',
    selDate3: '',
    currentDate: '',
    currentDate1: '',
    currentDate2: '',
    currentDate3: '',
    couponTitle: '', couponAmount: '', couponOrderAmount: '', totalQuantity: '',
    memberReceiveQuantity: '', ruleDescription: '', content: ''
  };
  config: Config = {
    navigationBarTitleText: "新建优惠券"
  };
  componentDidMount() {
    const currentDate = new Date().getTime();
    const newDate = this.getLocalTime(currentDate);
    this.setState({ currentDate: newDate });
  }
  getLocalTime(nS) {
    //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
    // d.cTime = 1539083829787
    let date = new Date(nS);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let h = date.getHours();
    if (h < 10) {
      h = "0" + h;
    }
    let m = date.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    let s = date.getSeconds()
    if (s < 10) {
      s = "0" + s;
    }
    let day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    date = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    return date;
  }
  // 选择日期
  onDateChange(i) {
    console.log(i)
    if (i == 1) {
      this.setState({ isDate: true });
    } else if (i == 2) {
      this.setState({ isDate1: true });
    } else if (i == 3) {
      this.setState({ isDate2: true });
    } else if (i == 4) {
      this.setState({ isDate3: true });
    }
  }

  cancel() {
    this.setState({ isDate: false });
  }
  cancel1() {
    this.setState({ isDate1: false });
  }
  cancel2() {
    this.setState({ isDate2: false });
  }
  cancel3() {
    this.setState({ isDate3: false });
  }
  datehide() {
    this.setState({ isDate: false });
  }
  // 选择日期
  confirm(e) {
    if (!e) {
      this.setState({ isDate: this.state.currentDate });
    } else {
      const selDate = this.getLocalTime(e);
      this.setState({ selDate, isDate: false });
    }
  }
  confirm1(e) {
    if (!e) {
      this.setState({ isDate1: this.state.currentDate1 });
    } else {
      const selDate1 = this.getLocalTime(e);
      this.setState({ selDate1, isDate1: false });
    }
  }
  confirm2(e) {
    if (!e) {
      this.setState({ isDate2: this.state.currentDate2 });
    } else {
      const selDate2 = this.getLocalTime(e);
      this.setState({ selDate2, isDate2: false });
    }
  }
  confirm3(e) {
    if (!e) {
      this.setState({ isDate3: this.state.currentDate3 });
    } else {
      const selDate3 = this.getLocalTime(e);
      this.setState({ selDate3, isDate3: false });
    }
  }
  // 规则名称
  getrulename(e) {
    this.setState({ ruleName: e.detail.value })
  }
  // 优惠券名称
  getname(e) {
    this.setState({ couponTitle: e.detail.value })
  }
  // 面值
  getprice(e) {
    this.setState({ couponAmount: e.detail.value })
  }
  // 需满足订单金额
  getorderprice(e) {
    this.setState({ couponOrderAmount: e.detail.value })
  }
  // 发放总量
  getamounttotal(e) {
    this.setState({ totalQuantity: e.detail.value })
  }
  // 每日限购
  getpurchase(e) {
    this.setState({ memberReceiveQuantity: e.detail.value })
  }
  // 规则
  getruledes(e) {
    this.setState({ ruleDescription: e.detail.value })
  }
  // 详情
  getcontent(e) {
    this.setState({ content: e.detail.value })
  }
  // 保存
  async save() {
    const { ruleDescription, content, ruleName, selDate, selDate1, selDate2, selDate3, couponTitle, couponAmount, couponOrderAmount, totalQuantity, memberReceiveQuantity } = this.state
    const params = {
      ruleName,
      couponTitle,
      couponAmount: parseInt(couponAmount),
      couponOrderAmount: parseInt(couponOrderAmount),
      totalQuantity,
      couponValidDaysType: 1,
      memberReceiveQuantity,
      ruleStartTime: selDate,
      ruleEndTime: selDate1, couponValidTime: selDate2, couponExpireTime: selDate3,
      ruleDescription: ruleDescription,
      content: content
    }
    const res = await addcoupons(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '优惠券添加成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }
  render() {
    const { isDate, isDate1, isDate2, isDate3, currentDate, currentDate1, currentDate2, currentDate3 } = this.state
    return (
      <Block>
        {isDate && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={currentDate}
              cancel={this.cancel.bind(this)}
              confirm={this.confirm.bind(this)}
              input={this.onInput}
            ></DatetimePicker>
          </View>
        )}
        {isDate1 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={currentDate1}
              cancel={this.cancel1.bind(this)}
              confirm={this.confirm1.bind(this)}
            ></DatetimePicker>
          </View>
        )}
        {isDate2 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={currentDate2}
              cancel={this.cancel2.bind(this)}
              confirm={this.confirm2.bind(this)}
              input={this.onInput}
            ></DatetimePicker>
          </View>
        )}
        {isDate3 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={currentDate3}
              cancel={this.cancel3.bind(this)}
              confirm={this.confirm3.bind(this)}
            ></DatetimePicker>
          </View>
        )}
        <View className='set'>
          <View className='set-row'>
            <Text>规则名称</Text>
            <View className='set-money'>
              <Input placeholder='请输入规则名称' placeholderClass='pcolor' onInput={this.getrulename}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>优惠券名称</Text>
            <View className='set-money'>
              <Input placeholder='请输入名称' placeholderClass='pcolor' onInput={this.getname}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>面值</Text>
            <View className='set-money'>
              <Input placeholder='请输入面值' placeholderClass='pcolor' onInput={this.getprice}></Input>
              <Text>元</Text>
            </View>
          </View>
          <View className='set-row'>
            <Text>需满足订单金额</Text>
            <View className='set-money'>
              <Input placeholder='0代表无门槛使用' placeholderClass='pcolor' onInput={this.getorderprice}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>发放总量</Text>
            <View className='set-money'>
              <Input placeholder='请输入总量' placeholderClass='pcolor' onInput={this.getamounttotal}></Input>
              <Text>张</Text>
            </View>
          </View>
          <View className='set-row'>
            <Text>每日限购数量</Text>
            <View className='set-money'>
              <Input placeholder='请输入限购数量' placeholderClass='pcolor' onInput={this.getpurchase}></Input>
              <Text>张</Text>
            </View>
          </View>
          <View className='set-row'>
            <Text>领券开始时间</Text>
            <View className='set-money'>
              {selDate ? (
                <View className='picker' onClick={() => { this.onDateChange(1) }}>{selDate}</View>
              ) : (
                  <View className='picker' onClick={() => { this.onDateChange(1) }}>请选择开始时间</View>
                )}
              <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
            </View>
          </View>
          <View className='set-row'>
            <Text>领券结束时间</Text>
            <View className='set-money'>
              {selDate1 ? (
                <View className='picker' onClick={() => { this.onDateChange(2) }}>{selDate1}</View>
              ) : (
                  <View className='picker' onClick={() => { this.onDateChange(2) }}>请选择结束时间</View>
                )}
              <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
            </View>
          </View>

          <View className='set-row'>
            <Text>优惠券生效日期</Text>
            <View className='set-money'>
              {selDate2 ? (
                <View className='picker' onClick={() => { this.onDateChange(3) }}>{selDate2}</View>
              ) : (
                  <View className='picker' onClick={() => { this.onDateChange(3) }}>请选择生效时间</View>
                )}
              <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
            </View>
          </View>
          <View className='set-row'>
            <Text>优惠券失效日期</Text>
            <View className='set-money'>
              {selDate3 ? (
                <View className='picker' onClick={() => { this.onDateChange(4) }}>{selDate3}</View>
              ) : (
                  <View className='picker' onClick={() => { this.onDateChange(4) }}>请选择失效时间</View>
                )}
              <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image>
            </View>
          </View>
          <View className='set-row'>
            <Text>规则描述</Text>
            <View className='set-money'>
              <Input placeholder='请输入规则' placeholderClass='pcolor' onInput={this.getruledes}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>优惠券详情</Text>
            <View className='set-money'>
              <Input placeholder='请输入优惠券详情' placeholderClass='pcolor' onInput={this.getcontent}></Input>
            </View>
          </View>



          <View className='btn' onClick={this.save}>
            保存
          </View>
        </View>
      </Block>
    );
  }
}
