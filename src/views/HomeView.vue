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


