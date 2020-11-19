import fetch from "@/utils/request";

/**
 * 获取订单客户列表
 */
export const ordercust = (params) => {
  return fetch.get("api/admin/v1/storePc/customer/orderCustList", params);
};
/**
 * 标记老客户
 */
export const addOldCust = (params) => {
  return fetch.post("api/admin/v1/store/oldCust/add", params);
};
/**
 * 取消标记老客户
 */
export const cancelOldCust = (params) => {
  return fetch.post("api/admin/v1/store/oldCust/delete", params);
};
// 账期客户
export const payment = (mobilePhoneNumber) => {
    return fetch.get("api/admin/v1/storePc/customer/paymentCustList", { mobilePhoneNumber });
};
// 账期明细
export const paymentdetail = (paymentDaysId) => {
    return fetch.get("api/admin/v1/storePc/paymentDays/paymentDetail", { paymentDaysId });
};
// 新增账期客户手机号模糊搜索
export const fuzzyList = (phoneNum) => {
    return fetch.get("api/admin/v1/storePc/customer/listByMobile", { phoneNum });
};
// 新增账期客户
export const addcharge = (params) => {
    return fetch.post("api/admin/v1/storePc/paymentDays/inserts", params);
};
// 启用/停用账期客户
export const cancelCust = (params) => {
    return fetch.post("api/admin/v1/storePc/paymentDays/changeStatus", params);
};
// 修改账期客户
export const updataCharg = (params) => {
    return fetch.post("api/admin/v1/storePc/paymentDays/updates", params);
};
// 潜在客户
export const posentBus = (mobilePhoneNumber) => {
    return fetch.get("api/admin/v1/storePc/customer/potentialCustList", { mobilePhoneNumber });
};
// 还账记录
export const record = (params) => {
    return fetch.get("api/admin/v1/storePc/paymentDays/repaymentPage", params);
};
// 还账
export const repayment = (params) => {
    return fetch.post("api/admin/v1/storePc/paymentDays/deductMoney", params);
};
// 交易服务费
export const coverservice = (params) => {
    return fetch.get("api/admin/v1/store/serviceFeePage", params);
};