<template>
  <div class="video__controls">
    <button @click="muteClient">Mute</button>
    <button @click="stopVideo">stopVideo</button>
    <button @click="stopVideo">shareScreen</button>
    <button @click="debug">Debug</button>
  </div>
  <div class="video__grid">
    <div class="video__wrapper" v-for="client in clients">
      <p>{{client}}</p>
      <video :ref="client" autoplay></video>
    </div>
  </div>
</template>

<script>
import {useNuxtApp} from "nuxt/app";
import {Peer} from "peerjs";

export default {
  name: "MeetingMember",
  layout: "meeting",
  props: ["room"],
  data() {
    return {
      userVideo: null,
      peer: null,
      clients: ["userVideo"],
      peers: {}
    }
  },
  mounted() {
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
      this.userVideo.getAudioTracks()[0].enabled = false;
      this.userVideo.getVideoTracks()[0].enabled = false;
      this.addVideoStream(this.$refs["userVideo"][0], this.userVideo);
      this.peer.on("call", call => {
        call.answer(this.userVideo);
        call.on("stream", (peerVideoStream) => {
          if(!this.clients.includes(call.peer)) {
            this.clients.push(call.peer);
            this.addVideoStream(this.$refs[call.peer][0], peerVideoStream);
          }
        })
      });
    });

    //Join socket for meeting room
    this.peer.on("open", (id) => {
      $socket.emit("join-room", this.room, id);
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
    debug() {
      console.log(this.clients);
    },


    // get stream from connected user
    connectToNewUser(userId) {
      console.log("Connected to User ", userId)
      const call = this.peer.call(userId, this.userVideo);
      call.on("stream", peerVideoStream => {
        console.log(peerVideoStream);
        if(!this.clients.includes(userId)) {
          this.clients.push(userId);
          setTimeout(100);
          const videoRef = this.$refs[userId][0];
          this.addVideoStream(videoRef, peerVideoStream);
        }
      })
      call.on("close", () => {
        this.clients = this.clients.splice(this.clients.indexOf(userId), 1);
      });

      this.peers[userId] = call;
    },

    // add video stream to dom
    addVideoStream(video, stream) {
      console.log("Stream added ", video, stream);
      video.srcObject = stream;
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

<style lang="scss" scoped>
  .video__grid {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .video__controls {
    display: flex;
    justify-content: center;
    gap: .5rem;
    margin-top: 1rem;
    button {
      background-color: #363A45;
      color: #ffffff;
      font-size: 12pt;
      font-weight: lighter;
      padding: .5rem 1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
  }

  .video__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    overflow: hidden;
    width: 30%;
    border-radius: 50%;
    margin: 1rem .5rem;

    video {
      height: 100%;
    }
  }
</style>