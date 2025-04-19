<template>
   <section>
      <h2 class="text-xl font-semibold">Approved Places</h2>
      <div v-if="placesStore.getIsLoading" class="flex justify-center items-center h-32">
         <span class="loader"></span>
      </div>
      <div v-else-if="placesStore.getError" class="text-red-500 text-center h-32">
         {{ placesStore.getError }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <PlaceCard v-if="places" v-for="(place, index) in places" :key="index" :place="place" @edit="handleEdit" />
         <div v-else class="text-gray-500">No places to display.</div>

         <!-- Edit Card -->
         <PlaceEditModal v-if="showEditModal" :place="placesStore.getPlaceById(editPlaceId!)"
            :error="placesStore.getUpdateError" :loading="placesStore.getIsLoading" @submit="handleUpdatePlace"
            @close="handleClose" />
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import PlaceCard from '@/components/admin/places/PlaceCard.vue';
import PlaceEditModal from '@/components/admin/places/PlaceEditModal.vue';
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { Place, EditPlace } from '@/interfaces/placeTypes'

const placesStore = usePlacesStore();
const authStore = useAuthStore();

const places = computed(() => placesStore.filterPlacesByApproved(true));

//-- Edit 
// Edit Modal
const showEditModal = ref<boolean>(false);
const editPlaceId = ref<string | null>(null);

const handleEdit = (placeId: string) => {
   editPlaceId.value = placeId;
   showEditModal.value = true;
};

const handleClose = () => {
   showEditModal.value = false;
   editPlaceId.value = null;
   placesStore.clearErrors();

};

const handleUpdatePlace = async (updatedPlace: EditPlace, placeId: string): Promise<void> => {
   const placeData: Place = {
      ...updatedPlace,
      upvotes: placesStore.getPlaceById(editPlaceId.value!)!.upvotes,
      _createdBy: placesStore.getPlaceById(editPlaceId.value!)!._createdBy
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