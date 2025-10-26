<template>
  <div class="copyright"><a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index">沪ICP备2022000959号-1</a></div>
  <!-- <div></div> -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'CopyRight',
})
export default class extends Vue {


}
</script>

<style lang="scss" scoped>
  .copyright {
    position: absolute;
    bottom: 10px;
    left: 0;
    text-align: center;
    width: 100%;
    font-size: 12px;
  }
</style>
