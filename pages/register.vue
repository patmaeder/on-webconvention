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
        <BasicButton class="form__submit-button" type="submit" :isPending="pending">Jetzt registrieren</BasicButton>
      </form>
      <FormResponse :response="response" />
    </main>
</template>

<script setup>
  import { ref } from 'vue'
  import {useFetch} from "nuxt/app";
  import {useFormResponse} from "../composables/useFormResponse";

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

    useFormResponse(registrationRequest, pending, response);
  }

</script>
