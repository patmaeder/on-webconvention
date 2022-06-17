<template>
  <div>
    <client-only>
      <BreakroomHandler />
    </client-only>
  </div>
</template>

<script>
import BreakroomHandler from "../components/meetings/BreakroomHandler";
definePageMeta({ layout: "no-header" });
export default {
  components: {BreakroomHandler}
}
</script>

<style lang="scss" scoped></style>
