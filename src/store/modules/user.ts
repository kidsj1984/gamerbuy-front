/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { logout, loginByPhone, loginByEMail, getCurrentUser, getCurrentHost, getCurrentIdcard, getCurrentIdentity } from '@/api/users'
import { getLoginStatus, setLoginStatus, removeToken, getRegStep, setRegStep, removeRegStep } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import { IDENTITY_TYPE } from '@/enum/common'
import { Base64 }  from 'js-base64';
import store from '@/store'

//三方后台登录key
const tokenKey = '54bb2165-71e1-41a6-af3e-7da4a0e1e2c1';

export interface IUserState {
  loginstatus: boolean    // 登录状态 
  uid: number             // 用户id
  myphone: string         // 手机号
  nickname: string        // 昵称
  email: string           // 邮箱
  buygames: number
  desirecount: number
  gamehours: number
  havegames: number
  loginarea: any
  loginip: any
  roles: string[]


  // id: any
  // token: any
  // name: any
  // phone: any
  // identity: any
  // hostIdentity: any
  // otherIdentity: any
  // regStep: any
}

export interface IUserData {
  buyGameCost: number
  buygames: number
  desirecount: number
  email: string
  gamehours: number
  havegames: number
  joinSteamDate: any
  last_consume_time: number
  last_login_time: number
  last_market_time: number
  loginarea: any
  loginip: any
  myphone: string
  nickname: string
  steamUserName: string
  total_sell_success_count: number
  uid: number
  userSteamCommunityStatus: any
  userSteamGameCount: number
  userSteamGrade: number
  userSteamTradeStatus: any
  userSteamVACStatus: any
  user_steamid: any
  userbalance: number
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public uid = 0;
  public myphone = '';
  public nickname = '';
  public email = '';
  public buygames = 0;
  public desirecount = 0;
  public gamehours = 0;
  public havegames = 0;
  public loginarea = '';
  public loginip = '';
  public loginstatus = getLoginStatus() || false;
  // old data
  public identity = '';
  // public id = '';
  public token = '';
  // public name = '';
  // public phone = '';
  public roles: string[] = []
  // public hostIdentity = '';
  // public otherIdentity = '';
  // public regStep = '';

  public userData:IUserData = {
    buyGameCost: 0,
    buygames: 0,
    desirecount: 0,
    email: '',
    gamehours: 0,
    havegames: 0,
    joinSteamDate: null,
    last_consume_time: 0,
    last_login_time: 0,
    last_market_time: 0,
    loginarea: null,
    loginip: null,
    myphone: '',
    nickname: '',
    steamUserName: '',
    total_sell_success_count: 0,
    uid: 4,
    userSteamCommunityStatus: null,
    userSteamGameCount: 0,
    userSteamGrade: 0,
    userSteamTradeStatus: null,
    userSteamVACStatus: null,
    user_steamid: null,
    userbalance: 0,
  }

  
  @Mutation
  private SET_LOGIN_STATUS(loginstatus: boolean) {
    this.loginstatus = loginstatus
    setLoginStatus(loginstatus)
  }

  @Mutation
  private SET_USER(user: IUserData) {
    if (user) {
      this.userData = user;
    }
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action({ rawError: true })
  public async Login(userInfo: { activeIndex:string, myphone?: string, myemail?:string, verificationcode?: string, password?: string, vcode?: string }) {
    let { myphone, myemail, verificationcode, password, activeIndex, vcode } = userInfo

    let result:any = null;

    //短信登录
    if (activeIndex === '2') {
      myphone = myphone && myphone.trim();
      const params = {
        myphone: myphone,
        verificationcode: verificationcode,
        vcode,
      }
      try {
        result = await loginByPhone(params);
      } catch {
        result = null;
      }
    } else {
      myemail = myemail && myemail.trim();
      const params = {
        myemail: myemail,
        mypass: password,
        vcode,
      }
      try {
        result = await loginByEMail(params);
      } catch {
        result = null;
      }
    }

    // token = '1234567894-token';
    if (result && result.code === 0) {
      this.SET_LOGIN_STATUS(true)
    } else {
      return Promise.reject(new Error(result.message ?? '用户不存在'));
    }
  }

  @Action
  public ResetToken() {
    removeToken()
    removeRegStep();
    this.SET_LOGIN_STATUS(false);
  }

  @Action({ rawError: true })
  public async GetUserInfo() {
    try {
      const { code, data }:any = await getCurrentUser();
      if (code === 0) {
        this.SET_USER(data)
        return Promise.resolve(data);
      }

      throw Error('登录超时，请重新登录');

    } catch (error:any) {
      const status = error.response && error.response.status;
      if (status === 403) {
        throw Error('用户被停用！');
      } else {
        throw Error('登录超时，请重新登录');
      }    
    }
  }

  @Action
  public setRoles() {
    this.SET_ROLES(['ADMIN']);
  }

  @Action
  public SetRegStep(regStep:string) {
    // this.SET_REG_STEP(regStep);
  }

  @Action
  public async GetHostIdentity() {
    try {
      const idCardPromise:any = getCurrentIdcard();
      const hostPromise:any = getCurrentHost();
      const [{ data: idCardResult }, { data: hostResult }] = await Promise.all([idCardPromise, hostPromise]);
      const { id: hostId, name: nickname, identityAudit, identityRemark, platformAudit, platformRemark } = hostResult;
      const identity = {
        ...hostResult,
        ...idCardResult,
        hostId,
        nickname
      }
      // this.SET_HOST_IDENTITY(identity);
      console.log('hostResult', identityAudit, identityRemark, platformAudit, platformRemark)
      // 平台和机构只要有一个拒绝，就算拒绝
      if (identityAudit === 8 || platformAudit === 8) {
        const remark = platformRemark || identityRemark;
        return { code: 3,  remark };
      // 平台和机构只要有一个待审批，就不算通过  
      } else if (identityAudit === 7 || platformAudit === 7) {
        return { code: 2 };
      }

      return null;
    } catch (error:any) {
      const status = error.response && error.response.status;
      if (status === 404) {
        return { code: 1 };
      } else {
        throw Error('登录超时，请重新登录')
      }
    }
  }

  @Action
  public async GetOtherIdentity() {
    try {
      const { data } = await getCurrentIdentity();
      const { audit, remark } = data;
      console.log(data);
      // this.SET_OTHER_IDENTITY(data);


      // 1:待审核 2:通过 3:被拒绝
      if (audit === 3) {
        return { code: 3,  remark };
      // 平台和机构只要有一个待审批，就不算通过  
      } else if (audit === 1) {
        return { code: 2 };
      }

      return null;
    } catch (error:any) {
      const status = error.response && error.response.status;
      if (status === 404) {
        return { code: 1 };
      } else {
        throw Error('登录超时，请重新登录')
      }
    }
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    // this.SET_TOKEN(token)
    // setToken(token)
    await this.GetUserInfo()
    resetRouter()

    const userInfo = {
      identity: '',
      roles: [],
    }
    // console.log(33333, userInfo);
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(['ADMIN'])
    // Add generated routes
    PermissionModule.dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    await logout()
    removeToken();
    removeRegStep();
    resetRouter();
    this.SET_ROLES([]);

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_LOGIN_STATUS(false)
  }
}

export const UserModule = getModule(User)
