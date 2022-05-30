<template>
  <nav>
    <NuxtLink to="/register" v-if="!store.session">
      Registrieren
    </NuxtLink>
    <NuxtLink to="/login" v-if="!store.session">
      Login
    </NuxtLink>
    <NuxtLink to="/protected">
      Geschützter Inhalt
    </NuxtLink>
    <NuxtLink to="/logout" v-if="store.session">
      Logout
    </NuxtLink>
  </nav>
</template>

<script setup>

import {useStore} from "../store";

const store = useStore();

</script>

<style lang="scss" scoped>

nav {
  max-width: 800px;
  margin: 0 auto;

  display: flex;
  gap: 20px;
}

</style>