<template>
  <div v-if="loading" class="flex justify-center items-center h-screen">
    <div class="text-2xl animate-pulse">Loading...</div>
  </div>

  <div v-else>
    <!-- Header -->
    <div class="container-fluid bg-green-200 h-96 flex flex-col justify-between">
      <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16">
        {{ continent?.name }}
      </h1>
      <RouterLink class="ms-16 w-16" to="/">🔙</RouterLink>
    </div>

    <div class="container-fluid flex justify-center md:justify-end md:pe-4 bg-green-200">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Browse countries..."
        class="mb-4 me-4 md:mt-0 md:ml-4 px-4 py-2 text-black rounded-lg border border-gray-600 focus:outline-none w-full md:max-w-sm"
      />
    <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
      Most Popular Countries
    </div>

  </div>


  <div class="min-h-[40vh] bg-gray-100">
  <div v-if="noResults" class="flex justify-center items-center h-[40vh] text-2xl text-gray-600">
    No results found
  </div>

  <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 mx-auto container-fluid">
    <RouterLink
      v-for="country in displayedCountries"
      :key="country.objectId"
      :to="`/country/${country.objectId}`"
      class="my-10 mx-auto w-28 h-40 md:w-40 md:h-64 2xl:w-54 2xl:h-72 bg-green-600 rounded-lg flex flex-col items-center justify-center text-white"
    >
      <div class="text-3xl">{{ country.emoji }}</div>
      <div class="mt-2 text-center">{{ country.name }}</div>
    </RouterLink>
  </div>
</div>

  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { externalAPI } from '@/modules/api/externalFetch';

const { fetchContinentAndCountries, continent, allCountries, popularCountries, loading } = externalAPI()

const route = useRoute()
const continentId = ref(route.params.id as string)

onMounted(() => {
  fetchContinentAndCountries(continentId.value)
})

watch(
  () => route.params.id,
  (newId) => {
    continentId.value = newId as string
    fetchContinentAndCountries(continentId.value)
  }
)

const searchTerm = ref('')

const displayedCountries = computed(() => {
  if (searchTerm.value.length >= 3) {
    return allCountries.value.filter(c =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  return popularCountries.value
})

const noResults = computed(() => {
  return searchTerm.value.length >= 3 && displayedCountries.value.length === 0
})


</script>



