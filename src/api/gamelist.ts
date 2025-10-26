import request from '@/utils/request'
import settings from '@/settings';

const isMock = true;
const mockHost = process.env.NODE_ENV === 'development' && (settings.mock || isMock) ? 'http://localhost:8081/mock-api2' : ''
const apiVersion = '/v1';


//获取游戏列表
export const getGameInfoList = (params:any) =>
  request({
    url: `${mockHost}${apiVersion}/GameInfo/GetList`,
    method: 'get',
    params,
  })


//获取游戏列表
export const getGetAppDetail = (params:any) =>
  request({
    url: `${mockHost}${apiVersion}/GameInfo/GetAppDetail`,
    method: 'get',
    params,
  })
