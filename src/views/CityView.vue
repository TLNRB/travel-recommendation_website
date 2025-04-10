<template>
<div v-if="loading" class="flex justify-center items-center h-screen">
    <!-- Loading Spinner -->
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>
<div v-else>
  <div class="container-fluid bg-green-200 h-96 flex flex-col justify-between">
    <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16">
      {{ city?.name }}
    </h1>
     <RouterLink class="ms-16 w-16" :to="`/country/${city?.country.objectId}`">🔙</RouterLink>
  </div>
  <div class="container-fluid flex justify-center md:justify-end md:pe-4 bg-green-200">
        <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
          Most Popular Places
        </div>
  </div>
  <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid bg-gray-100">
      <RouterLink to="/place" class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-red-600 rounded-lg"></RouterLink>
      <RouterLink to="/place" class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-red-600 rounded-lg"></RouterLink>
      <RouterLink to="/place" class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-red-600 rounded-lg"></RouterLink>
      <RouterLink to="/place" class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-red-600 rounded-lg"></RouterLink>
      <RouterLink to="/place" class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-red-600 rounded-lg"></RouterLink>
      <RouterLink to="/place" class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-red-600 rounded-lg"></RouterLink>
  </div>
</div>

</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router';
import { externalAPI } from '@/modules/api/externalFetch';

const {fetchSingleCity, city, loading} = externalAPI()

const route = useRoute()
const cityId = ref(route.params.id as string)

onMounted(() => {
  fetchSingleCity(cityId.value)
})

watch(
  () => route.params.id,
  (newId) => {
    cityId.value = newId as string
    fetchSingleCity(cityId.value)
  }
)
  </script>
