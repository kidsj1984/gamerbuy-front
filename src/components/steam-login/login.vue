<template>
  <span class="icon">
    <svg-icon style="color:#004A86; cursor: pointer;" class="size-icon" name="steam" @click="steamLogin" />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { apiDomin } from '@/utils/common';

@Component({
  name: 'StreamLogin',
})
export default class extends Vue {

  private steamLogin() {
    const pageUrl = `${location.origin}/verify`;
    const apiUrl = `https://${apiDomin}/v1/UserInfo/MyProfile?returnUrl=${encodeURIComponent(pageUrl)}`;
    const link = `https://${apiDomin}/v1/UserInfo/SteamLogin?returnUrl=${apiUrl}`;
    location.href = link;
  }
}
</script>

<style lang="scss" scoped>
</style>
