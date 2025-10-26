<template>
  <el-row :gutter="10" class="app-container-subwrap">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="app-container-title">
        活跃概括
      </div>
      <div class="dashboard-active">
        <div class="content-flex">
          <div class="content-flex-item">
            注册时间 2015-12-27 10:24
          </div>
          <div class="content-flex-item">
            最后访问 2021-9-9 15:20
          </div>
          <div class="content-flex-item content-flex-item-full">
            上次访问 IP114.88.164.210: - 中国 上海 上海
          </div>
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
  name: 'Active',
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

}
</script>

<style lang="scss" scoped>
.dashboard-active {
  font-size: 12px;
  .content-flex {

    .content-flex-item {
      text-align: left;
      border: 0;
    }
    .content-flex-item-full {
      width: 100%;
    }
  }
}

</style>
