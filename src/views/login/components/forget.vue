<template>
  <div>
    <div class="subTitle">密码重置</div>
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
        <el-form-item prop="vcode" class="form-input2" :rules="regRules.vcode">
          <span class="svg-container">
            <svg-icon name="verification" />
          </span>
          <el-input
            ref="vcode"
            v-model="regForm1.vcode"
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
import { getPassWordReset } from '@/api/users'
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

  private imgCode = `https://${apiDomin}/v1/UserInfo/ValidateCode?random=${Date.now()}`;

  private regForm1 = {
    myemail: '',
    vcode: '',
  }

  private regRules = {
    myemail: [{ required: true, message: '请填写邮箱地址', trigger: 'blur' }],
    vcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  }

  private regTypeOptions = REG_TYPE

  mounted() {
    console.log('REG_TYPE', this.regTypeOptions)
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
          myemail: this.regForm1.myemail, 
          vcode: this.regForm1.vcode,
        }
        this.loading = true
        try {
          const result:any = await getPassWordReset(params);
          const id = result && result.id;
          console.log('a', result);
          this.loading = false;

          //第一步注册成功
          if (result.code === 0) {
            this.$message({
              message: '重置密码邮件发送成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: result.message ?? '邮件失败，请核对您的信息',
              type: 'error'
            })
            return false
          }

        } catch (e) {
          this.$message({
            message: '邮件失败，请核对您的信息',
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
