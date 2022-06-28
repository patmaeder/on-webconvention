<template>
  <div>
    <button @click="startScreenshare" v-if="startScreenshare">Share Screen</button>
    <button @click="startWebcam" >Share Webcam</button>
    <button @click="muteAudio" >Mute</button>
    <button @click="unmuteAudio" >Unmute</button>
  </div>
</template>

<script>
export default {
  name: "MeetingControls",
  props: ["startWebcam", "startScreenshare", "muteAudio", "unmuteAudio"],
  methods: {
  }
}
</script>

<style scoped>

</style>