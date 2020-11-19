import fetch from '@/utils/request';

// 配置配送方式
export const deliveryway = (params: any) => {
  return fetch.post('api/admin/v1/store/deliveryWay/setting', params);
};
// 获取当前配送方式
export const disWayMethod = () => {
  return fetch.get('api/admin/v1/store/deliveryWay/get');
};
// 退货地址配置
export const returnAddress = (params: any) => {
  return fetch.post('api/admin/v1/store/returnAddress/setting', params);
};
// 获取退货地址
export const getSalesAddress = () => {
  return fetch.get('api/admin/v1/store/returnAddress/get');
};
// 选择配送方式
export const chooseMode = (params) => {
  return fetch.json('api/admin/v1/store/deliveryWay/check', params);
};




/**
 * 获取地址列表
 */
export const listAddress = () => {
  return fetch.get('api/mall/v1/address/list');
};

/**
 * 获取单个地址
 */
export const getAddress = (params: any) => {
  return fetch.get('api/mall/v1/address/get', params);
};

/**
 * 添加地址
 */
export const addAddress = (params: any) => {
  return fetch.json('api/mall/v1/address/add', params);
};
/**
 * 更新地址
 */
export const updateAddress = (params: any) => {
  return fetch.json('api/mall/v1/address/update', params);
};

/**
 * 删除地址
 */
export const deleteAddress = (params: any) => {
  return fetch.post('api/mall/v1/address/delete', params);
};
/**
 * 默认地址
 */
export const updateDefaultAddress = (params: any) => {
  return fetch.post('api/mall/v1/address/updateDefault', params);
};
