<template>
  <client-only>
    <div v-if="this.$route.query.roomId">
      <ConferenceHandler v-if="this.type === 'conference'" :room-id="roomId" />
      <BreakroomHandler v-else :room-id="roomId" />
    </div>
    <div v-else>
      <p>Nothing to see here!</p>
    </div>
  </client-only>
</template>

<script>
import BreakroomHandler from "../components/meetings/BreakroomHandler";
import ConferenceHandler from "../components/meetings/ConferenceHandler";
definePageMeta({ layout: "no-header" });
export default {
  components: {ConferenceHandler, BreakroomHandler},
  data() {
    return {
      type: this.$route.query.type || "breakroom",
      roomId: this.$route.query.roomId || "default"
    }
  }
}
</script>

<style lang="scss" scoped></style>
