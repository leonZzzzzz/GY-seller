import fetch from '@/utils/request'

/**
 * 打印机列表
 */
export const getPrinter = (params) => {
  return fetch.get('api/admin/v1/printer/getPrinterByType', params)
}
/**
 * 添加--修改打印机
 */
export const addPrinter = (params) => {
  return fetch.post('api/admin/v1/printer/insert', params)
}
/**
 * 删除打印机
 */
export const deletePrinter = (params) => {
  return fetch.post('api/admin/v1/config/delete', params)
}
/**
 * 打标签
 */
export const printLabel = (params) => {
  return fetch.post('api/admin/v1/printer/printLabel', params)
}
