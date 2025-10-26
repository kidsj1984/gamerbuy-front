<template>
  <div class="app-container">
    <div class="game-status-detail-wrap">
      <div class="game-status-detail">
        <!-- 订单状态 start -->
        <div class="game-status-detail-module">
          <div class="title">订单状态</div>
          <div class="game-status-step-detail detail">
            <div class="game-status-step-left">
              <div class="game-status-step-left-p">订单编号：{{steamOrderId}}</div>
              <div class="game-status-step-left-p">交易状态：{{stepMsg}}</div>
            </div>
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
        </div>
        <!-- 订单状态 end -->
        <!-- 商品信息 start -->
        <div class="game-status-detail-module">
          <div class="title">商品信息</div>
          <div class="detail">
            <el-table :data="gameTableData" style="width: 100%">
              <el-table-column label="商品" width="200px">
                <template slot-scope="scope">
                  <img :src="scope.row.gameImage" width="100%"/>
                </template>
              </el-table-column>
              <el-table-column prop="gamename" label="商品名称">
              </el-table-column>
              <el-table-column prop="sellprice" label="价格">
              </el-table-column>
              <el-table-column prop="cdkey" label="CD-KEY">
              </el-table-column>
              <el-table-column prop="confirmprice" label="到账金额">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 商品信息 end -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { Message, Form as ElForm } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { getSteamOrderStatus, getSteamOrderIdForSell } from '@/api/steamorder'
import { parseOrderStatus } from '@/utils/common'
import { ORDER_STATUS } from '@/enum/options';
import { ISellOrderDetailData } from '@/api/types'
import { STREAM_STATUS, ORDER_STEP_KEY, ORDER_STATUS_KEY } from '@/enum/common'

@Component({
  name: 'OrderDetail',
  components: {
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
  private ORDER_STATUS = ORDER_STATUS;
  private gameTableData:any = [];     // 商品信息
  private stepMsg = '交易中';

  mounted() {
    this.getSteamOrderInfo();
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
      this.stepMsg = statusData?.statusMsg ?? '交易中';
      const stepData:any = {};
      const step = statusData?.stepFlag;

      data.forEach((item:any) => {
        stepData[item.orderContent] = {
          date: item.orderOperatorTimeutc,
          status: item.orderStatus,
        }
      });
      this.stepData = stepData;
      this.step = step;

    } catch (e) {
      console.log(e);
    }
  }


  private async getSteamOrderInfo() {

    const params:any = {
      steamOrderId: this.steamOrderId
    }

    try {
      const data:any = await getSteamOrderIdForSell(params);
      if (data) {
        this.gameTableData.push({
          gameImage: data?.header_image,
          gamename: data?.gamename,
          cdkey: data?.cdkey,
          sellprice: data?.sellprice,
          confirmprice: data?.confirmprice,
          sellstatus: data?.sellstatus,
        })

      }
      console.log(data)
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

      .game-status-step-detail {
        display: flex;
        padding: 0;
        font-size: 14px;
      }
      .game-status-step-left {
        display: flex;
        flex: 0 0 200px;
        border-right: 1px #000 solid;
        flex-direction: column;
        justify-content: center;
        .game-status-step-left-p {
          padding: 20px;
          &:first-child {
            border-bottom: 1px #000 solid;
          }
        }
      }
      .game-status-step {
        flex: 1;
        padding: 20px 0;
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
