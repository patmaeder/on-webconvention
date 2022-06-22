<template>
  <client-only>
    <div v-if="roomId">
      <MeetingsConferenceHandler v-if="this.type === 'keynote'" :room-id="roomId" />
      <MeetingsBreakroomHandler v-else :room-id="roomId" />
    </div>
    <div v-else>
      <p>Nothing to see here!</p>
    </div>
  </client-only>
</template>

<script setup>
definePageMeta({ layout: "no-header", middleware: "auth" });

const route = useRoute();
const roomId = route.params.roomId;
const type = route.params.type;
</script>

<style lang="scss" scoped></style>
