<template>
  <div class="controlls">
    <button @click="muteClient">Mute</button>
    <button @click="stopVideo">stopVideo</button>
  </div>
  <div>
    <video v-for="client in clients" :ref="client" autoplay></video>
  </div>
</template>

<script>
import {useNuxtApp} from "nuxt/app";
import {Peer} from "peerjs";

export default {
  name: "MeetingMember",
  data() {
    return {
      userVideo: null,
      peer: null,
      clients: ["userVideo"],
      peers: {}
    }
  },
  created() {
    const { $socket } = useNuxtApp();

    //PeerJS adapter for WebRTC broker
    this.peer = new Peer(undefined, {
      port: "3001",
      host: "/",
      secure: false
    });

    //Get media-device / Webcam
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).then(stream => {
      this.userVideo = stream;
      this.addVideoStream(this.$refs["userVideo"][0], this.userVideo);

      this.peer.on("call", call => {
        call.answer(this.userVideo);
        call.on("stream", (peerVideoStream) => {
          this.clients.push(call.peer);
          this.addVideoStream(this.$refs[call.peer][0], peerVideoStream);
        })
      });
    });

    //Join socket for meeting room
    this.peer.on("open", (id) => {
      $socket.emit("join-room", 12, id);
    })

    $socket.on("user-connected", (userId) => {
      console.log("user connected: ", userId)
      this.connectToNewUser(userId);
    });

    $socket.on("user-disconnected", userId => {
      if(this.peers[userId]) this.peers[userId].close();
    })
  },
  methods: {
    // add video stream to dom
    addVideoStream(video, stream) {
      video.srcObject = stream;
      video.play();
    },

    // get stream from connected user
    connectToNewUser(userId) {
      const call = this.peer.call(userId, this.userVideo);
      call.on("stream", peerVideoStream => {
        this.clients.push(userId);
        this.addVideoStream(this.$refs[userId][0], peerVideoStream);
      })
      call.on("close", () => {
        console.log(call.peer, "Index: " + this.clients.indexOf(call.peer));
        this.clients = this.clients.splice(this.clients.indexOf(call.peer), 1);
        console.log(this.clients);
      });

      this.peers[userId] = call;
    },

    //Mute functions
    muteClient() {
      const enabled = this.userVideo.getAudioTracks()[0].enabled;
      this.userVideo.getAudioTracks()[0].enabled = !enabled;
    },
    stopVideo() {
      const enabled = this.userVideo.getVideoTracks()[0].enabled;
      this.userVideo.getVideoTracks()[0].enabled = !enabled;
    }
  }
}
</script>

<style scoped>

</style>