<template>
  <video ref="public_video" autoplay v-if="isPresenter" ></video>
  <video ref="subscriber_video" autoplay ></video>
  <video ref="screenshare_video" autoplay ></video>
</template>

<script lang="ts">

  export default {
    name: "ConferenceView",
    props: ["isPresenter"]
  }
</script>

<style scoped>

</style>