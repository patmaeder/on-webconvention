<template>
  <main>
    <h1>Example of fetching data stored with prisma using useAsyncData-hook (running on the server)</h1>
    <p>Registrierte Benutzer:</p>
    <ul>
      <li v-for="user in users">{{user.email}}</li>
    </ul>
  </main>
</template>

<script setup>
import {useNuxtApp} from "nuxt/app";

const { data: users } = await useAsyncData('fetch.users', async (context) => {

  const { $prisma } = useNuxtApp();

  return await $prisma.user.findMany({
    select: {
      email: true
    }
  });
})

</script>

<style lang="scss" scoped>
</style>
