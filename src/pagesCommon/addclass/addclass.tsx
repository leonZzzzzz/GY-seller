import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Input,
} from "@tarojs/components";
import "./addclass.scss";
import { addStoreList, updataStoreList } from "@/api/userInfo"

export default class Index extends Component {
  state = {
    type: 'add',
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    name: '',
    info: '',
    seqNum: '0',
    id: ''
  };
  config: Config = {
    navigationBarTitleText: "添加店铺分类"
  };

  componentDidMount() {
    let { list, type } = this.$router.params
    list = JSON.parse(list)
    console.log(list, type)
    this.setState({ name: list.name, info: list.info, seqNum: list.seqNum, id: list.id, type })
  }
  getName(e) {
    this.setState({ name: e.detail.value })
  }
  getInfo(e) {
    this.setState({ info: e.detail.value })
  }
  // 排序
  sortData(e) {
    this.setState({ seqNum: e.detail.value })
  }
  cutSeq() {
    let { seqNum } = this.state
    if (seqNum <= 0) {
      Taro.showToast({
        title: '请输入正整数',
        icon: 'none'
      })
    } else {
      seqNum--
    }
    this.setState({ seqNum })
  }
  addSeq() {
    let { seqNum } = this.state
    seqNum++
    this.setState({ seqNum })
  }
  // 保存
  async save(index) {
    let { name, info, seqNum, id, type } = this.state
    if (!name) {
      Taro.showToast({
        title: '请填写分类名称',
        icon: 'none'
      })
      return
    }
    if (index == 1) {
      const params = { name, info, seqNum, type: 15 }
      const res = await addStoreList(params)
      if (res.data.code == 20000) {
        if (type = 'addProduct') {
          Taro.setStorageSync('storeCategoryId', res.data.message)
          Taro.setStorageSync('storeCategoryName', name)
        }
        Taro.showToast({
          title: '添加成功',
          icon: 'none'
        })

        setTimeout(() => {
          Taro.navigateBack({ delta: 1 })
        }, 1000);
      }
    } else {
      const params = { name, info, seqNum, id, type: 15 }
      const res = await updataStoreList(params)
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
  }


  render() {
    const { name, info, seqNum, type } = this.state
    return (
      <Block>
        <View className='set'>
          <View className='set-row'>
            <Text>分类名称</Text>
            <View className='set-money'>
              <Input placeholder='请输入分类名称' placeholderClass='pcolor' value={name} onInput={this.getName}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>描述</Text>
            <View className='set-money'>
              <Input placeholder='请输入描述' placeholderClass='pcolor' value={info} onInput={this.getInfo}></Input>
            </View>
          </View>
          <View className='set-row'>
            <Text>排序</Text>
            <View className='seqnum'>
              <Text onClick={this.cutSeq}>-</Text>
              <Input placeholder='请输入序号' type="number" placeholderClass='pcolor' value={seqNum} onInput={this.sortData}></Input>
              <Text onClick={this.addSeq}>+</Text>
            </View>
          </View>


          {type == 'edit' && (
            <View className='btn' onClick={() => { this.save(2) }}>
              <Text>修改</Text>
            </View>
          )}
          {type == 'add' && (
            <View className='btn' onClick={() => { this.save(1) }}>
              <Text>保存</Text>
            </View>
          )}

        </View>
      </Block >
    );
  }
}
