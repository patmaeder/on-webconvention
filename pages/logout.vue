<template>
  <main>
    <div class="action-pane action-pane__container">
      <Spinner v-if="pending"></Spinner>
      <div class="action-pane__group" v-else>
        <h3 class="action-pane__headline">Du hast dich erfolgreich ausgeloggt.</h3>
        <BasicButton @click="navigateToFrontpage">Zurück zur Startseite</BasicButton>
      </div>
    </div>
  </main>
</template>

<script setup>
import {useStore} from "../store";
import {useLazyFetch} from "nuxt/app";
import BasicButton from "../components/BasicButton";

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

function navigateToFrontpage() {
  navigateTo("/");
}

</script>