<template>
  <div class="meetingRoom">
    <div ref="public_video"></div>
    <div ref="subscriber_video"></div>
    <div class="meetingRoom_main" ref="main" >
      <div class="header">
        <div class="menu-wrapper">

          <div>
            <div>
                <p>{{ currentRoom.name }}</p>
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
        <div class="breakroom">
          <div class="breakroom__videos" ref="subscriber_video"></div>
          <div class="breakroom__placeholder" v-if="!hasMembers">
            <h2>Warte auf Teilnehmer ...</h2>
          </div>
        </div>
      </div>
      <BasicIcon id="button-calendar" size="large" source="/icons/filter.svg" />
      <div class="footer">
        <div class="toolbar">
          <ul>
            <li>
              <BasicIcon
                  size="medium"
                  source="/icons/mic.svg"
                  class="basic-btn active"
                  @click="unmuteAudio"
                  v-if="muted"
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
            <li>
              <BasicIcon
                  size="medium"
                  source="/icons/cam.svg"
                  class="basic-btn"
                  @click="startWebcamStream"
                  v-if="!sharing"
              />
              <BasicIcon
                  size="medium"
                  source="/icons/cam.svg"
                  class="basic-btn active"
                  @click="stopWebcamSharing"
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
      <PollCreateOverlay @sharePollResults="sharePollResults" />
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

const main = ref(null);
const sidebar = ref(null);
const chat = ref(null);
let sidebarVisible = true;
let sharing = ref(false);
let muted = ref(false);

const props = defineProps(["startWebcam", "stopWebcam", "mute", "unmute", "hasMembers"])

function startWebcamStream() {
  this.startWebcam();
  this.sharing = true;
}

function stopWebcamSharing() {
  this.stopWebcam();
  this.sharing = false;
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

<style scoped>

</style>