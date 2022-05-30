<template>
  <nav>
    <NuxtLink to="/register">
      Registrieren
    </NuxtLink>
    <NuxtLink to="/login">
      Login
    </NuxtLink>
    <NuxtLink to="/protected">
      Geschützter Inhalt
    </NuxtLink>
  </nav>
</template>

<script setup>
</script>

<style lang="scss" scoped>

nav {
  max-width: 800px;
  margin: 0 auto;

  display: flex;
  gap: 20px;
}

</style>