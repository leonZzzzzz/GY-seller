import fetch from "@/utils/request";


// 订单列表
export const orderList = (params) => {
  return fetch.get("api/admin/mall/v1/store/guyuOrder/page", params);
};
//  * 订单详情
export const getOrderDetail = (id) => {
  return fetch.get("api/admin/mall/v1/store/guyuOrder/detail", { id });
};
// 订单发货
export const orderDelive = (id) => {
  return fetch.post("api/admin/mall/v1/order/deliver", { id });
};
// 退款订单列表
export const refundList = (params) => {
  return fetch.get("api/admin/mall/v1/store/guyuOrder/pageAfterSales", params);
};
// 改价
export const adjust = (params) => {
  return fetch.post("api/admin/mall/v1/store/guyuOrder/adjustAmount", params);
};
// 商家备注
export const addremark = (params) => {
  return fetch.post("api/admin/mall/v1/store/guyuOrder/updateRemark", params);
};
// 获取商家备注
export const getRemark = (id) => {
  return fetch.get("api/admin/mall/v1/store/guyuOrder/getRemark", { id });
};
// 订单关闭
export const orderCancel = (id) => {
  return fetch.post("api/admin/mall/v1/order/cancel", { id });
};
// 确认补单
export const supplierOrder = (id) => {
  return fetch.post("api/admin/mall/v1/store/guyuOrder/confirmSupplementOrder", { id });
};
// 补单关闭
export const mentCancel = (id) => {
  return fetch.post("api/admin/mall/v1/store/guyuOrder/cancelSupplementOrder", { id });
};
// 配送信息
export const getByOrderId = (orderId) => {
  return fetch.get("api/admin/v1/orderDriver/getOrderDriver", { orderId });
};
// 发票管理
export const getinvoice = (params) => {
  return fetch.get("api/admin/mall/v1/store/guyuOrder/page", params);
};
// 开票
export const finishInvoice = (orderId) => {
  return fetch.post("api/admin/mall/v1/store/guyuOrder/finishInvoice", { orderId });
};
// 打小票
export const orderPrintTicket = (orderId) => {
  return fetch.post("api/admin/mall/v1/print/printTicket", { orderId });
};
// 打标签
export const orderPrintLabel = (params) => {
  return fetch.post("api/admin/mall/v1/print/printLabel", params);
};
// 打标签获取订单未退款商品
export const printLabelGetOrderItems = (params) {
  return fetch.get('api/admin/mall/v1/store/guyuOrder/getOrderItems', params)
},









/**
 * 订单预览
 * orderItemIds 商品的id 多个用_连接
 */
export const getOrderPreview = (orderItemIds: string) => {
  return fetch.get("api/mall/v1/order/prepare", {
    orderItemIds
  });
};


/**
 * 订单购买
 */
export const postOrder = (params: any) => {
  return fetch.post("api/mall/v1/orderPay/prepay", params);
};
/**
 * 订单重新购买
 */
export const postResOrder = (params: any) => {
  return fetch.post("api/mall/v1/orderPay/retryPrepay", params);
};
// 微信支付
export const wechatPay = (params: any) => {
  return fetch.get("api/v1/wechat/pay_request_parameter", params);
};
/**
 * 订单列表
 */
export const pageOrder = (params: any) => {
  return fetch.get("api/mall/v1/order/page", params);
};
/**

/**
 * 订单取消
 */
export const cancelOrder = (params: any) => {
  return fetch.post("api/mall/v1/order/cancel", params);
};
/**
 * 订单完成
 */
export const finishOrder = (params: any) => {
  return fetch.post("api/mall/v1/order/finish", params);
};
/**
 * 获取订单超时时间
 */
export const shopOrderCancelTime = () => {
  return fetch.get("api/v1/config/shopOrderCancelTime");
};
/**
 * 订单状态统计
 */
export const getOrderStatus = () => {
  return fetch.get("api/mall/v1/order/getStatusQuantity");
};

// 退款订单详情
export const refundDetail = (afterSaleOrderId) => {
  return fetch.get("api/admin/mall/v1/store/guyuOrder/getAfterSales", { afterSaleOrderId });
};
// 同意买家申请
export const consentApply = (afterSaleOrderId) => {
  return fetch.post("api/admin/mall/v1/after-sale/guyu-refund/agree-apply", { afterSaleOrderId });
};
// 同意退款
export const consentRefund = (params) => {
  return fetch.post("api/admin/mall/v1/after-sale/guyu-refund/agree-refund", params);
};
// 拒绝退款
export const refuseRefund = (params) => {
  return fetch.post("api/admin/mall/v1/after-sale/refund/refuse", params);
};




