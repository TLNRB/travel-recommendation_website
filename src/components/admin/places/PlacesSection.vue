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

         <!-- Edit Card -->
         <PlaceEditModal v-if="showEditModal" :place="placesStore.getPlaceById(editPlaceId!)"
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
import PlaceEditModal from '@/components/admin/places/PlaceEditModal.vue';
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { Place, EditPlace } from '@/interfaces/placeTypes'

const placesStore = usePlacesStore();
const authStore = useAuthStore();

const places = computed(() => placesStore.filterPlacesByApproved(true));

//-- Add Place
const showAddModal = ref<boolean>(false);

const handleAdd = () => {
   showAddModal.value = true;
};

const handleCloseAdd = () => {
   showAddModal.value = false;
   placesStore.clearErrors();
};

const handleAddPlace = async (newPlace: EditPlace): Promise<void> => {
   const placeData: Place = {
      ...newPlace,
      _createdBy: authStore.getUserId!,
   };

   try {
      await placesStore.addPlace(placeData, authStore.getToken!);

      if (!placesStore.getAddError) {
         handleCloseAdd();
      }
   } catch (err) {
      console.error('Error adding place request:', err);
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
   const placeData: Place = {
      ...updatedPlace,
      _createdBy: placesStore.getPlaceById(editPlaceId.value!)!._createdBy
   }

   try {
      await placesStore.updatePlace(placeId, placeData, authStore.getToken!);

      if (!placesStore.getUpdateError) {
         handleCloseEdit();
      }

   } catch (err) {
      console.error('Error updating place request:', err);
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
      console.error('Error deleting place request:', err);
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