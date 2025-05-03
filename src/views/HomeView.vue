<template>
  <main>
    <!-- Search Section -->
    <searchAndPopular />

    <!-- Top Section -->
    <TopDestinations />

    <!-- Get Inspired Section -->
    <getInspired />

    <!-- Where next Section -->
    <whereNext />


    <!-- FAQ Section -->
    <div class="container-fluid h-32 p-6 bg-green-100">
      <h2 class="font-bold text-2xl flex justify-center"> Any additional Questions? </h2>
      <h3 class=" font-bold text-lg"> sample question </h3>
      <p class="ms-4"> sample answer sample answer sample answer sample answer </p>
      <p class="flex justify-end">link to faq page maybe idk</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useUsersStore } from '@/stores/crud/usersStore';
import searchAndPopular from '@/components/home/searchAndPopular.vue'
import TopDestinations from '@/components/home/TopDestinations.vue'
import getInspired from '@/components/home/getInspired.vue';
import whereNext from '@/components/home/whereNext.vue';
const activeTab = ref<'destinations' | 'atractions'>('destinations');
const activeTabTwo = ref<'beaches' | 'museums' | 'monuments' | 'other'>('beaches');

const placesStore = usePlacesStore();
const usersStore = useUsersStore();

onMounted(() => {
  placesStore.fetchPlaces();
  usersStore.fetchUsers();
})
</script>
