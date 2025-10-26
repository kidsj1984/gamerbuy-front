<template>
  <div class="app-container">
    <div class="cdkey-price-wrap">
      <div class="cdkey-price-head">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="game-image">
              <img :src="$$(gameDetail, 'header_image')" />
            </div>
          </el-col>
          <el-col :span="10">
            <div class="game-name">{{$$(gameDetail, 'aname')}} <svg-icon class="size-icon" name="windows" /></div>
            <div class="game-desc">
              <span style="margin-right:15px;">好评率 {{$$(gameDetail, 'likeRate') | formatPercent(0, true)}}</span>
              <span style="margin-right:15px;">发行日期  {{$$(gameDetail, 'release_date', 'date')}}</span>
              <span><el-button size="mini" type="primary" icon="el-icon-star-off">加入心愿单</el-button></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="game-price">
              最低价格
              <span class="s">¥{{ $$(gameDetail, 'lowestPrice') | formatAmount }}</span>
              <span class="r">{{ $$(gameDetail, 'price_overview', 'initial') | formatAmountE2 }}</span>
              <el-tag>{{ percent | formatAmountE2 | formatPercent(0, false) }}</el-tag>
            </div>
            <div class="game-label">
              <el-tag v-for="(item, index) in $$(gameDetail, 'categories').slice(0,4)" :key="index" type="info" > {{$$(item, 'description')}} </el-tag>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="cdkey-price-content">
        <div class="cdkey-price-detail">
          <div class="cdkey-price-detail-module">
            <div class="title">内容截图</div>
            <div class="detail">
              <div class="preview">
                <img :src="selectPic"/>
              </div>
              <div class="preview-list">
                <div v-for="(item, index) in $$(gameDetail, 'screenshots').slice(0,4)" :key="index" class="preview-list-item" @click="handleChangePic(index)"><img :src="item.path_thumbnail"/></div>
                <!-- <img src="https://cdn.akamai.steamstatic.com/steam/apps/1648690/header.jpg?t=1622733530"/>
                <img src="https://cdn.akamai.steamstatic.com/steam/apps/1648690/header.jpg?t=1622733530"/>
                <img src="https://cdn.akamai.steamstatic.com/steam/apps/1648690/header.jpg?t=1622733530"/>
                <img src="https://cdn.akamai.steamstatic.com/steam/apps/1648690/header.jpg?t=1622733530"/> -->
              </div>
            </div>
          </div>
          <div class="cdkey-price-detail-module">
            <div class="title">内容介绍</div>
            <div class="detail">
              {{$$(gameDetail, 'short_description')}}
            </div>
          </div>
          <div class="cdkey-price-detail-module">
            <div class="title">系统要求</div>
            <div class="detail detail-pre">
              <div class="pre" v-html="$$(gameDetail, 'pc_requirements', 'minimum')"></div>
              <div class="pre" v-html="$$(gameDetail, 'pc_requirements', 'recommended')"></div>
            </div>
          </div>
          <div class="cdkey-price-detail-module">
            <div class="title">相似推荐</div>
            <div class="detail">
              <el-col class="gameList" >
                <el-card class="gameItem" v-for="(item) of relatelist" :key="item.id" :body-style="{padding: '0px'}" @click.native="handleDetail(item)">
                  <GameCard 
                    :headerImage="item.header_image"
                    :name="item.aname"
                    :likeRate="item.likeRate"
                    :priceOverview="item.price_overview"
                    :price="item.lowestPrice"
                  />
                </el-card>
              </el-col>
            </div>
          </div>


        </div>
        <div class="cdkey-price-list">
          <div class="title">出售卖家</div>
          <div class="detail">
            <el-table
              :data="sellerlist"
              :row-class-name="tableRowClassName"
              show-header
              fit
              style="width: 100%;"
            >
              <el-table-column
                label="用户"
                align="center"
                min-width="180"
              >
                <template slot-scope="{row}">
                  <span><img :src="row.user_headpic" width="40px" height="40px"/></span>
                </template>
              </el-table-column>
              <el-table-column
                label="昵称"
                align="center"
                min-width="180"
              >
                <template slot-scope="{row}">
                  <span>{{ row.nickname}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="单价"
                align="center"
                min-width="180"
              >
                <template slot-scope="{row}">
                  <span>{{ row.myprice}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="折扣"
                align="center"
                min-width="180"
              >
                <template slot-scope="{row}">
                  <span>{{ (row.myprice / (row.oldprice / 100)) | formatAmount | formatPercent(0, true)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="总出售次数"
                align="center"
                min-width="180"
              >
                <template slot-scope="{row}">
                  <span>{{ row.sellcount}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="选购"
                align="center"
                width="100"
                class-name="fixed-width"
                fixed="right"
              >
                <template slot-scope="{row}">
                  <!-- <svg-icon name="purchase" style="width:2em; height:2em;color:rgb(245 167 35)" /> -->
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleGamePrice(row)"
                  >
                    购买
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              style="textAlign:right"
              @pagination="getSellerList"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { gameDetailFormat } from '@/utils/game-format'
import { getGetAppDetail } from '@/api/gamelist'
import { getSellerList } from '@/api/ssellerapplist'
import { IGameDetailData } from '@/api/types'
import GameCard from './components/game-card.vue'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'GameDetail',
  components: {
    GameCard,
    Pagination,
  },
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  // 游戏id
  get gameId() {
    return this.$route.params.gameId
  }

  // 相似游戏列表
  private relatelist: IGameDetailData[] = []
  // 游戏详情
  private gameDetail: IGameDetailData | null = null

  private selectPicIndex = 0;

  private total = 0
  private sellerlist: IGameDetailData[] = []
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    nickName: '',
    date: undefined,
    platform: undefined,
    type: undefined,
    viewStatus: undefined,
    cpStatus: undefined,
  }

  // 折扣
  get percent() {
    return Number(this.gameDetail?.lowestPrice) / this.gameDetail?.price_overview?.initial;
  }

  // 当前选中的图片
  get selectPic() {
    const picList:any = this.gameDetail?.screenshots?.slice(0, 4) || [];
    return picList[this.selectPicIndex]?.path_thumbnail;
  } 

  mounted() {
    console.log('REG_TYPE2', this.identity, this.relatelist, this.gameId);
    this.getDetail();
    this.getSellerList();
  }

  private handleChangePic(index: number) {
    this.selectPicIndex = index;
  }

  private async getDetail() {
    const params:any = {
      steamId: this.gameId
    }

    try {
      const { data } = await getGetAppDetail(params);
      // const data:any = {}
      const { detail, relatelist } = data;
      this.gameDetail = gameDetailFormat(detail);
      console.log(123, this.gameDetail);
      this.relatelist = relatelist;
      // this.total = totalItems;
      // this.listLoading = false
    } catch (e) {
      console.log(e);
      // this.listLoading = false
    }
  }

  private async getSellerList() {
    this.listLoading = true;

    const { page, limit } = this.listQuery;
    const params:any = {
      pageIndex: page,
      pageSize: limit,
      appid: this.gameId
    }

    try {
      const { data } = await getSellerList(params);
      // const data:any = {}
      const { items, totalItems } = data;
      console.log(23412, data, items)
      this.sellerlist = items;
      this.total = totalItems;
      this.listLoading = false
    } catch (e) {
      console.log(e);
      this.listLoading = false
    }
  }

  private tableRowClassName(obj: any) {
    const rowIndex = obj && obj.rowIndex;
    if (rowIndex % 2 === 1) {
      return 'success-row';
    }
    return '';
  }

  private handleDetail(item: any) {
    console.log(item);
    this.$router.push({ name: 'gameDetail', params: { gameId: item.id } });
  }

  private handleGamePrice(item: any) {
    console.log(666, item);
    this.$router.push({ name: 'gamePrice', params: { sellerId: item.id } });
  }

}
</script>

<style lang="scss">
  .el-table .success-row {
    background: #f0f9eb;
  }

  .cdkey-price-wrap .cdkey-price-content .cdkey-price-detail .cdkey-price-detail-module .detail-pre .pre {
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
  }
</style>
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

  .cdkey-price-wrap {
    padding:10px;
    background: #fff;


    .cdkey-price-head {
      height: 200px;
      margin-bottom: 20px;
      border-bottom: 1px #000 solid;

      .game-image {
        border-radius: 4px;
        height: 180px;
        display: flex;
        flex-direction: row;
        align-items: center; /*垂直居中*/
        justify-content: center; /*水平居中*/
        img {
          width: 100%;      // 460*215
          max-width: 385px;
          max-height: 180px;
          flex: 1;
          border: 1px #000 solid;
        }
      }

      .game-name {
        padding-top: 60px;
        height: 120px;
        font-size: 30px;
        line-height: 30px;
      }

      .game-desc {
        font-size: 14px;
      }

      .game-price {
        text-align: right;
        font-size: 14px;
        padding-top: 80px;
        height: 120px;
        * {
          vertical-align: bottom;
        }
        .s {
          font-size: 28px;
          font-weight: bold;
          margin-left: 10px;
        }

        .r {
          color: #AAAAAA;
          font-size: 20px;
          text-decoration: line-through;
          margin: 0 10px;
        }
      }

      .game-label {
        text-align: right;
        font-size: 14px;

        span {
          margin-left: 5px;
        }
      }
    }

    .cdkey-price-content {
      display: flex;

      .cdkey-price-detail {
        flex: 0 0 500px;
        border-right:1px #ccc solid;

        .cdkey-price-detail-module {
          padding: 10px;
          .title {
            border-bottom:1px #000 solid;
            padding: 10px;
            font-size: 20px;
            font-weight: bold;
          }

          .detail {
            padding: 10px;
          }
          .detail-pre {
            font-size: 14px;
            display: flex;
            .pre {
              padding: 0 10px;
              width: 50%;
              flex: 1;
              white-space: pre-line;
              line-height: 24px;
            }
          }

          .preview {
            width: 460px;
            height: 218px;
            background: #000;
            text-align: center;
            margin-bottom: 3px;
            img {
              height: 100%;
            }
          }

          .preview-list {
            width: 460px;
            display: flex;
            align-items: center;
            .preview-list-item {
              cursor: pointer;
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

      }

      .cdkey-price-list {
        position: relative;
        flex: 1;
        height: 600px;
        padding: 10px;

        .title {
          border-bottom:1px #000 solid;
          padding: 10px;
          font-size: 20px;
          font-weight: bold;
        }

        .detail {
          position: absolute;
          width: 100%;
          padding: 10px 30px 10px 10px;

        }
      }
      .gameList {
        margin: 5px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        .gameItem {
          width: 48%;
          margin: 0 0.5% 10px;

        }
      }
    }
  }


</style>
