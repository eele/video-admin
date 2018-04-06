<template>
  <video id="video" class="video" controls="controls"></video>
</template>

<script>
import Hls from "hls.js";
export default {
  props: ['url'],
  data() {
    return {
      video: ""
    };
  },
  mounted() {
    var self = this;
    this.video = document.getElementById("video");
    if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(this.url);
      hls.attachMedia(this.video);
      this.video.play();
      // hls.on(Hls.Events.MANIFEST_PARSED, function() {
      //   this.video.play();
      // });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
      // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
      // This is using the built-in support of the plain video element, without using hls.js.
      this.video.src = this.url;
      this.video.addEventListener("canplay", function() {
        this.video.play();
      });
    }
  }
}
</script>

<style>
#video {
  background-color: black;
}
.video {
  width: 100%;
  height: 100%;
}
</style>
