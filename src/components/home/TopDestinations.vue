<template>
  <div class="container-fluid flex justify-start ps-4 gap-2 bg-gray-100">
    <div class="text-black px-16 py-3 rounded-t-xl bg-white">
      Top Destinations
    </div>
  </div>

  <div  class="container-fluid py-10 px-10 w-full flex flex-col justify-center bg-white">

    <div v-if="!isLoading" class="grid grid-cols-2 lg:grid-cols-4 max-w-xl lg:max-w-6xl gap-10 px-4 mx-auto lg:px-10 pt-6 pb-10">
      <div
        v-for="city in topCities"
        :key="city.objectId"
        @click="goToCity(city.objectId)"
        class="cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-md transition-transform duration-300 hover:scale-105"
      >
         <img
          :src="city.image"
          alt="City image"
          class="w-full h-40 md:h-64 object-cover"
        />
        <div class="bg-white p-4">
          <div class="text-lg font-semibold text-green-700">{{ city.name }}</div>
          <div class="text-sm text-gray-500 mb-1">{{ city.country }}</div>
          <div class="text-xs text-gray-400">{{ city.count }} place{{ city.count > 1 ? 's' : '' }}</div>
        </div>
      </div>
    </div>
    <div v-else class="w-full flex justify-center">
        <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, defineEmits } from 'vue'
import { usePlacesStore } from '@/stores/crud/placesStore'
import { externalAPI } from '@/modules/api/externalFetch'
import { useRouter } from 'vue-router'
import type { Place } from '@/interfaces/placeTypes'

const emit = defineEmits(['loaded'])
const router = useRouter()
const placesStore = usePlacesStore()
const { fetchAllCountries, allCountriesGlobal, fetchCitiesForCountry } = externalAPI()

const approvedPlaces = computed(() =>
  placesStore.places.filter(p => p.approved && p.location.city && p.location.country)
)
const isLoading = ref(true)
const topCities = ref<any[]>([])



const generateTopCities = async () => {
  console.log('Starting top cities generation...')
  const placeMap = new Map<
    string,
    { count: number; place: Place }
  >()

  const countriesSet = new Set<string>()



  approvedPlaces.value.forEach(place => {
    const city = place.location.city?.trim().toLowerCase()
    const country = place.location.country?.trim().toLowerCase()
    if (!city || !country) return

    const key = `${city}__${country}`
    countriesSet.add(country)

    if (!placeMap.has(key)) {
      placeMap.set(key, { count: 1, place })
    } else {
      placeMap.get(key)!.count++
    }
  })


  // Map country names to IDs
  const countryNameToIdMap = new Map<string, string>()
  allCountriesGlobal.value.forEach(country => {
    countryNameToIdMap.set(country.name.trim().toLowerCase(), country.objectId)
  })

  // const matchedCities: CityDisplayData[] = []
  const matchedCities: any[] = []

for (const [key, value] of placeMap) {
  const [cityName, countryName] = key.split('__')
  const countryId = countryNameToIdMap.get(countryName)

  if (!countryId) continue

  const citiesInCountry = await fetchCitiesForCountry(countryId)

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

  const city = citiesInCountry.find(
    (    c: { name: string }) => normalize(c.name) === normalize(cityName)
  )

  if (city) {
    const image = typeof value.place.images[0] === 'string' ? value.place.images[0] : ''
    matchedCities.push({
      objectId: city.objectId,
      name: city.name,
      country: countryName,
      count: value.count,
      image: image || '/fallback.jpg'
    })
  } else {
    console.warn(`City not found in fetched cities: ${cityName}`)
  }
}

// Now sort and limit to top 4 after full loop
matchedCities.sort((a, b) => b.count - a.count)
const finalTopCities = matchedCities.slice(0, 4)

topCities.value = finalTopCities
isLoading.value = false
}

const goToCity = (id: string) => {
  router.push(`/city/${id}`)
}

onMounted(async () => {
  await Promise.all([placesStore.fetchPlaces(), fetchAllCountries()])
  await generateTopCities()
  emit('loaded')
})
</script>
<style scoped>
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
=======
<!-- Tabs for the Top Section -->
<div class="container-fluid flex justify-start ps-4 gap-2 bg-gray-100">
      <button
      :class="{ 'text-blue-600': activeTab === 'destinations',
      'text-gray-500': activeTab !== 'destinations' }"
      @click="activeTab = 'destinations'"
      class="text-black px-16 py-3 rounded-t-xl bg-white">
        Top Destinations
      </button>
      <button
      :class="{ 'text-blue-600': activeTab === 'atractions',
      'text-gray-500': activeTab !== 'atractions' }"
      @click="activeTab = 'atractions'"
       class="text-black px-16 py-3 rounded-t-xl bg-white">
        Top Atractions
      </button>
    </div>

  <!-- Top Destinations -->
<div v-if="activeTab === 'destinations'" class="container-fluid flex justify-center">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-10 py-32">
    <div
      v-for="destination in topDestinations"
      :key="destination.city + destination.country"
      class="w-50 h-80 bg-green-400 rounded-xl flex flex-col items-center justify-center text-white text-lg font-semibold"
    >
      <div>{{ destination.city }}</div>
      <div class="text-sm">{{ destination.country }}</div>
      <div class="text-xs mt-2">({{ destination.count }} places)</div>
    </div>
  </div>
</div>

<!-- Top Attractions -->
<div v-if="activeTab === 'atractions'" class="container-fluid flex justify-center">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-10 py-32">
    <div
      v-for="place in topAttractions"
      :key="place.name"
      class="w-50 h-80 bg-blue-400 rounded-xl flex items-center justify-center text-white text-lg font-semibold text-center p-4"
    >
      {{ place.name }}
    </div>
  </div>
</div>

</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePlacesStore } from '@/stores/crud/placesStore';

const activeTab = ref<'destinations' | 'atractions'>('destinations');

const placesStore = usePlacesStore();
const places = computed(() => placesStore.places.filter(p => p.approved));

// --- TOP DESTINATIONS LOGIC (grouped & sorted cities)
const topDestinations = computed(() => {
  const cityMap = new Map<string, { city: string; country: string; count: number }>();

  places.value.forEach(place => {
    const key = `${place.location.city}__${place.location.country}`;
    if (!cityMap.has(key)) {
      cityMap.set(key, {
        city: place.location.city,
        country: place.location.country,
        count: 0,
      });
    }
    cityMap.get(key)!.count++;
  });

  return Array.from(cityMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4); // Limit if needed
});

// --- TOP ATTRACTIONS LOGIC (randomized approved places)
const topAttractions = computed(() => {
  const shuffled = [...places.value].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4); // Show 8 random attractions
});

onMounted(() => {
  placesStore.fetchPlaces();
});

</script>

