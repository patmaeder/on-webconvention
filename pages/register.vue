<template>
    <main>
      <form class="form form__pane" @submit.prevent="performRegistration">
        <h1>Registrieren</h1>
        <div class="form__group">
          <label class="form__label" for="email">E-Mail-Adresse</label>
          <input class="form__input" name="email" id="email" type="email" v-model="email">
        </div>
        <div class="form__group">
          <label class="form__label" for="name">Benutzername</label>
          <input class="form__input" name="name" id="name" type="text" v-model="name">
        </div>
        <BasicButton class="form__submit-button" type="submit">Jetzt registrieren</BasicButton>
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
