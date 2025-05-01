<template>
  <!-- HERO Section -->
<div class="relative h-[60vh] w-full overflow-hidden">
  <!-- Background Image -->
  <img
    v-if="singlePlace?.images?.length"
    :src="singlePlace.images[0]"
    alt="Place hero image"
    class="absolute inset-0 w-full h-full object-cover brightness-75"
  />

  <!-- Title and Back button -->
  <div class="relative z-10 flex flex-col justify-center items-start h-full px-8 md:px-16">
    <h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">
      {{ singlePlace?.name || 'Place' }}
    </h1>
  </div>

  <RouterLink
      class="absolute bottom-4 left-4 md:left-16 z-20 mt-4 px-4 py-2 bg-white text-green-600 font-semibold rounded hover:bg-green-100 transition"
      :to="`/city/${cityId}`"
    >
      🔙 Back
    </RouterLink>

  <!-- Recommendations badge -->
  <div class="absolute bottom-0 right-4 z-20">
    <div class="text-black px-16 py-3 rounded-t-xl bg-white">
        Recommendations
      </div>
  </div>
</div>


  <!-- RECOMMENDATIONS Header -->


  <!-- CONTENT Section -->
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-8">
    <div v-if="loading" class="text-center text-gray-500 text-lg">Loading place...</div>

    <div v-else-if="error" class="text-center text-red-500 text-lg">{{ error }}</div>

    <div v-else-if="singlePlace">
      <!-- Place Info -->
      <div class="bg-white rounded-xl shadow p-6 mb-8">
        <h2 class="text-2xl font-bold text-green-800 mb-4">{{ singlePlace.name }}</h2>
        <p class="text-gray-700 mb-4">{{ singlePlace.description }}</p>
        <div class="flex flex-col md:flex-row md:space-x-8 text-gray-600 text-sm">
          <p><strong>City:</strong> {{ singlePlace.location.city }}</p>
          <p><strong>Country:</strong> {{ singlePlace.location.country }}</p>
          <p><strong>Street:</strong> {{ singlePlace.location.street }} {{ singlePlace.location.streetNumber }}</p>
        </div>
      </div>

      <!-- Gallery -->
      <div>
        <h3 class="text-xl font-semibold text-green-800 mb-4">Gallery</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <img
            v-for="(img, idx) in singlePlace.images"
            :key="idx"
            :src="img"
            alt="Gallery image"
            class="w-full h-64 object-cover rounded-xl shadow"
          />
        </div>
      </div>
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

// undefined from homepage problem to fix

const cityId = route.query.cityId as string;


onMounted(() => {
  getPlaceByName(placeName);
});
</script>

