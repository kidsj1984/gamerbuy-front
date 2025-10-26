import request from '@/utils/request'
import settings from '@/settings';

const isMock = true;
const mockHost = process.env.NODE_ENV === 'development' && (settings.mock || isMock) ? 'http://localhost:8081/mock-api2' : ''
const apiVersion = '/v1';

//根据uid查询卖家订单
export const getListBySellUid = (params:any) =>
  request({
    url: `${mockHost}${apiVersion}/Steamorder/GetListBySellUid`,
    method: 'get',
    params,
  })
  
//根据uid查询买家订单
export const getListByBuyUid = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/GetListByBuyUid`,
    method: 'get',
    params,
  })
}

//查询订单状态
export const getSteamOrderStatus = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/GetLogs`,
    method: 'get',
    params,
  })
}

//查询订单详情
export const getSteamOrderInfo = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/GetInfoByOrderId`,
    method: 'get',
    params,
  })
}

//查询卖家订单详情
export const getSteamOrderIdForSell = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/GetInfoByOrderIdForSell`,
    method: 'get',
    params,
  })
}

//stream账号登录
export const postSteamAccountLogin = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/LoginSteamAccount`,
    method: 'post',
    params,
  })
}

//stream账号二次验证
export const postSteamAccountVerify = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/SteamVerify`,
    method: 'post',
    params,
  })
}

//stream账号状态查询
export const getSteamAccountStatus = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/SteamLoginStatus`,
    method: 'get',
    params,
  })
}

//获取当前用户订单 充值
export const getOrderListByRecharge = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/PriceOrderList/GetListByDate`,
    method: 'get',
    params,
  })
} 

//获取当前用户订单 cdkeyZ
export const getOrderListByCDKey = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/GetListByBuyUid`,
    method: 'get',
    params,
  })
} 
