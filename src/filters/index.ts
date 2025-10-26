import { values } from 'lodash';
import moment from 'moment'
// Set utils function parseTime to filter
export { parseTime } from '@/utils'

// stream格式转换
export const streamJsonFormat = (data: string, row: string) => {
  let returnData = null;
  try {
    const dataObj = JSON.parse(data);
    if (dataObj) {
      returnData = dataObj[row];
    }
  } catch (error) {
    
  }

  return returnData;
}

// 金额进行除以1e2
export const formatAmountE2 = (value: number) => {
  if (!value || isNaN(value)) {
    return 0;
  }

  return parseFloat((value / 1e2).toFixed(2));
}


// 金额进行除以1e2
export const formatAmount = (value: number) => {
  if (!value || isNaN(value)) {
    return 0;
  }

  return value.toFixed(2);
}

// 百分比
export const formatPercent = (value: number, digits = 2, isMul: true) => {
  if (!value || isNaN(value)) {
    return '0%';
  }

  if (value) {
    let percentNumber = parseFloat(Number(value).toFixed(digits));
    if (isMul) {
      percentNumber = parseFloat((value * 1e2).toFixed(digits));
    }
    console.log(99999, percentNumber)

    if (percentNumber >= 100) {
      percentNumber = 99
    } else if (percentNumber <= -100) {
      percentNumber = -99
    }

    return percentNumber + '%';
  }
  return '0%';
}

// 数字格式
export const formatNumber = (value: number, digits = 0) => {
  if (isNaN(value)) {
    return 0;
  }
  if (digits > 0) {
    return value.toFixed(digits);
  } else {
    return parseInt(String(value));
  }
}

//根据key获取name
export const getTypeNameByKey = (value: number, options = [], valueName = 'value', labelName = 'label') => {
  // console.log(1213123, value)
  const selectObj = options.filter(item => (item[valueName] === value))[0];
  return (selectObj && selectObj[labelName]) || '';
}

//根据keyList获取name
export const getTypeNameByKeyList = (value: string, options = [], valueName = 'value', labelName = 'label') => {
  const valueArr = (value && value.split(',')) || [];
  const valueId = valueArr.map((item:string) => (getTypeNameByKey(parseInt(item), options, valueName, labelName)));
  return (valueId && valueId.join(',')) || '';
}

// old
// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 字符串自定义模版，只支持前后 $%S$  替换%S
export const formatTxt = (str: string, key: string) => {
  if (key) {
    const reg = '%S';
    const re = new RegExp(reg, 'gm');
    const newStr = key.replace(re, str);
    return newStr;
  }
  return str;
}

// 时间格式转换
export const formatDate = (value: number, isMillisecond = false, fmt = 'yyyy-MM-dd HH:mm:ss') => {
  const newValue = !isMillisecond ? value * 1000 : value;
  const date = new Date(newValue);

  const o:any = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;

  // if (digits > 0) {
  //   return value.toFixed(digits);
  // } else {
  //   return parseInt(String(value));
  // }
}


// 时间格式转换 数字转时分秒
export const formatTime = (value: number) => {
  const time = moment.duration(value, 'seconds');
  return moment({ h: time.hours(), m: time.minutes(), s: time.seconds() }).format('HH:mm:ss');
}

export const formatDate2 = (value: any, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment(parseInt(value)).format(format);
}

export const formatDateBySplit = (value: string, index: number, splitKey = '-') => {
  const valueSplit = value && value.split(splitKey);
  if (valueSplit) {
    if (index === 1) {
      return `${valueSplit[3]}-${valueSplit[4]}-${valueSplit[5]}`;
    } else {
      return `${valueSplit[0]}-${valueSplit[1]}-${valueSplit[2]}`;
    }
  }
  return '';
}


//获取分类名称
export const getLabelCNName = (value: string) => {
  let title = '';
  switch (value) {
    case 'polity':
      title = '政治';
      break;
    case 'porn':
      title = '色情';
      break;
    case 'abuse':
      title = '谩骂';
      break;
    case 'illegal':
      title = '非法';
      break;
    case 'terror':
      title = '暴恐';
      break;
    default:
      title = '广告';
      break;
  }

  return title;
}
