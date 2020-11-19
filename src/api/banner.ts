import fetch from '@/utils/request';

// 获取轮播图列表
export const bannerList = () => {
  return fetch.get('api/admin/v1/store/storeCarousel/pages');
};
// 新增轮播图
export const addBanner = params => {
  return fetch.post('api/admin/v1/store/storeCarousel/inserts', params);
};
// 修改轮播图
export const updatabanner = params => {
  return fetch.post('api/admin/v1/store/storeCarousel/update', params);
};
// 删除
export const deletebanner = (id) => {
  return fetch.post('api/admin/v1/store/storeCarousel/delete', { id });
};
