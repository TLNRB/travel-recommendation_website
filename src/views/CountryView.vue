<template>
  <div v-if="loading || placesLoading" class="flex justify-center items-center h-screen">
    <!-- Loading Spinner -->
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>
<div v-else>
  <div
        class="container-fluid h-120 relative flex flex-col justify-between bg-cover bg-center bg-no-repeat"
        :style="countryHeaderStyle"
      >
      <div class="relative z-10 flex flex-col mt-16 items-start h-full px-8 md:px-16">
      <h1 class="text-white text-2xl md:text-4xl lg:text-6xl font-bold drop-shadow-lg">
        {{ country?.name }}
      </h1>
      <RouterLink
        class="md:left-16 z-20 mt-4 md:px-4 md:py-2 py-1 px-2 text-sm  bg-white text-green-600 font-semibold rounded hover:bg-green-100 transition"
        :to="`/continent/${country?.continent.objectId}`"
      >
        🔙
      </RouterLink>
    </div>

        <div class="container-fluid flex h-14 lg:w-1/2 absolute right-0 bottom-0 justify-center md:justify-end md:pe-4">

          <input
            v-model="searchTerm"
            type="text"
            placeholder="Browse cities..."
            class="mb-4 me-4 md:mt-0 md:ml-4 px-4 py-2 text-white bg-black/40  rounded-lg border border-gray-100 focus:outline-none w-full md:max-w-sm"
          />
          <div class="text-black px-16 lg:px-28 py-3 rounded-t-xl bg-gray-100">
            Cities
          </div>

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
      class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 relative rounded-xl overflow-hidden shadow-md transition-transform transform hover:scale-105 flex flex-col items-center justify-end text-white"
      :style="{
        backgroundImage: city.image ? `url('${city.image}')` : undefined,
        backgroundColor: city.image ? undefined : '#059669',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
    <div class="z-10 px-2 pb-3 text-center w-full bg-black/30 backdrop-blur-sm">
    <h2 class="text-sm font-semibold truncate">{{ city.name }}</h2>
    <p class="text-xs truncate"> {{ city.country.name }}</p>
  </div>
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
import { useCountriesStore } from '@/stores/crud/countriesStore'
import { useCitiesStore } from '@/stores/crud/citiesStore'

const { getPlaces, places, loading: placesLoading } = usePlaces();
const {fetchCountryAndCities, allCities, country, loading} = externalAPI()

const route = useRoute()
const countryId = ref(route.params.id as string)
const citiesStore = useCitiesStore()

const countriesStore = useCountriesStore()

onMounted(async () => {
  await fetchCountryAndCities(countryId.value)
  await getPlaces()
  await citiesStore.fetchUniqueCities()
  await citiesStore.fetchCityImages()
})

watch(
  () => route.params.id,
  (newId) => {
    countryId.value = newId as string
    fetchCountryAndCities(countryId.value)
    getPlaces();
  }
)

const countryImage = computed(() => {
  return countriesStore.countryImages.find(
    (img) => img.name === country.value?.name
  )?.images?.[0]?.url
})

const countryHeaderStyle = computed(() => {
  return countryImage.value
    ? {
        backgroundImage: `url('${countryImage.value}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundColor: '#059669'
      }
})

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


const citiesWithImages = computed(() => {
  if (!citiesWithPlaces.value?.length || !Object.keys(citiesStore.cityImagesMap)?.length) {
    return []
  }

  return citiesWithPlaces.value.map(city => {
    const key = `${city.name.toLowerCase()}_${city.country.name.toLowerCase()}`
    const imageEntry = citiesStore.cityImagesMap[key]
    const image = imageEntry?.images?.[0]?.url

    return {
      ...city,
      image
    }
  })
})


const searchTerm = ref('')

const displayedCities = computed(() => {
  if (searchTerm.value.length >= 3) {
    return citiesWithImages.value.filter(c =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }
  return citiesWithImages.value;
});


const noResults = computed(() => {
  return searchTerm.value.length >= 3 && displayedCities.value.length === 0
})
  </script>
