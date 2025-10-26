<template>
  <div>
    <div class="subTitle">重置登录密码</div>
    <el-form
      ref="regForm1"
      :model="regForm1"
      class="login-form lg:mt-2"
      label-position="left"
    >
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
      <el-button class="mainActionBtn" type="primary" :loading="loading" @click="registerHandle">发送密码重置邮件</el-button>
      <div class="linkToLogin">
        <el-button type="text" @click="gotoLogin">返回登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Form as ElForm } from 'element-ui'
import { REG_TYPE, IDENTITY_TYPE } from '@/enum/common'
import { Component, Vue, Emit } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getResetPassWordByActivationCode } from '@/api/users'
import VerifyCode from '@/components/VerifyCode/index.vue'
import { apiDomin } from '@/utils/common';

@Component({
  name: 'RegStep1',
  components: {
    VerifyCode,
  }
})
export default class extends Vue {
  private loading = false;

  get findpwCode() {
    const findpwCode = this.$route.query?.code;
    return findpwCode;
  }

  get findpwEmail() {
    const findpwEmail = this.$route.query?.email;
    return findpwEmail;
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

  private imgCode = `https://${apiDomin}/v1/UserInfo/ValidateCode?random=${Date.now()}`;

  private regForm1 = {
    mypass1: '',
    mypass2: '',
  }

  private regRules = {
    mypass1: [{ validator: this.validatePassword, trigger: 'blur' }],
    mypass2: [{ validator: this.validateConfirmPassword, trigger: 'blur' }],
  }

  private regTypeOptions = REG_TYPE;

  mounted() {
    console.log('REG_TYPE', this.regTypeOptions)
    if (!this.findpwEmail || !this.findpwCode) {
      this.gotoLogin();
    }
    
  }
  
  private handleResetCode() {
    this.imgCode = `https://${apiDomin}/v1/UserInfo/ValidateCode?random=${Date.now()}`;
  }

  @Emit('changeType')
  private async registerHandle() {
    try {
      const valid = await (this.$refs.regForm1 as ElForm).validate();
      if (valid) {
        const params:any = {
          myemail: this.findpwEmail,
          code: this.findpwCode,
          mypass1: this.regForm1.mypass1,
          mypass2: this.regForm1.mypass2,
        }

        this.loading = true
        try {
          const result:any = await getResetPassWordByActivationCode(params);
          const id = result && result.id;
          console.log('a', result);
          this.loading = false;

          //第一步注册成功
          if (result.code === 0) {
            this.$message({
              message: '密码重置成功',
              type: 'success',
              onClose: () => {
                this.gotoLogin();
              }
            })
          } else {
            this.$message({
              message: result.message ?? '密码重置失败，请核对您的信息',
              type: 'error'
            })
            return false
          }

        } catch (e) {
          this.$message({
            message: '密码重置失败，请核对您的信息',
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

    .form-input2 {
      .el-input {
        width: 68%;
      }
    }

    .img-container {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
