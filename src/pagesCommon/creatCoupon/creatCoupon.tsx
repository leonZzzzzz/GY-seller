import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Input
} from "@tarojs/components";
import "./creatCoupon.scss";
import DatetimePicker from "@/components/datetime-picker";
import { addcoupons, insertcoupons } from "@/api/coupon"
import utils from '@/utils/utils'

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
    currentDate: new Date().getTime(),
    currentDate1: new Date().getTime(),
    currentDate2: new Date().getTime(),
    currentDate3: new Date().getTime(),
    couponTitle: '', couponAmount: '', couponOrderAmount: '', totalQuantity: '',
    memberReceiveQuantity: '', ruleDescription: '', content: '', itemlist: {}, type: '',
  };
  config: Config = {
    navigationBarTitleText: "新建优惠券"
  };
  componentDidMount() {
    // const item = this.$router.params.item
    const type = this.$router.params.type
    // const itemlist = JSON.parse(item)
    const itemlist = Taro.getStorageSync('selectCoupon') || {}
    // const currentDate = new Date().getTime();
    // const newDate = this.getLocalTime(currentDate);
    console.log(itemlist, parseInt(itemlist.couponAmount / 100))
    let selDate = itemlist.ruleStartTime ? itemlist.ruleStartTime.slice(0, 10) : ''
    let selDate1 = itemlist.ruleEndTime ? itemlist.ruleEndTime.slice(0, 10) : ''
    let selDate2 = itemlist.couponValidTime ? itemlist.couponValidTime.slice(0, 10) : ''
    let selDate3 = itemlist.couponExpireTime ? itemlist.couponExpireTime.slice(0, 10) : ''
    this.setState({
      type,
      // currentDate: newDate, 
      itemlist,
      selDate: selDate,
      selDate1: selDate1,
      selDate2: selDate2,
      selDate3: selDate3,
      ruleName: itemlist.ruleName,
      couponTitle: itemlist.couponTitle,
      couponAmount: itemlist.couponAmount,
      couponOrderAmount: itemlist.couponOrderAmount,
      totalQuantity: itemlist.totalQuantity,
      memberReceiveQuantity: itemlist.memberReceiveQuantity,
      ruleStartTime: itemlist.ruleStartTime,
      ruleEndTime: itemlist.ruleEndTime,
      couponValidTime: itemlist.couponValidTime, 
      couponExpireTime: itemlist.couponExpireTime,
      ruleDescription: itemlist.ruleDescription,
      content: itemlist.content
    });
    if (selDate || selDate1 || selDate2) {
      // console.log(new Date(selDate.replace(/-/g, '/')))
      // console.log((new Date(selDate.replace(/-/g, '/'))).getTime())
      // return
      console.log('修改优惠券？？？')
      let currentDate = new Date(selDate.replace(/-/g, '/'))
      let currentDate1 = new Date(selDate1.replace(/-/g, '/'))
      let currentDate2 = new Date(selDate2.replace(/-/g, '/'))
      let currentDate3 = new Date(selDate3.replace(/-/g, '/'))
      this.setState({
        currentDate: currentDate.getTime(),
        currentDate1: currentDate1.getTime(),
        currentDate2: currentDate2.getTime(),
        currentDate3: currentDate3.getTime()
      })
    }
  } 
  componentWillUnmount() {
    Taro.removeStorageSync('selectCoupon')
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
    // date = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    let dateStr = year + "-" + month + "-" + day
    return dateStr;
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
      let selDate = this.getLocalTime(e);
      let currentDate = new Date(selDate.replace(/-/g, '/'))
      this.setState({ 
        selDate, 
        isDate: false, 
        currentDate: currentDate.getTime() 
      });
    }
  }
  confirm1(e) {
    if (!e) {
      this.setState({ isDate1: this.state.currentDate1 });
    } else {
      let selDate1 = this.getLocalTime(e);
      let currentDate1 = new Date(selDate1.replace(/-/g, '/'))
      this.setState({ 
        selDate1, 
        isDate1: false, 
        currentDate1: currentDate1.getTime() 
      });
    }
  }
  confirm2(e) {
    if (!e) {
      this.setState({ isDate2: this.state.currentDate2 });
    } else {
      let selDate2 = this.getLocalTime(e);
      let currentDate2 = new Date(selDate2.replace(/-/g, '/'))
      this.setState({ 
        selDate2, 
        isDate2: false, 
        currentDate2: currentDate2.getTime() 
      });
    }
  }
  confirm3(e) {
    if (!e) {
      this.setState({ isDate3: this.state.currentDate3 });
    } else {
      let selDate3 = this.getLocalTime(e);
      let currentDate3 = new Date(selDate3.replace(/-/g, '/'))
      this.setState({ 
        selDate3, 
        isDate3: false, 
        currentDate3: currentDate3.getTime() 
      });
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
    console.log(e)
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
  // 每人限购
  getpurchase(e) {
    this.setState({ memberReceiveQuantity: e.detail.value })
  }
  // 规则
  // getruledes(e) {
  //   this.setState({ ruleDescription: e.detail.value })
  // }
  // 详情
  getcontent(e) {
    this.setState({ content: e.detail.value })
  }
  // 保存
  async save() {
    let { ruleName, content, selDate, selDate1, selDate2, selDate3, couponTitle, couponAmount, couponOrderAmount, totalQuantity, memberReceiveQuantity } = this.state
    if (!ruleName || !couponTitle || !couponAmount || !totalQuantity || !memberReceiveQuantity || !selDate || !selDate1 || !selDate2 || !selDate3) {
      Taro.showToast({
        title: '还有信息没有填写喔~',
        icon: 'none'
      })
      console.log(ruleName,couponTitle,couponAmount,totalQuantity,memberReceiveQuantity,selDate,selDate1,selDate2 ,selDate3)
      return
    }
    if (couponAmount == '79.99' || couponAmount == '69.99') {
      couponAmount = utils.mul(couponAmount, 100)
      couponAmount = utils.add(couponAmount, 1)
    } else {
      couponAmount = utils.mul(couponAmount, 100)
    }
    const params = {
      ruleName,
      couponTitle,
      couponAmount,
      couponOrderAmount: utils.mul(couponOrderAmount, 100),
      totalQuantity,
      couponValidDaysType: 1,
      memberReceiveQuantity,
      ruleStartTime: selDate+ ' 00:00:00',
      ruleEndTime: selDate1+ ' 00:00:00', 
      couponValidTime: selDate2+ ' 00:00:00', 
      couponExpireTime: selDate3+ ' 00:00:00',
      // ruleDescription: ruleDescription,
      content: '2'
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
  // 修改
  async sert() {
    let { itemlist, ruleDescription, content, ruleName, selDate, selDate1, selDate2, selDate3, couponTitle, couponAmount, couponOrderAmount, totalQuantity, memberReceiveQuantity } = this.state
    console.log(couponTitle, couponAmount, couponOrderAmount, totalQuantity, memberReceiveQuantity, selDate, selDate1, selDate2, selDate3)
    if (!ruleName || !couponTitle || !couponAmount || !totalQuantity || !memberReceiveQuantity || !selDate || !selDate1 || !selDate2 || !selDate3) {
      Taro.showToast({
        title: '还有信息没有填写喔~',
        icon: 'none'
      })
      return
    }
    if (couponAmount == '79.99' || couponAmount == '69.99') {
      couponAmount = utils.mul(couponAmount, 100)
      couponAmount = utils.add(couponAmount, 1)
    } else {
      couponAmount = utils.mul(couponAmount, 100)
    }
    console.log(selDate, selDate1, selDate2, selDate3)
    const params = {
      ruleName,
      couponTitle,
      couponAmount,
      couponOrderAmount: utils.mul(couponOrderAmount, 100),
      totalQuantity,
      couponValidDaysType: 1,
      memberReceiveQuantity,
      ruleStartTime: selDate+ ' 00:00:00',
      ruleEndTime: selDate1+ ' 00:00:00', 
      couponValidTime: selDate2+ ' 00:00:00', 
      couponExpireTime: selDate3+ ' 00:00:00',
      // ruleDescription: ruleDescription,
      content: '2',
      id: itemlist.id
    }
    console.log(params)
    const res = await insertcoupons(params)
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '优惠券修改成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }
  render() {
    const { isDate, isDate1, isDate2, isDate3, currentDate, currentDate1, currentDate2, currentDate3, itemlist,
      couponAmount, couponOrderAmount, type, selDate, selDate1, selDate2, selDate3} = this.state
    return (
      <Block>
        {isDate && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="date"
              value={currentDate}
              cancel={this.cancel.bind(this)}
              confirm={this.confirm.bind(this)}
            ></DatetimePicker>
          </View>
        )}
        {isDate1 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="date"
              value={currentDate1}
              cancel={this.cancel1.bind(this)}
              confirm={this.confirm1.bind(this)}
              currentDate={currentDate1}
            ></DatetimePicker>
          </View>
        )}
        {isDate2 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="date"
              value={currentDate2}
              cancel={this.cancel2.bind(this)}
              confirm={this.confirm2.bind(this)}
              currentDate={currentDate2}
            ></DatetimePicker>
          </View>
        )}
        {isDate3 && (
          <View className="choosedate">
            <View className="mengc" onClick={this.datehide}></View>
            <DatetimePicker
              className="pickdata"
              type="date"
              value={currentDate3}
              cancel={this.cancel3.bind(this)}
              confirm={this.confirm3.bind(this)}
              currentDate={currentDate3}
            ></DatetimePicker>
          </View>
        )}
        <View className='set'>
          <View className='set-row'>
            <Text>规则名称</Text>
            <View className='set-money'>
              <Input placeholder='请输入规则名称' value={itemlist.ruleName} placeholderClass='pcolor' onInput={this.getrulename}></Input>
            </View>
          </View>
          <View className='hint'>例如：满多少可用或无门槛</View>
          <View className='set-row'>
            <Text>优惠券名称</Text>
            <View className='set-money'>
              <Input placeholder='请输入名称' value={itemlist.couponTitle} placeholderClass='pcolor' onInput={this.getname}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>面值</Text>
            <View className='set-money'>
              <Input placeholder='请输入面值' value={couponAmount} placeholderClass='pcolor' onInput={this.getprice}></Input>
              <Text>元</Text>
            </View>
          </View>
          <View className='hint'>使用此优惠券可抵扣的金额</View>
          <View className='set-row'>
            <Text>需满足订单金额</Text>
            <View className='set-money'>
              <Input placeholder='0代表无门槛使用' value={couponOrderAmount} placeholderClass='pcolor' onInput={this.getorderprice}></Input>
              <Text>元</Text>
            </View>
          </View>
          <View className='hint'>满足订单金额可使用此优惠券</View>
          <View className='set-row'>
            <Text>发放总量</Text>
            <View className='set-money'>
              <Input placeholder='请输入总量' value={itemlist.totalQuantity} placeholderClass='pcolor' onInput={this.getamounttotal}></Input>
              <Text>张</Text>
            </View>
          </View>
          <View className='hint'>发放此优惠券总量</View>
          <View className='set-row'>
            <Text>每人限领数量</Text>
            <View className='set-money'>
              <Input placeholder='请输入限领数量' value={itemlist.memberReceiveQuantity} placeholderClass='pcolor' onInput={this.getpurchase}></Input>
              <Text>张</Text>
            </View>
          </View>
          <View className='hint'>每人可领此优惠券数量</View>
          <View className='set-row' onClick={() => { this.onDateChange(1) }}>
            <Text>领券开始时间</Text>
            <View className='set-money'>
              {selDate ? (
                <View className='picker'>{selDate}</View>
              ) : (
                  <View className='picker'>请选择开始时间</View>
                )}
              {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
            </View>
          </View>
          <View className='set-row' onClick={() => { this.onDateChange(2) }}>
            <Text>领券结束时间</Text>
            <View className='set-money'>
              {selDate1 ? (
                <View className='picker'>{selDate1}</View>
              ) : (
                  <View className='picker'>请选择结束时间</View>
                )}
              {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
            </View>
          </View>

          <View className='set-row' onClick={() => { this.onDateChange(3) }}>
            <Text>优惠券生效日期</Text>
            <View className='set-money'>
              {selDate2 ? (
                <View className='picker'>{selDate2}</View>
              ) : (
                  <View className='picker'>请选择生效时间</View>
                )}
              {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
            </View>
          </View>
          <View className='set-row' onClick={() => { this.onDateChange(4) }}>
            <Text>优惠券失效日期</Text>
            <View className='set-money'>
              {selDate3 ? (
                <View className='picker'>{selDate3}</View>
              ) : (
                  <View className='picker'>请选择失效时间</View>
                )}
              {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
            </View>
          </View>
          {/* <View className='set-row'>
            <Text>规则描述</Text>
            <View className='set-money'>
              <Input placeholder='请输入规则' value={itemlist.ruleDescription} placeholderClass='pcolor' onInput={this.getruledes}></Input>
            </View>
          </View> */}
          {/* <View className='set-row'>
            <Text>优惠券详情</Text>
            <View className='set-money'>
              <Input placeholder='请输入优惠券详情' value={itemlist.content} placeholderClass='pcolor' onInput={this.getcontent}></Input>
            </View>
          </View> */}
          <View className='footer-bar'></View>
          {type == 'edit' ? (
            <View className='btn' onClick={this.sert}>
              修改
          </View>
          ) : (
              <View className='btn' onClick={this.save}>
                保存
          </View>
            )}

        </View>
      </Block>
    );
  }
}
