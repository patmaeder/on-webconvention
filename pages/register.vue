<template>
  <main>
    <form class="form" @submit.prevent="performRegistration">
      <h1>Registrieren</h1>
      <label class="form__label" for="email">E-Mail-Adresse</label>
      <input name="email" id="email" type="email" v-model="email">
      <label class="form__label" for="name">Benutzername</label>
      <input name="name" id="name" type="text" v-model="name">
      <input type="submit" value="Jetzt Registrieren">
    </form>
    <span v-if="pending">Wird gesendet ...</span>
    <span class="form__response" v-if="response">{{response}}</span>
  </main>
</template>

<script setup>
  import { watchEffect, ref } from 'vue'
  import {useFetch} from "nuxt/app";

  const email = ref('');
  const name = ref('');

  let pending = ref(false);
  let response = ref(null);

  const performRegistration = async () => {
    const registrationRequest = useFetch('/api/auth/register', {
      method: "post",
      body: {
        email: email.value,
        name: name.value
      }
    });

    watchEffect(() => {
      pending.value = registrationRequest.pending.value;

      // consecutive requests with no changes
      if(registrationRequest.error.value === true) {
        return;
      }

      if(registrationRequest.error.value) {
        response.value = registrationRequest.error.value;
        return;
      }

      response.value = registrationRequest.data.value.message;
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
