
// cd-key详情model
export interface IGameCDKeyDetailData {
  detail: IGameDetailData
  relatelist: Array<IGameDetailData>
}

// 游戏详情信息
export interface IGameDetailData {
  id: number
  atype: string
  aname: string
  steam_appid: number
  required_age: number
  is_free: number
  detailed_description: string
  about_the_game: string
  short_description: string
  fullgame: string
  supported_languages: string
  header_image: string
  website: string
  pc_requirements: string
  mac_requirements: string
  linux_requirements: string
  developers: string
  publishers: string
  price_overview: any
  packages: string
  platforms: string
  categories: string
  genres: string
  screenshots: string
  release_date: string
  support_info: string
  background: string
  writetime: string
  newPrice: number
  likeRate: string
  lowestPrice: number
}

// 卖家游戏详情
export interface ISellOrderDetailData {
  gameCover: string
  gameName: string
  lowestPrice: number
  originPrice: number
  platForm: string
  steamAppid: number
  steam_avatar_new: string
  steam_community_status: string
  steam_have_games_count: number
  steam_join_date: string
  steam_nick_name: string
  steam_trade_status: string
  steam_user_grade: number
  steam_vac_status: string
}

//old
export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
  identity: number
  token: string
}

//违规列表(音频)
export interface IViolationAudioListData {
  id: number
  flag: number
  dateCreated: number
  dateUpdated: number
  streamId: number
  platformId: number
  categoryId: number
  domain: string
  name: string
  follower: number
  greenId: number
  frameOffset: number
  audioText: string
  audioURL: string
  videoURL: string
  taskId: string
  dateOffseted: number
  label: string
  keywords: string
  suggestion: string
  audit: number
}

//违规列表
export interface IViolationListData {
  id: number
  date: string
  platform: string
  type: string
  cpStatus: string
  status: string
}

//用户列表
export interface IUserListData {
  id: number
  phone: string
  identity: number
  status: number
}

//主播列表
export interface IAnchorListData {
  id: number
  nickName: string
  name: string
  phone: string
  games: string
  platform: string
}
//主播审核列表
export interface IAnchorReviewData {
  id: number
  nickName: string
  name: string
  phone: string
  idCard: string
  platform: string
}

//主播授权列表
export interface IAnchorAuthData {
  id: number
  nickName: string
  game: string
  agency: string
  platform: string
  status: string
}

//数据历史列表
export interface IStatisticsListData {
  startDate: number   //监测开始时间
  endDate: number     //监测结束时间
  uv: number          //监测人数
  labelUv: number     //违规人数
  platform: number    //监测平台数
  labelRate: number   //违规率
  totalDuration: number   //监测总时长
  avgDuration: number     //主播平均监测时长
}

//监控历史列表
export interface IMonitorListData {
  id: number          //监测任务ID
  start: number       //监测开始时间
  end: number         //监测结束时间
  rank: number        //榜单类型
  platformId: number  //平台ID
  categoryId: number  //分类ID
  period: number      //周期
  offsetStart: number //开始范围
  offsetEnd: number   //结束范围
  flag: number        //监测状态    1:未开始 2:进行中 3:已停止 4:已结束
}

//抓取详情列表
export interface IStatisticsFetchData {
  url: string         //房间地址
  nickname: string     //主播昵称
  uv: number          //订阅数
  platform: number    //监测平台数
  startDate: number   //开始监测时间
  endDate: number   //结束监测时间
  totalDuration: number   //录制时长
}

//敏感词列表
export interface ISensitiveListData {
  id: number
  dateCreated: number
  dateUpdated: number
  flag: number
  keyword: string
  label: string
}

//详情model
//签约平台内容
export interface IContractPlatformData {
  id: number
  platformId: any
  platformName?: string
  url: string
  editType?: boolean
  [propName: string]: any   //可以随意扩展
}
