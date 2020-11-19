import fetch from "@/utils/request";

/**
 * 获取分类商品 
 */
export const goodsList = (params: any) => {
  return fetch.get("api/admin/mall/v1/guyuProduct/pageByStore", params);
};

// 商品分类
export const listBytype = (type, parentId) => {
  return fetch.get("api/v1/category/listByTypeAndParentId", { type, parentId });
};

// 新增商品
export const addGoods = (params) => {
  return fetch.json("api/admin/mall/v1/product/add", params);
};
// 编辑商品页面数据
export const geteditGoods = (id) => {
  return fetch.get("api/admin/mall/v1/product/get", { id });
};
// 编辑商品
export const editGoods = (params) => {
  return fetch.json("api/admin/mall/v1/product/update", params);
};
// 获取商品优质等级
export const prodLevel = () => {
  return fetch.get("api/admin/v1/config/listByParentId?parentId=PRODUCT_QUALITY_LEVEL");
};

// 获取商品参数
export const prodParam = (params) => {
  return fetch.get("api/admin/mall/v1/productParamCategory/list", params);
};
// 上架、下架
export const sellGoods = (params) => {
  return fetch.post("api/admin/mall/v1/product/sell", params);
};
// 获取店铺分类
export const getStoreClass = () => {
  return fetch.get("api/admin/v1/store/storeCategory/list");
};
