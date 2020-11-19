import fetch from '@/utils/request'
/**
 * 登陆接口
 */
export const login = params => {
  return fetch.post('api/v1/member/login', params)
}
/**
 * 授权接口
 */
export const authorize = (params: any) => {
  return fetch.post('api/store/v1/registration/authorize', params)
}
/**
 * 更新会员头像昵称
 */
export const updateMember = (params: any) => {
  return fetch.post('api/v1/member/updateMember', params)
}
/**
 * 获取用户信息
 */
export const userInfo = () => {
  return fetch.get('api/v1/member/info')
}

