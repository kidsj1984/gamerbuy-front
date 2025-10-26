<template>
  <div class="app-container">
    <video ref="video" id="video" controls="" width="50%"></video>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import flvjs from 'flv.js';

let flvPlayer:any = null;

@Component({
  name: 'Video'
})

export default class extends Vue {
  private url = String(this.$route.query.url);

  private type = String(this.$route.query.type || 'flv');

  mounted() {
    console.log(this.url);

    this.playVideo();
  }

  private playVideo() {

    const videoElement = this.$refs.video as HTMLMediaElement;
    if (flvjs.isSupported() && videoElement && this.url && this.type) {
      flvPlayer = flvjs.createPlayer({
        type: this.type,
        url: this.url,
      });
      flvPlayer.attachMediaElement(videoElement);
      flvPlayer.load();
      flvPlayer.play();
    }
  }
}
</script>
