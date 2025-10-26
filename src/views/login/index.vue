<template>
  <div>
    <div class="login-bg"></div>
    <div class="login-page">
      <!--
      <div :class="getCardStyle() ? 'logo' : 'logo2'">{{$t('login.logo')}}</div>
      -->
      <div class="login-card">
        <div class="features">
          <!-- <div class="bg"></div>
          <div class="txt txt1">Welcome</div>
          <div class="txt txt2">Livestream Monitoring System</div>
          <div class="txt txt3">欢迎访问LMS系统</div> -->
        </div>
        
        <div class="login-main login-style1">
          <div class="title">Gamebuy 游戏帮</div>
          <div class="slogan">帮您节省在游戏上花的每一分钱</div>
          <!-- 登录 start -->
          <Login v-if="loginType === 1" @changeType="changeTypeHandle" />
          <!-- 登录 end -->

          <!-- 注册 步骤1 start -->
          <RegStep1 v-if="loginType === 2" @changeType="changeTypeHandle" />
          <!-- 注册 步骤1 end -->

          <!-- 忘记密码 start -->
          <Forget v-if="loginType === 3" @changeType="changeTypeHandle" />
          <!-- 忘记密码 end -->

          <!-- 找回密码 start -->
          <Findpw v-if="loginType === 4" @changeType="changeTypeHandle" />
          <!-- 找回密码 end -->

          <CopyRight/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { CommonModule } from '@/store/modules/common'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import Login from './components/login.vue' 
import RegStep1 from './components/reg-1.vue'
import Forget from './components/forget.vue'
import Findpw from './components/findpw.vue'
import CopyRight from '@/components/copyright/index.vue'
import { IDENTITY_TYPE } from '@/enum/common'

@Component({
  name: 'LoginIndex',
  components: {
    LangSelect,
    Login,
    RegStep1,
    Forget,
    Findpw,
    CopyRight,
  }
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  get type() {
    const type = this.$route.params.type;
    return type && type.toLowerCase();
  }

  get token() {
    return UserModule.token;
  }

  // get hostIdentity():any {
  //   return UserModule.hostIdentity;
  // }

  // get otherIdentity():any {
  //   return UserModule.otherIdentity;
  // }
  
  private IDENTITY_TYPE = IDENTITY_TYPE;
  private loginType = 1;  // 1：登录 2：注册  3：忘记密码 4:重置密码
  private isEdit = false;  //操作类型  false:新增  true:编辑
  private identityType:any = IDENTITY_TYPE.ANCHOR; //主播身份
  private remark = '';  //拒绝原因
  // private identityType = IDENTITY_TYPE.LIVE_PLATFORM; //主播身份
  // private identityType = IDENTITY_TYPE.AGENCY; //主播身份
  // private passwordType = 'password'
  private loading = false
  // private showDialog = false
  // private capsTooltip = false
  private redirect?: string 
  private otherQuery: Dictionary<string> = {}


  async mounted() {
    if (this.type === 'findpw') {
      this.loginType = 4
    }
    // await CommonModule.GetPlatformOptions();
    // await CommonModule.GetGameOptions();
    // await CommonModule.GetAgencyOptions();

  }

  private changeTypeHandle(options: any) {
    const { loginType = this.loginType, identityType = this.identityType, isEdit = false } = options;

    this.loginType = loginType;
    this.identityType = identityType;
    this.isEdit = isEdit;
  }
}
</script>

<style lang="scss">
@supports (-webkit-mask: none) and (not (cater-color: $loginInputColor)) {
  .login-page .el-input {
    input {
      color: $loginInputColor;
    }
  }
}

@media (min-width: 640px) {
  .login-page {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.login-bg {
  display: block;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('../../assets/login-images/bg2.png');
  background-color: rgba(0,0,0);
  background-repeat: no-repeat;
  background-position: center;
  // -webkit-filter: brightness(50%);
  // -moz-filter: brightness(50%);
  // -ms-filter: brightness(50%);
  // -o-filter: brightness(50%);
  // filter: brightness(50%);  
}
@media (max-width: 640px) {
  .login-bg {
    display: none;
  }
}
.login-page {
  .logo {
    background-repeat: no-repeat;
    margin: 4rem auto 1rem;
    // width: 210px;
    height: 52px;
    font-size: 30px;
    color: #000;
    text-align: center;
    // background-image: url(/static/media/login-logo-dark.920e825b.svg);
  }

  .logo2 {
    background-repeat: no-repeat;
    margin: 1rem auto 1rem;
    // width: 210px;
    height: 40px;
    font-size: 30px;
    color: #000;
    text-align: center;
    // background-image: url(/static/media/login-logo-dark.920e825b.svg);
  }

  @media (min-width: 640px) {
    .logo {
      position: absolute;
      margin: 0;
      top: 28px;
      left: 50px;
      color: #fff;
    }

    .logo2 {
      position: absolute;
      margin: 0;
      top: 28px;
      left: 50px;
      color: #fff;
    }
  }

  @media (min-width: 640px) {
    .login-card, .login-card2 {
      display: flex;
      overflow: hidden;
      box-shadow: 0 6px 18px rgba(13, 37, 59, 0.14);
      border-radius: 6px;
      margin: 100px auto;
    }
  }
  @media (min-width: 1024px) {
    .login-card {
      height: 750px;
    }
  }

  .features {
    position: relative;
    height: 100%;
    display: none;
    user-select: none;
    .bg {
      width: 100%;
      height: 100%;
      box-shadow: inset -2px 0 4px hsla(0, 0%, 70.2%, 0.08);
      background: #ebedf0;
      background-image: url('../../assets/login-images/banner.jpg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
      -webkit-filter: brightness(50%);
      -moz-filter: brightness(50%);
      -ms-filter: brightness(50%);
      -o-filter: brightness(50%);
      filter: brightness(50%);  
    }
    .txt {
      color: #fff;
      width: 100%;
      text-align: center;
      font-size: 35px;
      font-weight: bold;
    }

    .txt1 {
      position: absolute;
      top: 160px;
    }
    .txt2 {
      position: absolute;
      top: 250px;
    }
    .txt3 {
      position: absolute;
      top: 350px;
      font-size: 50px;
    }

  }


  @media (min-width: 1024px) {
    .features {
      display: block;
      width: 900px;
    }
  }

  .login-style1 {
    padding: 2rem;
    --bg-opacity: 1;
    background: rgba(255, 255, 255, var(--bg-opacity)) url('../../assets/login-images/left_bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    min-height: 700px;

  
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        height: 47px;
        background: transparent;
        border: 0px;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $loginInputColor;
        caret-color: $loginCursorColor;
        -webkit-appearance: none;

        &:-webkit-autofill {
          background-color: #fff !important;
        }
      }
      &.el-input-group {
        display: inline-table;
        .el-input-group__prepend {
          padding: 0 0 0 20px;
          border: 0;
          background-color:$loginInputBGColor;
        }
        .el-input-group__append {
          padding: 0 0 0 10px;
          border: 0;
          background-color: $loginBg;
        }
        input {
          padding: 12px 5px 12px 10px;
        }
      }
    }

    .form-input2 {
      .el-input {
        width: 68%;
      }
    }
    

    .el-form-item {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: $loginInputBGColor;
      border-radius: 5px;
      color: #454545;
    }
    .login-form-control2 {
      .el-form-item {
        border: 0;
        background: none;
        border-radius: 5px;
        color: #454545;
      }
    }
    .title {
      padding-bottom: 0.8rem;
      color: #333333;
      font-weight: 500;
      font-size: 32px;
      line-height: 32px;
      text-align: center;
    }
    .slogan {
      padding-bottom: 1rem;
      color: rgba(0, 0, 0, 0.55);
      font-weight: 500;
      font-size: 14px;
      line-height: 14px;
      text-align: center;
    }

    .subTitle {
      padding-bottom: 0.5rem;
      display: none;
      color: #333333;
      font-weight: 500;
      font-size: 16px;
    }
    @media (min-width: 640px) {
      .subTitle {
        display: block;
      }
    }

    .sl {
      display: flex;
      align-items: center;
      user-select: none;
      font-weight: 300;
      font-size: 0.875rem;
      margin: 1rem -0.5rem;
      color: #9aacbd;

      &:after,
      &:before {
        display: block;
        user-select: none;
        height: 1px;
        flex-grow: 1;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        content: "";
        background: #d1d9e0;
      }
    }

    .login-form {
      .login-form-control {
        margin-bottom: 0.75rem;
      }

      .login-form-control {
        &.vaildation-error {
          > label {
            color: #8e1717;
          }
          .error-message {
            font-size: 0.875rem;
            margin-top: 0.25rem;
            color: #8e1717;
          }
        }
        > label {
          display: block;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          color: #353739;
        }
        .svg-container {
          padding: 6px 5px 6px 15px;
          color: $darkGray;
          vertical-align: middle;
          width: 30px;
          display: inline-block;
        }
        .img-container {
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
    }

    
    .mainActionBtn {
      --text-opacity: 1;
      color: #fff;
      text-align: center;
      border-radius: 0.25rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      margin-top: 2rem;
      cursor: pointer;
      user-select: none;
      display: block;
      width: 100%;
      transition: background 0.3s ease;
      &:hover {
      }
    }


  }
  @media (min-width: 640px) {
    .login-style1 {
      height: 100%;
      padding: 3rem;
      width: 565px;
    }
  }


  .login-style2 {
    padding: 0 2rem 2rem;
    --bg-opacity: 1;
    background-color: #fff;
    background-color: rgba(255, 255, 255, var(--bg-opacity));
    position: relative;
    min-height: 200px;

    .step-warp {
      margin: 0 auto 20px;
      width: 100%;
      padding: 0 10px 10px;
      border-bottom: 1px #000 solid;
    }
    
    @media (min-width: 640px) {
      .step-warp {
        padding: 10px 25%;
      }
    }

    .step2-title {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
    }

    @media (min-width: 640px) {
      .step2-title {
        text-align: left;
      }
    }

    .regSubFrom {
      width: 100%;
      margin: 0 auto;
    }
    
    @media (min-width: 640px) {
      .regSubFrom {
      width: 60%;
      }
    }

    .result-warp {
      width: 60%;
      margin: 10px auto;
      text-align: center;
      
      .el-icon-success {
        color: $green;
      }

      .el-icon-error {
        color: $red;
      }

      .el-alert__icon.is-big {
        font-size: 60px;
        width: 60px;
      }

      .result-message {
        font-size: 24px;
        padding: 10px 0;
      }

      .result-remark {
        padding: 10px 0;
        font-size: 14px;
      }
      
      .result-reason {
        padding: 10px 0 30px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.427);
      }
    }

    @media (max-width: 640px) {
      .el-form-item__label {
        float: none;
      }
      .el-form-item__content {
        margin-left: 0!important;
      }
    }
    .submitWrap {
      text-align:center;
      padding-top: 10px;
    }

    
    @media (min-width: 640px) {
      .submitWrap {
        text-align:left;
      }
    }
  }

  @media (min-width: 640px) {
    .login-style2 {
      width: 80vw;
      padding: 2rem;
    }
  }
}

</style>
