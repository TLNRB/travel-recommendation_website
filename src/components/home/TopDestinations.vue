<template>
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
