import '@tarojs/async-await';
import Taro, { Component, Config } from '@tarojs/taro';
import { response, needStoreIdRequest } from './utils/interceptors';
import { authorize } from './api/common';
import checkAppUpdate from './utils/check-app-update';
import Index from './pages/index';
import './app.scss';

Taro.addInterceptor(needStoreIdRequest);
Taro.addInterceptor(response);

class App extends Component {
  config: Config = {
      ${pages},
      subPackages: [
        {
          root: 'pagesCommon',
          pages: ['address/list/index', 'address/edit/index']
        },
        {
          root: 'pagesMall',
          pages: ['product-detail/index', 'product-confirm/index', 'order/list/index', 'order/detail/index']
        }
      ],
      ${window},
      ${tabBar}
  }
  componentDidMount() {
    Taro.removeStorageSync('storeId');
    Taro.login().then(code => {
      authorize({ code: code.code }).then(res => {
        const { memberId,  sessionId } = res.data.data;
        Taro.setStorageSync('memberId', memberId);
        Taro.setStorageSync('sessionId', sessionId);
      });
    });
    checkAppUpdate();
  }
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById('app'));

