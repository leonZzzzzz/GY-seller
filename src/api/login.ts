import fetch from '@/utils/request';

// 获取店铺审核状态
export const audit = () => {
  return fetch.get('api/store/v1/registration/auditSituation');
};
// 静默授权
export const authorize = code => {
  return fetch.post('api/store/v1/registration/authorize', { code });
};
// 店铺入驻
export const joinStore = params => {
  return fetch.post('api/store/v1/registration/joinStore', params);
};
export const authorize1 = () => {
  return fetch.get('api/store/v1/registration/testSessionId');
};
// 获取经营种类
export const listbylist = type => {
  return fetch.get('api/v1/category/listByType', { type });
};


//  图片上传
export const uodataPic = (temFilePath: string, params: any) => {
  return fetch.upload('api/v1/attachments/images/tencent_cloud', temFilePath, params);
};
// 查看账号密码
export const checkAccount = () => {
  return fetch.get('api/store/v1/registration/getInitAccount');
};
// 查看店铺入驻资料
export const allowView = () => {
  return fetch.get('api/store/v1/registration/getRegistrationDetail');
};
// 修改店铺入驻资料
export const updataStore = params => {
  return fetch.post('api/store/v1/registration/updateRegistrationDetail', params);
};
// 测试
// export const testlogin = () => {
//   return fetch.get('api/admin/mall/v1/store/guyuOrder/testStoreId');
// };
// 获取验证码
export const verilPhone = params => {
  return fetch.post('api/store/v1/registration/smsCode', params);
};
// 重置密码
export const resetPassword = params => {
  return fetch.post('api/store/v1/registration/resetPassword', params);
};



/**
 * 登陆
 * orderItemIds 商品的id 多个用_连接
 */
export const getOrderPreview = params => {
  return fetch.post('login', params);
};

// 退出登录
export const loginOut = params => {
  return fetch.post('guyuLogout', params);
};
