export const ORDER_STATUS: any = [
  { value: 0, label: '全部' }, 
  { value: 1, label: '交易中' }, 
  { value: 2, label: '交易超时' }, 
  { value: 3, label: '已取消' },
  { value: 4, label: '交易完成' },
];

export const SELLER_STATUS: any = [
  { value: 0, label: '出售中' }, 
  { value: 1, label: '已出售' }, 
  { value: 2, label: '已下架' }, 
];

export const CDKEY_SELLER_STATUS: any = [
  { value: -1, label: '锁定中', key: 'LOCKED' }, 
  { value: 0, label: '出售中', key: 'SALING' }, 
  { value: 1, label: '已出售', key: 'SOLD' }, 
  { value: 2, label: '已下架', key: 'REMOVED' }, 
];

export const CDKEY_PLATFORM: any = [
  { value: 1, label: 'Steam', key: 'SOLD' }, 
];
