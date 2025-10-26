import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { IDENTITY_TYPE } from '@/enum/common'
import { aboutRoutes, otherRoutes, cdkeyRoutes, buyerRoutes, sellerRoutes, constantRoutes } from '@/router'
import store from '@/store'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    console.log(9999, this.routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(roles: string[]) {
    const role = roles && roles[0];
    // console.log(111111, identity, roles)
    let accessedRoutes:RouteConfig[] = [];
    // switch (role) {
    //   case IDENTITY_TYPE.ADMIN:
    //     accessedRoutes = cdkeyRoutes
    //     break;
    //   default:
    //     accessedRoutes = demoRoutes
    //     break;
    // }
    accessedRoutes = [
      ...cdkeyRoutes,
      ...buyerRoutes,
      ...sellerRoutes,
      ...aboutRoutes,
      ...otherRoutes,
    ];
    
    // if (roles.includes('admin')) {
    //   accessedRoutes = demoRoutes
    // } else {
    //   accessedRoutes = filterAsyncRoutes(demoRoutes, roles)
    // }
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
