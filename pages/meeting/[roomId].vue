<template>
  <div>
    <div v-if="roomId">
      <MeetingsConferenceHandler v-if="currentRoom.type === 'keynote'" :room-id="roomId" />
      <MeetingsBreakroomHandler v-else :room-id="roomId" />
    </div>
    <div v-else>
      <p>Nothing to see here!</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "no-header", middleware: "auth" });

const route = useRoute();
const roomId = route.params.roomId;

const { data: currentRoom } = await useAsyncData('fetch.currentRoom', () => $fetch(`/api/expo/eventRoom/${roomId}`))
const { data: currentEvent } = await useAsyncData('fetch.currentEvent', () => $fetch(`/api/expo/eventRoom/${roomId}/currentEvent`))
</script>

<style lang="scss" scoped></style>
