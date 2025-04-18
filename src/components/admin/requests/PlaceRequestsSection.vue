<template>
   <section>
      <h2 class="text-xl font-semibold">Place Requests</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <PlaceRequestCard v-if="placeRequests" v-for="(place, index) in placeRequests" :key="index" :place="place"
            @edit="handleEdit" />
         <div v-else class="text-gray-500">No place requests yet.</div>

         <!-- Edit Card -->
         <PlaceRequestEditModal v-if="showEditModal" :place="placesStore.getPlaceById(editPlaceRequestId!)"
            :recommendations="recommendations" :error="placesStore.getUpdateError" :loading="placesStore.getIsLoading" @submit="handleUpdatePlaceRequest"
            @close="handleClose" />
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import PlaceRequestCard from '@/components/admin/requests/PlaceRequestCard.vue';
import PlaceRequestEditModal from '@/components/admin/requests/PlaceRequestEditModal.vue';
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { Place, EditPlaceRequest } from '@/interfaces/placeTypes'

const placesStore = usePlacesStore();
const recommendationsStore = useRecommendationsStore();
const authStore = useAuthStore();

const placeRequests = computed(() => placesStore.filterPlacesByApproved(false));

//===== Edit ===== //
// Get recommendations for editing
const recommendations = computed(() => {
   if (editPlaceRequestId.value !== null) {
      return recommendationsStore.getRecommendationsByPlaceId(editPlaceRequestId.value);
   }
   return [];
});

// Edit Modal
const showEditModal = ref<boolean>(false);
const editPlaceRequestId = ref<string | null>(null);

const handleEdit = (placeId: string) => {
   editPlaceRequestId.value = placeId;
   showEditModal.value = true;
};

const handleClose = () => {
   showEditModal.value = false;
   editPlaceRequestId.value = null;

};

const handleUpdatePlaceRequest = async (updatedPlace: EditPlaceRequest, placeId: string): Promise<void> => {
   const placeData: Partial<Place> = {
      ...updatedPlace,
      upvotes: placesStore.getPlaceById(editPlaceRequestId.value!).upvotes,
      _createdBy: placesStore.getPlaceById(editPlaceRequestId.value!)._createdBy
   }

   try {
      await placesStore.updatePlace(placeId, placeData, authStore.getToken!);

      if (!placesStore.getUpdateError) {
         handleClose();
      }

   } catch (error) {
      console.error('Error updating place request:', error);
   }
};


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