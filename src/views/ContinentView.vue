<template>
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>

  <div v-else>
    <!-- Header -->
    <div
        class="container-fluid h-120 relative flex flex-col justify-between bg-cover bg-center bg-no-repeat"
        :style="backgroundImage"
      >
        <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16 text-white drop-shadow-lg">
          {{ continent?.name }}
        </h1>
        <RouterLink class="ms-16 mb-6 w-8 text-center rounded-xl box-shadow-xl bg-white/50 text-xl" to="/">🔙</RouterLink>
        <div class="container-fluid flex h-14 lg:w-1/2 absolute right-0 bottom-0 justify-center md:justify-end md:pe-4">

          <input
            v-model="searchTerm"
            type="text"
            placeholder="Browse countries..."
            class="mb-4 me-4 md:mt-0 md:ml-4 px-4 py-2 text-white bg-black/40  rounded-lg border border-gray-100 focus:outline-none w-full md:max-w-sm"
          />
          <div class="text-black px-16 lg:px-28 py-3 rounded-t-xl bg-gray-100">
            Countries
          </div>

        </div>
      </div>


<div v-if="countriesWithImages.length">
  <div class="min-h-[40vh] bg-gray-100">
    <div v-if="noResults" class="flex justify-center items-center h-[40vh] text-2xl text-gray-600">
      No results found
    </div>

    <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid">
      <RouterLink
  v-for="country in displayedCountries"
  :key="country.objectId"
  :to="`/country/${country.objectId}`"
  class="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-28 h-40 md:w-40 md:h-64 2xl:w-56 2xl:h-72 mx-auto my-6 flex flex-col justify-end bg-cover bg-center text-white"
  :style="{
    backgroundImage: country.image ? `url('${country.image}')` : undefined,
    backgroundColor: country.image ? undefined : '#059669'
  }"
>

  <!-- Country Name -->
  <div class="w-full text-center text-black py-2 bg-white text-sm md:text-base font-medium rounded-b-2xl">
    {{ country.name }}
  </div>

  <!-- Hover Overlay (optional aesthetic effect) -->
  <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl"></div>
</RouterLink>
    </div>

   </div>
  </div>
  <div v-else>
    Loading...
  </div>
</div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { externalAPI } from '@/modules/api/externalFetch';
import { usePlaces } from '@/modules/places/usePlaces';
import europeImg from '@/assets/images/europe-continent.avif'
import asiaImg from '@/assets/images/asia-continent.jpg'
import africaImg from '@/assets/images/africa-continent.webp'
import northAmericaImg from '@/assets/images/north-america-continent.jpg'
import southAmericaImg from '@/assets/images/south-america-continent.jpg'
import australiaImg from '@/assets/images/oceania-continent.jpg'
import antarcticaImg from '@/assets/images/anctartica-continent.avif'
import { useCountriesStore } from '@/stores/crud/countriesStore'
import type { Country } from '@/interfaces/interfaces';
const countriesStore = useCountriesStore()

const continentBackgrounds: Record<string, string> = {
  '28HX8qDZHw': europeImg,
  'mSxk54vkg6': asiaImg,
  'X2rEcTJnsE': africaImg,
  'vZNZcahFvu': northAmericaImg,
  'ISPUD93Or8': southAmericaImg,
  'E6LHZzkHr6': australiaImg,
  'xwS5b1G6tn': antarcticaImg
}

const backgroundImage = computed(() => {
  const id = continent.value?.objectId
  return id && continentBackgrounds[id]
    ? `background-image: url('${continentBackgrounds[id]}')`
    : ''
})

const { getPlaces, places } = usePlaces();

const { fetchContinentAndCountries, continent, allCountries, loading, allCities } = externalAPI()

const route = useRoute()
const continentId = ref(route.params.id as string)

onMounted(async () => {
  await countriesStore.fetchUniqueCountries()
  await countriesStore.fetchCountryImages()
  await fetchContinentAndCountries(continentId.value)
  await getPlaces()
})

watch(
  () => route.params.id,
  (newId) => {
    continentId.value = newId as string
    fetchContinentAndCountries(continentId.value)
    getPlaces();
  }
)

const countriesWithImages = computed(() => {
  if (!countriesWithContent.value?.length || !countriesStore.countryImages?.length) {
    return [] // Or return countriesWithContent.value if you want them without images
  }

  return countriesWithContent.value.map((country): Country & { image?: string } => {
    const match = countriesStore.countryImages.find(img => img.name === country.name)

    if (!match) {
      console.warn(`No image match found for country: ${country.name}`)
    }

    const image = match?.images?.[0]?.url

    return {
      ...country,
      image
    }
  })
})

const citiesWithPlaces = computed(() => {
  const citiesWithContent = new Set(
    places.value
      .filter(place => place.approved)
      .map(place =>
        `${place.location.city.toLowerCase()}__${place.location.country.toLowerCase()}`
      )
  );

  return allCities.value.filter(city => {
    const cityName = city.name?.toLowerCase();
    const countryName = city.country?.name?.toLowerCase();

    if (!cityName || !countryName) return false;

    const key = `${cityName}__${countryName}`;
    return citiesWithContent.has(key);
  });
});

const countriesWithContent = computed(() => {
  return allCountries.value.filter(country =>
    citiesWithPlaces.value.some(city =>
      city.country?.objectId === country.objectId
    )
  );
});

const searchTerm = ref('')

const displayedCountries = computed(() => {
  const base = countriesWithImages.value

  if (searchTerm.value.length >= 3) {
    return base.filter(c =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  return base;
});

const noResults = computed(() => {
  return searchTerm.value.length >= 3 && displayedCountries.value.length === 0;
});



</script>



