import request from '@/utils/request'

//获取平台列表options
export const getPlatformOptions = () =>
  request({
    url: '/v1/crud/platform?offset=0&limit=200',
    method: 'get',
  })

//获取直播内容options
export const getGamelistOptions = () =>
  request({
    url: '/v1/crud/category?offset=0&limit=2000',
    method: 'get',
  })

//获取违禁词分类
export const getSensitiveOptions = () =>
  request({
    url: '/v1/crud/sensitive?offset=0&limit=2000',
    method: 'get',
  })

//获取机构列表options
export const getAgencylistOptions = () =>
  request({
    url: '/v1/crud/identity?offset=0&limit=2000&identity_flag=3',
    method: 'get',
  })

//上传图片
export const uploadImages = (data:any) =>
  request({
    url: '/v1/cos/putobject',
    method: 'post',
    data,
  })
