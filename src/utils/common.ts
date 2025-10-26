import intersectionWith from 'lodash/intersectionWith'
import { ORDER_STEP_KEY, ORDER_STEP_DATA } from '@/enum/common'

export const apiDomin = 'api.iding.vip';
/** 
 * 模版映射
 * 结构如下
 * {data: {name: 123,className:'hd'}}
 ***/
export const getTpl = (template:string, data: any) => {
  return template.replace(/\{%([^%\{\}]+)%}/g, function(orgin, item) {
    item = item.replace(/^\s+|\s+$/, '');
    let params = [];
    if (item.indexOf('.') > -1) {
      params = item.split('.')
    }
    return params.reduce((a:any, b:any) => {
      return a[b]
    }, data)
  })
}

/**
 * 订单状态
 * @param stepData 订单状态流程
 * @param currentStep 当前页面步骤id
 * @param orderId 订单id
 */
export const parseOrderStatus = (stepData: any, currentStep: string[], orderId: string) => {
  // const jumpPath = getTpl(ORDER_STEP_DATA[currentStep].path, { data: { orderId: this.orderId } });
  let pageStep = ORDER_STEP_KEY.SUBMIT_ORDER;
  // console.log(222, stepData, currentStep)
  // console.log(111, ORDER_STEP_DATA[currentStep].id, getTpl(ORDER_STEP_DATA[currentStep].path, { data: { orderId: 'asdf' } }));
  if (stepData) {
    stepData.forEach((item:any) => {
      // console.log(3333, item);
      if (item.orderStatus === '1') {
        pageStep = item.orderContent;
      }
    });
  }

  let hasJump = false;
  const jumpPath = getTpl(ORDER_STEP_DATA[pageStep].path, { data: { orderId } });
  // console.log(9888, currentStep, pageStep)
  if (currentStep.indexOf(pageStep) === -1) {
    hasJump = true;
  }
  // console.log(8888, pageStep, currentStep, jumpPath, hasJump);

  return {
    hasJump,
    jumpPath,
  }
}

/**
 * 订单状态
 * @param stepData 订单状态流程
 * @param currentStep 当前页面步骤id
 * @param orderId 订单id
 */
export const parseOrderStatus2 = (stepData: any, currentStep: number, orderId: string) => {
  
  let hasJump = false;
  let jumpPath = '/';
  // console.log(222, stepData, currentStep)
  // console.log(111, ORDER_STEP_DATA[currentStep].id, getTpl(ORDER_STEP_DATA[currentStep].path, { data: { orderId: 'asdf' } }));
  if (!stepData) {
    hasJump = true;
    jumpPath = '/';
  } else {
    hasJump = stepData?.jumpFlag !== currentStep;
    jumpPath = getTpl(stepData?.path, { data: { orderId } });
  }

  return {
    hasJump,
    jumpPath,
  }
}


export const flatTree = (arr:Array<any>, defaltKey = 'children'):Array<any> => {
  return arr.flatMap((curr:any) => {
    let newArr = curr;
    if (curr[defaltKey]) {
      const treeArr:Array<any> = flatTree(curr[defaltKey], defaltKey);
      newArr = treeArr.map((item:any) => {
        const obj = { ...curr, ...item };
        delete obj[defaltKey]; 
        return obj;
      });
    }
    return newArr;
  });
}

//数组KV转成obj对象
export const arrKV2ObjKV = (arr:any, keyName = 'key', valueName = 'value') => {
  const obj:any = {};
  arr?.forEach((item: any) => {
    obj[item[keyName]] = item[valueName]
  });
  return obj;
}

//obj对象转成key value模式
export const objKV2ArrKV = (obj:any, keyName = 'value', valueName = 'label') => {
  return Object.keys(obj).map((item) => ({ [keyName]: item, [valueName]: obj[item] }));
}

//根据key获取options的name
export const getNameByKey = (value:number, options:Array<any>) => {
  const currentItem = options.filter((item) => (item.value === value))[0];
  return (currentItem && currentItem.label) || '';
}

//根据key获取options的item
export const getItemsByKeys = (value:Array<number>, options:Array<any>) => {
  const selectPlatform = intersectionWith(options, value, (a, b) => (a.value === b));
  return selectPlatform;
}

//根据keys(数组)获取options的name，并且用连接符返回字符串
export const getNamesByKeys = (value:Array<number>, options:Array<any>, splitKey = ' | ') => {
  const selectPlatform = intersectionWith(options, value, (a, b) => (a.value === b));
  const names = selectPlatform.map((item) => (item.label));
  return names.join(splitKey)
}

// 根据url获取streamId
export const getStreamIdByUrl = (url: string) => {
  let streamId = '';
  if (url) {
    const reg = /\/app\/((\d)+)/ig; 
    streamId = url.match(reg)?.[0]?.replace('\/app\/', '') ?? ''; 
  }
  return streamId;
}
