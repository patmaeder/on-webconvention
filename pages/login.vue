<template>
  <main>
    <form class="form" @submit.prevent="performLogin">
      <h1>Login</h1>
      <label for="email">E-Mail-Adresse</label>
      <input name="email" id="email" type="email" v-model="email">
      <input type="submit" value="Jetzt Einloggen">
    </form>
    <span v-if="pending">Wird gesendet ...</span>
    <span v-if="response">{{response}}</span>
  </main>
</template>

<script setup>
  import { watchEffect, ref } from 'vue'
  import {useFetch} from "nuxt/app";

  const email = ref('');

  let pending = ref(false);
  let response = ref(null);

  const performLogin = async () => {
    const loginRequest = useFetch('/api/auth/login', {
      method: "post",
      body: {
        email: email.value,
      }
    });

    watchEffect(() => {
      pending.value = loginRequest.pending.value;

      // consecutive requests with no changes
      if(loginRequest.error.value === true) {
        return;
      }

      if(loginRequest.error.value) {
        response.value = loginRequest.error.value;
        return;
      }

      response.value = loginRequest.data.value;
    });
  }

</script>

<style lang="scss" scoped>

  .form {
    display: flex;
    flex-direction: column;
    gap: 5px;

    max-width: 800px;
    margin: 0 auto;
  }

  label {
    font-weight: bold;
  }

</style>
