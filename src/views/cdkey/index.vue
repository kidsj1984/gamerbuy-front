<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-warp">
        <el-input
          v-model="listQuery.gameName"
          placeholder="请输入关键字搜索"
          style="width: 200px;"
          class="filter-item"
          autocomplete="off"
        />
      </div>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
    </div>

    <el-row>
      <el-col class="gameList" >
        <el-card v-loading="listLoading" class="gameItem" v-for="(item) of list" :key="item.id" :body-style="{padding: '0px'}" @click.native="handleDetail(item)">
          <GameCard 
            :headerImage="item.header_image"
            :name="item.aname"
            :likeRate="item.likeRate"
            :priceOverview="item.price_overview"
            :price="item.lowestPrice"
          />
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="textAlign:right"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDENTITY_TYPE } from '@/enum/common'
import { UserModule } from '@/store/modules/user'
import { getGameInfoList } from '@/api/gamelist'
import { IGameDetailData } from '@/api/types'
import GameCard from './components/game-card.vue'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ViolationList',
  components: {
    Pagination,
    GameCard,
  },
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  private IDENTITY_TYPE = IDENTITY_TYPE;

  private tableKey = 0
  private list: IGameDetailData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    gameName: '',
    date: undefined,
    platform: undefined,
    type: undefined,
    viewStatus: undefined,
    cpStatus: undefined,
  }


  mounted() {
    this.getList()
  }

  private format(val: any) {
    if (val) {
      console.log(999, JSON.parse(val).initial);
    }
    
  }

  private async getList() {
    this.listLoading = true;

    const { page, limit } = this.listQuery;
    const params:any = {
      pageIndex: page,
      pageSize: limit,
      gameName: this.listQuery.gameName,
      genresList: '',
      gameLang: '',
      gameType: '',
      gamePrice: ''
    }
    

    try {
      const { data } = await getGameInfoList(params);
      // const data:any = {}
      const { items, totalItems } = data;
      console.log(23412, data, items)
      this.list = items;
      this.total = totalItems;
      this.listLoading = false
    } catch (e) {
      console.log(e);
      this.listLoading = false
    }
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  private handleDetail(item: any) {
    console.log(item);
    this.$router.push({ name: 'gameDetail', params: { gameId: item.steam_appid } });
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
      width: 19%;
      margin: 0 0.5% 10px;
      cursor: pointer;
    }
  }
</style>
