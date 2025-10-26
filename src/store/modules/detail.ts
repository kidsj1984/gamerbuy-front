import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getPlatformOptions, getGamelistOptions, getAgencylistOptions } from '@/api/common'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import { Base64 }  from 'js-base64';
import store from '@/store'


export interface IDetailState {
  listRouteHistory: any
}


@Module({ dynamic: true, store, name: 'detail' })
class Detail extends VuexModule implements IDetailState {
  public listRouteHistory:any = {}

  get currentHistory():any {
    return (routeName:string) => {
      const historyQuery = this.listRouteHistory[routeName];
      if (historyQuery && historyQuery.isActive) {
        return historyQuery;
      }
      return null;
    }
  }

  @Mutation
  private ADD_LIST_ROUTE(listRoute: any) {
    const routeName = listRoute.routeName;
    delete listRoute.routeName;
    this.listRouteHistory[routeName] = listRoute;
  }

  @Mutation
  private ACTIVE_LIST_ROUTE(routeName:string) {
    const currentHistory = this.listRouteHistory[routeName];
    if (currentHistory) {
      currentHistory.isActive = true;
      this.listRouteHistory[routeName] = currentHistory;
    }
  }

  @Mutation
  private REMOVE_ACTIVE_LIST_ROUTE(routeName:string) {
    const currentHistory = this.listRouteHistory[routeName];
    if (currentHistory) {
      currentHistory.isActive = false;
      this.listRouteHistory[routeName] = currentHistory;
    }
  }

  @Action
  public async addListRoute(query:any) {
    this.ADD_LIST_ROUTE(query);
  }

  @Action
  public async activeListRouteByDetail(routeName:string) {
    const name = routeName.replace('Detail', 'List');
    this.ACTIVE_LIST_ROUTE(name);
  }

  @Action
  public async removeActiveListRoute(routeName:string) {
    this.REMOVE_ACTIVE_LIST_ROUTE(routeName);
  }
  
}

export const DetailModule = getModule(Detail)
