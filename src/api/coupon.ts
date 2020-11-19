import fetch from "@/utils/request";

/**
 * 获取优惠券列表
 */
export const couponList = (params) => {
    return fetch.get("api/admin/v1.1/store-coupon-rule/page", params);
};
// 新增优惠券
export const addcoupons = (params) => {
    return fetch.post("api/admin/v1.1/store-coupon-rule/insert", params);
};
// 修改优惠券
export const insertcoupons = (params) => {
    return fetch.post("api/admin/v1.1/store-coupon-rule/update", params);
};
// 禁用优惠券
export const abortcoupon = (id) => {
    return fetch.post("api/admin/v1/coupon_rule/abort", { id });
};
// 启用
export const usercoupon = (id) => {
    return fetch.post("api/admin/v1/coupon_rule/publish", { id });
};