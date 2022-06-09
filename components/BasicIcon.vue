<template>
  <div class="iconWrapper" :class="size">
    <img :src="source" />
  </div>
</template>

<script lang="ts" setup>
/*
 * ---------------
 * Props
 * ---------------
 */
const props = defineProps({
  size: String,
  source: String,
});
</script>

<style lang="scss" scoped>
.iconWrapper {
  background-color: #ffffff;
  border-radius: 100px;
  display: flex;
  justify-content: center;

  img {
    align-self: center;
  }
}

.medium {
  width: 55px;
  height: 55px;

  img {
    height: 45%;
  }
}

.large {
  width: 75px;
  height: 75px;

  img {
    height: 35%;
  }
}
</style>
