<template>
  <h1>Nuxt 3 starter template with all folders and hint</h1>
  <p>Registrierte Benutzer:</p>
  <ul>
    <li v-for="user in users">{{user.email}}</li>
  </ul>
</template>

<script setup>
import {useServer} from "../server";

const { data: users } = await useAsyncData('fetch.users', async () => {

  const { prisma } = await useServer();

  return await prisma.user.findMany({
    select: {
      email: true
    }
  });
})

console.log(users);
</script>

<style lang="scss" scoped>
</style>
