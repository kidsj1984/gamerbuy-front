import { objKV2ArrKV } from '@/utils/common';

//支付渠道
export const PAYMENT_METHOD: { [key: string]: number } = {
  WXPAY: 1,
  ALIPAY: 2,
}

//订单流程枚举
export const ORDER_STEP_KEY: { [key: string]: string } = {
  SUBMIT_ORDER: 'submitOrder',      // 1 => 跳转到付款页
  CASH_SUCCESS: 'cashSuccess',      // 2 => 跳转到steam登录  notlogin
  PRODUCT_SELL: 'productSell',      // 3 => 跳转到订单状态
  WAIT_FOR_VERIFY: 'waitForVerify', // 4 => 订单状态
  DONE: 'done',                     // 5 => 订单状态
}

// 订单页面跳转枚举
export const ORDER_STATUS_FLAG = {
  HOME: 0,
  ORDER: 1,
  SETTING: 2,
  STATUS: 3,
}

// 订单状态枚举
export const  ORDER_STATUS_KEY = {
  // 0: 无效订单    交易状态：无效订单
  invalidorder: { status: 0, path: '/', jumpFlag: 0, stepFlag: 0, statusMsg: '无效订单' },
  // 1:submitorder(锁cdkey，5分钟内，页面 跳转支付    交易状态：交易中
  submitorder: { status: 1, path: '/cdkey/gameOrder/{%data.orderId%}', jumpFlag: 1, stepFlag: 1, statusMsg: '交易中' },
  // 1.1: 5分钟外，释放cdkey，支付超时（页面 跳转订单状态，并且显示超时，订单完结状态） 交易状态：订单超时
  ordertimeout: { status: 1.1, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 1, statusMsg: '订单超时' },
  // 1.2:取消订单，释放cdkey，（页面 跳转订单状态，并且显示订单取消，订单完结状态） 交易状态：订单取消
  cancelorder: { status: 1.2, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 1, statusMsg: '订单取消' },
  // 2:cashsuccess(页面 跳转steam登录) 需要补充异常情况。交易中 （notlogin） 交易状态：交易中
  cashsuccess: { status: 2, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.1: 正在登录中 交易状态：交易中
  doing: { status: 2.1, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.2: steam密码错误 交易状态：交易中
  wrongpassword: { status: 2.2, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.3: 需要二次验证 交易状态：交易中
  needverify: { status: 2.3, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.4: 正在二次验证 交易状态：交易中
  hasupdate: { status: 2.4, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.5: 获取verifyCode超时 交易状态：交易中
  verifycodetimeout: { status: 2.5, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.6: verifyCode错误 交易状态：交易中
  wrongverifycode: { status: 2.6, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 2.7: 失败 交易状态：交易中
  fail: { status: 2.7, path: '/cdkey/gameSetting/{%data.orderId%}', jumpFlag: 2, stepFlag: 2, statusMsg: '交易中' },
  // 3: steam登录成功（页面 订单状态页面） 交易状态：交易中
  steamloginsuccess: { status: 3, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 3, statusMsg: '交易中' },
  // 4: 验证商品成功 交易状态：交易中
  verifyproductsuccess: { status: 4, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 4, statusMsg: '交易中' },
  // 4.1: 无效cdkey 交易状态：交易失败(无效cdkey)
  invalidcdkey: { status: 4.1, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 4, statusMsg: '交易失败(无效cdkey)' },
  // 4.2: cdkey已经激活过了 交易状态：交易失败(cdkey已使用)
  cdkeyused: { status: 4.2, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 4, statusMsg: '交易失败(cdkey已使用)' },
  // 4.3: cdkey激活游戏不对版 交易状态：交易失败(无效cdkey)
  cdkeywronggame: { status: 4.3, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 4, statusMsg: '交易失败(激活游戏与出售商品不符)' },
  // 5: 交易成功 交易状态：完成
  tradefinish: { status: 5, path: '/buyer/orderDetail/{%data.orderId%}', jumpFlag: 3, stepFlag: 5, statusMsg: '完成' },
}

export const ORDER_STEP_DATA: { [key: string]: any } = {
  submitOrder: { id: 0, path: '/cdkey/gameOrder/{%data.orderId%}' },
  cashSuccess: { id: 1, path: '/cdkey/gameSetting/{%data.orderId%}' },
  productSell: { id: 2, path: '/cdkey/gameStatus/{%data.orderId%}' },
  waitForVerify: { id: 3, path: '/cdkey/gameStatus/{%data.orderId%}' },
  done: { id: 4, path: '/cdkey/gameStatus/{%data.orderId%}' },
}

// 订单流程枚举
export const STREAM_STATUS: { [key: string]: string } = {
  SUCCESS: 'steamloginsuccess',           // 成功
  FAIL: 'fail',                           // 失败
  NEEDVERIFY: 'needverify',               // 二次验证
  NOTLOGIN: 'cashsuccess',
  DOING: 'doing',                         // 初始化
  HASUPDATE: 'hasupdate',                 // 已经更新code
  WRONGPASSWORD: 'wrongpassword',         // 密码错误
  VERIFYCODETIMEOUT: 'verifycodetimeout', // 获取verifyCode超时
  WRONGVERIFYCODE: 'wrongverifycode',     // verifyCode错误
}

// 协议类型
export const AGREEMENT_TYPE: { [key: string]: string } = {
  AGREEMENT: '1',     // 用户协议
  PRIVACY: '2',  // 隐私协议
}

// 订单类型
export const ORDER_TYPE: { [key: string]: string } = {
  CDKEY: '1',     // cdkey
  RECHARGE: '2',  // 充值
}

// 低代码form表单枚举
export const LOW_CODE_FORM_TYPE: { [key: string]: string } = {
  SELECT: 'select',               // 选择框
  DATEPICKER: 'datepicker',       // 日期选择
  INPUT: 'input',                 // 输入框
  SEARCH: 'search',               // 搜索
  ACTION: 'action',               // 操作
}

// 低代码表格枚举
export const LOW_CODE_TABLE_TYPE: { [key: string]: string } = {
  ENUM: 'enum',                   // 枚举值
  DATE: 'date',                   // 日期选择
  TEXT: 'text',                   // 文本
  IMG: 'image',                   // 图片
  ACTION: 'action',               // 操作
  CUSTOM: 'custom',               // 自定义
}

// 用户身份
export const USER_TYPE: { [key: string]: string } = {
  buyer: 'buyerPersonal',
  seller: 'sellerPersonal',
}


// old
export const IDENTITY_TYPE: { [key: string]: string } = {
  ANCHOR: 'HOST',           //主播
  AGENCY: 'CLUB',           //机构
  LIVE_PLATFORM: 'PLATFORM',    //直播平台
  CP: 'CP',               //内容提供商
  FEG: 'ADMIN',               //知识产权平台
  ADMIN: 'ADMIN'               //知识产权平台
};

export const REG_TYPE: Array<Object> = [
  { value: 'HOST', name: '我是主播' },         //主播
  { value: 'CLUB', name: '我是机构' },         //机构
  { value: 'PLATFORM', name: '我是平台' },     //直播平台
  // { value: 'CP', name: '我是游戏厂商' },            //内容提供商
  // { value: 'ADMIN', name: '我是管理员' },      //feg
];

// export const USER_IDENTITY_TYPE_OBJ: any = { HOST: '主播', CLUB: '机构', PLATFORM: '平台', CP: '游戏厂商', ADMIN: '管理员' };
// export const USER_STATUS_OBJ: any = { 1: '启用', 2: '停用' }


// export const USER_IDENTITY_TYPE: Array<Object>  = objKV2ArrKV(USER_IDENTITY_TYPE_OBJ);
// export const USER_STATUS: Array<Object> = objKV2ArrKV(USER_STATUS_OBJ);

export const VIOLATION_FEG_AUDIT: any = [{ value: 1, label: '下播处理' }, { value: 2, label: '警告处理' }, { value: 3, label: '封禁处理' }]
export const VIOLATION_OTHER_AUDIT: any = [{ value: 0, label: '未处理' }, { value: 1, label: '已处理' }]
export const AUDIT_ALL_STATUS: any = [{ value: 0, label: '所有' }, { value: 1, label: '待审核' }, { value: 2, label: '在册' }, { value: 3, label: '被拒绝' }];
export const AUDIT_STATUS: any = [{ value: 0, label: '所有' }, { value: 1, label: '未审核' }, { value: 2, label: '同意' }, { value: 3, label: '误判' }];
export const LABEL_OPTIONS: any = [{ value: 'Normal', label: '正常' }, { value: 'Terror', label: '暴恐' }, { value: 'Porn', label: '色情' }, { value: 'Polity', label: '政治' }, { value: 'Abuse', label: '谩骂' }, { value: 'Illegal', label: '违法' }, { value: 'Ad', label: '广告' }, { value: 'Custom', label: '自定义词库' }];
export const LABEL_OPTIONS2: any = [{ value: 0, label: '全部' }, { value: 2, label: '暴恐' }, { value: 3, label: '色情' }, { value: 4, label: '政治' }, { value: 5, label: '谩骂' }, { value: 6, label: '违法' }, { value: 7, label: '广告' }];
export const MONITOR_STATUS: any = [{ value: 1, label: '未开始' }, { value: 2, label: '进行中' }, { value: 3, label: '已停止' }, { value: 4, label: '已结束' }];
export const MONITOR_RANK: any = [{ value: 2, label: '礼物榜' }, { value: 3, label: '人气榜' }, { value: 4, label: '弹幕榜' }, { value: 5, label: '粉丝榜' }];
export const MONITOR_PERIOD: any = [{ value: 0, label: '今天' }, { value: 1, label: '昨天' }, { value: 7, label: '近7天' }, { value: 31, label: '近30天' }, { value: 8, label: '本周' }, { value: 21, label: '本月' }];
export const MONITOR_WEEK: any = [{ value: 1, label: '周一' }, { value: 2, label: '周二' }, { value: 3, label: '周三' }, { value: 4, label: '周四' }, { value: 5, label: '周五' }, { value: 6, label: '周六' }, { value: 0, label: '周日' }];
export const MONITOR_TYPE: any = [{ value: 1, label: '榜单' }, { value: 2, label: '手动' }];

export const REVIEW_FAIL_REASON: any = ['资料提交有误', '资料不真实', '其他'];
