import Taro, { Chain } from '@tarojs/taro';
import { authorize } from '@/api/common';
import { pageStore } from '@/api/store';

/**
 * 处理会话过期后，自动请求上次的数据
 * @param url
 * @param data
 * @param method
 * @param header
 */
async function authorizeAndRequest(url: string, data: object, method: Method, header: object) {
  const code = await Taro.login();
  //重新授权
  const res = await authorize({ code: code.code });
  const { memberId, sessionId } = res.data.data;
  // 保存 memberId
  Taro.setStorageSync('memberId', memberId);
  // 保存 storeId
  Taro.setStorageSync('sessionId', sessionId);
  return Taro.request({
    url,
    data,
    method,
    header
  });
}

// 是否需要 storeId
export const needStoreIdRequest = async function (chain: Chain) {
  const data = chain.requestParams.data;
  if (data && 'storeId' in data) {
    let storeId = Taro.getStorageSync('storeId');
    if (storeId) {
      data.storeId = storeId;
      return chain.proceed(chain.requestParams).then((res: any) => {
        return res;
      });
    } else {
      const result = await pageStore();
      storeId = result.data.data[0].id;
      data.storeId = storeId;
      Taro.setStorageSync('storeId', storeId);
      return chain.proceed(chain.requestParams).then((res: any) => {
        return res;
      });
    }
  } else {
    return chain.proceed(chain.requestParams).then((res: any) => {
      return res;
    });
  }
};

// 响应拦截
export const response = async function (chain: Chain) {
  const sessionId = Taro.getStorageSync('sessionId');
  if (sessionId) {
    chain.requestParams.header.WPGSESSID = sessionId;
    chain.requestParams.header.Cookie = 'SESSION=' + sessionId;
  }
  return chain.proceed(chain.requestParams).then((res: any) => {
    const { url, method, data, header } = chain.requestParams;
    if (res.data.code === 20000) {
      return Promise.resolve(res);
    } else if (res.data.code === 63021 || res.data.code === 10000) {
      // 是否有memberId
      if (!Taro.getStorageSync('memberId')) {
        // Taro.navigateTo({ url: '/pages/authorize/index' });
        return Promise.reject(res);
      } else {
        return authorizeAndRequest(url, data, method as Method, header);
      }
    } else if (res.data.code === 63020) {
      // 有 memberId 重新登录并请求上次数据
      return authorizeAndRequest(url, data, method as Method, header);
    } else if (res.data.code === 50103) {
      return authorizeAndRequest(url, data, method as Method, header);
    } else if (res.data.code === 21001) {

    }

    else {
      Taro.showToast({
        title: res.data.message,
        icon: 'none'
      });
      return Promise.reject(res);
    }
  });
};
