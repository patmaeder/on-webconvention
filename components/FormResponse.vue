<template>
    <span class="form__response" :class="{'form__response--error': !response.success}" v-if="response">
      <IconsCheckIcon v-if="response.success"/>
      <IconsCrossIcon v-else />
      {{response.message}}
    </span>
</template>
<script setup>
  const props = defineProps({
    response: Object,
  });
</script>