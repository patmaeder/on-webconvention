<template>
  <div class="meetingRoomWrapper">
    <div class="header">
      <div class="menu-wrapper">
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
        <video class="camera" ref="subscriber_video" autoplay ></video>
      </div>
      <div class="screen-wrapper">
        <video id="screen" ref="screenshare_video" autoplay ></video>
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
                class="basic-btn"
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
            <BasicIcon
                size="medium"
                source="/icons/end_call.svg"
                class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/cam.svg"
                class="basic-btn"
            />
          </li>
          <li>
            <BasicIcon
                size="medium"
                source="/icons/chat.svg"
                class="basic-btn"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  export default {
    name: "ConferenceView",
    props: ["isPresenter"]
  }
</script>

<style lang="scss" scoped>

</style>