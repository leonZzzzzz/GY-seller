import fetch from "@/utils/request";

/**
 * 获取分类商品
 */
export const pageProduct = (params: any) => {
  return fetch.get("api/mall/v1/product/page", params);
};

/**
 * 获取商品详情
 * @param {Object} params
 */
export const getProduct = (params: any) => {
  return fetch.get('api/mall/v1/product/get', params)
}
/**
 * 获取商品规格
 */
export const getProductStock = (params: any) => {
  return fetch.get(`api/mall/v1/product/stock`, params)
}

/**
 * 购买商品
 * @param {object} params
 */
export const addProduct = (params: any) => {
  return fetch.post('api/mall/v1/cart/nowBuy', params)
}
