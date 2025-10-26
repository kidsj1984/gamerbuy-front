// 游戏字段格式化
export const gameDetailFormat = (detail: any) => {
  const newDetail:any = {};
  if (detail) {
    Object.keys(detail).forEach((key: string) => {
      const isStringObj = /^\{|^\[/.test(detail?.[key]);
      newDetail[key] = isStringObj ? string2obj(detail?.[key]) : detail?.[key];
    })
  }
  return newDetail
}

// string2obj
export const string2obj = (data: string) => {
  let returnData = {};
  try {
    returnData = JSON.parse(data);
  } catch (error) {
    
  }

  return returnData;
}

