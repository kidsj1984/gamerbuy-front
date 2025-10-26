import request from '@/utils/request'
import settings from '@/settings';

const isMock = true;
const mockHost = process.env.NODE_ENV === 'development' && (settings.mock || isMock) ? 'http://localhost:8081/mock-api2' : ''
const apiVersion = '/v1';

//用邮箱获取token
export const loginByEMail = (params: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/LoginByEmail`,
    method: 'get',
    params
  })

//用短信获取token
export const loginByPhone = (params: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/LoginByPhone`,
    method: 'get',
    params
  })

//获取当前用户信息 
export const getCurrentUser = () =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/GetCurrentUserInfo`,
    method: 'get',
  })

//注册账号  (注册第一步)   
export const registerStep1 = (data: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/RegUser`,
    method: 'post',
    data,
  })  

//登录短信发送 
export const getCaptchasendByLogin = (params: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/GetVerificationCodeForLogin`,
    method: 'get',
    params,
  })

//注册短信发送 
export const getCaptchasendByReg = (params: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/GetVerificationCode`,
    method: 'get',
    params,
  })

//steam账号注册 
export const regUserForSteam = (data: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/RegUserForSteam`,
    method: 'post',
    data,
  })

export const logout = () =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/Logout`,
    method: 'post'
  })

//忘记密码
export const getPassWordReset = (params: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/PassWordReset`,
    method: 'get',
    params,
  })

//重置忘记密码
export const getResetPassWordByActivationCode = (params: any) =>
  request({
    url: `${mockHost}${apiVersion}/UserInfo/ResetPassWordByActivationCode`,
    method: 'get',
    params,
  })

// 以下是老代码
//用账号密码获取token
export const getUserTokenByPassword = (basic: string, key: string) =>
  request({
    url: `/v1/users/token/${key}`,
    method: 'get',
    headers: {
      Authorization: `Basic ${basic}`
    }
  })


//获取用户信息
export const getUserInfo = () =>
  request({
    url: '/v1/users/1',
    method: 'get',
  })

//主播身份证添加  (注册第二步 1 主播)  
export const addIDCard = (data: any) =>
  request({
    url: '/v1/crud/idcard',
    method: 'post',
    data,
  })  

//更新主播身份证
export const updateIDCard = (data: any) => {
  const id = data.id;
  delete data.id;
  request({
    url: `/v1/crud/idcard/${id}`,
    method: 'put',
    data,
  })   
}

//主播身份添加  (注册第二步 2 主播)  
export const addHost = (data: any) =>
  request({
    url: '/v1/crud/host',
    method: 'post',
    data,
  }) 

//更新主播身份  
export const updateHost = (data: any) => {
  const id = data.id;
  delete data.id;
  request({
    url: `/v1/crud/host/${id}`,
    method: 'put',
    data,
  })   
}

//获取单个主播详情
export const getHost = (id:number) =>
  request({
    url: `/v1/crud/host_idcard_identity/${id}`,
    method: 'get',
  })

//获取主播列表
export const getHostList = (params:any) =>
  request({
    url: '/v1/crud/host',
    method: 'get',
    params,
  })

//其他身份添加  (注册第二步 2 机构/平台/CP)  
export const addIdentity = (data: any) =>
  request({
    url: '/v1/crud/identity',
    method: 'post',
    data,
  })

//更新身份添加  (机构/平台/CP)  
export const updateIdentity = (data: any) => {
  const id = data.id;
  delete data.id;
  return request({
    url: `/v1/crud/identity/${id}`,
    method: 'put',
    data,
  })
}

//获取单个其他身份 (机构/平台/CP)
export const getIdentity = (id:number) => 
  request({
    url: `/v1/crud/identity/${id}`,
    method: 'get',
  })

  
//获取当前用户信息 
export const getCurrentHost = () =>
  request({
    url: '/v1/current/host',
    method: 'get',
  })
  
//获取当前用户信息 
export const getCurrentIdcard = () =>
  request({
    url: '/v1/current/idcard',
    method: 'get',
  })

//获取当前用户信息 
export const getCurrentIdentity = () =>
  request({
    url: '/v1/current/identity',
    method: 'get',
  })
  
//获取用户列表
export const getUsersList = (params: any) =>
  request({
    url: '/v1/crud/user',
    method: 'get',
    params
  })

//获取单个用户
export const getUser = (id:number) =>
  request({
    url: `/v1/crud/user/${id}`,
    method: 'get',
  })

//管理员创建用户
export const addUser = (data: any) =>
  request({
    url: '/v1/crud/user',
    method: 'post',
    data,
  })  

//管理员更新用户
export const updateUser = (data: any) => {
  const id = data.id;
  delete data.id;
  return request({
    url: `/v1/crud/user/${id}`,
    method: 'put',
    data,
  })  
}

export const getUsers = (params: any) =>
  request({
    url: '/v1/users/1',
    method: 'get',
    params
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const login = (data: any) =>
  request({
    url: '/users/login',
    method: 'post',
    data
  })
