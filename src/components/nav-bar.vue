<template>
  <nav v-if="route.path === '/'" class="flex justify-between gap-10 items-center py-3 px-6 space-x-4 bg-gray-100  text-black">
    <div class="flex gap-4 items-center w-64 justify-center">
      <RouterLink to="/">
        <img class="w-16 h-16" src="../assets/images/planet-2.svg" alt="logo">
      </RouterLink>
      <div class="relative">
        <button @click="toggleDropdown" class="px-4 py-2  text-black rounded-lg flex items-center">
          Explore
          <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="isOpen" class="absolute left-0 mt-2 w-auto bg-white rounded-lg shadow-lg">
          <ul class="py-2">
            <li v-for="continent in continents" :key="continent" class="px-4 py-2 hover:bg-gray-200">
              {{ continent }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex w-64 justify-center">
      <RouterLink to="/auth">Suggest a Place</RouterLink>
    </div>
    <div class="flex gap-4 items-center w-64 justify-center">
      <p> language </p>
      <RouterLink to="/auth">Login</RouterLink>
    </div>
  </nav>
  <nav v-else-if="route.path === '/auth'" class="absolute m-5">
    <RouterLink to="/">
      <img class="w-32 h-32" src="../assets/images/planet-2.svg" alt="logo">
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const isOpen = ref(false);
const continents = ref(["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (event: Event) => {
  if (!(event.target as HTMLElement).closest(".relative")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>
