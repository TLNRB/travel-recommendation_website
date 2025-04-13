<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/nav-bar.vue'
import footerElement from '@/components/footer-element.vue';
// Stores
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';

const userStore = useUserStore();
const authStore = useAuthStore();
</script>

<template>
  <Navbar />
  <!-- Loading -->
  <div v-if="authStore.getIsLoggedIn && !userStore.getIsUserLoaded">Loading...</div>
  <RouterView v-else />
  <footerElement />
</template>

<style scoped></style>
