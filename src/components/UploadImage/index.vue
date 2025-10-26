<template>
  <div class="upload-container">
    <el-upload
      v-show="imageUrl.length === 0"
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      class="image-uploader"
      drag
      action="#"
      :http-request="handleUpload"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <div v-show="imageUrl.length>1" class="image-preview image-app-preview">
      <div class="image-preview-wrapper">
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i
            class="el-icon-delete"
            @click="rmImage"
          />
        </div>
      </div>
    </div>
    <p v-for="(item, i) in message" :key="i" class="image-message">{{item}}</p>
    <!--
    <div class="image-preview">
      <div
        v-show="imageUrl.length>1"
        class="image-preview-wrapper"
      >
        <img :src="imageUrl">
        <div class="image-preview-action">
          <i
            class="el-icon-delete"
            @click="rmImage"
          />
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { uploadImages } from '@/api/common';

@Component({
  name: 'UploadImage'
})
export default class extends Vue {
  @Prop({ default: '' }) private value!: string
  @Prop(Array) private message!: Array<string>

  private tempUrl = ''
  private dataObj = { token: '', key: '' }

  get imageUrl() {
    return this.value
  }

  private emitInput(value: string) {
    this.$emit('input', value)
  }

  private rmImage() {
    this.emitInput('')
  }

  private async handleUpload(params:any) {
    const file = params.file;
    const fileType = file.type;
    const isImage = fileType.indexOf('image') !== -1;
    const isLt2M = file.size / 1024 / 1024 < 2;
    // // 这里常规检验，看项目需求而定
    // if (!isImage) {
    //   this.$message.error("只能上传图片格式png、jpg、gif!");
    //   return;
    // }
    // if (!isLt2M) {
    //   this.$message.error("只能上传图片大小小于2M");
    //   return;
    // }

    const fd = new FormData()
    fd.append('Filedata', file);
    try {
      const res = await uploadImages(fd);
      this.emitInput(res.data);
    } catch (error) {
      console.log(error);
      this.emitInput('');

    }

  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;

  .image-uploader {
    width: 100%;
    float: left;
  }

  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;

    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;

      .el-icon-delete {
        font-size: 36px;
      }
    }

    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }

  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 0px;

    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }

  .image-message {
    clear: both;
    margin: 0px;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
