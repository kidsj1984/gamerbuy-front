<template>
  <el-row :gutter="10" class="app-container-subwrap">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <div class="app-container-title">
        我的订单
        <div class="app-container-action">
          <el-button type="text" size="mini" @click="jump">查看全部 &gt;</el-button>
        </div>
      </div>


      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="游戏"
          prop="header_image"
          align="center"
          min-width="100"
        >
          <template slot-scope="{row}">
            <span><img :src=row.header_image width="100%"/></span>
          </template>
        </el-table-column>
        <el-table-column
          label="游戏名称"
          min-width="120"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.gamename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="购买时间"
          min-width="120"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.selltimeutc | formatDate2}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="购买价格"
          min-width="120"
          align="center"
        >
          <template slot-scope="{row}">
            <span>{{ row.sellprice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label=""
          align="center"
          width="60"
          class-name="fixed-width"
        >
          <template slot-scope="{row}">
            <i class="el-icon-arrow-right" @click="handleDetail(row)"></i>
          </template>
        </el-table-column>
      </el-table>

    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { USER_TYPE } from '@/enum/common'
import { UserModule } from '@/store/modules/user'
import { DetailModule } from '@/store/modules/detail'
import { getListBySellUid, getListByBuyUid } from '@/api/steamorder'
import { IUserListData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'MyOrder',
  components: {
    Pagination
  },
  filters: {
    statusFilter: (type: number) => {
      return type === 1 ? '启用' : '停用';
    }
  }
})
export default class extends Vue {
  @Prop({ required: true }) private userType!: string

  get uid() {
    return UserModule.uid;
  }

  private tableKey = 0
  private list: any = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 4,
  }

  async mounted() {
    this.initList()
  }

  private jump() {
    if (this.userType === USER_TYPE.seller) {
      this.$router.push({ name: 'sellerOrderList' });
    } else {
      this.$router.push({ name: 'buyerOrderList' });
    }
  }

  private initList() {
    // const query = DetailModule.currentHistory(this.$options.name);
    // DetailModule.removeActiveListRoute(String(this.$options.name));

    // if (query) {
    //   this.listQuery = query;
    //   setTimeout(() => {
    //     this.$set(this.listQuery, 'page', query.page);
    //   }, 500)
    // }

    this.$nextTick(() => {
      this.getList();
    })
  }

  private async getList() {
    this.listLoading = true;

    const { page, limit } = this.listQuery;
    const params:any = {
      pageIndex: 1,
      pageSize: 10,
    }

    let apiInstance = getListByBuyUid;
    if (this.userType === USER_TYPE.seller) {
      apiInstance = getListBySellUid;
    }

    try {
      const { data } = await apiInstance(params);
      const { items, totalItems } = data;
      this.list = items;
      this.total = totalItems;
      this.listLoading = false
    } catch (e) {
      console.log(e);
      this.listLoading = false
    }
  }
  
  private handleDetail(row: any) {
    console.log(row)


    let routerName = 'buyerOrderDetail';
    if (this.userType === USER_TYPE.seller) {
      routerName = 'sellerOrderDetail';
    }
    this.$router.push({ name: routerName, params: { orderId: row.orderid } });
  }

}
</script>

<style lang="scss" scoped>
  .el-icon-arrow-right {
    cursor: pointer;
  }
</style>
