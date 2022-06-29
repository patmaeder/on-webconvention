<template>
  <!-- Temp fix for dynamic loading of breakromm bg-images :) -->
  <div class="meetingRoom meetingview__bg" :class="{breakroom__bg__2: (roomId % 2 === 0), breakroom__bg__1: (roomId % 2 !== 0)}">
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
                  class="basic-btn active"
                  @click="unmuteLocal"
                  v-if="localMuted"
              />
              <BasicIcon
                  size="medium"
                  source="/icons/phones.svg"
                  class="basic-btn"
                  @click="muteLocal"
                  v-else
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
let muted = ref(true);
let localMuted = ref(false);

const props = defineProps(["startWebcam", "stopWebcam", "mute", "unmute", "hasMembers", "muteLocal", "unmuteLocal"])

function startWebcamStream() {
  props.startWebcam();
  sharing.value = true;
}

function stopWebcamSharing() {
  props.stopWebcam();
  sharing.value = false;
}

function muteAudio() {
  props.mute();
  muted.value = true;
}

function unmuteAudio() {
  props.unmute();
  muted.value = false;
}

function muteLocal() {
  props.muteLocal();
  localMuted.value = true;
}

function unmuteLocal() {
  props.unmuteLocal();
  localMuted.value = false;
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