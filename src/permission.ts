import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import i18n from '@/lang' // Internationalization
import settings from './settings'

NProgress.configure({ showSpinner: false })

// 免登陆
const whiteList = ['/login', '/login/findpw', '/verify', '/agreement/1', '/agreement/2', '/excel2'];
// 有登录态跳转首页
const redirectHomeList = ['/login', '/verify'];

const getPageTitle = (key: string) => {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${settings.title}`
  }
  return `${settings.title}`
}

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start();


  try {
    const userData = await UserModule.GetUserInfo();
    console.log(1111, userData, to.path, UserModule.roles)
    if (userData) {
      // 如果有登录态，并且是登录页，则跳转首页
      if (redirectHomeList.indexOf(to.path) !== -1) {
        console.log(2222)
        next({ path: '/' })
        NProgress.done()
      } else if (UserModule.roles.length === 0) {
        console.log(3333)
        const roles = UserModule.roles;
        UserModule.setRoles();
        // Generate accessible routes map based on role
        PermissionModule.GenerateRoutes(roles)
        // Dynamically add accessible routes
        PermissionModule.dynamicRoutes.forEach(route => {
          router.addRoute(route)
        });
        next({ ...to, replace: true })
      } else {
        console.log(4444)
        next()
        NProgress.done()
      }
    }

    // Hack: ensure addRoutes is complete
    // Set the replace: true, so the navigation will not leave a history record
    // next({ ...to, replace: true })
  } catch (err) {
    // const message = (err && err.message) || '登录出错';
    // Remove token and redirect to login page
    UserModule.ResetToken();
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next()
      NProgress.done()
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }

  // Determine whether the user has logged in
  // if (UserModule.loginstatus) {
  //   if (redirectHomeList.indexOf(to.path) !== -1) {
  //     // If is logged in, redirect to the home page
  //     next({ path: '/' })
  //     // next()
  //     NProgress.done()
  //   } else {
  //     console.log(6666, UserModule.roles)
  //     // Check whether the user has obtained his permission roles
  //     if (UserModule.roles.length === 0) {
  //       try {
  //         const userData = await UserModule.GetUserInfo();
  //         const roles = UserModule.roles;
  //         // Generate accessible routes map based on role
  //         PermissionModule.GenerateRoutes(roles)
  //         // Dynamically add accessible routes
  //         PermissionModule.dynamicRoutes.forEach(route => {
  //           router.addRoute(route)
  //         })
  //         // Hack: ensure addRoutes is complete
  //         // Set the replace: true, so the navigation will not leave a history record
  //         next({ ...to, replace: true })
  //       } catch (err) {
  //         // const message = (err && err.message) || '登录出错';
  //         // Remove token and redirect to login page
  //         UserModule.ResetToken()
  //         Message.error({
  //           message: String(err) || '登录超时，请重新登录',
  //           type: 'error'
  //         })
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     } else {
  //       // console.log('933', to)
  //       // if (UserModule.regStep) {
  //       //   UserModule.SetRegStep('');
  //       //   next()
  //       // } else {
  //       next()
  //       // }
  //     }
  //   }
  // } else {
  //   // Has no token
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // In the free login whitelist, go directly
  //     next()
  //   } else {
  //     // Other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
  NProgress.done()

  // set page title
  document.title = getPageTitle(to.meta.title)
})
