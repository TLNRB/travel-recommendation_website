<template>
  <div class="container-fluid bg-green-200 h-96 flex flex-col justify-between">
    <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16">
      {{ singlePlace?.name || 'Place' }}
    </h1>
    <RouterLink class="ms-16 w-16" :to="`/city/${cityId}`">🔙</RouterLink>
  </div>

  <div class="container-fluid flex justify-center md:justify-end md:pe-4 bg-green-200">
    <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
      Recommendations
    </div>
  </div>

  <div v-if="loading" class="p-4">Loading place...</div>
  <div v-else-if="error" class="text-red-500 p-4">{{ error }}</div>
  <div v-else-if="singlePlace" class="p-4">
    <h2 class="text-xl font-semibold mb-2">{{ singlePlace.description }}</h2>
    <p>City: {{ singlePlace.location.city }}</p>
    <p>Country: {{ singlePlace.location.country }}</p>
    <div class="mt-4 grid grid-cols-2 gap-4">
      <img
        v-for="(img, idx) in singlePlace.images"
        :key="idx"
        :src="img"
        alt="Place image"
        class="w-full h-40 object-cover rounded"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePlaces } from '@/modules/places/usePlaces';

const route = useRoute();
const { getPlaceByName, singlePlace, loading, error } = usePlaces();

const placeName = route.params.id as string;
const cityId = route.query.cityId as string;


onMounted(() => {
  getPlaceByName(placeName);
});
</script>

