<template>
  <h1>Example of fetching data stored with prisma using api routes:</h1>
  <p>Registrierte Benutzer:</p>
  <ul>
    <li v-for="user in users">{{user.email}}</li>
  </ul>
</template>

<script setup>
const { data: users } = await useAsyncData('fetch.users', () => $fetch('/api/users'))
</script>

<style lang="scss" scoped>
</style>
