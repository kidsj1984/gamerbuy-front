<template>
  <div class="game-card">
    <div class="body">
      <img :src="headerImage" width="100%"/>
    </div>
    <div class="bottom clearfix">
      <div class="title">{{name}}</div>
      <div class="desc">
        <svg-icon name="like" style="color:rgb(245 167 35)"/>
        {{likeRate | formatPercent(0, true)}}
      </div>
      <div class="platform">
        <div class="rate" :class="rateClass">{{-percent | formatPercent(0, true)}}</div>
        <div class="pricewrap">
          <div class="original">¥{{priceOverview | streamJsonFormat('initial') | formatAmountE2}}</div>
          <div class="pirce">¥{{price | formatAmount}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { streamJsonFormat, formatAmountE2 } from '@/filters/index';

@Component({
  name: 'ViolationList',
  components: {
    Pagination
  },
})
export default class extends Vue {
  @Prop({ required: true }) private name!: string
  @Prop({ required: true }) private likeRate!: string
  @Prop({ default: '' }) private priceOverview!: string
  @Prop({ default: '' }) private headerImage!: string
  @Prop({ default: 0 }) private price!: number

  get percent() {
    return 1 - this.price / formatAmountE2(streamJsonFormat(this.priceOverview, 'initial'));
  }

  get rateClass() {
    if (this.percent > 0.75) {
      return 'rate-orange';
    } else if (this.percent >= 0.5) {
      return 'rate-green';
    } else if (this.percent >= 0.25) {
      return 'rate-blue';
    } else {
      return 'rate-gray';
    }
  }

  // private getPercent() {
  //   priceOverview | streamJsonFormat('discount_percent')
  //   return 0
  // }
}
</script>

<style lang="scss" scoped>
  .game-card {
    .body {
      overflow: hidden;
      img {
        display: block;
      }
    }

    .bottom {
      position: relative;
      height: 80px;
      border-top: 1px rgba(233, 233, 233, 1) solid;
      // background-color: rgba(247, 249, 250, 1);
      .title {
        font-weight: bold;
        padding: 16px 0 10px 0;
        width: 68%;
        height: 50px;
        text-indent: 5px;
        overflow: hidden; 
        text-overflow:ellipsis; 
        white-space: nowrap;
      }
      .desc {
        text-indent: 5px;
        height: 48px;
        font-size: 12px;
      }
      .platform {
        display: flex;
        position: absolute;
        top: 24px;
        right: 2%;
        font-size: 12px;
        width: 30%;
        height: 40px;
        text-align: center;
        border-radius: 5px;
        .rate {
          flex: 1;
          line-height: 40px;
          color: #fff;
          background: rgba(127, 127, 127, 1);
          &-orange {
            background: rgb(240, 145, 2);
          }
          &-green {
            background: rgba(120, 191, 3, 1);
          }
          &-blue {
            background: rgba(2, 167, 240, 1);
          }
          &-gray {
            background: rgba(127, 127, 127, 1);
          }
        }
        .pricewrap {
          flex: 1;
          line-height: 20px;
          .original {
            height: 20px;
            text-decoration: line-through;
            color: #888888;
          }
          .pirce {
            height: 20px;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
