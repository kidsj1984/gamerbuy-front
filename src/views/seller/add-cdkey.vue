<template>
  <div class="app-container">
    <div class="add-cdkey-detail-wrap">
      <div class="add-cdkey-detail">
        <div class="title">添加 CD-KEY</div>
        <el-form
          ref="addForm"
          :model="addForm"
          class="add-form"
          label-position="left"
        >
          <div class="add-form-control">
            <el-form-item label="选择CD-KEY所属平台:" prop="platfrom" :rules="formRules.platfrom">
              <el-select v-model="addForm.platfrom" :multiple-limit="2" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in CDKEY_PLATFORM"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="add-form-control">
            <el-form-item label="输入想要出售的游戏链接" prop="gameUrl"  :rules="formRules.gameUrl">
              <el-input
                id="gameUrl"
                ref="gameUrl"
                v-model="addForm.gameUrl"
                placeholder="请输入STEAM商店的该游戏链接"
                name="gameUrl"
                type="text"
                tabindex="1"
                autocomplete="off"
                style="width: 70%"
              />
              <el-button style="margin-left: 20px" type="primary"  @click="getGameInfo">获取游戏信息</el-button>
            </el-form-item>
          </div>
          <div v-if="gameDetail" class="add-form-control">
            <div>出售应用信息</div>
            <div class="add-form-control-game">
              <div><img :src="gameDetail.header_image"/></div>
              <div>
                <p>{{gameDetail.aname}}</p>
                <p></p>
                <p>初始STEAM售价 ¥{{ initial }}</p>
                <p>当前STEAM售价价格 ¥{{ $$(gameDetail, 'price_overview', 'final') | formatAmountE2 }}</p>
              </div>
            </div>
          </div>
          <div class="add-form-control">
            <el-form-item label="输入游戏CD-KEY" prop="mycdkey"  :rules="formRules.mycdkey">
              <el-input
                id="mycdkey"
                ref="mycdkey"
                v-model="addForm.mycdkey"
                placeholder="请输入游戏CD-KEY"
                name="mycdkey"
                type="text"
                tabindex="1"
                autocomplete="off"
              />
            </el-form-item>
          </div>
          <div class="add-form-control">
            <el-form-item label="输入游戏CD-KEY价格" prop="myprice"  :rules="formRules.myprice">
              <el-input-number
                ref="myprice"
                v-model="addForm.myprice"
                placeholder="最低价格1元，最低金额变动0.5元"
                class="verifyCode"
                name="myprice"
                type="text"
                tabindex="2"
                :precision="2"
                :min="1"
                :max="initial"
                autocomplete="off"
                style="width: 70%"
              >
              </el-input-number>
              折扣值：{{ getSalesInfo() }}
            </el-form-item>
          </div>       
          <div class="add-form-control">
            <p>实际到账金额={{getRealAmount()}}</p>
            <p>手续费提示::平台手续费{{ fee | formatPercent(0, true) }}</p>
          </div>
          <el-button 
            class="mainActionBtn" 
            type="primary" 
            @click="handleGameBuy"
            :disabled="!gameInfoLoad" 
            :loading="formLoading"
          >提交</el-button>
        </el-form>
      </div>
      <!-- 右侧文案 start -->
      <div class="add-cdkey-detail-info">
        <div class="add-cdkey-detail-module2">
          <div class="title">出售说明</div>
          <div class="detail">
            <pre>
              1.平台上出售的CDKey必须在steam国区中找到对应的商店页面方可挂单出售，不支持外区CDKey出售

              2.用户请先填写游戏的商店页面链接进行查询，DLC游戏请仔细核对填写正确的DLC单独页面！

              3.请务必确保提交的CDKey所兑换的游戏和进行查询时选择的是同一个游戏，我们给买家自动发货后会有验证！

              4.如提交的CDKey和对应游戏不同，系统会判定验证失败，并退款给买家，所产生的卖家损失平台概不负责！

              5.系统判定验证失败后，为保护卖家其余CDKey的安全，平台会自动下架挂单。

              6.被自动下架的剩余未出售的CDKey，需要卖家手动删除后CDKey才能再次提交编辑进行上架
            </pre>
          </div>
        </div>
      </div>
      <!-- 右侧文案 end -->
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { Message, Form as ElForm } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { gameDetailFormat } from '@/utils/game-format'
import { addCDkey } from '@/api/cdkey'
import { TagsViewModule } from '@/store/modules/tags-view'
import { getGetAppDetail } from '@/api/gamelist'
import { ISellOrderDetailData } from '@/api/types'
import { CDKEY_PLATFORM } from '@/enum/options'
import { formatAmount, formatPercent, formatAmountE2 } from '@/filters/index'
import { getStreamIdByUrl } from '@/utils/common';
// import GameCard from './components/game-card.vue'

@Component({
  name: 'GameDetail',
  components: {
    // GameCard,
  },
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  get initial() {
    const initial = formatAmountE2(this.gameDetail?.price_overview?.initial ?? 0);
    return initial;
  }

  private formLoading = false;
  private gameInfoLoad = false;

  private gameDetail: any = null

  private addForm = {
    platfrom: 1,
    gameUrl: '',  // https://store.steampowered.com/app/1308090/?utm_source=keylol&curator_clanid=9730205
    mycdkey: '',
    myprice: null,
    appid: '',
  }

  private formRules = {
    platfrom: [{ required: true, message: '请选择所属平台', trigger: 'change' }],
    gameUrl: [{ required: true, message: '请填写游戏链接', trigger: 'blur' }],
    mycdkey: [{ required: true, message: '请填写cd-key', trigger: 'blur' }],
    myprice: [{ required: true, message: '请填写售卖价格', trigger: 'blur' }],
  }

  private CDKEY_PLATFORM = CDKEY_PLATFORM;

  private fee = 0.03; // 手续费，暂时写死


  // 获取折扣率
  private getSalesInfo() {
    const initPrice = this.gameDetail?.price_overview?.initial / 100 ?? 0;
    const myprice = this.addForm.myprice ?? 0;
    return myprice && initPrice ? formatPercent(-1 * (1 - (myprice / initPrice)), 2, true) : '0%';
  }

  // 实际到账金额
  private getRealAmount() {
    const myprice = this.addForm.myprice ?? 0;
    return myprice ? formatAmount(myprice * (1 - this.fee)) : 0;
  }

  private async getGameInfo() {
    if (this.addForm.gameUrl) {
      const appid = getStreamIdByUrl(this.addForm.gameUrl);
      this.addForm.appid = appid;
      try {
        const params:any = {
          steamId: appid
        }
        const { data } = await getGetAppDetail(params);
        // const data:any = {}
        const { detail, relatelist } = data;
        this.gameDetail = gameDetailFormat(detail);

        console.log(666, this.gameDetail, detail, relatelist)
        this.gameInfoLoad = true
      } catch (e) {
        console.log(e);
        this.gameInfoLoad = false
      }
    }

  }

  private async handleGameBuy() {
    // this.formLoading = true;

    // const a = await (this.$refs.addForm as ElForm).validate();
    // console.log(900001, a);

    (this.$refs.addForm as ElForm).validate().then(async(valid: boolean) => {
      if (valid) {
        const params:any = {
          platfrom: this.addForm.platfrom, 
          mycdkey: this.addForm.mycdkey,
          myprice: this.addForm.myprice,
          appid: this.addForm.appid,
        }

        try {
          const { code, message, data }:any = await addCDkey(params);
          if (code === 0) {
            Message.success({
              message: 'CD-Key添加成功'
            });
            this.$router.push({ name: 'sale' });
            TagsViewModule.delCurrentView(this.$route);
            
          } else {
            Message.error({
              message: message || '服务器忙请稍后重试',
              type: 'error'
            });
          }
          this.formLoading = false
        } catch (e) {
          console.log(e);
          this.formLoading = false
        }
      }
    });

    // const params:any = {
    //   // sellOrderId: this.sellerId,
    //   // channelId: this.pageQuery.payType,
    // }
    
  }
}
</script>

<style lang="scss">
  .el-table .success-row {
    background: #f0f9eb;
  }

  .add-cdkey-detail-wrap .el-form-item__label {
    float: none;
  }
</style>
<style lang="scss" scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }

  .add-cdkey-detail-wrap {
    padding:10px;
    background: #fff;
    display: flex;

    .add-cdkey-detail-module2 {
      margin: 0 10px;
      border: 1px #000 solid;
      .title {
        padding: 10px;
        border-bottom: 1px #000 solid;
      }
      .detail {
        padding: 10px;
        pre {
          padding: 0 20px;
          white-space: pre-line;
          line-height: 24px;
        }
      }
    }
    .add-cdkey-detail {
      border: 1px #000 solid;
      padding: 20px;
      flex: 2;
      .title {
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 15px;
      }

      .add-form-control {
        padding-bottom: 10px;
        font-size: 14px;

        .add-form-control-game {
          padding-top: 10px;
          display: flex;
          div {
            img {
              width: 100%;
            }
            width: 80%;
            padding-right: 20px;
          }
        }
      }
    }
    .add-cdkey-detail-info {
      flex: 1;
    }
    
  }


</style>
