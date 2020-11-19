import Taro, { Component, Config } from '@tarojs/taro';
import { deliveryway, disWayMethod, chooseMode } from '@/api/address';
import { Block, View, Text } from '@tarojs/components';
import './distway.scss';
const app = Taro.getApp()

export default class Index extends Component {
  // 去设置密码
  gopasswod() {
    Taro.navigateTo({
      url: '../setpsd/setpsd'
    });
  }
  state = {
    type: '',
    disMethod: '',
    takeMethod: '',
    platMethod: '',
    listData: []
  };
  componentDidShow() {
    this.getDisMethod();
  }
  getDisMethod = async () => {
    const res = await disWayMethod();
    const disMethod = {}, takeMethod = {}, platMethod = {}
    if (res.data.code == 20000) {
      const listData = res.data.data
      if (listData.length > 0) {
        listData.map(item => {
          if (item.type == 'distribution') {
            disMethod.distime = item.timeQuantum
            disMethod.phone = item.phoneNumber;
            disMethod.id = item.id;
            disMethod.checked = item.isCheck
          }
          if (item.type == 'takeout') {
            takeMethod.distime = item.timeQuantum;
            takeMethod.phone = item.phoneNumber;
            takeMethod.address = item.address;
            takeMethod.id = item.id;
            takeMethod.checked = item.isCheck
          }
          if (item.type == 'platformsend') {
            platMethod.distime = item.timeQuantum;
            platMethod.phone = item.phoneNumber;
            platMethod.address = item.address;
            platMethod.id = item.id;
            platMethod.checked = item.isCheck
          }
          this.setState({ disMethod, takeMethod, platMethod })
        })
      }

      this.setState({ listData: listData })
    }
  };

  chooseType(e) {
    console.log(e)
    const { disMethod, takeMethod, platMethod } = this.state;
    let { type, num } = e.currentTarget.dataset
    if (num == 1) {
      if (!disMethod.distime) {
        Taro.showToast({
          title: '请先填写配送信息',
          icon: 'none'
        })
        return
      }
      disMethod.checked = !disMethod.checked
      disMethod.checked = disMethod.checked
    } else if (num == 2) {
      if (!takeMethod.distime) {
        Taro.showToast({
          title: '请先填写配送信息',
          icon: 'none'
        })
        return
      }
      takeMethod.checked = !takeMethod.checked
      takeMethod.checked = takeMethod.checked
    } else if (num == 3) {
      platMethod.checked = !platMethod.checked
      platMethod.checked = platMethod.checked
    }
    this.setState({ type: type, num, disMethod, takeMethod, platMethod });
  }

  // 保存
  async preserve() {
    const { type, disMethod, takeMethod, platMethod } = this.state;
    let id1 = '', id2 = '', id3 = '', idList = []
    if (platMethod.checked) {
      id1 = platMethod.id
    }
    if (disMethod.checked) {
      id2 = disMethod.id
    }
    if (takeMethod.checked) {
      id3 = takeMethod.id
    }
    if (id1) {
      idList.push(id1)
    }
    if (id2) {
      idList.push(id2)
    }
    if (id3) {
      idList.push(id3)
    }
    var params = { ids: idList }
    const res = await chooseMode(params);
    if (res.data.code == 20000) {
      Taro.showToast({
        title: '配送方式设置成功',
        icon: 'none'
      })
    }
  }
  config: Config = {
    navigationBarTitleText: '配送方式'
  };
  render() {
    const { type, listData, disMethod, takeMethod, platMethod } = this.state;
    return (
      <Block>
        <View className='setrow'>
          <View className='setrow-a'>
            {disMethod.checked ? (
              <Icon type='success' data-type='distribution' data-num='1' onClick={this.chooseType}></Icon>
            ) : (
                <Icon type='circle' data-type='distribution' data-num='1' onClick={this.chooseType}></Icon>

              )}

            <View className='setcol'>
              <Text>店铺配送</Text>
              {disMethod.distime && (
                <Block>
                  <View>配送时间：次日{disMethod.distime}</View>
                  <View>配送电话：{disMethod.phone}</View>
                </Block>
              )}
            </View>
          </View>
          {disMethod.distime ? (
            <View
              className='revise'
              onClick={() => {
                Taro.navigateTo({ url: '../recom/recom?type=distribution&id=' + disMethod.id + '&distime=' + disMethod.distime + '&phone=' + disMethod.phone });
              }}>
              修改 </View>
          ) : (
              <View
                className='revise'
                onClick={() => {
                  Taro.navigateTo({ url: '../recom/recom?type=distribution' });
                }}>
                填写</View>
            )}
        </View>
        <View className='setrow'>
          <View className='setrow-a'>
            {takeMethod.checked ? (
              <Icon type='success' data-type='takeout' data-num='2' onClick={this.chooseType}></Icon>
            ) : (
                <Icon type='circle' data-type='takeout' data-num='2' onClick={this.chooseType}></Icon>

              )}

            <View className='setcol'>
              <Text>上门自提</Text>
              {takeMethod.distime && (
                <Block>
                  <View>自提时间：次日{takeMethod.distime}</View>
                  <View>自提电话：{takeMethod.phone}</View>
                  <View>自提地址：{takeMethod.address}</View>
                </Block>
              )}
            </View>
          </View>
          {takeMethod.distime ? (
            <View
              className='revise'
              onClick={() => {
                Taro.navigateTo({ url: '../recom/recom?type=takeout&id=' + takeMethod.id + '&distime=' + takeMethod.distime + '&address=' + takeMethod.address + '&phone=' + takeMethod.phone });
              }}>
              修改</View>
          ) : (
              <View
                className='revise'
                onClick={() => {
                  Taro.navigateTo({ url: '../recom/recom?type=takeout' });
                }}>
                填写</View>
            )}

        </View>

        {platMethod.id && (
          <View className='setrow'>
            <View className='setrow-a'>
              {platMethod.checked ? (
                <Icon type='success' data-type='platformsend' data-num='3' onClick={this.chooseType}></Icon>
              ) : (
                  <Icon type='circle' data-type='platformsend' data-num='3' onClick={this.chooseType}></Icon>

                )}
              <View className='setcol'>
                <Text>丰盈配送</Text>
                {/* {platMethod.distime && (
                <Block>
                  <View>配送订单最低金额：</View>
                  <View>配送时间：{platMethod.distime}</View>
                  <View>配送电话：{platMethod.phone}</View>
                  <View>配送地址：</View>
                </Block>
              )} */}
              </View>
            </View>
            {/* {platMethod.distime ? (
            <View
              className='revise'
              onClick={() => {
                Taro.navigateTo({ url: '../recom/recom?type=distribution&id=' + platMethod.id + '&distime=' + platMethod.distime + '&phone=' + platMethod.phone });
              }}>
              修改 </View>
          ) : (
              <View
                className='revise'
                onClick={() => {
                  Taro.navigateTo({ url: '../recom/recom?type=distribution' });
                }}>
                填写</View>
            )} */}
          </View>
        )}

        <View className='btn' onClick={this.preserve}>
          <Text>保存</Text>
        </View>
      </Block>
    );
  }
}
