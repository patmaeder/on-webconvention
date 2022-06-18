<template>
  <client-only>
    <!-- <MeetingMember :room="this.$route.query.room" /> -->
    <MeetingControls :startWebcam="startShareWebcam" :startScreenshare="startShareScreen" :mute-audio="mute" />
    <ConferenceView ref="conferenceView" :isPresenter="true" />
  </client-only>
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
      presenter: (this.$route.query.presenter === "true")
    }
  },
  created() {
    const { $jsonRPC, $client } = useNuxtApp();

    const signal = new $jsonRPC("ws://localhost:7000/ws");
    const screenshareSignal = new $jsonRPC("ws://localhost:7000/ws");
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
    startShareWebcam() {
      const { $localStream } = useNuxtApp();
      $localStream.getUserMedia({
        resolution: "vga",
        audio: true,
        video: true,
        codec: "vp8"
      }).then(stream => {
        this.$refs.conferenceView.$refs.public_video.srcObject = stream;
        client.publish(stream);
      }).catch(err => console.error(err));
    },
    startShareScreen() {
      const { $localStream } = useNuxtApp();
      $localStream.getDisplayMedia({
        resolution: "vga",
        audio: true,
        video: true,
        codec: "vp8"
      }).then(stream => {
        this.$refs.conferenceView.$refs.screenshare_video.srcObject = stream;
        screenshare.publish(stream);
      }).catch(err => console.error(err));
    },
    mute() {
      local.mute();
    },
  }
}
</script>