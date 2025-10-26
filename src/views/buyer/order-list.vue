<template>
  <div class="app-container">
    <el-tabs v-model="activeName" tab-position="top" type="border-card">
      <el-tab-pane label="CD-KEY订单" :name="ORDER_TYPE.CDKEY">
        <OrderCard :cardData="cardDefaultData[ORDER_TYPE.CDKEY]"/>
      </el-tab-pane>
      <el-tab-pane label="充值订单" :name="ORDER_TYPE.RECHARGE">
        <OrderCard :cardData="cardDefaultData[ORDER_TYPE.RECHARGE]"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ORDER_TYPE, LOW_CODE_FORM_TYPE, LOW_CODE_TABLE_TYPE } from '@/enum/common';
import { getOrderListByRecharge, getListByBuyUid } from '@/api/steamorder'
import { ORDER_STATUS } from '@/enum/options';
import { UserModule } from '@/store/modules/user';
import OrderCard from '@/components/table-list/index.vue';

@Component({
  name: 'OrderList',
  components: {
    OrderCard,
  },
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  get uid() {
    return UserModule.uid;
  }
  
  private ORDER_TYPE = ORDER_TYPE;
  private LOW_CODE_FORM_TYPE = LOW_CODE_FORM_TYPE;
  private LOW_CODE_TABLE_TYPE = LOW_CODE_TABLE_TYPE;

  private activeName = ORDER_TYPE.CDKEY;
  private cardDefaultData = {
    [ORDER_TYPE.CDKEY]: {
      instanceApi: getListByBuyUid,
      filterData: [
        { 
          name: 'selectDate', 
          type: LOW_CODE_FORM_TYPE.DATEPICKER, 
          extraData: { type: 'daterange', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期', beginTimeKey: 'beginTime', endTimeKey: 'endTime' }
        },
        { 
          name: 'orderStatus', 
          type: LOW_CODE_FORM_TYPE.SELECT, 
          extraData: { options: ORDER_STATUS, placeholder: '订单状态' }
        },
        { 
          name: 'selectKey', 
          type: LOW_CODE_FORM_TYPE.INPUT, 
          extraData: { placeholder: '请输入订单号查询' }
        },
        {
          name: 'search', 
          type: LOW_CODE_FORM_TYPE.SEARCH, 
        },
      ],
      tableData: [
        { name: 'orderid', columnName: '订单号', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'header_image', columnName: '游戏', type: LOW_CODE_TABLE_TYPE.IMG },
        { name: 'gamename', columnName: '游戏名称', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'selltimeutc', columnName: '购买时间', type: LOW_CODE_TABLE_TYPE.DATE },
        { name: 'sellprice', columnName: '购买价格', type: LOW_CODE_TABLE_TYPE.TEXT, template: '$%S' },
        { name: 'sellstatus', columnName: '交易状态', type: LOW_CODE_TABLE_TYPE.ENUM, options: ORDER_STATUS },
        { name: 'selluid', columnName: '出售者', type: LOW_CODE_TABLE_TYPE.TEXT },
        {
          name: 'action', 
          columnName: '操作', 
          type: LOW_CODE_TABLE_TYPE.ACTION, 
          btnList: [
            {
              btnName: '订单详情',
              disabled: () => false,
              callback: (row:any) => {
                this.$router.push({ name: 'buyerOrderDetail', params: { orderId: row.orderid } });
              },
            },
          ]
        },
      ],
    },
    [ORDER_TYPE.RECHARGE]: {
      instanceApi: getOrderListByRecharge,
      filterData: [
        { 
          name: 'selectDate', 
          type: LOW_CODE_FORM_TYPE.DATEPICKER, 
          extraData: { type: 'daterange', 'start-placeholder': '开始日期', 'end-placeholder': '结束日期', beginTimeKey: 'beginTime', endTimeKey: 'endTime' }
        },
        { 
          name: 'orderStatus', 
          type: LOW_CODE_FORM_TYPE.SELECT, 
          extraData: { options: ORDER_STATUS, placeholder: '订单状态' }
        },
        { 
          name: 'selectKey', 
          type: LOW_CODE_FORM_TYPE.INPUT, 
          extraData: { placeholder: '请输入订单号查询' }
        },
      ],
      tableData: [
        { name: 'orderId', columnName: '订单号', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'payTimeutc', columnName: '支付时间', type: LOW_CODE_TABLE_TYPE.DATE },
        { name: 'tradeTimeutc', columnName: '交易完成时间', type: LOW_CODE_TABLE_TYPE.DATE },
        { name: 'steamid', columnName: 'SteamID', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'nickName', columnName: 'Steam用户昵称', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'orderStatus', columnName: '交易状态', type: LOW_CODE_TABLE_TYPE.ENUM, options: ORDER_STATUS },
        {
          name: 'action', 
          columnName: '操作', 
          type: LOW_CODE_TABLE_TYPE.ACTION, 
          btnList: [
            {
              btnName: '订单详情',
              disabled: () => false,
              callback: (row:any) => {
                console.log('订单详情', row);
              },
            },
          ]
        },
      ],
      filterUrl: '',
    },
  }


  mounted() {
    console.log(333)
  }

}
</script>

<style lang="scss" scoped>
  .gameList {
    margin: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .gameItem {
      width: 24%;
      margin: 0 0.5% 10px;

    }
  }
</style>
