<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/nav-bar.vue'
import footerElement from '@/components/footer-element.vue';
// Stores
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { usePlacesStore } from '@/stores/crud/placesStore';
import { onMounted } from 'vue';

const userStore = useUserStore();
const authStore = useAuthStore();

</script>

<template>
  <Navbar />
  <!-- Loading -->
  <div v-if="authStore.getIsLoggedIn && !userStore.getIsUserLoaded"
    class="mt-[73px] flex justify-center items-center py-[40px] md:mt-[89px]">
    <span class="loader"></span>
  </div>
  <main v-else class="container bg-gray-50 min-w-full w-full mt-[73px] flex justify-between flex-col md:mt-[89px]">
    <RouterView />
    <footerElement />
  </main>
</template>

<style scoped>
.container {
  min-height: calc(100vh - 73px);
}

@media (min-width: 768px) {
  .container {
    min-height: calc(100vh - 89px);
  }
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>