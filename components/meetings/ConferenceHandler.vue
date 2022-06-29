<template>
  <ConferenceView ref="conferenceView"
                  :isPresenter="this.presenter"
                  :start-webcam-share="startShareWebcam"
                  :stop-webcam-share="stopShareWebcam"
                  :start-screenshare="startShareScreen"
                  :stop-screenshare="stopShareScreen"
                  :mute="mute"
                  :unmute="unmute"
                  :is-sharing-webcam="sharingWebcam"
                  :is-sharing-screen="sharingScreen"
  />
</template>

<script>
import ConferenceView from "./ConferenceView";

import {useNuxtApp} from "nuxt/app";
import {useStore} from "~/store";

let store;

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
}

let client, screenshare;

export default {
  components: {ConferenceView},
  props: ["roomId"],
  data() {
    return {
      presenter: false,
      localWebcam: null,
      localScreen: null,
      sharingWebcam: false,
      sharingScreen: false,
    }
  },
  created() {
    const { $jsonRPC, $client } = useNuxtApp();
    const runtimeConfig = useRuntimeConfig()
    store = useStore();
    this.presenter = store.session.role === "speaker";

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
          this.sharingWebcam = true;
          this.$refs.conferenceView.$refs.subscriber_video.srcObject = stream;
          this.$refs.conferenceView.$refs.subscriber_video.autoplay = true;
          this.$refs.conferenceView.$refs.subscriber_video.muted = false;


          stream.onremovetrack = () => {
            this.sharingWebcam = false;
            this.$refs.conferenceView.$refs.subscriber_video.srcObject = null;
          }
        }
      }
      screenshare.ontrack = (track, stream) => {
        track.onunmute = () => {
          this.sharingScreen = true;
          this.$refs.conferenceView.$refs.screenshare_video.srcObject = stream;
          this.$refs.conferenceView.$refs.screenshare_video.autoplay = true;
          this.$refs.conferenceView.$refs.screenshare_video.muted = false;

          stream.onremovetrack = () => {
            this.sharingScreen = false;
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
    debug() {
      console.log(this.presenter)
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