import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getPlatformOptions, getGamelistOptions, getAgencylistOptions, getSensitiveOptions } from '@/api/common'
import { 
  getPlatformOptionsStorage, setPlatformOptionsStorage, 
  getPlatformOptionsExpireStorage, setPlatformOptionsExpireStorage,
  getGameOptionsStorage, setGameOptionsStorage, 
  getGameCategoryOptionsStorage, setGameCategoryOptionsStorage, 
  getGameOptionsExpireStorage, setGameOptionsExpireStorage,
  getAgencyOptionsStorage, setAgencyOptionsStorage, 
  getAgencyOptionsExpireStorage, setAgencyOptionsExpireStorage,
  getSensitiveOptionsStorage, setSensitiveOptionsStorage, 
  getSensitiveOptionsExpireStorage, setSensitiveOptionsExpireStorage,
} from '@/utils/storage'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import { Base64 }  from 'js-base64';
import store from '@/store'


function translateDataToTree(data:any) {
  const parents = data.filter((value:any) => value.parentId === 'undefined' || value.parentId === null || value.parentId === 0)
  const children = data.filter((value:any) => value.parentId !== 'undefined' && value.parentId !== null && value.parentId !== 0)
  const translator = (parents:any, children:any) => {
    parents.forEach((parent:any) => {
      children.forEach((current:any, index:number) => {
        if (current.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      })
    })
  }
  translator(parents, children)
 
  return parents
}

const sortKey = [6, 63, 65, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 60, 62, 66, 69, 70, 71, 72, 79, 81, 92, 94, 1, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 88, 89, 87, 64, 67, 68, 73, 78, 80, 82, 83, 84, 85, 91, 93, 61, 2, 38, 39, 40, 41, 42, 43, 52, 53, 54, 74, 75, 76, 77, 86, 90, 3, 44, 50, 51, 4, 45, 46, 47, 48, 49, 55, 56, 57, 58, 59, 5];

export interface ICommonState {
  platformOptions: Array<any>
  gameOptions: Array<any>
  gameCategoryOptions: Array<any>
  agencyOptions: Array<any>
  sensitiveOptions: Array<any>
}

// const expireTime = 2 * 60 * 60 * 1000;
const expireTime = 10 * 60 * 1000;

@Module({ dynamic: true, store, name: 'common' })
class Common extends VuexModule implements ICommonState {
  public platformOptions = []
  public gameOptions = []
  public gameCategoryOptions = []
  public agencyOptions = []
  public sensitiveOptions = []

  @Mutation
  private SET_PLATFORM_OPTIONS(platformOptions: any) {
    this.platformOptions = platformOptions;
  }

  @Mutation
  private SET_GAME_OPTIONS(gameOptions: any) {
    this.gameOptions = gameOptions;
  }

  @Mutation
  private SET_GAME_CATEGORY_OPTIONS(gameCategoryOptions: any) {
    this.gameCategoryOptions = gameCategoryOptions;
  }

  @Mutation
  private SET_AGENCY_OPTIONS(agencyOptions: any) {
    this.agencyOptions = agencyOptions;
  }

  @Mutation
  private SET_SENSITIVE_OPTIONS(sensitiveOptions: any) {
    this.sensitiveOptions = sensitiveOptions;
  }

  @Action
  public async GetPlatformOptions() {
    const localOptions = getPlatformOptionsStorage();
    const localExpire = Number(getPlatformOptionsExpireStorage());
    const nowTime = Date.now();
    console.log(nowTime, localExpire)
    if (nowTime - localExpire > expireTime) {
      console.log('过期了，重新获取数据')
      try {
        const result:any = await getPlatformOptions();
        const options = ((result && result.data) && result.data.items) || [];
        const newOptions = options.map((item:any) => ({ value: item.id, label: item.name }));
        
        console.log('result', newOptions);
  
        setPlatformOptionsStorage(newOptions)
        setPlatformOptionsExpireStorage(Date.now().toString());
        this.SET_PLATFORM_OPTIONS(newOptions)
  
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('没过期，读取缓存里的')
      this.SET_PLATFORM_OPTIONS(localOptions)
    }

  }
  
  @Action
  public async GetGameOptions() {
    const localOptions = getGameOptionsStorage();
    const localCategoryOptions = getGameCategoryOptionsStorage();
    const localExpire = Number(getGameOptionsExpireStorage());
    const nowTime = Date.now();

    if (nowTime - localExpire > expireTime) {
      console.log('过期了，重新获取数据')
      try {
        const result:any = await getGamelistOptions();
        const options = ((result && result.data) && result.data.items) || [];
        // console.log('options', options)

        //全部游戏分类整理
        const sortOptions = options.sort((a:any, b:any) => (a.name.localeCompare(b.name)));
        const newOptions:any = [];
        sortOptions.forEach((item:any) => {
          if (item.parentId) {
            newOptions.push({ value: item.id, label: item.name });
          }
        });

        const sortOptions2 = options.sort((a:any, b:any) => {
          return sortKey.indexOf(a.id) - sortKey.indexOf(b.id)
        });
        //根据分类父级整理
        const newOptions2 = translateDataToTree(sortOptions2);
        // const newOptions2 = newOptionsTmp.sort((a:any, b:any) => (a.id - b.id));

        // console.log('newOptions2', newOptions2)
        
        setGameOptionsStorage(newOptions);
        setGameCategoryOptionsStorage(newOptions2);
        setGameOptionsExpireStorage(Date.now().toString());
        this.SET_GAME_OPTIONS(newOptions);
        this.SET_GAME_CATEGORY_OPTIONS(newOptions2);
  
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('没过期，读取缓存里的')
      this.SET_GAME_OPTIONS(localOptions)
      this.SET_GAME_CATEGORY_OPTIONS(localCategoryOptions);
    }

  }

  @Action
  public async GetAgencyOptions() {
    const localOptions = getAgencyOptionsStorage();
    const localExpire = Number(getAgencyOptionsExpireStorage());
    const nowTime = Date.now();

    if (nowTime - localExpire > expireTime) {
      console.log('过期了，重新获取数据')
      try {
        const result:any = await getAgencylistOptions();
        const options = ((result && result.data) && result.data.items) || [];
        const newOptions = options.map((item:any) => ({ value: item.id, label: item.identityName }));

        const sortOptions = newOptions.sort((a:any, b:any) => (a.label.localeCompare(b.label)))
        
        // console.log('result', sortOptions);
  
        setAgencyOptionsStorage(sortOptions)
        setAgencyOptionsExpireStorage(Date.now().toString());
        this.SET_AGENCY_OPTIONS(sortOptions)
  
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('没过期，读取缓存里的')
      this.SET_AGENCY_OPTIONS(localOptions)
    }

  }

  @Action
  public async GetSensitiveOptions() {
    const localOptions = getSensitiveOptionsStorage();
    const localExpire = Number(getSensitiveOptionsExpireStorage());
    const nowTime = Date.now();

    if (nowTime - localExpire > expireTime) {
      console.log('过期了，重新获取数据')
      try {
        const result:any = await getSensitiveOptions();
        const options = ((result && result.data) && result.data.items) || [];
        const newOptions = options.map((item:any) => ({ value: item.id, label: item.name }));

        const sortOptions = newOptions.sort((a:any, b:any) => (a.label.localeCompare(b.label)))
        
        // console.log('result', sortOptions);
  
        setSensitiveOptionsStorage(sortOptions)
        setSensitiveOptionsExpireStorage(Date.now().toString());
        this.SET_SENSITIVE_OPTIONS(sortOptions)
  
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('没过期，读取缓存里的')
      this.SET_SENSITIVE_OPTIONS(localOptions)
    }

  }
}

export const CommonModule = getModule(Common)
