export const getStorage = (key:string, isReturnJson = false) => {
  const strValue:any = localStorage.getItem(key);
  let resultValue:any = '';

  if (isReturnJson) {
    try {
      resultValue = JSON.parse(strValue);
    } catch (error) {
      resultValue = strValue;
    }
  } else {
    resultValue = strValue;
  }

  return resultValue;

}

export const setStorage = (key:string, value:any) => {
  let strValue = '';
  if (typeof value === 'string') {
    strValue = value;
  } else {
    strValue = JSON.stringify(value);
  }
  localStorage.setItem(key, strValue);
}

// platformOptions
const platformOptionsKey = 'lms_platform_options'
export const getPlatformOptionsStorage = () => getStorage(platformOptionsKey, true)
export const setPlatformOptionsStorage = (value: string) => setStorage(platformOptionsKey, value)

// platformOptionsExpire
const platformOptionsExpireKey = 'lms_platform_options_expire'
export const getPlatformOptionsExpireStorage = () => getStorage(platformOptionsExpireKey)
export const setPlatformOptionsExpireStorage = (value: string) => setStorage(platformOptionsExpireKey, value)


// gameOptions
const gameOptionsKey = 'lms_game_options'
export const getGameOptionsStorage = () => getStorage(gameOptionsKey, true)
export const setGameOptionsStorage = (value: string) => setStorage(gameOptionsKey, value)

// gameOptions
const gameCategoryOptionsKey = 'lms_game_category_options'
export const getGameCategoryOptionsStorage = () => getStorage(gameCategoryOptionsKey, true)
export const setGameCategoryOptionsStorage = (value: string) => setStorage(gameCategoryOptionsKey, value)

// gameOptionsExpire
const gameOptionsExpireKey = 'lms_game_options_expire'
export const getGameOptionsExpireStorage = () => getStorage(gameOptionsExpireKey)
export const setGameOptionsExpireStorage = (value: string) => setStorage(gameOptionsExpireKey, value)

// agencyOptions
const agencyOptionsKey = 'lms_agency_options'
export const getAgencyOptionsStorage = () => getStorage(agencyOptionsKey, true)
export const setAgencyOptionsStorage = (value: string) => setStorage(agencyOptionsKey, value)

// agencyOptionsExpire
const agencyOptionsExpireKey = 'lms_agency_options_expire'
export const getAgencyOptionsExpireStorage = () => getStorage(agencyOptionsExpireKey)
export const setAgencyOptionsExpireStorage = (value: string) => setStorage(agencyOptionsExpireKey, value)

// sensitiveOptions
const sensitiveOptionsKey = 'lms_sensitive_options'
export const getSensitiveOptionsStorage = () => getStorage(sensitiveOptionsKey, true)
export const setSensitiveOptionsStorage = (value: string) => setStorage(sensitiveOptionsKey, value)

// sensitiveOptionsExpire
const sensitiveOptionsExpireKey = 'lms_sensitive_options_expire'
export const getSensitiveOptionsExpireStorage = () => getStorage(sensitiveOptionsExpireKey)
export const setSensitiveOptionsExpireStorage = (value: string) => setStorage(sensitiveOptionsExpireKey, value)


const verifyExpireKey = 'lms_verify'
export const getVerifyExpireStorage = () => getStorage(verifyExpireKey, true)
export const setVerifyExpireStorage = (value: string) => setStorage(verifyExpireKey, value)

