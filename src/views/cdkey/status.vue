<template>
  <div class="app-container">
    <div class="game-status-detail-wrap">
      <div class="game-status-detail">
        <div class="game-status-detail-module">
          <div class="title">订单状态</div>
          <div class="detail">
            <div class="game-status-title">系统发货进度</div>
            <div class="game-status-step">
              <el-steps :active="step" finish-status="success"  align-center>
                
                <el-step title="提交订单" icon="el-icon-edit" >
                  <template slot="description" v-if="stepData[ORDER_STEP_KEY.SUBMIT_ORDER]">
                    {{ $$(stepData[ORDER_STEP_KEY.SUBMIT_ORDER], 'date') | formatDate(true)}}
                    <!-- {{parseInt(stepData[ORDER_STEP_KEY.SUBMIT_ORDER].date) | formatDate(true)}} -->
                  </template>
                </el-step>
                <el-step title="付款成功" icon="el-icon-edit">
                  <template slot="description" v-if="stepData[ORDER_STEP_KEY.CASH_SUCCESS]">
                    {{ $$(stepData[ORDER_STEP_KEY.CASH_SUCCESS], 'date') | formatDate(true)}}
                    <!-- {{parseInt(stepData[ORDER_STEP_KEY.CASH_SUCCESS].date) | formatDate(true)}} -->
                  </template>
                </el-step>
                <el-step title="商品出库" icon="el-icon-edit">
                  <svg-icon name="guide" slot="icon"/>
                  <template slot="description" v-if="stepData[ORDER_STEP_KEY.PRODUCT_SELL]">
                    {{ $$(stepData[ORDER_STEP_KEY.PRODUCT_SELL], 'date') | formatDate(true)}}
                    <!-- {{parseInt(stepData[ORDER_STEP_KEY.PRODUCT_SELL].date) | formatDate(true)}} -->
                  </template>
                </el-step>
                <el-step title="验证商品" icon="el-icon-edit">
                  <svg-icon name="idcard" slot="icon"/>
                  <template slot="description" v-if="stepData[ORDER_STEP_KEY.WAIT_FOR_VERIFY]">
                    {{ $$(stepData[ORDER_STEP_KEY.WAIT_FOR_VERIFY], 'date') | formatDate(true)}}
                    <!-- {{parseInt(stepData[ORDER_STEP_KEY.WAIT_FOR_VERIFY].date) | formatDate(true)}} -->
                  </template>
                </el-step>
                <el-step title="交易完成" icon="el-icon-edit">
                  <svg-icon name="check-square" slot="icon"/>
                  <template slot="description" v-if="stepData[ORDER_STEP_KEY.DONE]">
                    {{ $$(stepData[ORDER_STEP_KEY.DONE], 'date') | formatDate(true)}}
                    <!-- {{parseInt(stepData[ORDER_STEP_KEY.DONE].date) | formatDate(true)}} -->
                  </template>
                </el-step>
              </el-steps>
            </div>
          </div>
          <div class="detail">
            <div class="game-status-title">系统发货说明</div>
            <div class="game-status-content">
              1. 当系统验证CD-KEY内容狱实际出售内容不相符时，系统会自动退款至买家支付渠道，请耐心等待<br/>
              2. 当买家购买时因账号原因无法激活时，系统亦会自动退款至买家支付渠道，请耐心等待<br/>
              3. 查询具体订单信息请至买家中心查询
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { Message, Form as ElForm } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getSteamOrderStatus } from '@/api/steamorder'
import { parseOrderStatus2 } from '@/utils/common'
import { ISellOrderDetailData } from '@/api/types'
import { ORDER_STATUS_FLAG, ORDER_STATUS_KEY, STREAM_STATUS, ORDER_STEP_KEY } from '@/enum/common'
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
  get steamOrderId() {
    return this.$route.params.orderId
  }

  private sellOrderDetail: ISellOrderDetailData | null = null

  private detailLoading = false;
  private postLoading = false;
  private streamLoginTimer:any = null;

  private streamLoginStatus = STREAM_STATUS.NOTLOGIN;
  private STREAM_STATUS = STREAM_STATUS;
  private stepData = {};
  private step = 0;
  private ORDER_STEP_KEY = ORDER_STEP_KEY;

  mounted() {
    // this.getDetailBySellOrderId();
    // this.checkStatus();
    this.getOrderStatus();
  }


  private async getOrderStatus() {
    console.log(5454, this.steamOrderId);
    const params:any = {
      steamOrderId: this.steamOrderId
    }

    try {
      const result:any = await getSteamOrderStatus(params);
      const data = result?.data;
      const status = result?.status || 'invalidorder';
      const statusData = ORDER_STATUS_KEY[status];
      const stepData:any = {};
      let step = 0;

      data.forEach((item:any, i:number) => {
        stepData[item.orderContent] = {
          date: item.orderOperatorTimeutc,
          status: item.orderStatus,
        }

        if (item.orderStatus) {
          step = i + 1;
        }
      });
      console.log(900007, stepData)
      console.log(9999, stepData[ORDER_STEP_KEY.SUBMIT_ORDER].date)
      this.stepData = stepData;
      this.step = step;
      // this.sellOrderDetail = gameDetailFormat(data);
      const { hasJump, jumpPath } = parseOrderStatus2(statusData, ORDER_STATUS_FLAG.STATUS, this.steamOrderId);
      console.log(6666, hasJump)
      if (hasJump) {
        this.$router.push(jumpPath)
      }
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
  .game-status-detail-wrap {
    padding:10px;
    background: #fff;
    display: flex;

    .game-status-title {
      padding: 20px;
    }
    .game-status-step {
      padding: 20px;
    }
    .game-status-content {
      padding: 0 40px 20px;
      line-height: 30px;
    }
    .game-status-head {
      padding: 40px 0;
      width: 80%;
      margin: 0 auto;
    }

    .game-status-detail-module {
      padding: 10px;
      .title {
        padding: 10px 10px 0;
        font-size: 20px;
        font-weight: bold;
      }

      .detail {
        margin-top: 20px;
        padding: 10px;
        border:1px #000 solid;

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

    .game-status-detail {
      flex: 1;
    }
    .game-status-detail-info {
      flex: 0 0 500px;
    }
    
  }


</style>
