<template>
  <main>
    <form class="form form__pane" @submit.prevent="performLogin">
      <h1>Login</h1>
      <div class="form__group">
        <label class="form__label" for="email">E-Mail-Adresse</label>
        <input class="form__input" name="email" id="email" type="email" v-model="email">
      </div>
      <BasicButton class="form__submit-button" type="submit">Jetzt anmelden</BasicButton>
    </form>
    <span v-if="pending">Wird gesendet ...</span>
    <span class="form__response" v-if="response">{{response}}</span>
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

      response.value = loginRequest.data.value.message;
    });
  }

</script>

<style lang="scss" scoped>


</style>
