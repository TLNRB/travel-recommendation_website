<template>
  <!-- Title & Reshuffle -->
  <div class="container-fluid flex justify-between items-center px-6  bg-gray-100">
    <div class="text-black px-16 py-3 rounded-t-xl bg-white">
          Where to go next?
        </div>
  </div>

  <!-- Country Grid -->
  <div class="container-fluid w-full flex flex-col justify-center bg-white">
    <button
      @click="reshuffle"
      class="flex gap-2 px-4 py-2 me-4 ms-auto my-4 w-32 rounded-full shadow  active:scale-95 text-sm text-green-600 hover:text-green-700 hover:scale-105 transition-all duration-300"
    >
    <svg
            :class="['h-4 w-4', isShuffling ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M4 4c1.885 5.217 5.53 9.663 10.418 11.582M20 20c-1.885-5.217-5.53-9.663-10.418-11.582"
            />
          </svg>
       Shuffle
    </button>
    <div class="grid grid-cols-2 mx-auto lg:grid-cols-4 gap-4 px-10 pt-4 pb-10">
      <div
        v-for="country in displayedCountries"
        :key="country.objectId"
        @click="goToCountry(country.objectId)"
        class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40 cursor-pointer bg-white rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col justify-center items-center transition-transform duration-300 hover:scale-105"
      >
        <div class="text-4xl mb-2">
          {{ country.emoji }}
        </div>
        <div class="text-gray-800 text-sm font-semibold text-center px-2">
          {{ country.name }}
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { usePlaces } from '@/modules/places/usePlaces'
import { externalAPI } from '@/modules/api/externalFetch'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { getPlaces, places } = usePlaces()
const { fetchAllCountries, allCountriesGlobal } = externalAPI()
const router = useRouter()

const displayedCountries = ref<any[]>([])
  const isShuffling = ref(false)

onMounted(async () => {
  await Promise.all([getPlaces(), fetchAllCountries()])
  reshuffle()
})

const reshuffle = () => {
  isShuffling.value = true
  setTimeout(() => {
  if (!places.value.length || !allCountriesGlobal.value.length) return

  const approved = places.value.filter(p => p.approved)
  const seen = new Map<string, any>()

  approved.forEach(place => {
    const placeCountry = place.location.country?.toLowerCase()
    if (!placeCountry) return

    const match = allCountriesGlobal.value.find(
      c => c.name.toLowerCase() === placeCountry
    )

    if (match && !seen.has(match.objectId)) {
      seen.set(match.objectId, {
        name: match.name,
        emoji: match.emoji,
        objectId: match.objectId
      })
    }
  })

  const shuffled = Array.from(seen.values())
    .sort(() => 0.5 - Math.random())
    .slice(0, 8)

  displayedCountries.value = shuffled
  isShuffling.value = false
}, 300)
}


const goToCountry = (id: string) => {
  router.push(`/country/${id}`)
}

</script>

