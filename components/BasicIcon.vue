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

  @media screen and (min-width: 400px) {
    width: 30px;
    height: 30px;
  }

  @media screen and (min-width: 576px) {
    width: 40px;
    height: 40px;
  }

  @media screen and (min-width: 992px) {
    width: 50px;
    height: 50px;
  }

  img {
    height: 45%;
  }
}

.large {
  width: 75px;
  height: 75px;

  @media screen and (min-width: 400px) {
    width: 45px;
    height: 45px;
  }

  @media screen and (min-width: 576px) {
    width: 55px;
    height: 55px;
  }

  @media screen and (min-width: 992px) {
    width: 65px;
    height: 65px;
  }

  img {
    height: 35%;
  }
}
</style>
