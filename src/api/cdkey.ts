import request from '@/utils/request';
import settings from '@/settings';

const isMock = true;
const mockHost = process.env.NODE_ENV === 'development' && (settings.mock || isMock) ? 'http://localhost:8081/mock-api2' : ''
const apiVersion = '/v1';

//获取卖家cdkey列表
export const getCDkeyList = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/CDKey/GetList`,
    method: 'get',
    params,
  })
}

//新增cdkey
export const addCDkey = (data:any) => {
  return request({
    url: `${mockHost}${apiVersion}/CDKey/AddMyCdKey`,
    method: 'post',
    data,
  })
}

//cdkey下架
export const setCDKeyToDown = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/CDKey/SetToDown`,
    method: 'get',
    params,
  })
}

//cdkey下架并删除
export const setCDKeyToDownAndDel = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/CDKey/SetToDownAndDel`,
    method: 'get',
    params,
  })
}

//cdkey上架
export const setCDKeyToUp = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/CDKey/SetToUp`,
    method: 'get',
    params,
  })
}

//更新cdkey价格
export const UpdatePriceById = (params:any) => {
  return request({
    url: `${mockHost}${apiVersion}/CDKey/UpdatePriceById`,
    method: 'get',
    params,
  })
}
