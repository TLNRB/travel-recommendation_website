<script setup lang="ts">
import { RouterView } from 'vue-router'
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <nav v-if="route.path === '/'" class="flex justify-start gap-10 items-center py-3 space-x-4 bg-gray-500 text-white">
        <RouterLink class="ms-10" to="/">Home</RouterLink>
        <RouterLink to="/auth">Login</RouterLink>
  </nav>
  <nav v-else-if="route.path === '/auth'" class="absolute m-5">
    <RouterLink to="/">
      <img class="w-32 h-32" src="./assets/images/planet-2.svg" alt="logo">
    </RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped></style>
