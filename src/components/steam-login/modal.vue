<template>
  <div v-if="dialogVisible" class="steam-login-modal">
    <div class="steam-login-modal-body">
      <StreamLogin />
    </div>
    <div class="steam-login-v-modal"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import StreamLogin from '@/components/steam-login/index.vue'

@Component({
  components: { StreamLogin },
  name: 'SteamLoginModal',
})
export default class extends Vue {
  @Prop({ required: true }) private dialogVisible!: boolean


}
</script>

<style lang="scss" scoped>
  .steam-login-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
  }
  .steam-login-modal-body {
    position: relative;
    margin: 20vh auto 50px;
    background: #FFFFFF;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    box-sizing: border-box;
    width: 50%;
    z-index: 101;
  }
  .steam-login-v-modal {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000000;
    z-index: 100;
  }
</style>
