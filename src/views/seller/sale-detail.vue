<template>
  <div class="app-container">
    <div class="cdkey-price-wrap">
      <OrderCard :cardData="cardDefaultData[ORDER_TYPE.CDKEY]" ref="child"/>
    </div>
    <el-dialog title="修改价格" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="单价">
          <el-input-number v-model="form.price" autocomplete="off"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ORDER_TYPE, LOW_CODE_FORM_TYPE, LOW_CODE_TABLE_TYPE } from '@/enum/common';
import { getCDkeyList, setCDKeyToUp, setCDKeyToDown, setCDKeyToDownAndDel, UpdatePriceById } from '@/api/cdkey'
import { arrKV2ObjKV } from '@/utils/common';
import { Message } from 'element-ui';
import { CDKEY_SELLER_STATUS } from '@/enum/options';
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
  
  private form = {
    price: null,
  }

  private ORDER_TYPE = ORDER_TYPE;
  private LOW_CODE_FORM_TYPE = LOW_CODE_FORM_TYPE;
  private LOW_CODE_TABLE_TYPE = LOW_CODE_TABLE_TYPE;

  private dialogFormVisible = false;
  private currentRow = null;
  // 游戏详情
  private gameDetail: any | null = null

  private activeName = ORDER_TYPE.CDKEY;
  private cardDefaultData = {
    [ORDER_TYPE.CDKEY]: {
      instanceApi: getCDkeyList,
      params: {
        appid: this.gameId, // 指定的gameId
      },
      apiCallback: (a: any) => {
        console.log(a);
      },
      filterData: [
      ],
      tableData: [
        { name: 'id', columnName: '序号', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'cdkey', columnName: 'CD-KEY', type: LOW_CODE_TABLE_TYPE.TEXT },
        { name: 'updatetimeutc', columnName: '更新时间', type: LOW_CODE_TABLE_TYPE.DATE },
        { name: 'myprice', columnName: '出售价格', type: LOW_CODE_TABLE_TYPE.TEXT, template: '$%S' },
        { name: 'mystatus', columnName: '出售状态', type: LOW_CODE_TABLE_TYPE.ENUM, options: CDKEY_SELLER_STATUS },
        // { name: 'cdkey', columnName: '可激活地区', type: LOW_CODE_TABLE_TYPE.TEXT },
        {
          name: 'action', 
          columnName: '操作', 
          type: LOW_CODE_TABLE_TYPE.ACTION, 
          btnList: [
            {
              btnName: '上架',
              confirmMsg: '确认是否上架',
              show: (row:any) => {
                return row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.REMOVED
              },
              disabled: () => false,
              callback: (row:any) => {
                this.handleActionSubmit(row, 3);
              },
            },
            {
              btnName: '修改价格',
              show: (row:any) => {
                return row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.SALING
              },
              disabled: () => false,
              callback: (row:any) => {
                this.handleShowEditDialog(row);
              },
            },
            {
              btnName: '下架',
              confirmMsg: '确认是否下架',
              show: (row:any) => {
                return row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.SALING
              },
              disabled: () => false,
              callback: async(row:any) => {
                this.handleActionSubmit(row, 1);
              },
            },
            {
              btnName: '下架并删除',
              confirmMsg: '确认是否下架并删除',
              show: (row:any) => {
                return row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.SALING
              },
              callback: (row:any) => {
                this.handleActionSubmit(row, 2);
              },
            },
            {
              btnName: '删除',
              confirmMsg: '确认是否删除',
              show: (row:any) => {
                return row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.REMOVED
              },
              callback: (row:any) => {
                this.handleActionSubmit(row, 2);
              },
            },
            {
              btnName: '订单详情',
              show: (row:any) => {
                return row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.LOCKED || row.mystatus === arrKV2ObjKV(CDKEY_SELLER_STATUS)?.SOLD
              },
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

  private handleShowEditDialog(row:any) {
    this.currentRow = row;
    this.form.price = row?.myprice ?? 0;
    this.dialogFormVisible = true;
  }

  private async handleEditDialog() {
    if (this.form.price) {
      const { id }:any = this.currentRow;
      try {
        const params:any = {
          id,
          price: this.form.price
        }

        const { code, message }:any = await UpdatePriceById(params);
        if (code === 0) {
          Message.success({
            message: '操作成功',
            type: 'error'
          })
          this.dialogFormVisible = false
        } else {
          Message.error({
            message: message || '服务器忙请稍后重试',
            type: 'error'
          })
        }
      } catch (e) {
        Message.error({
          message: '服务器忙请稍后重试',
          type: 'error'
        })
      }
    } else {
      Message.warning({
        message: '请输入要修改的单价',
      })
    }
   
  }

  // type 1:下架  2:下架并删除 3:上架
  private async handleActionSubmit(row:any, type:number) {
    try {
      const params:any = {
        id: row.id,
      }
      let instanceApi = null; 
      switch (type) {
        case 1:
          instanceApi = setCDKeyToDown;
          break;
        case 2:
          instanceApi = setCDKeyToDownAndDel;
          break;
        case 3:
          instanceApi = setCDKeyToUp;
          break;
        default:
          break;
      }

      const { code, message }:any = await instanceApi?.(params);
      if (code === 0) {
        Message.success({
          message: '操作成功',
          type: 'error'
        });
        (this.$refs.child as Vue & { getList: () => any })?.getList();
      } else {
        Message.error({
          message: message || '服务器忙请稍后重试',
          type: 'error'
        })

      }
    } catch (e) {
      Message.error({
        message: '服务器忙请稍后重试',
        type: 'error'
      })
    }
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
