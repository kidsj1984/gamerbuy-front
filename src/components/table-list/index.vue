<template>
  <div>
    <div class="filter-container">
      <div v-for="(itemFrom, index) in filterData" :key="index" class="filter-item-warp">
        <template v-if="itemFrom.type === LOW_CODE_FORM_TYPE.DATEPICKER">
          <el-date-picker
            v-model="listQuery[itemFrom.name]"
            type="daterange"
            :start-placeholder="itemFrom.extraData['start-placeholder']"
            :end-placeholder="itemFrom.extraData['end-placeholder']">
          </el-date-picker>
        </template>
        <template v-else-if="itemFrom.type === LOW_CODE_FORM_TYPE.SELECT">
          <el-select v-model="listQuery[itemFrom.name]" filterable :placeholder="itemFrom.extraData['placeholder']">
            <el-option
              v-for="item in itemFrom.extraData.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="itemFrom.type === LOW_CODE_FORM_TYPE.SEARCH">
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            {{ $$(itemFrom, 'extraData.name') || $t('table.search') }}
          </el-button>
        </template>
        <template v-else-if="itemFrom.type === LOW_CODE_FORM_TYPE.ACTION">
          <el-button
            v-for="(btnItem, btnIndex) in itemFrom.btnList"
            :key="btnIndex"
            :disabled="btnItem.disabled()"
            @click="btnItem.callback()"
          >
            {{ btnItem.btnName}}
          </el-button>
        </template>
        <template v-else>
          <el-input
            v-model="listQuery[itemFrom.name]"
            :placeholder="itemFrom.extraData.placeholder"
          />
        </template>
      </div>

      <!-- <div v-if="itemFrom.btnList" class="filter-item-warp">
        <el-button
          v-for="(btnItem, btnIndex) in itemFrom.btnList"
          :key="btnIndex"
          size="mini"
          :disabled="btnItem.disabled()"
          @click="btnItem.callback()"
        >
          {{ btnItem.btnName}}
        </el-button>
      </div> -->

    </div>

    <el-row>
      <el-col class="gameList" >
        <el-table v-loading="listLoading" :data="list" style="width: 100%">
          <template v-for="(itemFrom, index) in tableData">
            <el-table-column v-if="itemFrom.type === LOW_CODE_TABLE_TYPE.ENUM"  :key="index" :label="itemFrom.columnName" :width="itemFrom.width">
              <template slot-scope="scope">
                {{ scope.row[itemFrom.name] | getTypeNameByKey(itemFrom.options) }}
              </template>
            </el-table-column>
            <el-table-column v-else-if="itemFrom.type === LOW_CODE_TABLE_TYPE.IMG" :key="index" :label="itemFrom.columnName" :width="itemFrom.width">
              <template slot-scope="scope">
                <img :src="scope.row[itemFrom.name]" width="100%"/>
              </template>
            </el-table-column>
            <el-table-column v-else-if="itemFrom.type === LOW_CODE_TABLE_TYPE.DATE" :key="index" :label="itemFrom.columnName" :width="itemFrom.width">
              <template slot-scope="scope">
                {{ scope.row[itemFrom.name] | formatDate2}}
              </template>
            </el-table-column>
            <el-table-column v-else-if="itemFrom.type === LOW_CODE_TABLE_TYPE.ACTION" :key="index" :label="itemFrom.columnName" :width="itemFrom.width">
              <template slot-scope="scope">
                <template v-for="(btnItem, btnIndex) in itemFrom.btnList">
                  <el-popconfirm
                    :key="`popconfirm${btnIndex}`"
                    v-if="(typeof btnItem.show === 'undefined' || btnItem.show(scope.row, scope.$index)) && btnItem.confirmMsg"
                    :title="btnItem.confirmMsg"
                    @confirm="btnItem.callback(scope.row, scope.$index)"
                  >
                    <el-button
                      slot="reference"
                      :key="btnIndex"
                      size="mini"
                      :disabled="btnItem.disabled && btnItem.disabled(scope.row, scope.$index)"
                    >
                      {{ btnItem.btnName}}
                    </el-button>
                  </el-popconfirm>
                  <el-button
                    v-if="(typeof btnItem.show === 'undefined' || btnItem.show(scope.row, scope.$index)) && !btnItem.confirmMsg"
                    :key="btnIndex"
                    size="mini"
                    :disabled="btnItem.disabled && btnItem.disabled(scope.row, scope.$index)"
                    @click="btnItem.callback(scope.row, scope.$index)"
                  >
                    {{ btnItem.btnName}}
                  </el-button>
                </template>
              </template>
            </el-table-column>
            <el-table-column v-else-if="itemFrom.type === LOW_CODE_TABLE_TYPE.CUSTOM" :key="index" :label="itemFrom.columnName" :width="itemFrom.width">
              <template slot-scope="scope">
                {{itemFrom.render(scope.row[itemFrom.name], scope.row)}}
              </template>
            </el-table-column>
            <el-table-column v-else :key="index" :label="itemFrom.columnName" :width="itemFrom.width">
              <template slot-scope="scope">
                {{scope.row[itemFrom.name] | formatTxt(itemFrom.template)}}
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-col>
    </el-row>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      style="textAlign:right"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { LOW_CODE_FORM_TYPE, LOW_CODE_TABLE_TYPE } from '@/enum/common'
import { UserModule } from '@/store/modules/user'
import { IGameDetailData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import moment from 'moment'

@Component({
  name: 'OrderCard',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  @Prop({ required: true }) private cardData!: any;

  get filterData() {
    return this.cardData?.filterData ?? [];
  }

  get tableData() {
    return this.cardData?.tableData ?? [];
  }

  get instanceApi(): any {
    return this.cardData?.instanceApi;
  }

  get apiCallback(): any {
    return this.cardData?.apiCallback;
  }

  get params(): any {
    return this.cardData?.params;
  }


  private LOW_CODE_FORM_TYPE = LOW_CODE_FORM_TYPE;
  private LOW_CODE_TABLE_TYPE = LOW_CODE_TABLE_TYPE;

  private tableKey = 0
  private list: any = [];
  private total = 0
  private listLoading = true
  private listQuery = {
    pageIndex: 1,
    pageSize: 20,
  }

  mounted() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true;

    const filterParams = this.parseFilterData(this.listQuery, this.filterData);
    
    let parentsParams = {};
    // 父类补充查询条件
    if (this.params) {
      parentsParams = typeof this.params === 'function' ? this.params() : this.params;
    }

    console.log(900003, parentsParams);

    const params:any = {
      ...parentsParams,
      ...filterParams,
      pageIndex: this.listQuery.pageIndex,
      pageSize: this.listQuery.pageSize,
    }

    console.log(90002, params, this.params);
    

    try {
      const { data } = await this.instanceApi?.(params);
      // const data:any = {}
      const { items, totalItems } = data;
      console.log(23412, data, items)
      this.list = items;
      this.total = totalItems;
      this.listLoading = false;
      this.apiCallback?.(data);
    } catch (e) {
      console.log(e);
      this.listLoading = false
    }
  }

  private handleFilter() {
    this.listQuery.pageIndex = 1
    this.getList()
  }

  private parseFilterData(listQuery: any, filterData: any) {
    if (!listQuery) return listQuery;
    const newParams: any = {}
    Object.keys(listQuery).forEach((item: any) => {
      const filterItem = filterData.filter((filterItem: any) => {
        return filterItem.name === item
      })[0];
      const type = filterItem?.type;
      if (type === LOW_CODE_FORM_TYPE.DATEPICKER) {
        const beginKey = filterItem?.extraData?.beginTimeKey ?? 'beginTime';
        const endKey = filterItem?.extraData?.endTimeKey ?? 'endTime';
        newParams[beginKey] = listQuery[item]?.[0] ? moment(listQuery[item]?.[0]).format('X') : null;
        newParams[endKey] = listQuery[item]?.[1] ? moment(listQuery[item]?.[1]).format('X') : null;
      } else {
        newParams[item] = listQuery[item];
      }
    });

    return newParams;

  }

}
</script>

<style lang="scss" scoped>
  .filter-item-warp {
    padding: 10px 0px;

    .filter-item {
      margin: 0;
    }
  }
</style>
