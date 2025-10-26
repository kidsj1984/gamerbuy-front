<template>
  <div>
    <div class="subTitle">用户注册</div>
    <el-form
      ref="regForm1"
      :model="regForm1"
      class="login-form lg:mt-2"
      label-position="left"
    >
      <div class="login-form-control">
        <el-form-item prop="myemail" class="form-input" :rules="regRules.myemail">
          <span class="svg-container">
            <svg-icon name="mail" />
          </span>
          <el-input
            id="myemail"
            ref="myemail"
            v-model="regForm1.myemail"
            :placeholder="$t('login.mailPlaceholder')"
            name="myemail"
            type="text"
            tabindex="1"
            autocomplete="off"
          />
        </el-form-item>
      </div>
      <div class="login-form-control">
        <el-form-item prop="myphone" class="form-input" :rules="regRules.myphone">
          <span class="svg-container">
            <svg-icon name="phone" />
          </span>
          <el-input
            id="myphone"
            ref="myphone"
            v-model="regForm1.myphone"
            :placeholder="$t('login.phonePlaceholder')"
            name="myphone"
            type="text"
            tabindex="1"
            maxlength="11"
            autocomplete="off"
          >
            <template slot="prepend"><label for="myphone">+86</label></template>
          </el-input>
        </el-form-item>
      </div>
      <div class="login-form-control">
        <el-form-item prop="verificationcode" class="form-input" :rules="regRules.verificationcode">
          <span class="svg-container">
            <svg-icon name="verification" />
          </span>
          <el-input
            ref="verificationcode"
            v-model="regForm1.verificationcode"
            :placeholder="$t('login.verifyCodePlaceholder')"
            class="verifyCode"
            name="verificationcode"
            type="text"
            tabindex="2"
            maxlength="4"
            autocomplete="off"
          >
          </el-input>
          <VerifyCode :phone="regForm1.myphone" :action="1"></VerifyCode>
          <!-- <el-button class="verifyCodeBtn" size="mini" type="primary" >验证码</el-button> -->
        </el-form-item>
      </div>
      <div class="login-form-control">
        <el-form-item prop="mypass1" class="form-input" :rules="regRules.mypass1">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            ref="mypass1"
            show-password
            v-model="regForm1.mypass1"
            :placeholder="$t('login.passwordPlaceholder')"
            name="mypass1"
            type="text"
            tabindex="3"
            maxlength="16"
            autocomplete="off"
          />
        </el-form-item>
      </div>
      <div class="login-form-control">
        <el-form-item prop="mypass2" class="form-input" :rules="regRules.mypass2">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            ref="mypass2"
            show-password
            v-model="regForm1.mypass2"
            :placeholder="$t('login.confirmPasswordPlaceholder')"
            name="mypass2"
            type="text"
            tabindex="4"
            maxlength="16"
            autocomplete="off"
          />
        </el-form-item>
      </div>
      <el-button class="mainActionBtn" type="primary" :loading="loading" @click="registerHandle">立即注册</el-button>
      <div class="linkToLogin">
        <el-button type="text" @click="gotoLogin">已有账号？返回登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Form as ElForm } from 'element-ui'
import { REG_TYPE, IDENTITY_TYPE } from '@/enum/common'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { registerStep1 } from '@/api/users'
import VerifyCode from '@/components/VerifyCode/index.vue'

@Component({
  name: 'RegStep1',
  components: {
    VerifyCode,
  }
})
export default class extends Vue {
  private loading = false;

  //todo 需要根据手机号做验证，暂时为了测试随意输入账号
  private validatePhone = (rule: any, value: string, callback: Function) => {
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) { 
      callback(new Error('手机号码有误，请重填'));
    } else {
      callback();
    }
  }

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码不能少于6位'))
    } else {
      callback()
    }
  }

  private validateConfirmPassword = (rule: any, value: string, callback: Function) => {
    if (value !== this.regForm1.mypass1) {
      callback(new Error('两次密码不一致'))
    } else {
      callback()
    }
  }

  private regForm1 = {
    myemail: '',
    myphone: '',
    verificationcode: '',
    mypass1: '',
    mypass2: '',
    identityType: '',
  }

  private regRules = {
    myemail: [{ required: true, message: '请填写邮箱地址', trigger: 'blur' }],
    myphone: [{ required: true, message: '请填写手机号码', trigger: 'blur' }, { validator: this.validatePhone, trigger: 'blur' }],
    // verificationcode: [{ required: true, message: '请填写验证码', trigger: 'blur' }],
    mypass1: [{ validator: this.validatePassword, trigger: 'blur' }],
    mypass2: [{ validator: this.validateConfirmPassword, trigger: 'blur' }],
    identityType: [{ required: true, message: this.$t('login.identityTypeErrorMsg'), trigger: 'change' }]
  }

  private regTypeOptions = REG_TYPE

  mounted() {
    console.log('REG_TYPE', this.regTypeOptions)
  }

  @Emit('changeType')
  private async registerHandle() {
    try {
      const valid = await (this.$refs.regForm1 as ElForm).validate();
      if (valid) {
        const params:any = {
          myemail: this.regForm1.myemail, 
          myphone: this.regForm1.myphone,
          verificationcode: this.regForm1.verificationcode,
          mypass1: this.regForm1.mypass1,
          mypass2: this.regForm1.mypass2,
        }
        this.loading = true
        try {
          const result:any = await registerStep1(params);
          const id = result && result.id;
          console.log('a', result);
          this.loading = false;

          //第一步注册成功
          if (result.code === 0) {
            //用户登录并且设置token
            const loginForm = {
              myemail: this.regForm1.myemail,
              mypass1: this.regForm1.mypass1,
              activeIndex: '1',
            }
            await UserModule.Login(loginForm);
            this.$router.push({
              // path: this.redirect || '/',
              path: '/',
            }).catch(err => {
              console.warn(err)
            })
            return true
          } else {
            this.$message({
              message: result.message ?? '注册失败，请核对您的信息',
              type: 'error'
            })
            return false
          }

        } catch (e) {
          this.$message({
            message: '注册失败，请核对您的信息',
            type: 'error'
          })
          this.loading = false
        }

        return false
      } else {
        this.loading = false
        return false
      }

    } catch (error) {
      console.log(error);
    }

   
    // console.log(3333);
    // console.log(a);
    // return {
    //   loginType: 2,
    //   regStep: 2,
    //   identityType: this.regForm1.identityType || IDENTITY_TYPE.ANCHOR,
    // }
  }

  @Emit('changeType')
  private gotoLogin() {
    return {
      loginType: 1,
    }
  }

}
</script>

<style lang="scss" scoped>
  .login-page {
    .verifyCode {
      width:60%;
    }
    @media (max-width: 640px) {
      .verifyCode {
        width:70%;
      }
    }
    .verifyCodeBtn {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .linkToLogin {
      padding: 10px 0 0 ;
    }
  }
</style>
