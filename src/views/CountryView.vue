<template>
  <div v-if="loading || placesLoading" class="flex justify-center items-center h-screen">
    <!-- Loading Spinner -->
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>
<div v-else>


  <div  class="container-fluid bg-green-200 h-96 flex flex-col justify-between">
    <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16">
      {{ country?.name }}
    </h1>
    <RouterLink class="ms-16 w-16" :to="`/continent/${country?.continent.objectId}`">🔙</RouterLink>
  </div>
  <div class="container-fluid flex justify-center md:justify-end md:pe-4 bg-green-200">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Browse countries..."
        class="mb-4 me-4 md:mt-0 md:ml-4 px-4 py-2 text-black rounded-lg border border-gray-600 focus:outline-none w-full md:max-w-sm"
      />
    <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
      Most Popular Cities
    </div>

  </div>
  <div class="min-h-[40vh] bg-gray-100">
  <div v-if="noResults" class="flex justify-center items-center h-[40vh] text-2xl text-gray-600">
    No results found
  </div>

  <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid">
    <RouterLink
      v-for="city in displayedCities"
      :key="city.objectId"
      :to="`/city/${city.objectId}`"
      class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-green-600 rounded-lg flex flex-col items-center justify-center text-white"
    >
    <div class="mt-2 text-center">{{ city.name }}</div>
    </RouterLink>
  </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { externalAPI } from '@/modules/api/externalFetch';
import { usePlaces } from '@/modules/places/usePlaces';

const { getPlaces, places, loading: placesLoading } = usePlaces();
const {fetchCountryAndCities, allCities, country, loading} = externalAPI()

const route = useRoute()
const countryId = ref(route.params.id as string)

onMounted(() => {
  fetchCountryAndCities(countryId.value)
  getPlaces();
})

watch(
  () => route.params.id,
  (newId) => {
    countryId.value = newId as string
    fetchCountryAndCities(countryId.value)
    getPlaces();
  }
)

const citiesWithPlaces = computed(() => {
  const citiesWithContent = new Set(
    places.value
    .filter(place => place.approved)
    .map(place =>
      `${place.location.city.toLowerCase()}__${place.location.country.toLowerCase()}`
    )
  );
  console.log(citiesWithContent)
  console.log(allCities)
  return allCities.value.filter(city => {
    if (!city.country || !city.country.name) return false;

    const key = `${city.name.toLowerCase()}__${city.country.name.toLowerCase()}`
    return citiesWithContent.has(key)
  });
});
console.log("cities with places" + citiesWithPlaces)

const searchTerm = ref('')

const displayedCities = computed(() => {
  if (searchTerm.value.length >= 3) {
    return citiesWithPlaces.value.filter(c =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  return citiesWithPlaces.value;
});

const noResults = computed(() => {
  return searchTerm.value.length >= 3 && displayedCities.value.length === 0
})
  </script>
