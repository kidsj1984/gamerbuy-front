const mobileRegExp = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|WebOS|Windows Phone|MicroMessenger)/i;
const iosRegExp = /(iPhone|iPad)/i;
const androidRegExp = /(Android)/i;
const weixinRegExp = /(MicroMessenger)/i;


const browser = (exp) => {
  if (typeof window === 'undefined') return false;
  if (!exp) return false;
  const ua = window.navigator.userAgent;
  return exp.test(ua);
}

const isMobile =  () => {
  return browser(mobileRegExp);
};

const isIOS =  () => {
  return browser(iosRegExp);
};
const isAndroid =  () => {
  return browser(androidRegExp);
};
const isWeixin =  () => {
  return browser(weixinRegExp);
};


export {
  isMobile,
  isIOS,
  isAndroid,
  isWeixin,
}
