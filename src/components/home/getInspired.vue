<template>
  <!-- Title -->
  <div class="container-fluid flex justify-end pe-4">
    <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
      Get Inspired
    </div>
  </div>

  <div class="container-fluid flex flex-col md:flex-row bg-gray-100 min-h-[500px]">
    <!-- Tabs -->
    <div class="w-full md:w-1/4 flex flex-row md:flex-col justify-start border-r">
      <button v-for="cat in categories" :key="cat" @click="selectCategory(cat)" :class="[
        'py-6 px-4 text-left w-full border-b border-gray-300 transition text-sm',
        selectedCategory === cat ? 'bg-white font-semibold text-green-600' : 'hover:bg-white text-gray-700'
      ]">
        {{ cat }}
      </button>
    </div>

    <!-- Places Display -->
    <div class="w-full md:w-3/4 bg-gray-100 p-6 flex flex-col justify-top">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold capitalize">{{ selectedCategory }} Picks</h2>
        <button @click="reshuffle()"
          class="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:scale-105 transition-all duration-300">
          <svg :class="['h-4 w-4', isShuffling ? 'animate-spin' : '']" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M4 4c1.885 5.217 5.53 9.663 10.418 11.582M20 20c-1.885-5.217-5.53-9.663-10.418-11.582" />
          </svg>
          Shuffle
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="mx-auto w-full grid grid-cols-2 max-w-2xl  gap-6">

        <div v-for="place in displayedPlaces" :key="place.name" @click="goToPlace(place.name)"
          class="cursor-pointer group bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition">
          <img v-if="place.images?.length"
            :src="typeof place.images[0] === 'string' ? place.images[0] : URL.createObjectURL(place.images[0])"
            alt="Place image"
            class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="p-3">
            <h3 class="text-sm font-semibold truncate">{{ place.name }}</h3>
            <p class="text-xs text-gray-600 truncate">{{ place.location.city || 'Unknown City' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore'

const placesStore = usePlacesStore()

const emit = defineEmits(['loaded'])
const router = useRouter()

const categories = ['Beach', 'Museum', 'Monument', 'Street', 'Park']

const selectedCategory = ref('Beach')
const shuffledSet = ref<Set<string>>(new Set())
const isShuffling = ref(false)


const places = computed(() => placesStore.filterPlacesByApproved(true));

declare const URL: {
  createObjectURL(file: Blob): string
}

const filteredByCategory = computed(() => {
  const tagMatch = (tags: string[], cat: string) =>
    tags.some(tag => tag.toLowerCase() === cat.toLowerCase())

  return places.value.filter(
    (place) => tagMatch(place.tags, selectedCategory.value)
  )
})

const displayedPlaces = computed(() => {
  return filteredByCategory.value.filter(p => shuffledSet.value.has(p.name)).slice(0, 4)
}
)

const reshuffle = () => {
  isShuffling.value = true
  setTimeout(() => {
    const shuffled = [...filteredByCategory.value]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
    shuffledSet.value = new Set(shuffled.map(p => p.name))
    isShuffling.value = false
  }, 300)
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  reshuffle()
}

const goToPlace = (placeName: string) => {
  router.push(`/place/${encodeURIComponent(placeName)}`)
}

watch(
  () => places.value,
  (newVal) => {
    if (newVal.length > 0) {
      reshuffle()
    }
  },
  { immediate: true }
)


onMounted(async () => {
  await placesStore.fetchPlaces()
  emit('loaded')
})
</script>
