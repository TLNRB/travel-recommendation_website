<template>
   <section>
      <h2 class="text-xl font-semibold">Place Requests</h2>
      <!-- Error Message -->
      <div v-if="placesStore.getError" class="text-red-500 text-center h-32">
         {{ placesStore.getError }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <PlaceRequestCard v-if="placeRequests.length > 0" v-for="(place, index) in placeRequests" :key="index"
            :place="place" @edit="handleEdit" @approve="handleUpdatePlaceRequest" @reject="handleDeletePlaceRequest"
            :updateError="placesStore.getUpdateError" :deleteError="placesStore.getDeleteError" />
         <div v-else class="text-gray-500">No place requests to display.</div>

         <!-- Edit Card -->
         <PlaceRequestEditModal v-if="showEditModal" :place="placesStore.getPlaceById(editPlaceRequestId!)!"
            :recommendations="recommendations" :updateError="placesStore.getUpdateError"
            :deleteError="recommendationsStore.getDeleteError" :placeLoading="placesStore.getIsLoading"
            :recommendationLoading="recommendationsStore.getIsLoading" @submit="handleUpdatePlaceRequest"
            @close="handleClose" @delete-recommendation="handleDeleteRecommendation" />
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
import type { EditPlace } from '@/interfaces/placeTypes'

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
   recommendationsStore.clearErrors();

};

const handleUpdatePlaceRequest = async (updatedPlace: EditPlace, placeId: string): Promise<void> => {
   const createdBy: string = placesStore.getPlaceById(placeId)!._createdBy as string;

   try {
      await placesStore.updatePlace(placeId, updatedPlace, authStore.getToken!, createdBy);

      if (!placesStore.getUpdateError) {
         handleClose();
      }

   } catch (err) {
      console.error('Error updating place request:', err);
   }
};

//-- Delete 
// Delete Place Request
const handleDeletePlaceRequest = async (placeId: string): Promise<void> => {
   try {
      await placesStore.deletePlace(placeId, authStore.getToken!);

      if (!placesStore.getDeleteError) {
         handleClose();
      }
   } catch (err) {
      console.error('Error deleting place request:', err);
   }
}


// Delete Recommendation
const handleDeleteRecommendation = async (recommendationId: string, placeId: string): Promise<void> => {
   try {
      await recommendationsStore.deleteRecommendation(recommendationId, authStore.getToken!, placeId);
   }
   catch (err) {
      console.error('Error deleting recommendation:', err);
   }
}


onMounted(async () => {
   await placesStore.fetchPlaces();
   await recommendationsStore.fetchRecommendations(false, 'true');
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