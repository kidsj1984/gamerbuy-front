<template>
  <div class="app-container">
    <UploadExcelComponent
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <el-button @click="download">下载</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'


@Component({
  name: 'Excel',
  components: {
    UploadExcelComponent
  }
})

export default class extends Vue {
  private url = String(this.$route.query.url);

  private type = String(this.$route.query.type || 'flv');

  private header:any = null;
  private results:any = null;
  private filename = ''
  private autoWidth = true
  private bookType = 'xlsx'

  mounted() {
    console.log(this.url);
  }

  private beforeUpload(file: File) {
    return true
  }

  private handleSuccess({ results, header }: { results: any, header: string[]}) {
    console.log(results, header);
    this.results = results;
    this.header = header;
  }

  private download() {
    if (this.results) {
      this.results.map((item:any) => {
        if (item['违规视频链接']) {
          item['违规视频链接'] = `http://dj.longzhume.com/video?url=${encodeURIComponent(item['违规视频链接'])}`;
        }
        
        item['违规音频链接'] = `http://dj.longzhume.com/video?type=aac&url=${encodeURIComponent(item['违规音频链接'])}`;
        return item;
      })
      const data = formatJson(this.header, this.results);
      exportJson2Excel(this.header, data, this.filename !== '' ? this.filename : undefined, undefined, undefined, this.autoWidth, this.bookType)
    }
  }
}
</script>
