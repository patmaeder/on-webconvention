<template>
  <div class="meeting__controls">
    <button @click="shareCamera">Start Camera</button>
    <button @click="stopSharing">Stop Camera</button>
  </div>
  <div class="video__grid">
    <video ref="personalVideo" autoplay>
    </video>
  </div>
</template>

<script>

import {useNuxtApp} from "nuxt/app";

export default {
  name: "MeetingVideo",
  data() {
    return {
      stream: null,
    }
  },
  created() {
    const { $peer } = useNuxtApp();
    $peer.on('open', id => {
      console.log("Hallo")
      console.log(id);
    });
  },
  methods: {
    shareCamera() {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then(stream => {
        this.stream = stream;
        this.$refs.personalVideo.srcObject = stream;
      })
    },
    stopSharing() {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
}
</script>

<style scoped lang="scss">
.meeting__controls {
  button {

  }
}
</style>