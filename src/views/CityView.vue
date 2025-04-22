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
  <div>
  <div v-if="placesLoading"> Loading places... </div>
  <div v-else-if="error" class="text-red-500"> {{ error }} </div>
  <div v-else>
    <div v-if="filteredPlaces.length" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid">
        <RouterLink :to="{
            path: `/place/${place.name}`,
            query: { cityId: cityId }}"
          v-for="place in filteredPlaces" :key="place._id"
          class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-green-600 rounded-lg flex flex-col items-center justify-center text-white">
          {{ place.name }}
          {{ place.location.city }}
        </RouterLink>
      </div>
    <div v-else> No places for this city yet. </div>
  </div>
</div>
</div>

</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router';
import { externalAPI } from '@/modules/api/externalFetch';
import { usePlaces } from "@/modules/places/usePlaces";

const {fetchSingleCity, city, loading} = externalAPI()
const { places, error, getPlaces, loading: placesLoading } = usePlaces();

const route = useRoute()
const cityId = ref(route.params.id as string)

const filteredPlaces = computed(() => {
  const cityName = city.value?.name?.toLowerCase();
  if (!cityName) return [];
  return places.value.filter(
    (place) => place.location.city.toLowerCase() === cityName
  );
});

onMounted(() => {
  fetchSingleCity(cityId.value)
  getPlaces();
})

watch(
  () => route.params.id,
  (newId) => {
    cityId.value = newId as string
    fetchSingleCity(cityId.value)
  }
)
  </script>
