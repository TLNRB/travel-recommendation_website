<template>
   <section>
      <h2 class="text-xl font-semibold">Place Requests</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <PlaceRequestCard v-if="placeRequests" v-for="(place, index) in placeRequests" :key="index" :place="place"
            :recommendationsStore="recommendationsStore" />
         <div v-else class="text-gray-500">No place requests yet.</div>
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import PlaceRequestCard from '@/components/admin/requests/PlaceRequestCard.vue';
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';

const placesStore = usePlacesStore();
const recommendationsStore = useRecommendationsStore();

const placeRequests = computed(() => placesStore.filterPlacesByApproved(true));

onMounted(async () => {
   await placesStore.fetchPlaces();
   await recommendationsStore.fetchRecommendations();

   /* for (const place of placesStore.places) {
      if (place.approved) {
         try {
            await recommendationsStore.fetchRecommendationsByPlace(place._id);
         } catch (error) {
            console.error(`Error fetching recommendations for place ${place._id}:`, error);
         }
      }
   }; */
});
</script>