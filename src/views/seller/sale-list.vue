<template>
  <div class="app-container">
    <el-tabs v-model="activeName" tab-position="top" type="border-card">
      <el-tab-pane label="我的CD-KEY出售列表" :name="ORDER_TYPE.CDKEY">
        <OrderCard :cardData="cardDefaultData[ORDER_TYPE.CDKEY]"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ORDER_TYPE, LOW_CODE_FORM_TYPE, LOW_CODE_TABLE_TYPE } from '@/enum/common';
import { getSellerOrderList } from '@/api/ssellerapplist'
import { SELLER_STATUS } from '@/enum/options';
import { UserModule } from '@/store/modules/user';
import { formatAmount, formatPercent } from '@/filters/index'
import OrderCard from '@/components/table-list/index.vue';
import { getStreamIdByUrl } from '@/utils/common';

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
      instanceApi: getSellerOrderList,
      filterData: [
        { 
          name: 'selectKey', 
          type: LOW_CODE_FORM_TYPE.INPUT, 
          extraData: { placeholder: '请输入订单号查询' }
        },
        {
          name: 'search', 
          type: LOW_CODE_FORM_TYPE.SEARCH, 
          extraData: { name: '查询上架游戏' }
        },
        {
          name: 'action', 
          columnName: '操作', 
          type: LOW_CODE_FORM_TYPE.ACTION, 
          btnList: [
            {
              btnName: '添加出售CD-KEY',
              disabled: () => false,
              callback: () => {
                this.$router.push({ name: 'addCdkey' });
              },
            },
          ]
        },
      ],
      tableData: [
        { name: 'header_image', columnName: '游戏', type: LOW_CODE_TABLE_TYPE.IMG },
        { name: 'gamename', columnName: '游戏名称', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'updatetimeutc', columnName: '上架时间', type: LOW_CODE_TABLE_TYPE.DATE },
        { name: 'myprice', columnName: '出售金额', type: LOW_CODE_TABLE_TYPE.TEXT, template: '%S' },
        { name: 'oldprice', columnName: '折扣计算', type: LOW_CODE_TABLE_TYPE.CUSTOM, render: (current: number, row: { myprice: number}) => (formatPercent(parseFloat(String(formatAmount((row.myprice / (current / 100))))), 0, true)) },
        { name: 'mystock', columnName: '库存', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'sellcount', columnName: '出售次数', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'mystatus', columnName: '交易状态', type: LOW_CODE_TABLE_TYPE.ENUM, options: SELLER_STATUS },
        {
          name: 'action', 
          columnName: '操作', 
          width: 300,
          type: LOW_CODE_TABLE_TYPE.ACTION, 
          btnList: [
            {
              btnName: '库存详情',
              disabled: () => false,
              callback: (row:any) => {
                this.$router.push({ name: 'saleDetail', params: { gameId: row.appid } });
              },
            },
            {
              btnName: '订单详情',
              disabled: () => false,
              callback: (row:any) => {
                this.$router.push({ name: 'sellerOrderListByGameId', params: { gameId: row.appid } });
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
