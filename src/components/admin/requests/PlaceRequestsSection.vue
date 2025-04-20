<template>
   <section>
      <h2 class="text-xl font-semibold">Place Requests</h2>
      <!-- Loader -->
      <div v-if="placesStore.getIsLoading" class="flex justify-center items-center h-32">
         <span class="loader"></span>
      </div>
      <!-- Error Message -->
      <div v-else-if="placesStore.getError" class="text-red-500 text-center h-32">
         {{ placesStore.getError }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <PlaceRequestCard v-if="placeRequests" v-for="(place, index) in placeRequests" :key="index" :place="place"
            @edit="handleEdit" />
         <div v-else class="text-gray-500">No place requests yet.</div>

         <!-- Edit Card -->
         <PlaceRequestEditModal v-if="showEditModal" :place="placesStore.getPlaceById(editPlaceRequestId!)"
            :recommendations="recommendations" :error="placesStore.getUpdateError" :loading="placesStore.getIsLoading"
            @submit="handleUpdatePlaceRequest" @close="handleClose" />
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
import type { Place, EditPlace } from '@/interfaces/placeTypes'

const placesStore = usePlacesStore();
const recommendationsStore = useRecommendationsStore();
const authStore = useAuthStore();

const placeRequests = computed(() => placesStore.filterPlacesByApproved(false));

//-- Edit
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
   placesStore.clearErrors();

};

const handleUpdatePlaceRequest = async (updatedPlace: EditPlace, placeId: string): Promise<void> => {
   const placeData: Place = {
      ...updatedPlace,
      _createdBy: placesStore.getPlaceById(editPlaceRequestId.value!)!._createdBy
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

<style scoped>
.loader {
   border: 3px solid #afafaf;
   border-top: 3px solid #404040;
   border-radius: 50%;
   width: 18px;
   height: 18px;
   animation: spin 1s linear infinite;
   display: flex;
   margin-inline: auto;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}
</style>