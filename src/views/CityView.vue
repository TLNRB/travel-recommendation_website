<template>
  <div v-if="externalAPIStore.getLoading" class="flex justify-center items-center h-screen">
    <!-- Loading Spinner -->
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>
  <div v-else>
    <div class="container-fluid h-120 relative flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      :style="cityHeaderStyle">
      <div class="relative z-10 flex flex-col mt-16 items-start h-full px-8 md:px-16">
        <h1 class="text-white text-2xl md:text-4xl lg:text-6xl font-bold drop-shadow-lg">
          {{ city?.name }}
        </h1>
        <RouterLink
          class="md:left-16 z-20 mt-4 md:px-4 md:py-2 py-1 px-2 text-sm  bg-white text-green-600 font-semibold rounded hover:bg-green-100 transition"
          :to="`/country/${city?.country.objectId}`">
          🔙
        </RouterLink>
      </div>

      <div class="container-fluid flex h-14 lg:w-1/2 absolute right-0 bottom-0 justify-center md:justify-end md:pe-4">
        <div class="text-black px-16 lg:px-28 py-3 rounded-t-xl bg-gray-100">
          Places
        </div>

      </div>
    </div>
    <div>
      <div v-if="placesStore.getIsLoading"> Loading places... </div>
      <div v-else-if="placesStore.getError" class="text-red-500"> {{ placesStore.getError }} </div>
      <div v-else>
        <div v-if="filteredPlaces.length"
          class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid">
          <RouterLink v-for="place in filteredPlaces" :key="place.name" :to="{
            path: `/place/${place.name}`,
            query: { cityId: cityId }
          }"
            class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 relative rounded-xl overflow-hidden shadow-md transition-transform transform hover:scale-105 flex flex-col items-center justify-end text-white"
            :style="{
              backgroundImage: `url('${place.images[0]}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }">


            <!-- Info Panel -->
            <div class="z-10 px-2 pb-3 text-center w-full bg-black/30 backdrop-blur-sm">
              <h2 class="text-sm font-semibold truncate">{{ place.name }}</h2>
              <p class="text-xs truncate">{{ place.location.city }}</p>
            </div>
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
// Stores
import { useCitiesStore } from '@/stores/crud/citiesStore'
import { usePlacesStore } from '@/stores/crud/placesStore'
import { useExternalAPIStore } from '@/stores/externalAPIStore'

const route = useRoute()
const cityId = ref(route.params.id as string)
const citiesStore = useCitiesStore()
const placesStore = usePlacesStore()
const externalAPIStore = useExternalAPIStore();

onMounted(async () => {
  await externalAPIStore.fetchSingleCity(cityId.value)
  await placesStore.fetchPlaces()
  await citiesStore.fetchUniqueCities()
  await citiesStore.fetchCityImages()
})

const city = computed(() => externalAPIStore.getCity)



watch(
  () => route.params.id,
  (newId) => {
    cityId.value = newId as string
    externalAPIStore.fetchSingleCity(cityId.value)
  }
)

const cityImage = computed(() => {
  const cityName = city.value?.name?.toLowerCase();

  let countryName: string | undefined;

  if (typeof city.value?.country === 'object' && city.value.country?.name) {
    countryName = city.value.country.name.toLowerCase();
  }

  if (!cityName || !countryName) {
    console.warn("Missing city or country name", city.value);
    return null;
  }

  const key = `${cityName}_${countryName}`;

  return citiesStore.cityImagesMap[key]?.images?.[0]?.url || null;
});

const cityHeaderStyle = computed(() => {
  return cityImage.value
    ? {
      backgroundImage: `url('${cityImage.value}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
    : {
      backgroundColor: '#059669',
    }
})


const places = computed(() => placesStore.filterPlacesByApproved(true));

const filteredPlaces = computed(() => {
  const cityName = city.value?.name?.toLowerCase();
  if (!cityName) return [];
  return places.value.filter(
    (place) => place.location.city?.toLowerCase() === cityName
  );
});
</script>
