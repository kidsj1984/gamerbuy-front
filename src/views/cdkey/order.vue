<template>
  <div class="app-container">
    <div class="cdkey-order-wrap">
      <div class="cdkey-order-head">
        订单支付
      </div>
      <div class="cdkey-order-desc">
        请使用{{payType === PAYMENT_METHOD.ALIPAY? '支付宝': '微信'}}进行扫描支付
      </div> 
      <div class="cdkey-order-content">
        <template v-if="payUrl && payType === PAYMENT_METHOD.ALIPAY">
          <iframe :src="payUrl" width="600" height="250" frameborder=”no” border=”0″ marginwidth=”0″ marginheight=”0″ scrolling=”no” allowtransparency=”yes”></iframe>
        </template>
        <template v-else-if="payUrl">
          <img :src="payUrl"/>
          <span class="icon">
            <svg-icon style="color:#51DC02" class="size-icon" name="wechat" />
          </span>
        </template>
      </div>
      <div class="cdkey-order-cancel">
        <el-button
          type="primary"
          @click="handleCancel()"
        >
          取消
        </el-button>
      </div>
      <div class="cdkey-order-price">
        <p>订单摘要</p>
        <p class="cdkey-order-price-info">
          <span class="r">¥{{ sellprice | formatAmount }}</span>
          <span>支付金额</span>
        </p>
      </div>
      <div>
        订单支付完成后请耐心等待1-2分钟等待系统检测
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { getSteamOrderStatus, getSteamOrderInfo } from '@/api/steamorder'
import { ORDER_STATUS_KEY, ORDER_STATUS_FLAG, PAYMENT_METHOD } from '@/enum/common'
import { getTpl, parseOrderStatus2 } from '@/utils/common'
import GameCard from './components/game-card.vue'
import QRCode from 'qrcode'

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
  get steamOrderId() {
    return this.$route.params.orderId
  }

  private currentStep = 0;
  private isCurrentStep = true;
  private payUrl = '';
  private sellprice = 0;
  private payType = PAYMENT_METHOD.WXPAY;
  private orderStatusTimer:any = null;

  private PAYMENT_METHOD = PAYMENT_METHOD;

  mounted() {
    console.log('REG_TYPE2', this.identity)
    this.getOrderStatus(true);

    this.orderStatusTimer = setInterval(() => {
      this.getOrderStatus(false);
    }, 5000)
    
  }

  beforeDestroy() {
    clearInterval(this.orderStatusTimer);
  }

  private handleCancel() {
    console.log(8888);
    this.$router.go(-1);
  }

  private async getOrderStatus(isInit:boolean) {
    console.log(5454, this.steamOrderId);
    const params:any = {
      steamOrderId: this.steamOrderId
    }

    try {
      const result = await getSteamOrderStatus(params);
      const data = result?.data;
      const status = result?.status || 'invalidorder';
      const statusData = ORDER_STATUS_KEY[status];
      // this.sellOrderDetail = gameDetailFormat(data);
      const { hasJump, jumpPath } = parseOrderStatus2(statusData, ORDER_STATUS_FLAG.ORDER, this.steamOrderId);
      console.log(123123, data, hasJump, jumpPath);
      if (hasJump) {
        this.$router.push(jumpPath)
      } else if (isInit) {
        this.getSteamOrderInfo();
      }
      
    } catch (e) {
      console.log(e);
    }
  }

  private async getSteamOrderInfo() {

    const params:any = {
      steamOrderId: this.steamOrderId
    }

    try {
      const data:any = await getSteamOrderInfo(params);
      const payType = data?.channelid ?? PAYMENT_METHOD.WXPAY;
      this.payType = payType;
      this.sellprice = data?.sellprice;
      // this.payUrl = data?.pay_url;

      if (payType === PAYMENT_METHOD.ALIPAY) {
        // const a = data?.pay_url.replaceAll('\"<', '<').replaceAll('>\"', '>').replaceAll('\\"', '\'').replaceAll('\\\\/\\\\/', '\\/\\/');
        // // const a = data?.pay_url?.replaceAll?.('\\\\/\\\\/', '//')?.replaceAll?.('\\n', '')?.replaceAll?.('\\', '"')?.replaceAll?.('&quot;', '\'');
        // console.log(90001, a);
        this.payUrl = data?.pay_url;
      } else {
        this.payUrl = await QRCode.toDataURL(data?.pay_url);
      }

      console.log(data?.sellprice)
    } catch (e) {
      console.log(e);
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
.app-container {
  background: #fff;
}
  .cdkey-order-wrap {
    margin: 0 auto;
    width: 570px;
    text-align: center;
    .cdkey-order-head {
      font-size: 30px;
      font-weight: bold;
      padding-bottom: 40px;
    }

    .cdkey-order-desc {
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 20px;
    }

    .cdkey-order-content {
      position: relative;
      height: 260px;
      img {
        width: 260px;
      }
      .icon {
        border-radius: 25%;
        background: #fff;
        box-shadow: 1px 1px 10px #888888;
        width: 40px;
        height: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -20px 0 0 -20px;
        .size-icon {
          position: absolute;
          top: 5%;
          left: 5%;
          width: 90%!important;
          height: 90%!important;
        }
      }
    }

    .cdkey-order-cancel {
      padding-top: 20px;
    }

    .cdkey-order-price {
      text-align: left;
      .cdkey-order-price-info {
        padding: 30px;
        border: 1px #000 solid;
        .r {
          float: right;
        }
      }
    }
  }


</style>
