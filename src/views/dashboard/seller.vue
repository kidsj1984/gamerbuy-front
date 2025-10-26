<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="14" :lg="15" :xl="17">
        <MyOrder :userType="IDENTITY_TYPE"/>
      </el-col>
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="height: 1px">
      </el-col>
      <el-col :xs="24" :sm="24" :md="9" :lg="8" :xl="6">
        <Account :userType="IDENTITY_TYPE" />
        <!-- <QuickEntry /> -->
        <!-- <Active /> -->
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { USER_TYPE } from '@/enum/common'
import { UserModule } from '@/store/modules/user'
import { DetailModule } from '@/store/modules/detail'
import { getUsersList } from '@/api/users'
import Account from './components/account.vue'
import Active from './components/active.vue'
import MyOrder from './components/my-order.vue'
import QuickEntry from './components/quick-entry.vue'

@Component({
  name: 'Dashboard',
  components: {
    Account,
    Active,
    MyOrder,
    QuickEntry,
  },
  filters: {}
})
export default class extends Vue {
  // get identity() {
  //   return UserModule.identity;
  // }

  private IDENTITY_TYPE = USER_TYPE.seller;

  private tableKey = 0
  private list: any = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    phone: '',
    identity: undefined,
    status: undefined,
  }

  async mounted() {
    this.initList();

    console.log(166623, this.$route, this.$router)
  }

  private initList() {
    const query = DetailModule.currentHistory(this.$options.name);
    DetailModule.removeActiveListRoute(String(this.$options.name));
    if (query) {
      this.listQuery = query;
      setTimeout(() => {
        this.$set(this.listQuery, 'page', query.page);
      }, 500)
    }

    this.$nextTick(() => {
      // this.getList();
    })
  }

  // private async getList() {
  //   this.listLoading = true;

  //   const { page, limit, phone, identity, status } = this.listQuery;
  //   const params:any = {
  //     offset: (page - 1) * limit,
  //     limit,
  //     phone,
  //     flag: status,
  //   }
  //   if (identity) {
  //     params.roles = `like${identity}`;
  //   }

  //   try {
  //     const { data } = await getUsersList(params);
  //     const { items, totalItems } = data;
  //     this.list = items;
  //     this.total = totalItems;
  //     this.listLoading = false
  //   } catch (e) {
  //     console.log(e);
  //     this.listLoading = false
  //   }
  // }

  private handleFilter() {
    this.listQuery.page = 1
    // this.getList()
  }

  private handleDetail(row: any) {
    const query:any = { ...this.listQuery };
    query.routeName = this.$options.name;
    DetailModule.addListRoute(query);
    if (row) {
      const action = 'edit';
      this.$router.push({ name: 'userDetail', params: { id: row.id, action } });
    } else {
      this.$router.push({ name: 'userDetail', params: { action: 'add' } });
    }
  }


}
</script>

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
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
