<template>
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <!-- Loading Spinner -->
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>

  <div v-else class="container-fluid bg-green-200 h-96 flex flex-col justify-between">
    <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16">
      {{ country?.name }}
    </h1>
    <RouterLink class="ms-16 w-16" :to="`/continent/${country?.continent.objectId}`">🔙</RouterLink>
  </div>
  <div class="container-fluid flex justify-center md:justify-end md:pe-4 bg-green-200">
        <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
          Most Popular Citites
        </div>
  </div>
  <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid bg-gray-100">
    <RouterLink
      v-for="city in cities"
      :key="city.objectId"
      :to="`/city/${city.objectId}`"
      class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-green-600 rounded-lg flex flex-col items-center justify-center text-white"
    >
      <!-- <div class="text-3xl">{{ city.adminCode }}</div> -->
      <div class="mt-2 text-center">{{ city.name }}</div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { externalAPI } from '@/modules/api/externalFetch';

const {fetchCountryAndCities, cities, country, loading} = externalAPI()

const route = useRoute()
const countryId = ref(route.params.id as string)

onMounted(() => {
  fetchCountryAndCities(countryId.value)
})

watch(
  () => route.params.id,
  (newId) => {
    countryId.value = newId as string
    fetchCountryAndCities(countryId.value)
  }
)
  </script>
