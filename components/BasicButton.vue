<template>

    <button type="button" class="basicButton">
      <slot v-if="!isPending">Button</slot>
      <Spinner v-else />
    </button>
</template>

<script lang="ts" setup>

const props = defineProps({
  isPending: Boolean,
});

</script>


<style lang="scss" scoped>

.basicButton {
    padding: 13px 25px 13px 25px;
    width: 294px;
    color: #FFFFFF;
    background: linear-gradient(to right, #79F0DA, #3B4595);
    font-size: 20px;
    font-weight: bold;
    border: 1px solid #3B4595;
    border-radius: 10px;
    cursor: pointer;
    overflow: hidden;

    position: relative;
    z-index: 1;
    transition: opacity 120ms ease-in-out;

    &.hidden {
      opacity: 0;
    }

    &:before {
      content: "";
      background: linear-gradient(to right, #79F0DA -50%, #3B4595);

      left: 0;
      top: 0;

      width: 100%;
      height: 100%;
      position: absolute;

      opacity: 0;

      z-index: -1;
    }

    &:hover:before {
      transition: opacity 120ms ease-in-out;
      opacity: 1;
    }

    @media screen and (max-width: 768px) {
        padding: 9px 15px 9px 15px;
        width: 200px;
        font-size: 17px;
    }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

</style>