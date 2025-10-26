<template>
  <div>
    <el-tabs class="login-tab" v-model="activeIndex" @tab-click="handleClick">
      <el-tab-pane label="账号密码登录" name="1"></el-tab-pane>
      <el-tab-pane label="验证码登录" name="2"></el-tab-pane>
    </el-tabs>

    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form lg:mt-2"
      label-position="left"
    >
      <div class="login-form-control" v-if="activeIndex === '2'">
        <el-form-item prop="myphone" class="form-input" :rules="loginRules.myphone">
          <span class="svg-container">
            <svg-icon name="phone" />
          </span>
          <el-input
            id="myphone"
            ref="myphone"
            v-model="loginForm.myphone"
            :placeholder="$t('login.phonePlaceholder')"
            name="myphone"
            type="text"
            tabindex="1"
            maxlength="11"
            autocomplete="off"
          >
            <template slot="prepend"><label v-if="activeIndex === '2'" for="myphone">+86</label></template>
          </el-input>
        </el-form-item>
      </div>

      <div class="login-form-control" v-if="activeIndex === '2'">
        <el-form-item prop="verificationcode" class="form-input" :rules="loginRules.verificationcode">
          <span class="svg-container">
            <svg-icon name="verification" />
          </span>
          <el-input
            ref="verificationcode"
            v-model="loginForm.verificationcode"
            :placeholder="$t('login.verifyCodePlaceholder')"
            class="verifyCode"
            name="verificationcode"
            type="text"
            tabindex="2"
            maxlength="4"
            autocomplete="off"
          >
          </el-input>
          <!-- <el-button class="verifyCodeBtn" size="mini" type="primary" >验证码</el-button> -->
          <VerfyCode :phone="loginForm.myphone" :action="2"></VerfyCode>
        </el-form-item>
      </div>

      <div class="login-form-control" v-if="activeIndex === '1'">
        <el-form-item prop="myemail" class="form-input" :rules="loginRules.myemail">
          <span class="svg-container">
            <svg-icon name="mail" />
          </span>
          <el-input
            id="myemail"
            ref="myemail"
            v-model="loginForm.myemail"
            :placeholder="$t('login.mailPlaceholder')"
            name="myemail"
            type="text"
            tabindex="1"
            autocomplete="off"
          />
        </el-form-item>
      </div>

      <div class="login-form-control" v-if="activeIndex === '1'">
        <el-form-item prop="password" class="form-input" :rules="loginRules.password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            ref="password"
            show-password
            v-model="loginForm.password"
            :placeholder="$t('login.passwordPlaceholder')"
            name="password"
            type="text"
            tabindex="3"
            autocomplete="off"
          />
        </el-form-item>
      </div>

      <!-- <div class="login-form-control">
        <el-form-item prop="vcode" class="form-input2" :rules="loginRules.vcode">
          <span class="svg-container">
            <svg-icon name="verification" />
          </span>
          <el-input
            ref="vcode"
            v-model="loginForm.vcode"
            :placeholder="$t('login.imageCodePlaceholder')"
            name="vcode"
            type="text"
            tabindex="5"
            maxlength="4"
            autocomplete="off"
          />
          <span class="img-container" @click="handleResetCode">
            <img :src="imgCode"/>
          </span>
        </el-form-item>
      </div> -->

      <!-- <div class="login-form-control2">
        <el-form-item prop="check" class="form-input" :rules="loginRules.check">
          <el-checkbox ref="check" v-model="loginForm.check">我已阅读并同意<a href="/agreement/1" target="_blank">《游戏帮用户协议》</a></el-checkbox>
        </el-form-item>
      </div> -->

      <el-button :loading="loading" class="mainActionBtn" type="primary" @click="handleLogin">登录</el-button>

    </el-form>

    <div class="login-3rd">
      <label>{{$t('login.thirdparty')}}</label>
      <StreamLogin/>
      <div class="linkToLogin">
        <el-button type="text" @click="gotoReg">注册账户</el-button>
        <el-button type="text" @click="gotoForget">忘记密码</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm } from 'element-ui'
import { isValidUsername } from '@/utils/validate'
import { UserModule } from '@/store/modules/user'
import VerfyCode from '@/components/VerifyCode/index.vue'
import StreamLogin from '@/components/steam-login/login.vue'
import { apiDomin } from '@/utils/common';

@Component({
  name: 'login',
  components: {
    VerfyCode,
    StreamLogin,
  }
})
export default class extends Vue {
  get type() {
    const type = this.$route.params.type;
    return type && type.toLowerCase();
  }
  
  private validateCheck = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('请勾选用户协议'))
    } else {
      callback()
    }
  }
  
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  private loading = false;
  private activeIndex = '1';
  private imgCode = `https://${apiDomin}/v1/UserInfo/ValidateCode?random=${Date.now()}`;

  private loginForm = {
    myemail: '',
    myphone: '',
    verificationcode: '',
    password: '',
    activeIndex: '',
    vcode: '',
    check: false,
  }

  private loginRules = {
    myemail: [{ required: true, message: '请填写邮箱地址', trigger: 'blur' }],
    myphone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    verificationcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    identityType: [{ required: this.activeIndex === '2', message: this.$t('login.identityTypeErrorMsg'), trigger: 'change' }],
    vcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    check: [{ validator: this.validateCheck, trigger: 'change' }],
  }

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }
  
  mounted() {
    console.log(1)
  }
  
  private handleResetCode() {
    this.imgCode = `https://${apiDomin}/v1/UserInfo/ValidateCode?random=${Date.now()}`;
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }

  private handleClick(tab:any, event:any) {
    console.log(tab, event, this.activeIndex);
  }

  private async handleLogin() {
    try {
      const valid = await (this.$refs.loginForm as ElForm).validate();
      if (valid) {
        this.loading = true;
        this.loginForm.activeIndex = this.activeIndex;
        console.log(9999, this.$refs.loginForm, this.loginForm)
        try {
          await UserModule.Login(this.loginForm);
          // console.log('111', result);
          this.$router.push({
            // path: this.redirect || '/',
            path: '/',
            query: this.otherQuery
          }).catch(err => {
            console.warn(err)
          })
          // Just to simulate the time of the request
          setTimeout(() => {
            this.loading = false
          }, 0.5 * 1000)
        } catch (e:any) {
          
          this.$message({
            message: e,
            type: 'error'
          })
          this.loading = false
          console.log('e', e, e.message);
        }

      } else {
        this.loading = false
        return false
      }
    } catch (error) {
      console.log(error);
    }

  }
  
  @Emit('changeType')
  private gotoReg() {
    return {
      loginType: 2,
    }
  }

  @Emit('changeType')
  private gotoForget() {
    return {
      loginType: 3,
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-tab {
    background-color: $loginBg;
  }

  .login-page {
    .verifyCode {
      width:60%;
    }
    @media (max-width: 640px) {
      .verifyCode {
        width:70%;
      }
    }
    .iconWechat {
      color: #46AF35;
    }
    .iconQQ {
      color: #5EAADE;
    }
    .login-3rd {
      display: flex;
      flex-direction: row;
      user-select: none;
      font-size: 18px;
      margin-top: 10px;
      align-items: center;

      label {
        flex:0 0 100px;
        font-size: 14px;
        font-weight: normal;
      }
      .icon {
        margin: 0 3px;
        font-size: 24px;
      }
      .linkToLogin {
        flex: 1;
        text-align: right;
      }
    }
  }

</style>
