<template>
  <main>
    <form class="form form__pane" @submit.prevent="performLogin">
      <h1>Login</h1>
      <div class="form__group">
        <label class="form__label" for="email">E-Mail-Adresse</label>
        <input class="form__input" name="email" id="email" type="email" v-model="email">
      </div>
      <BasicButton class="form__submit-button" type="submit" :isPending="pending">Jetzt anmelden</BasicButton>
      <span>Du hast noch keinen Account? <NuxtLink href="/register">Jetzt registrieren</NuxtLink></span>
    </form>
    <FormResponse :response="response" />
  </main>
</template>

<script setup>
  import { ref } from 'vue'
  import {useFetch} from "nuxt/app";
  import {useFormResponse} from "../composables/useFormResponse";

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

    useFormResponse(loginRequest, pending, response);
  }

</script>