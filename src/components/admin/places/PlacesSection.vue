<template>
   <section>
      <h2 class="text-xl font-semibold">Approved Places</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
   const placeData: Partial<Place> = {
      ...updatedPlace,
      upvotes: placesStore.getPlaceById(editPlaceId.value!).upvotes,
      _createdBy: placesStore.getPlaceById(editPlaceId.value!)._createdBy
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