<template>
  <main>
    <span v-if="pending">Wird geladen...</span>
    <h1 v-if="!store.session">Du hast dich erfolgreich ausgeloggt.</h1>
  </main>
</template>

<script setup>
import {useStore} from "../store";
import {useLazyFetch} from "nuxt/app";

const store = useStore();
const { data, pending } = await useLazyFetch('/api/auth/logout', { method: "POST"});

watch(data, (response) => {
  console.log("[Auth]","Logout done");
  if(!response.success) {
    console.log("[Auth]","Logout did not succeed");
    return;
  }

  store.clearSession();
})

</script>