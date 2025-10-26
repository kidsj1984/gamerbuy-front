import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

const sizeKey = 'size'
export const getSize = () => Cookies.get(sizeKey)
export const setSize = (size: string) => Cookies.set(sizeKey, size)

// User
const tokenKey = 'access_token'
export const getLoginStatus = () => Cookies.get(tokenKey) === '1'
export const setLoginStatus = (token: boolean) => Cookies.set(tokenKey, token ? '1' : '0');
export const removeToken = () => Cookies.remove(tokenKey)

// User
const regStepKey = 'lms_access_reg_step'
export const getRegStep = () => Cookies.get(regStepKey)
export const setRegStep = (token: string) => Cookies.set(regStepKey, token)
export const removeRegStep = () => Cookies.remove(regStepKey)
