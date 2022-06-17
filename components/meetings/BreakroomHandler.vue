<template>
  <MeetingControls :start-webcam="startShare" :mute-audio="mute" :unmute-audio="unmute" />
  <BreakroomView ref="breakroomView" />
</template>

<script>
import MeetingControls from "./MeetingControls";
import BreakroomView from "./BreakroomView";

import { LocalStream, Client } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
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
  created() {
    const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
    client = new Client(signal, config);
    signal.onopen = () => client.join(this.roomId);
    client.ontrack = (track, stream) => {
      const videoContainer = this.$refs.breakroomView.$refs.subscriber_video;
      const videoEl = document.createElement('video');
      console.log("got track: ", track.id, "for stream: ", stream.id);
      if (track.kind === 'video') {
        track.onunmute = () => {
          console.log("unmute")
          videoEl.srcObject = stream;
          videoEl.autoplay = true;
          videoEl.controls = true;
          videoEl.muted = false;
          videoContainer.appendChild(videoEl);

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
      const  videoContainer = this.$refs.breakroomView.$refs.public_video;
      const videoEl = document.createElement('video');
      local = await LocalStream.getUserMedia({
        resolution: "vga",
        audio: true,
        video: true,
        codec: "vp8",
        simulcast: true,
      });
      videoEl.autoplay = true;
      videoEl.controls = true;
      videoEl.muted = true;
      videoEl.srcObject = local;
      videoContainer.appendChild(videoEl);
      client.publish(local);
    },
    mute() {
      local.mute();
    },
  }
}
</script>

<style scoped>

</style>