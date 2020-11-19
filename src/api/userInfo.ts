import fetch from '@/utils/request';

/**
 * 关于我们
 */
export const aboutus = () => {
  return fetch.get('api/v1/staticConfig/about_us_store');
};
// 我的
export const myuseinfo = () => {
  return fetch.get('api/admin/v1/store/registration/storeCenter');
};
// 店铺详情
export const storeDetail = () => {
  return fetch.get('api/admin/v1/store/registration/getStoreDetail');
};
// 修改店铺信息
export const upDataDetail = (params) => {
  return fetch.post('api/admin/v1/store/registration/updateRegistrationDetail', params);
};

// 需缴纳的保证金和年费
export const payMoney = () => {
  return fetch.get('api/admin/v1/store/registration/getPayAmount');
};
// 充值保证金
export const payAnnualMoney = (params) => {
  return fetch.post('api/admin/v1/store/registration/payAnnualMoney', params);
};
// 重置密码
export const updataPsd = (params) => {
  return fetch.json('api/admin/v1/account/updatePwd', params);
};
// 获取保证金信息
export const getmoneyAnnual = () => {
  return fetch.get('api/admin/v1/store/surplusMoneyMsg');
};
// 获取小程序码
export const WeChatcode = () => {
  return fetch.get('api/admin/v1/store/getSmallProgramCode');
};

// 获取优惠券分享小程序码
export const couponWeChatcode = () => {
  return fetch.get('api/admin/v1/store/invitationCouponPoster');
};

// 获取公众号二维码
export const apiWXfollowCodeImage = () => {
  return fetch.get('/api/v1/config/WECHATIMGURL');
};


// 店铺首页
export const storeHome = () => {
  return fetch.get('api/admin/v1/store/registration/indexData');
};
// 推荐新人
export const recommendUser = (type) => {
  return fetch.get('api/v1/staticConfig/recommendUser', { type });
};
// 相关问题和条款
export const related = (type) => {
  return fetch.get('api/v1/staticConfig/agreement', { type });
};
// 获取店铺分类
export const getstoreCategory = (params) => {
  return fetch.get('api/admin/v1/store/storeCategory/pages', params);
};

// 添加店铺分类
export const addStoreList = (params) => {
  return fetch.post('api/admin/v1/store/storeCategory/inserts', params);
};
// 修改店铺分类
export const updataStoreList = (params) => {
  return fetch.post('api/admin/v1/store/storeCategory/update', params);
};
// 删除店铺分类
export const deleteStoreList = (id) => {
  return fetch.post('api/admin/v1/store/storeCategory/delete', { id });
};