import fetch from "@/utils/request";

//#region
/**
 * 门店列表接口
 * @param params
 */
export const pageStore = () => {
  return fetch.get("api/mall/v1/store/list");
};
//#endregion

// 修改店铺信息接口--上传logo
export const uploadpic = (params: any) => {
  return fetch.post("api/v1/attachments/images/tencent_cloud", params);
};
//实收金额明细
export const relTotalAmount = (params: any) => {
  return fetch.get("api/admin/v1/store/registration/relTotalAmountPage", params);
};
// 应收金额明细
export const mustAmount = (params: any) => {
  return fetch.get("api/admin/v1/store/registration/mustAmountPage", params);
};
// 毛利金额明细
export const orderRelAmount = (params: any) => {
  return fetch.get("api/admin/v1/store/registration/orderRelAmountPage", params);
};
// 账期金额
export const paymentAmount = (params: any) => {
  return fetch.get("api/admin/v1/store/registration/paymentAmountPage", params);
};
// 待结算
export const settlementAmount = (params: any) => {
  return fetch.get("api/admin/v1/store/registration/settlementAmountPage", params);
};