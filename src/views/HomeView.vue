<template>
  <main>
    <div>
      <!-- Search Section -->
      <SearchAndPopular  />

      <!-- Top Section -->
      <TopDestinations  />

      <!-- Get Inspired Section -->
      <GetInspired  />

      <!-- Where Next Section -->
      <WhereNext />

      <!-- FAQ Section -->
      <div class="container-fluid h-32 p-6 bg-green-100">
        <h2 class="font-bold text-2xl flex justify-center">Any additional Questions?</h2>
        <h3 class="font-bold text-lg">sample question</h3>
        <p class="ms-4">sample answer sample answer sample answer sample answer</p>
        <p class="flex justify-end">link to faq page maybe idk</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useUsersStore } from '@/stores/crud/usersStore';
import TopDestinations from '@/components/home/TopDestinations.vue'
import GetInspired from '@/components/home/getInspired.vue'
import WhereNext from '@/components/home/whereNext.vue'
import SearchAndPopular from '@/components/home/searchAndPopular.vue'

const placesStore = usePlacesStore();
const usersStore = useUsersStore();

onMounted(() => {
  placesStore.fetchPlaces();
  usersStore.fetchUsers();
})



</script>

<style>
.loader {
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>


