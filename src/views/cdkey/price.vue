<template>
  <div class="app-container">
    <div class="cdkey-price-detail-wrap">
      <div class="cdkey-price-detail">
        <div class="cdkey-price-detail-module">
          <div class="title">安全支付</div>
          <div class="detail">
            <div class="cdkey-price-head">
              <el-row :gutter="20">
                <el-col :span="10">
                  <div class="game-image">
                    <img :src="$$(sellOrderDetail, 'gameCover')" />
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="game-name">{{$$(sellOrderDetail, 'gameName')}} <svg-icon class="size-icon" name="windows" /></div> 
                </el-col>
                <el-col :span="4">
                  <div class="game-price">
                    <span class="s">¥{{$$(sellOrderDetail, 'lowestPrice') | formatAmount}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="cdkey-price-detail-module">
          <div class="title">出售卖家</div>
          <div class="detail">
            <el-row :gutter="20">
              <el-col :span="20">
                <div class="game-seller-info">
                  <div class="t">
                    <div class="i"><img :src="$$(sellOrderDetail, 'steam_avatar_new')" /></div>
                    <div class="i2">
                      <p>{{$$(sellOrderDetail, 'steam_nick_name')}} Steam 等级 {{$$(sellOrderDetail, 'steam_user_grade')}} </p>
                      <p>加入日期 {{$$(sellOrderDetail, 'steam_join_date')}} 信誉{{reputation? '正常' : '异常'}} 游戏数 {{$$(sellOrderDetail, 'steam_have_games_count')}}</p>
                    </div>
                  </div>
                  <div class="b">
                    <el-tag :type="$$(sellOrderDetail, 'steam_trade_status') === 'none'?'success':'danger'">交易封禁 ：{{$$(sellOrderDetail, 'steam_trade_status') === 'none' ? '正常' : '异常'}}</el-tag>
                    <el-tag :type="$$(sellOrderDetail, 'steam_community_status') === 'False'?'success':'danger'">社区封禁 ：{{$$(sellOrderDetail, 'steam_community_status') === 'False'  ? '正常' : '异常'}}</el-tag>
                    <el-tag :type="$$(sellOrderDetail, 'steam_vac_status') === 'False'?'success':'danger'">VAC封禁 ：{{$$(sellOrderDetail, 'steam_vac_status') === 'False'  ? '正常' : '异常'}}</el-tag>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="game-price-2">
                  <div class="t"><svg-icon class="size-icon" name="property-safety" /></div>
                  <div class="b">信誉{{reputation? '正常' : '异常'}}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="cdkey-price-detail-module3">
          <div class="title">选择支付渠道</div>
          <div class="detail">
            <div class="cdkey-payment-channel">
              <div class="cdkey-payment-channel-radio">
                <el-radio v-model="pageQuery.payType" :label="PAYMENT_METHOD.WXPAY">
                  使用微信支付 
                </el-radio>
                <div class="b"><div class="btn-wechat-login"></div></div>
              </div>
              <div v-if="pageQuery.payType === PAYMENT_METHOD.WXPAY" class="cdkey-payment-channel-btn">
                <div class="m">单击按钮重定向到微信支付并安全地完成您的付款</div>
                <div class="b">
                  <el-button
                    :loading="postLoading"
                    type="primary"
                    @click="handleGameBuy()"
                  >
                    使用微信付款
                  </el-button>
                </div>
              </div>
            </div>
            <div class="cdkey-payment-channel">
              <div class="cdkey-payment-channel-radio">
                <el-radio v-model="pageQuery.payType" :label="PAYMENT_METHOD.ALIPAY">使用支付宝支付</el-radio>
                <div class="b"><div class="btn-alipay-login"></div></div>
              </div>
              <div v-if="pageQuery.payType === PAYMENT_METHOD.ALIPAY" class="cdkey-payment-channel-btn">
                <div class="m">单击按钮重定向到支付宝并安全地完成您的付款</div>
                <div class="b">
                  <el-button
                    :loading="postLoading"
                    type="primary"
                    @click="handleGameBuy()"
                  >
                    使用支付宝付款
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div class="cdkey-price-detail-info">
        <!--
        <div class="cdkey-price-detail-module">
          <div class="title">代金券与礼品卡</div>
          <div class="detail">
            <span style="margin-right:10px">输入代码</span>
            <el-input
              v-model="pageQuery.giftCode"
              placeholder="请输入礼品代码"
              style="width: 300px;margin-right:10px"
            />
            <el-button
              type="primary"
              @click="handleGiftCode()"
            >
              应用
            </el-button>
          </div>
        </div>
        -->
        <div class="cdkey-price-detail-module">
          <div class="title">订单摘要</div>
          <div class="detail">
            <el-row :gutter="20">
              <el-col :span="10">
                支付金额
              </el-col>
              <el-col :span="14" style="text-align:right">
                ¥{{$$(sellOrderDetail, 'lowestPrice')}}
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="cdkey-price-detail-module2">
          <div class="title">CDKey贩售说明</div>
          <div class="detail">
            <pre>
              <b>出售</b>
              1.平台上只出售能在国区兑换的CDKey，不支持外区账号进行购买和兑换
              2.用户下单支付后需在平台登录提交自己的steam账号进行提货
              3.提货后平台会自动发货并且对CDKey进行验证来确保CDKey的准确性
              4.购买DLC的CDKey请确保自己账号游戏库中有购买的游戏本体
              5.如需出售CDKey，请去卖家中心进行操作
              
              <b>求购</b>
              1.每位用户每天只能求购3个游戏
              2.每个求购只会显示3天，3天后自动撤销求购申请
              3.如有卖家向你出售此游戏，求购用户会收到短信提示
              4.求购DLC请确保自己账号游戏库中有购买的游戏本体
            </pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { gameDetailFormat } from '@/utils/game-format'
import { getDetailBySellOrderId, addMyOrder } from '@/api/ssellerapplist'
import { ISellOrderDetailData } from '@/api/types'
import { PAYMENT_METHOD } from '@/enum/common'
import GameCard from './components/game-card.vue'

@Component({
  name: 'GameDetail',
  components: {
    GameCard,
  },
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  // 售卖者对应游戏的售卖id
  get sellerId() {
    return this.$route.params.sellerId
  }

  // 信誉度
  get reputation() {
    return this.sellOrderDetail?.steam_community_status === 'False' && this.sellOrderDetail?.steam_trade_status === 'none' && this.sellOrderDetail?.steam_vac_status === 'False';
  }

  private sellOrderDetail: ISellOrderDetailData | null = null

  private detailLoading = false;
  private postLoading = false;

  private pageQuery = {
    giftCode: '',
    payType: PAYMENT_METHOD.WXPAY,
  }

  private PAYMENT_METHOD = PAYMENT_METHOD;

  mounted() {
    this.getDetailBySellOrderId();
  }

  private async getDetailBySellOrderId() {
    this.detailLoading = true;

    const params:any = {
      sellOrderId: this.sellerId
    }

    try {
      const { data } = await getDetailBySellOrderId(params);
      this.sellOrderDetail = gameDetailFormat(data);
      console.log(888, data, this.sellOrderDetail);
      // // const data:any = {}
      // const { items, totalItems } = data;
      // console.log(23412, data, items)
      // this.sellerlist = items;
      // this.total = totalItems;
      this.detailLoading = false
    } catch (e) {
      console.log(e);
      this.detailLoading = false
    }
  }

  private handleGiftCode(obj: any) {
    return '';
  }

  private async handleGameBuy() {
    this.postLoading = true;

    const params:any = {
      sellOrderId: this.sellerId,
      channelId: this.pageQuery.payType,
    }

    try {
      const { code, message, data }:any = await addMyOrder(params);
      if (code === 0) {
        this.$router.push({ name: 'gameOrder', params: { orderId: data?.orderId } });
      } else {
        Message.error({
          message: message || '服务器忙请稍后重试',
          type: 'error'
        })
      }
      this.postLoading = false
    } catch (e) {
      console.log(e);
      this.postLoading = false
    }
    
  }
}
</script>

<style lang="scss">
  .el-table .success-row {
    background: #f0f9eb;
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

  .cdkey-price-detail-wrap {
    padding:10px;
    background: #fff;
    display: flex;


    .cdkey-price-head {

      .game-image {
        border-radius: 4px;
        height: 180px;
        display: flex;
        flex-direction: row;
        align-items: center; /*垂直居中*/
        justify-content: center; /*水平居中*/
        img {
          width: 100%;
          max-height: 180px;
          flex: 1;
          border: 1px #000 solid;
        }
      }

      .game-name {
        padding-top: 60px;
        height: 120px;
        font-size: 30px;
        line-height: 30px;
      }

      .game-desc {
        font-size: 14px;
      }

      .game-price {
        text-align: right;
        font-size: 14px;
        padding-top: 80px;
        height: 120px;
        * {
          vertical-align: bottom;
        }
        .s {
          font-size: 28px;
          font-weight: bold;
          margin-left: 10px;
        }

        .r {
          color: #AAAAAA;
          font-size: 20px;
          text-decoration: line-through;
          margin: 0 10px;
        }
      }

      .game-label {
        text-align: right;
        font-size: 14px;

        span {
          margin-left: 5px;
        }
      }
    }

    .cdkey-price-detail-module {
      padding: 10px;
      .title {
        padding: 10px;
        font-size: 20px;
        font-weight: bold;
      }

      .detail {
        padding: 10px;
        border:1px #000 solid;
      }
      .detail-pre {
        font-size: 14px;
        display: flex;
        pre {
          padding: 0 10px;
          width: 50%;
          flex: 1;
          white-space: pre-line;
          line-height: 24px;
        }
      }

      .game-seller-info {
        padding: 10px 0;
        border-right: 1px #000 solid;
        .t {
          border-bottom: 1px #000 solid;
          font-size: 14px;
          padding-bottom: 10px;
          .i {
            display: inline-block;
            padding: 0 10px;
            img {
              width: 64px;
              height: 64px;
            }
          }
          .i2 {
            display: inline-block;
            padding: 0 10px;

          }
          * {
            vertical-align: middle;
          }
        }

        .b {
          padding: 10px;
          span {
            margin-right: 5px;
          }
        }
      }

      .game-price-2 {
        text-align: center;
        .t {
          font-size: 80px;
          line-height: 110px;
          height: 110px;
        }
        .b {
          font-size: 18px;
        }
      }

      .preview {
        width: 460px;
        height: 218px;
      }

      .preview-list {
        width: 460px;
        display: flex;
        align-items: center;
        .preview-list-item {
          flex: 1;
          overflow: hidden;
          padding-left: 3px;
          img {
            width: 100%;
          }
        }
        .preview-list-item:first-child {
          padding-left: 0;
        }
      }
    }

    .cdkey-price-detail-module2 {
      margin: 10px;
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

    .cdkey-price-detail-module3 {
      padding: 10px;

      .cdkey-payment-channel {
        padding: 10px 20px 10px;
        margin-top: 10px;
        border: 1px #000 solid;
        .cdkey-payment-channel-radio {
          display: flex;
          padding-bottom: 10px;
          label {
            flex: 1;
            padding: 20px 0 10px;
          }
          .b {
            flex: 0 0 140px;
          }
        }

        .cdkey-payment-channel-btn {
          display: flex;
          .m {
            flex: 1;
          }

          .b {
            flex: 0 0 150px;
          }
        }
      }
    }

    .cdkey-price-detail {
      flex: 1;
    }
    .cdkey-price-detail-info {
      flex: 0 0 500px;
    }
    .gameList {
      margin: 5px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .gameItem {
        width: 48%;
        margin: 0 0.5% 10px;

      }
    }
    
  }


  .btn-alipay-login {
    width: 100px;
    height: 40px;
    background-size: cover;
    background-image: url('../../assets/login-images/icon_alipay.png');
  }


  .btn-wechat-login {
    width: 100px;
    height: 40px;
    background-size: cover;
    background-image: url('../../assets/login-images/icon_wechat.png');
  }


</style>
