<template>
  <client-only>
    <!-- <MeetingMember :room="this.$route.query.room" /> -->
    <MeetingControls :startWebcam="startShareWebcam" :startScreenshare="startShareScreen" :mute-audio="mute" />
    <ConferenceView ref="conferenceView" :isPresenter="presenter" />
  </client-only>
</template>

<script>
import MeetingMember from "../MeetingMember";
import ConferenceView from "./ConferenceView";
import MeetingControls from "./MeetingControls";

import { LocalStream, Client } from "ion-sdk-js";
import { IonSFUJSONRPCSignal } from "ion-sdk-js/lib/signal/json-rpc-impl";

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
}

let client, screenshare;

export default {
  components: {MeetingControls, ConferenceView, MeetingMember},
  props: ["roomId"],
  data() {
    return {
      presenter: (this.$route.query.presenter === "true")
    }
  },
  created() {
    const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
    const screenshareSignal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
    client = new Client(signal, config);
    screenshare = new Client(screenshareSignal, config);
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
      LocalStream.getUserMedia({
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
      LocalStream.getDisplayMedia({
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