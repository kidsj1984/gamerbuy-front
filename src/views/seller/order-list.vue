<template>
  <div class="app-container">
    <el-tabs v-model="activeName" tab-position="top" type="border-card">
      <el-tab-pane label="CD-KEY订单" :name="ORDER_TYPE.CDKEY">
        <OrderCard :cardData="cardDefaultData[ORDER_TYPE.CDKEY]"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ORDER_TYPE, LOW_CODE_FORM_TYPE, LOW_CODE_TABLE_TYPE } from '@/enum/common';
import { getOrderListByRecharge, getListBySellUid } from '@/api/steamorder'
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

  // 售卖者对应游戏id
  get gameId() {
    return this.$route.params.gameId
  }
  
  private ORDER_TYPE = ORDER_TYPE;
  private LOW_CODE_FORM_TYPE = LOW_CODE_FORM_TYPE;
  private LOW_CODE_TABLE_TYPE = LOW_CODE_TABLE_TYPE;

  private activeName = ORDER_TYPE.CDKEY;
  private cardDefaultData = {
    [ORDER_TYPE.CDKEY]: {
      instanceApi: getListBySellUid,
      params: {
        appid: this.gameId, // 指定的gameId
      },
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
        { name: 'cdkey', columnName: '使用CD-KEY', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'selltimeutc', columnName: '出售时间', type: LOW_CODE_TABLE_TYPE.DATE },
        { name: 'sellprice', columnName: '出售价格', type: LOW_CODE_TABLE_TYPE.TEXT, template: '%S' },
        { name: 'confirmprice', columnName: '到账金额', type: LOW_CODE_TABLE_TYPE.TEXT, template: '%S' },
        { name: 'sellstatus', columnName: '交易状态', type: LOW_CODE_TABLE_TYPE.ENUM, options: ORDER_STATUS },
        { name: 'buyuid', columnName: '购买者', type: LOW_CODE_TABLE_TYPE.TEXT },
        {
          name: 'action', 
          columnName: '操作', 
          type: LOW_CODE_TABLE_TYPE.ACTION, 
          btnList: [
            {
              btnName: '订单详情',
              disabled: () => false,
              callback: (row:any) => {
                this.$router.push({ name: 'sellerOrderDetail', params: { orderId: row.orderid } });
              },
            },
          ]
        },
      ],
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
