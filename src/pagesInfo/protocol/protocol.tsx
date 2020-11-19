import Taro, { Component, Config } from '@tarojs/taro';
import { related } from '@/api/userInfo';
import WxParse from '@/components/wxParse/wxParse';
import { View, Text, Image } from '@tarojs/components';
import './protocol.scss';

export default class Index extends Component {
  state = {};

  componentWillMount() { }
  componentDidMount() {
    let { type } = this.$router.params
    this.getaboutus(type);
  }
  getaboutus = async (type) => {
    const res = await related(type);
    // console.log(res.data.data.content)
    WxParse.wxParse('article', 'html', res.data.data.content, this.$scope, 5);
  };
  config: Config = {
    navigationBarTitleText: '丰盈e鲜'
  };
  render() {
    return (
      <View style='flex-direction:column;margin-left:5px;font-size:13px ! important;'>
        <import src='../../components/wxParse/wxParse.wxml' />
        <template is='wxParse' data='{{wxParseData:article.nodes}}' />
      </View>
    );
  }
}
