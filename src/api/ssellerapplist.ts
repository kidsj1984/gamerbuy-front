import request from '@/utils/request'
import settings from '@/settings';

const isMock = true;
const mockHost = process.env.NODE_ENV === 'development' && (settings.mock || isMock) ? 'http://localhost:8081/mock-api2' : ''
const apiVersion = '/v1';

//获取卖家列表
export const getSellerList = (params:any) =>
  request({
    url: `${mockHost}${apiVersion}/Ssellerapplist/GetListByAppId`,
    method: 'get',
    params,
  })

//获取卖家订单详情
export const getDetailBySellOrderId = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Ssellerapplist/GetDetailBySellOrderId`,
    method: 'get',
    params,
  })
}


//获取卖家出售列表
export const getSellerOrderList = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Ssellerapplist/GetListByUid`,
    method: 'get',
    params,
  })
}

//订单任务
export const addMyOrder = (data:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/AddMyOrder`,
    method: 'post',
    data,
  })
}

export const addMyOrderForAlipay = (data:any) => {
  return request({
    url: `${mockHost}${apiVersion}/Steamorder/AddMyOrderForAlipay`,
    method: 'post',
    data,
  })
}
