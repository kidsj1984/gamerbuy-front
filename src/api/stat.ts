import request from '@/utils/request'

//获取历史数据
export const getStreamStat = (params:any) =>
  request({
    url: '/v1/stream/datestat',
    method: 'get',
    params,
  })
