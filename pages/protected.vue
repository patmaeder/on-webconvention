<template>
  <main>
    <h1>Protected route</h1>
  </main>
</template>

<script setup>
  definePageMeta({
    middleware: "auth"
  })
</script>

<style lang="scss" scoped>
</style>
