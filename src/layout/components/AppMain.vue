<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <SteamLoginModal
      :dialogVisible.sync="dialogVisible"
      :modal-append-to-body="false"
    />
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'
import { UserModule } from '@/store/modules/user'
import SteamLoginModal from '@/components/steam-login/modal.vue';
import { RouteRecord, Route } from 'vue-router'

@Component({
  name: 'AppMain',
  components: {
    SteamLoginModal
  }
})
export default class extends Vue {

  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  private dialogVisible = false;

  @Watch('$route')
  private onRouteChange(route: Route) {
    const dialogVisible = !UserModule?.userData?.user_steamid && this.$route.path.indexOf('/seller') !== -1;
    this.dialogVisible = dialogVisible;
  }

  mounted() {
    const dialogVisible = !UserModule?.userData?.user_steamid && this.$route.path.indexOf('/seller') !== -1;
    this.dialogVisible = dialogVisible;
  }

}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
