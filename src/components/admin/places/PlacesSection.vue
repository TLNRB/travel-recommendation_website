<template>
   <section>
      <div class="flex justify-between items-center gap-4">
         <h2 class="text-xl font-semibold">Approved Places</h2>
         <!--  Add Place Button -->
         <button @click="handleAdd"
            class="bg-blue-600 text-sm text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition duration-200 ease-in-out cursor-pointer">
            Add Place
         </button>
      </div>
      <!-- Error Message -->
      <div v-if="placesStore.getError" class="text-red-500 text-center h-32">
         {{ placesStore.getError }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <PlaceCard v-if="places.length > 0" v-for="(place, index) in places" :key="index" :place="place"
            :deleteError="placesStore.getDeleteError" @edit="handleEdit" @delete="handleDeletePlace" />
         <div v-else class="text-gray-500">No places to display.</div>

         <!-- Add Card -->
         <PlaceAddModal v-if="showAddModal" :addError="placesStore.getAddError" :loading="placesStore.getIsLoading"
            @submit="handleAddPlace" @close="handleCloseAdd" />

         <!-- Failed Recommendation Card -->
         <PlaceRecommendationFail v-else-if="showRecommendationModal"
            :place="placesStore.getPlaceById(failedRecommendationPlaceId!)!" :recommendation="failedRecommendation!"
            :addError="recommendationsStore.getAddError" :loading="recommendationsStore.getIsLoading"
            @submit="handleAddRecommendation" @close="handleCloseAddRecommendation" />

         <!-- Edit Card -->
         <PlaceEditModal v-else-if="showEditModal" :place="placesStore.getPlaceById(editPlaceId!)!"
            :updateError="placesStore.getUpdateError" :loading="placesStore.getIsLoading" @submit="handleUpdatePlace"
            @close="handleCloseEdit" />
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import PlaceCard from '@/components/admin/places/PlaceCard.vue';
import PlaceAddModal from '@/components/admin/places/PlaceAddModal.vue';
import PlaceRecommendationFail from '@/components/admin/places/PlaceRecommendationFail.vue';
import PlaceEditModal from '@/components/admin/places/PlaceEditModal.vue';
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useAuthStore } from '@/stores/authStore';
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';
// Interfaces
import type { Place, AddPlace, EditPlace } from '@/interfaces/placeTypes'
import type { AddRecommendation, Recommendation } from '@/interfaces/recommendationTypes';

const placesStore = usePlacesStore();
const authStore = useAuthStore();
const recommendationsStore = useRecommendationsStore();

const places = computed(() => placesStore.filterPlacesByApproved(true));

//-- Add Place
const showAddModal = ref<boolean>(false);

const failedRecommendationPlaceId = ref<string | null>(null);
const failedRecommendation = ref<AddRecommendation | null>(null);
const showRecommendationModal = ref<boolean>(false);

// Place
const handleAdd = () => {
   showAddModal.value = true;
};

const handleCloseAdd = () => {
   showAddModal.value = false;
   placesStore.clearErrors();
};

const handleAddPlace = async (newPlace: AddPlace, recommendation: AddRecommendation): Promise<void> => {
   const placeData: Place = {
      ...newPlace,
      _createdBy: authStore.getUserId!,
   };

   try {
      const placeId = await placesStore.addPlace(placeData, authStore.getToken!);

      // Check if the place was added successfully
      if (placeId) {
         // If there are no recommendations, close the modal
         if (!recommendation) {
            handleCloseAddRecommendation();
         }
         // If there are recommendations, add them
         else {
            const recommendationData: Partial<Recommendation> = { // Leaving the dayOfWriting out
               ...recommendation,
               place: placeId,
               _createdBy: authStore.getUserId!,
            };

            console.log('recommendationData', recommendationData);

            await recommendationsStore.addRecommendation(recommendationData, authStore.getToken!);

            if (!recommendationsStore.getAddError) {
               console.log('Recommendation added successfully');
               // If the recommendation is added successfully, close the modal
               handleCloseAddRecommendation();
            }
            else {
               console.log('Recommendation failed to add');
               // If the recommendation fails, set the failed recommendation place's ID
               handleOpenAddRecommendation(placeId, recommendation);
            }
         }
      }

      if (!placesStore.getAddError) {
         handleCloseAdd();
      }
   } catch (err) {
      console.error('Error adding place:', err);
   }
};

// Recommendation
const handleOpenAddRecommendation = (placeId: string, recommendation: AddRecommendation) => {
   failedRecommendationPlaceId.value = placeId;
   failedRecommendation.value = recommendation;
   showRecommendationModal.value = true;
};

const handleCloseAddRecommendation = () => {
   showRecommendationModal.value = false;
   failedRecommendationPlaceId.value = null;
   failedRecommendation.value = null;
   recommendationsStore.clearErrors();
};

const handleAddRecommendation = async (placeId: string, recommendation: AddRecommendation): Promise<void> => {
   // If there are no recommendations, close the modal
   if (!recommendation) {
      handleCloseAddRecommendation();
      console.log('No recommendation provided');
   }
   else {
      const recommendationData: Partial<Recommendation> = {
         ...recommendation,
         place: failedRecommendationPlaceId.value!,
         _createdBy: authStore.getUserId!,
      };
      console.log('recommendationData', recommendationData);

      try {
         await recommendationsStore.addRecommendation(recommendationData, authStore.getToken!);

         if (!recommendationsStore.getAddError) {
            handleCloseAddRecommendation();
         }
      } catch (err) {
         console.error('Error adding recommendation:', err);
      }
   }
};


//-- Edit 
// Edit Modal
const showEditModal = ref<boolean>(false);
const editPlaceId = ref<string | null>(null);

const handleEdit = (placeId: string) => {
   editPlaceId.value = placeId;
   showEditModal.value = true;
};

const handleCloseEdit = () => {
   showEditModal.value = false;
   editPlaceId.value = null;
   placesStore.clearErrors();

};

const handleUpdatePlace = async (updatedPlace: EditPlace, placeId: string): Promise<void> => {
   const createdBy: string = placesStore.getPlaceById(placeId)!._createdBy

   try {
      await placesStore.updatePlace(placeId, updatedPlace, authStore.getToken!, createdBy);

      if (!placesStore.getUpdateError) {
         handleCloseEdit();
      }

   } catch (err) {
      console.error('Error updating place:', err);
   }
};

//-- Delete
const handleDeletePlace = async (placeId: string): Promise<void> => {
   try {
      await placesStore.deletePlace(placeId, authStore.getToken!);

      if (!placesStore.getDeleteError) {
         handleCloseEdit();
      }
   } catch (err) {
      console.error('Error deleting place:', err);
   }
}


onMounted(async () => {
   await placesStore.fetchPlaces();

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