<template>
  <div class="meetingRoom">
    <div class="meetingRoom_main" ref="main" >
      <div class="header">
        <div class="menu-wrapper">

          <div>
            <div >
                <span>{{ currentRoom.name }}</span>
                <p v-if="currentEvent.length > 0">{{ currentEvent }}</p>
            </div>
          </div>

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
        <div class="members">
          <video class="camera" ref="public_video" autoplay v-if="isPresenter" ></video>
          <video class="camera" ref="subscriber_video" autoplay v-else ></video>
        </div>
        <div class="screen-wrapper">
          <video id="screen" ref="screenshare_video" autoplay ></video>
        </div>
      </div>
      <BasicIcon id="button-calendar" size="large" source="/icons/filter.svg" />
      <div class="footer">
        <div class="toolbar">
          <ul>
            <li v-if="isPresenter">
              <BasicIcon
                  size="medium"
                  source="/icons/mic.svg"
                  class="basic-btn active"
                  v-if="muted"
                  @click="unmuteAudio"
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
              <NuxtLink to="/event-site">
                <BasicIcon
                    size="medium"
                    source="/icons/end_call.svg"
                    class="basic-btn"
                />
              </NuxtLink>
            </li>
            <li v-if="isPresenter">
              <BasicIcon
                  size="medium"
                  source="/icons/cam.svg"
                  class="basic-btn active"
                  @click="stopWebcam"
                  v-if="sharingWebcam"
              />
              <BasicIcon
                  size="medium"
                  source="/icons/cam.svg"
                  class="basic-btn"
                  @click="startWebcam"
                  v-else
              />
            </li>
            <li v-if="isPresenter">
              <BasicIcon
                  size="medium"
                  source="/icons/cam.svg"
                  class="basic-btn active"
                  @click="stopScreen"
                  v-if="sharingScreen"
              />
              <BasicIcon
                  size="medium"
                  source="/icons/cam.svg"
                  class="basic-btn"
                  @click="startScreen"
                  v-else
              />
            </li>
            <li>
              <BasicIcon
                size="medium"
                source="/icons/chat.svg"
                class="basic-btn"
                @click="toggleSidebar"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="meetingRoom_sidebar" ref="sidebar" >
      <div>
        <Chat ref="chat"/>
      </div>
      <PollCreateOverlay @sharePollResults="sharePollResults" v-if="store.session.role == 'speaker'" />
    </div>
    <PollVoteOverlay />
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '~/store';

const store = useStore();
const route = useRoute();
const roomId = route.params.roomId;
const { data: currentRoom } = await useAsyncData('fetch.currentRoom', () => $fetch(`/api/expo/eventRoom/${roomId}`))
const { data: currentEvent } = await useAsyncData('fetch.currentEvent', () => $fetch(`/api/expo/eventRoom/${roomId}/currentEvent`))

const main = ref(null);
const sidebar = ref(null);
const chat = ref(null);

let sidebarVisible = true;
let sharingWebcam = ref(false);
let sharingScreen = ref(false);
let muted = ref(false);

const props = defineProps(["isPresenter", "startScreenshare", "stopScreenshare", "startWebcamShare", "stopWebcamShare", "mute", "unmute"])

function startScreen() {
  this.startScreenshare();
  this.sharingScreen = true;
}

function stopScreen() {
  this.stopScreenshare();
  this.sharingScreen = false;
}

function startWebcam() {
  this.startWebcamShare();
  this.sharingWebcam = true;
}

function stopWebcam() {
  this.stopWebcamShare();
  this.sharingWebcam = false;
}

function muteAudio() {
  this.mute();
  this.muted = true;
}

function unmuteAudio() {
  this.unmute();
  this.muted = false;
}

function toggleSidebar() {
  if (sidebarVisible) {
    main.value.style.minWidth = "100vw"
  } else {
    main.value.style.minWidth = "0vw"
  }
  sidebarVisible = !sidebarVisible;
}

function sharePollResults(event) {
  chat.value.sendMessage('pollResults', event)
}
</script>

<style lang="scss" scoped>
</style>