<template>
  <div class="meetingRoom meetingview__bg keynote__bg">
    <div class="meetingRoom_main" ref="main" >
      <div class="header">
        <div class="menu-wrapper">

          <NuxtLink to="/event-site">
            <div v-if="currentEvent.length > 0">
                <span>{{ currentRoom.name }}</span>
                <p>{{ currentEvent }}</p>
            </div>
            <div v-else>
                <p>{{ currentRoom.name }}</p>
            </div>
            <div>
                <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.2129 9.18164L26.0002 13.7271L22.2129 9.18164ZM22.2129 18.2726L26.0002 13.7271L22.2129 18.2726Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1 1V26.4548M23.7275 13.7274H11.9092H23.7275ZM1 1H17.3638H1ZM1 26.4548H17.3638H1ZM17.3638 1V8.27281V1ZM17.3638 19.182V26.4548V19.182Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
          </NuxtLink>

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
                  :class="{ active: localMuted.value }"
                  @click="muteLocal"
              />
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
const public_video = ref(null);
const subscriber_video = ref(null);

let sidebarVisible = true;
let sharingWebcam = ref(false);
let sharingScreen = ref(false);
let muted = ref(true);
let localMuted = ref(false);

const props = defineProps(["isPresenter", "startScreenshare", "stopScreenshare", "startWebcamShare", "stopWebcamShare", "mute", "unmute"])

function startScreen() {
  this.startScreenshare();
  sharingScreen.value = true;
}

function stopScreen() {
  this.stopScreenshare();
  sharingScreen.value = false;
}

function startWebcam() {
  this.startWebcamShare();
  sharingWebcam.value = true;
}

function stopWebcam() {
  this.stopWebcamShare();
  sharingWebcam.value = false;
}

function muteAudio() {
  this.mute();
  muted.value = true;
}

function unmuteAudio() {
  this.unmute();
  muted.value = false;
}

// ToDo: Clean up control-methods with this schema.
function muteLocal() {
  if(props.isPresenter) {
    public_video.value.muted = !localMuted.value;
  } else {
    subscriber_video.value.muted = !localMuted.value;
  }
  localMuted.value = !localMuted.value;
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