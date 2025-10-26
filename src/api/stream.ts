import request from '@/utils/request'

//历史数据列表
export const getStreamStatList = (params:any) =>
  request({
    url: '/v1/stream/datestatlist',
    method: 'get',
    params,
  })

//统计汇总
export const getStreamAllstat = (params:any) =>
  request({
    url: '/v1/stream/getallstat',
    method: 'get',
    params,
  })
  
//新增监控任务（手动）
export const addRankbatch = (params:any, data:any) => {
  return request({
    url: '/v1/stream/rankbatch',
    method: 'post',
    params,
    data,
  })
}

//查询监控任务（手动）
export const getRankbatch = (params:any) => {
  return request({
    url: '/v1/crud/stream_rank',
    method: 'get',
    params,
  })
}

