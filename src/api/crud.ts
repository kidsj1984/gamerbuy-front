import request from '@/utils/request'

//获取音频违规信息列表
export const getStreamGreenResult = (params:any) =>
  request({
    url: '/v1/crud/stream_asr',
    method: 'get',
    params,
  })

//变更审核状态
export const updateStreamGreenResult = (id:number, data:any) =>
  request({
    url: `/v1/crud/stream_asr/${id}`,
    method: 'put',
    data,
  })

//获取单个违规数据
export const getStreamGreenResultById = (id:number) =>
  request({
    url: `/v1/crud/stream_asr/${id}`,
    method: 'get',
  })

//监控任务列表
export const getStreamTaskList = (params:any) =>
  request({
    url: '/v1/crud/stream_task',
    method: 'get',
    params,
  })

//获取单个监控任务
export const getStreamTask = (id:number) =>
  request({
    url: `/v1/crud/stream_task/${id}`,
    method: 'get',
  })

//更新监控任务
export const updateStreamTask = (data:any) => {
  const id = data.id;
  delete data.id;
  return request({
    url: `/v1/crud/stream_task/${id}`,
    method: 'put',
    data,
  })
}

//新增监控任务
export const addStreamTask = (data:any) =>
  request({
    url: '/v1/crud/stream_task',
    method: 'post',
    data,
  })


//监控任务列表
export const getSensitiveList = (params:any) =>
  request({
    url: '/v1/crud/sensitive',
    method: 'get',
    params,
  })

//获取单个监控任务
export const getSensitive = (id:number) =>
  request({
    url: `/v1/crud/sensitive/${id}`,
    method: 'get',
  })

//更新监控任务
export const updateSensitive = (data:any) => {
  const id = data.id;
  delete data.id;
  return request({
    url: `/v1/crud/sensitive/${id}`,
    method: 'put',
    data,
  })
}

//新增监控任务
export const addSensitive = (data:any) =>
  request({
    url: '/v1/crud/sensitive',
    method: 'post',
    data,
  })

//抓取详情
export const getStreamProcessList = (params:any) => 
  request({
    url: '/v1/crud/stream_stat_host',
    method: 'get',
    params,
  })


//获取身份列表  identity_flag: 1CP / 2平台 / 3机构
export const getIdentityist = (params:any) =>
  request({
    url: '/v1/crud/identity',
    method: 'get',
    params,
  })
