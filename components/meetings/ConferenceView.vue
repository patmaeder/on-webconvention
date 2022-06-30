<template>
  <div class="meetingRoom meetingview__bg keynote__bg">
    <div class="meetingRoom_main" ref="main" >
      <div class="header">
        <div class="menu-wrapper">

          <div>
            <div >
                <span>{{ currentRoom.name }}</span>
                <p v-if="currentEvent.length > 0">{{ currentEvent.name }}</p>
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
          <div>
            <video class="camera" :class="{hidden: !sharingWebcam}" ref="public_video" autoplay v-if="(store.session.role === 'speaker')"  ></video>
            <video class="camera" :class="{hidden: !isSharingWebcam}" ref="subscriber_video" autoplay v-else ></video>
          </div>
          <div :class="{hidden: sharingWebcam || isSharingWebcam}">
            <div class="camera-placeholder">
              <p>Name</p>
            </div>
          </div>
        </div>
        <div class="screen-wrapper" v-if="(store.session.role === 'speaker')">
          <video id="screen" ref="screenshare_video" autoplay :class="{hidden: !sharingScreen}"></video>
          <h2 class="sc-placeholder sc__placeholder__wrapper" :class="{hidden: sharingScreen}">Stage</h2>
        </div>
        <div class="screen-wrapper" v-else>
          <video id="screen" ref="screenshare_video" autoplay :class="{hidden: !isSharingScreen}"></video>
          <h2 class="sc-placeholder sc__placeholder__wrapper" :class="{hidden: isSharingScreen}">Stage</h2>
        </div>
      </div>
      <BasicIcon id="button-calendar" size="large" source="/icons/filter.svg" />
      <div class="footer">
        <div class="toolbar">
          <ul>
            <li v-if="store.session.role === 'speaker'">
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
            <li>
              <NuxtLink to="/event-site">
                <BasicIcon
                    size="medium"
                    source="/icons/end_call.svg"
                    class="basic-btn"
                />
              </NuxtLink>
            </li>
            <li v-if="store.session.role === 'speaker'">
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
            <li v-if="store.session.role === 'speaker'">
              <BasicIcon
                  size="medium"
                  source="/icons/screen.svg"
                  class="basic-btn active"
                  @click="stopScreen"
                  v-if="sharingScreen"
              />
              <BasicIcon
                  size="medium"
                  source="/icons/screen.svg"
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
      <PollCreateOverlay @sharePollResults="sharePollResults" v-if="store.session.role === 'speaker'" />
    </div>
    <PollVoteOverlay />
    <Calendar :events="events" :favorites="favoriteEvents" :roomNames="eventSite.reduce((obj, item) => Object.assign(obj, {[item.id]: item.name }))" @favorEvent="favor"/>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '~/store';

const store = useStore();
const route = useRoute();
const roomId = route.params.roomId;
const { data: currentRoom } = await useAsyncData('fetch.currentRoom', () => $fetch(`/api/expo/eventRoom/${roomId}`))
const { data: currentEvent } = await useAsyncData('fetch.currentEvent', () => $fetch(`/api/expo/eventRoom/${roomId}/currentEvent`))
const { data: eventSite } = await useAsyncData('fetch.eventRooms', () => $fetch('/api/expo/eventRooms'))
const { data: events } = await useAsyncData('fetch.events', () => $fetch('/api/expo/events'))


let favoriteEvents = ref([]);
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

const props = defineProps(["isPresenter", "startScreenshare", "stopScreenshare", "startWebcamShare", "stopWebcamShare", "mute", "unmute", "isSharingWebcam", "isSharingScreen"])

function startScreen() {
  sharingScreen.value = true;
  props.startScreenshare();
}

function stopScreen() {
  sharingScreen.value = false;
  props.stopScreenshare();
}

function startWebcam() {
  sharingWebcam.value = true;
  props.startWebcamShare();
}

function stopWebcam() {
  sharingWebcam.value = false;
  props.stopWebcamShare();
}

function muteAudio() {
  muted.value = true;
  props.mute();
}

function unmuteAudio() {
  muted.value = false;
  props.unmute();
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

function favor(eventID) {

  if (favoriteEvents.value.includes(eventID)) {
    favoriteEvents.value = favoriteEvents.value.filter((elem) => {
      return elem != eventID
    })

  } else {
    favoriteEvents.value.push(eventID)
  }
}

</script>

<style lang="scss" scoped>
</style>