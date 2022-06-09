<template>
  <nav class="navigation navigation__container">
    <div class="navigation__inner">
      <div class="navigation__title">on19-Eventplattform</div>
      <div class="navigation__links">
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
      </div>
    </div>
  </nav>
</template>

<script setup>

import {useStore} from "../store";

const store = useStore();

</script>

<style lang="scss" scoped>

.navigation {

  &__container {
    height: 200px;

    background-image: url("/images/header-keyvisual.webp");
    background-position: center 40%;
    background-size: cover;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    padding: 20px 35px;
    position: relative;
    z-index: 0;

    &:before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(54, 58, 69, 0.75);
      z-index: -1;
    }
  }

  &__inner {
    max-width: 1200px;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: white;

    margin-bottom: 30px;
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;

    a {
      font-size: 16px;
      font-weight: 400;
      color: white;
      text-decoration: unset;

      &:hover {
        text-decoration: underline;
      }
    }
  }

}

nav {
}

</style>