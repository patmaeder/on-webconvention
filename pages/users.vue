<template>
  <main>
    <h1>Example of fetching data stored with prisma using api routes:</h1>
    <p>Registrierte Benutzer:</p>
    <ul>
      <li v-for="user in users">{{user.email}}</li>
    </ul>
  </main>
</template>

<script setup>
import {useFetch} from "nuxt/app";

const { data: users } = await useFetch('/api/users');

</script>

<style lang="scss" scoped>
</style>
