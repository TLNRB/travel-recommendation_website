<template>
<div class="container-fluid bg-gray-100 mx-auto px-4 sm:px-16 lg:px-64 xl:px-80 2xl:px-96 py-8">
<!-- Categories -->
<div class="mb-8 w-full">
  <div class="flex gap-4 justify-start mb-4 flex-wrap">
    <span
      v-for="cat in ['All', 'Museum', 'Monument', 'Beach']"
      :key="cat"
      @click="selectCategory(cat)"
      :class="[
        'cursor-pointer px-4 py-2 rounded-full text-sm font-semibold transition',
        selectedCategory === cat ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-green-100'
      ]"
    >
      {{ cat }}
    </span>
  </div>

  <!-- Search Input -->
  <div class="relative w-full">
    <input
      type="text"
      v-model="searchQuery"
      @input="showSuggestions = searchQuery.length >= 3"
      placeholder="Search Places..."
      class="w-full px-4 py-3 border rounded-2xl shadow-md"
    />

    <!-- Suggestions Dropdown -->
    <ul
      v-if="showSuggestions && filteredPlaces.length > 0"
      class="absolute z-50 w-full bg-white mt-2 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="place in filteredPlaces"
        :key="place.name"
        @click="goToPlace(place.name)"
        class="px-4 py-2 hover:bg-green-100 cursor-pointer"
      >
        {{ place.name }}
      </li>
    </ul>

    <div
      v-else-if="showSuggestions && filteredPlaces.length === 0"
      class="absolute z-50 w-full bg-white mt-2 rounded-lg shadow-lg p-4 text-center text-gray-400"
    >
      No places found.
    </div>
  </div>
</div>
<div>
  <h2 class="text-xl font-semibold mb-4">Most Rated</h2>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="place in mostRatedPlaces"
      :key="place.name"
      class="w-full h-40  rounded-lg bg-gray-200 relative overflow-hidden cursor-pointer group"
      @click="goToPlace(place.name)"
    >
      <img
        v-if="place.images?.length"
        :src="typeof place.images[0] === 'string' ? place.images[0] : URL.createObjectURL(place.images[0])"
        alt="Place image"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div class="absolute bottom-2 left-2 text-white font-semibold text-sm drop-shadow-lg">
        {{ place.name }}
      </div>
      <div class="absolute bottom-2 right-2 text-white font-semibold text-sm drop-shadow-lg">
        ⬆️ {{ place.upvotes }}
      </div>
    </div>
  </div>
</div>
</div>

</template>
<script setup lang="ts">
import { usePlaces } from '@/modules/places/usePlaces'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { getPlaces, places } = usePlaces()
const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('All')
const showSuggestions = ref(false)

onMounted(() => {
  getPlaces()
})

const filteredPlaces = computed(() => {
  if (!places.value) return []

  let filtered = places.value

  const matchesCategory = (placeTags: string[], category: string) => {
  return placeTags.some(tag => tag.toLowerCase() === category.toLowerCase())
}

if (selectedCategory.value !== 'All') {
  filtered = filtered.filter(place => matchesCategory(place.tags, selectedCategory.value))
}

  if (searchQuery.value.length >= 3) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(place =>
      place.name.toLowerCase().includes(query) ||
      place.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const goToPlace = (placeName: string) => {
  router.push(`/place/${encodeURIComponent(placeName)}`)
  showSuggestions.value = false
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  searchQuery.value = ''
  showSuggestions.value = false
}

const mostRatedPlaces = computed(() => {
  if (!places.value) return []

  return [...places.value]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 6)
})
</script>
