<template>
  <el-row :gutter="10" class="app-container-subwrap">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="app-container-title">
        快捷入口
      </div>
      <div class="content-flex">
        <div class="content-flex-item content-flex-item-pointer">
          我的优惠券
        </div>
        <div class="content-flex-item content-flex-item-pointer">
          STEAM绑定
        </div>
        <div class="content-flex-item content-flex-item-pointer">
          我的任务
        </div>
        <div class="content-flex-item content-flex-item-pointer">
          积分兑换
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { IDENTITY_TYPE } from '@/enum/common'
import { UserModule } from '@/store/modules/user'
import { DetailModule } from '@/store/modules/detail'

@Component({
  name: 'QuickEntry',
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }
}
</script>

<style lang="scss" scoped>


</style>
