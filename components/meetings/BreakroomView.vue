<template>
  <div ref="public_video"></div>
  <div ref="subscriber_video"></div>
  <div class="meetingRoomWrapper">
    <div class="header">
      <div class="menu-wrapper">
        <div class="menu">
          <ul>
            <li>
              <BasicIcon
                  size="medium"
                  source="/icons/q.svg"
                  class="basic-btn"
              />
            </li>
            <li>
              <BasicIcon
                  size="medium"
                  source="/icons/settings.svg"
                  class="basic-btn"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="main-section">
      <div class="breakroom">
        <div class="breakroom__videos" ref="subscriber_video"></div>
        <div class="breakroom__placeholder" v-if="!hasMembers">
          <h2>Warte auf Teilnehmer ...</h2>
        </div>
      </div>
    </div>
    <BasicIcon id="button-calendar" size="large" source="/icons/filter.svg" />
    <div class="footer">
      <div class="toolbar">
        <ul>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/mic.svg"
                class="basic-btn active"
                @click="unmuteAudio"
                v-if="muted"
            />
            <BasicIcon
                size="medium"
                source="/icons/mic.svg"
                class="basic-btn"
                @click="muteAudio"
                v-else
            />
          </li>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/phones.svg"
                class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/end_call.svg"
                class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/cam.svg"
                class="basic-btn"
                @click="startWebcamStream"
                v-if="!sharing"
            />
            <BasicIcon
                size="medium"
                source="/icons/cam.svg"
                class="basic-btn active"
                @click="stopWebcamSharing"
                v-if="sharing"
            />
          </li>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/chat.svg"
                class="basic-btn"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BreakroomView",
  props: ["startWebcam", "stopWebcam", "mute", "unmute", "hasMembers"],
  data() {
    return {
      sharing: false,
      muted: true,
    }
  },
  methods: {
    startWebcamStream() {
      this.startWebcam();
      this.sharing = true;
    },
    stopWebcamSharing() {
      this.stopWebcam();
      this.sharing = false;
    },
    muteAudio() {
      this.mute();
      this.muted = true;
    },
    unmuteAudio() {
      this.unmute();
      this.muted = false;
    }
  }
}
</script>

<style scoped>

</style>