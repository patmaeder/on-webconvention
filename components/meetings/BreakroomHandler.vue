<template>
  <client-only>
    <BreakroomView ref="breakroomView"
                   :start-webcam="startShare"
                   :stop-webcam="stopShare"
                   :mute="mute"
                   :unmute="unmute"
                   :has-members="hasMembers"
    />
  </client-only>
</template>

<script>
import MeetingControls from "./MeetingControls";
import BreakroomView from "./BreakroomView";

import {useNuxtApp} from "nuxt/app";
let client, local;

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export default {
  name: "BreakroomHandler",
  props: ["roomId"],
  components: {BreakroomView, MeetingControls},
  data() {
    return {
      hasMembers: false,
      local: null
    }
  },
  created() {
    const { $client, $jsonRPC } = useNuxtApp();
    const signal = new $jsonRPC("ws://localhost:7000/ws");
    client = new $client(signal, config);
    signal.onopen = () => client.join(this.roomId || "room1");
    client.ontrack = (track, stream) => {
      const videoContainer = this.$refs.breakroomView.$refs.subscriber_video;
      const videoEl = document.createElement('video');
      console.log("got track: ", track.id, "for stream: ", stream.id);
      if (track.kind === 'video') {
        track.onunmute = () => {
          console.log("unmute")
          videoEl.srcObject = stream;
          videoEl.autoplay = true;
          videoEl.muted = false;
          videoContainer.appendChild(videoEl);
          this.hasMembers = true;

          // when the publisher leave
          stream.onremovetrack = () => {
            videoEl.srcObject = null;
            videoEl.remove();
          }
        }
      }
    }
  },
  methods: {
    async startShare() {
      const { $localStream } = useNuxtApp();
      const  videoContainer = this.$refs.breakroomView.$refs.subscriber_video;
      const videoEl = document.createElement('video');
      local = await $localStream.getUserMedia({
        resolution: "vga",
        audio: true,
        video: true,
        codec: "vp8",
        simulcast: true,
      });
      this.local = local;
      videoEl.autoplay = true;
      videoEl.muted = true;
      videoEl.srcObject = local;


      videoContainer.appendChild(videoEl);
      local.mute("audio");
      client.publish(local);
    },
    stopShare() {
      local.unpublish();
    },
    mute() {
      local.mute("audio");
    },
    unmute() {
      this.local.unmute("audio")
    },
  }
}
</script>

<style scoped>

</style>