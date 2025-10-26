<template>
  <div class="account-info-unlogin">
    <p>当前账户尚未绑定steam账号</p>
    <p>绑定后可进行游戏售卖操作</p>
    <p>
      <el-button
        @click="steamLogin"
       class="btn-steam-login"
      />
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { apiDomin } from '@/utils/common';

@Component({
  name: 'StreamLogin',
})
export default class extends Vue {

  private steamLogin() {
    const pageUrl = location.href;
    const apiUrl = `https://${apiDomin}/v1/UserInfo/MyProfile?returnUrl=${encodeURIComponent(pageUrl)}`;
    const link = `https://${apiDomin}/v1/UserInfo/SteamLogin?returnUrl=${apiUrl}`;
    location.href = link;
  }
}
</script>

<style lang="scss" scoped>
  .account-info-unlogin {
    padding: 5px;
    border: 1px #000 solid;
    text-align: center;
    .btn-steam-login {
      width: 154px;
      height: 23px;
      background-image: url('../../assets/login-images/btn_steam_login.png');
    }
  }
</style>
