<template>
  <ConferenceView ref="conferenceView"
                  :isPresenter="this.presenter"
                  :start-webcam-share="startShareWebcam"
                  :stop-webcam-share="stopShareWebcam"
                  :start-screenshare="startShareScreen"
                  :stop-screenshare="stopShareScreen"
                  :mute="mute"
                  :unmute="unmute"
  />
</template>

<script>
import ConferenceView from "./ConferenceView";
import MeetingControls from "./MeetingControls";

import {useNuxtApp} from "nuxt/app";

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
}

let client, screenshare;

export default {
  components: {MeetingControls, ConferenceView},
  props: ["roomId"],
  data() {
    return {
      presenter: (this.$route.query.presenter === "true"),
      localWebcam: null,
      localScreen: null,
    }
  },
  created() {
    const { $jsonRPC, $client } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig()

    const signal = new $jsonRPC(runtimeConfig.public.SFU_HOST);
    const screenshareSignal = new $jsonRPC(runtimeConfig.public.SFU_HOST);
    client = new $client(signal, config);
    screenshare = new $client(screenshareSignal, config);
    signal.onopen = () => {
      client.join(this.roomId);
    }
    screenshareSignal.onopen = () => {
      screenshare.join(this.roomId + "-screenshare");
    }
    if(!this.presenter) {
      client.ontrack = (track, stream) => {
        track.onunmute = () => {
          this.$refs.conferenceView.$refs.subscriber_video.srcObject = stream;
          this.$refs.conferenceView.$refs.subscriber_video.autoplay = true;
          this.$refs.conferenceView.$refs.subscriber_video.muted = false;

          stream.onremovetrack = () => {
            this.$refs.conferenceView.$refs.subscriber_video.srcObject = null;
          }
        }
      }
      screenshare.ontrack = (track, stream) => {
        track.onunmute = () => {
          this.$refs.conferenceView.$refs.screenshare_video.srcObject = stream;
          this.$refs.conferenceView.$refs.screenshare_video.autoplay = true;
          this.$refs.conferenceView.$refs.screenshare_video.muted = false;

          stream.onremovetrack = () => {
            this.$refs.conferenceView.$refs.screenshare_video.srcObject = null;
          }
        }
      }
    }
  },
  methods: {
    async startShareWebcam() {
      const { $localStream } = useNuxtApp();
      this.localWebcam = await $localStream.getUserMedia({
        resolution: "vga",
        audio: true,
        video: true,
        codec: "vp8"
      });
      this.localWebcam.mute("audio");
      this.$refs.conferenceView.$refs.public_video.srcObject = this.localWebcam;
      this.$refs.conferenceView.$refs.public_video.muted = true;
      client.publish(this.localWebcam);
    },
    async startShareScreen() {
      const { $localStream } = useNuxtApp();
      this.localScreen = await $localStream.getDisplayMedia({
        resolution: "vga",
        audio: true,
        video: true,
        codec: "vp8"
      });
      this.$refs.conferenceView.$refs.screenshare_video.srcObject = this.localScreen;
      screenshare.publish(this.localScreen);
    },
    mute() {
      this.localWebcam.mute("audio");
    },
    unmute() {
      this.localWebcam.unmute("audio");
    },
    stopShareWebcam() {
      this.localWebcam.unpublish();
      if(this.presenter) {
        this.$refs.conferenceView.$refs.public_video.srcObject = null;
      } else { this.$refs.conferenceView.$refs.subscriber_video.srcObject = null; }
    },
    stopShareScreen() {
      this.localScreen.unpublish();
      this.$refs.conferenceView.$refs.screenshare_video.srcObject = null;
    }
  }
}
</script>