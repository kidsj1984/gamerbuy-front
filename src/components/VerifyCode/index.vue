<template>
  <span class="verifyCodeBtn">
    <el-button v-if="show" size="mini" type="primary" @click="getCode">验证码</el-button>
    <el-button v-if="!show" disabled>{{ times }}秒</el-button>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getCaptchasendByReg, getCaptchasendByLogin } from '@/api/users'
import { 
  getVerifyExpireStorage, setVerifyExpireStorage, 
} from '@/utils/storage'

@Component({
  name: 'VerifyCode'
})
export default class extends Vue {
  @Prop({ required: true }) private phone!: string
  @Prop({ required: true }) private action!: number   //1注册 2登录
  private show = true;
  private times = 60;
  private timer:any = null;

  mounted() {
    const time = getVerifyExpireStorage();
    const nowTime = Date.now();
    const limit = 60 - Math.floor((nowTime - time) / 1000);
    
    if (time && limit > 0) {
      this.show = false;
      this.times = limit;
      this.getCountdown();
    }
  }

  getCountdown() {
    this.show = false;
    this.timer = setInterval(() => {
      this.times--
      if (this.times === 0) {
        this.times = 60;
        this.show = true
        clearInterval(this.timer)
      }
    }, 1000)
  }

  async getCode() {
    if (this.phone) {
      try {
        const instance = this.action === 1 ? getCaptchasendByReg : getCaptchasendByLogin;

        await instance({ phone: this.phone });
        const nowTime = String(Date.now());
        setVerifyExpireStorage(nowTime);
        this.getCountdown();
      } catch (error) {
        console.log(error);
      }


    }

  }

  destroyed() {
    clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
  .verifyCodeBtn {
    position: absolute;
    right: 10px;
    top: 6px;
  }
</style>
