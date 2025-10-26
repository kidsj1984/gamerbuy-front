<template>
  <el-row :gutter="10" class="app-container-subwrap">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="app-container-title">
        账户信息
      </div>
      <!-- stream 未绑定 start -->
      <template v-if="!userData.user_steamid">
        <div class="app-dashboard-account-info">
          <div class="account-info">
            <StreamLogin />
          </div>
          <div class="account-info">
            <div class="account-grid">电子邮箱：</div>
            <div class="account-grid-r">{{userData.email}}</div>
          </div>
          <div class="account-info">
            <div class="account-grid">手机：</div>
            <div class="account-grid-r">{{userData.myphone}}</div>
          </div>
          <div class="account-info">
            <div class="account-grid">钱包余额:</div>
            <div class="account-grid-r">{{userData.userbalance}}</div>
          </div>
        </div>
        <div class="app-dashboard-account-num">
          <div class="content-flex">
            <div class="content-flex-item">
              <p>--</p>
              <p>成功交易次数</p>
            </div>
            <div class="content-flex-item">
              <p>--</p>
              <p>钱包余额</p>
            </div>
            <div class="content-flex-item">
              <p>--</p>
              <p>代购额度</p>
            </div>
            <div class="content-flex-item">
              <p>--</p>
              <p>已获取收益</p>
            </div>
          </div>
        </div>
      </template>
      <!-- stream 未绑定 end -->
      <!-- stream 已绑定 start -->
      <template v-else>
        <div class="app-dashboard-account-info">
          <div class="account-info">
            <div class="account-grid"><img :src="userData.avatar" width="90" height="90"></div>
            <div class="account-grid-r">
              <div class="i">{{userData.nickname}}</div>
              <div class="b"><svg-icon name="steam2" title="同步steam数据"/></div>
              <div v-if="isSeller" class="i">当前steam信誉： {{reputation}} </div>
              <div v-if="isSeller" class="i"> 交易封禁 ：{{userSteamTradeStatus}} </div>
              <div v-if="isSeller" class="i"> 社区封禁 ：{{userSteamCommunityStatus}} | VAC封禁 ：{{userSteamVACStatus}} </div>
            </div>
          </div>
          <div class="account-info">
            <div class="account-grid">电子邮箱：</div>
            <div class="account-grid-r">{{userData.email}}</div>
          </div>
          <div class="account-info">
            <div class="account-grid">手机：</div>
            <div class="account-grid-r">{{userData.myphone}}</div>
          </div>
          <div class="account-info">
            <div class="account-grid">钱包余额:</div>
            <div class="account-grid-r">{{userData.userbalance}}</div>
          </div>
        </div>
        <div class="app-dashboard-account-num">
          <div v-if="isSeller" class="content-flex">
            <div class="content-flex-item">
              <p>{{userData.total_sell_success_count}}</p>
              <p>成功交易次数</p>
            </div>
            <div class="content-flex-item">
              <p>¥{{userData.userbalance}}</p>
              <p>钱包余额</p>
            </div>
            <div class="content-flex-item">
              <p>{{userData.desirecount}}</p>
              <p>代购额度</p>
            </div>
            <div class="content-flex-item">
              <p>{{userData.buygames}}</p>
              <p>已获取收益</p>
            </div>
          </div>
          <div v-else class="content-flex">
            <div class="content-flex-item">
              <p>{{userData.havegames}}</p>
              <p>拥有游戏数</p>
            </div>
            <div class="content-flex-item">
              <p>{{userData.gamehours}}h</p>
              <p>游戏时长</p>
            </div>
            <div class="content-flex-item">
              <p>{{userData.desirecount}}</p>
              <p>已添加愿望单</p>
            </div>
            <div class="content-flex-item">
              <p>{{userData.buygames}}</p>
              <p>已购买游戏</p>
            </div>
          </div>
        </div>
      </template>
      <!-- stream 已绑定 end -->
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { USER_TYPE } from '@/enum/common'
import { UserModule } from '@/store/modules/user'
import StreamLogin from '@/components/steam-login/index.vue'

@Component({
  components: { StreamLogin },
  name: 'Account',
})
export default class extends Vue {
  @Prop({ required: true }) private userType!: string

  get userData() {
    return UserModule.userData ?? {};
  }

  get reputation() {
    const isStatus = UserModule.userData?.userSteamVACStatus === 'False' &&  UserModule.userData?.userSteamCommunityStatus === 'False' &&  UserModule.userData?.userSteamTradeStatus === 'none';
    return isStatus ? '正常' : '异常'
  }

  get userSteamVACStatus() {
    const isStatus = UserModule.userData?.userSteamVACStatus === 'False';
    return isStatus ? '正常' : '异常'
  }

  get userSteamCommunityStatus() {
    const isStatus = UserModule.userData?.userSteamCommunityStatus === 'False';
    return isStatus ? '正常' : '异常'
  }

  get userSteamTradeStatus() {
    const isStatus = UserModule.userData?.userSteamTradeStatus === 'none';
    return isStatus ? '正常' : '异常'
  }

  // 卖家信息
  get isSeller() {
    return this.userType === USER_TYPE.seller;
  }


  async mounted() {
    console.log(111)
  }

}
</script>

<style lang="scss" scoped>
  .app-dashboard-account-info {
    padding: 10px;
    border-bottom: 1px #ccc solid;

    .account-info {
      display: flex;
      margin-bottom: 15px;
      .account-grid {
        flex: 0 0 90px;
        margin-right: 10px;
        text-align: right;
      }
      .account-grid-r {
        flex: 1;
        position: relative;
        .i {
          font-size: 12px;
          padding: 2px 0 7px;
        }
        .b {
          position:absolute;
          top: 5px;
          right: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .app-dashboard-account-num {
    padding: 10px;
    
  }


</style>
