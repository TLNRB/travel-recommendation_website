<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-y-auto">
         <!-- Close -->
         <button @click="close" class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl">&times;</button>

         <h2 class="text-xl font-semibold mb-4">Edit Collection</h2>

         <form @submit.prevent="submit">
            <div class="space-y-4">
               <!-- Name -->
               <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <input v-model="editCollection.name" type="text" required
                     class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Visibility -->
               <div>
                  <label class="block text-sm font-medium mb-1">Visibility</label>
                  <select v-model="editCollection.visible" required class="w-full px-3 py-2 border rounded-lg bg-white">
                     <option value="true">Public</option>
                     <option value="false">Private</option>
                  </select>
               </div>

               <!-- Add Places -->
               <div>
                  <label class="block text-sm font-medium mb-1">Add Places</label>
                  <div class="flex gap-2 items-center mb-2">
                     <select v-model="selectedPlace" class="w-full px-3 py-2 border rounded-lg bg-white">
                        <option disabled value="">Select a place</option>
                        <option v-for="place in availablePlaces" :key="place._id" :value="place">
                           {{ place.name }}
                        </option>
                     </select>
                     <button type="button" @click="addPlace"
                        class="h-[40px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer duration-[.25s] ease-in-out">
                        Add
                     </button>
                  </div>

                  <!-- Display Selected Places -->
                  <div v-if="editCollection.places!.length > 0" class="space-y-2">
                     <div v-for="(place, index) in editCollection.places" :key="index"
                        class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                        <div class="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
                           <img :src="typeof place === 'object' ? place.images?.[0] as string : ''" alt="Place image"
                              class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1">
                           <p class="text-sm font-medium text-gray-800 truncate">{{ typeof place === 'object' ?
                              place.name : '' }}</p>
                           <p class="text-xs text-gray-500">
                              📍 {{ typeof place === 'object' && place.location?.city ? place.location.city + ', ' : ''
                              }}
                              {{ typeof place === 'object' ? place.location?.country : '' }}, {{ typeof place ===
                                 'object' ?
                                 place.location?.continent : '' }}
                           </p>
                        </div>
                        <button type="button" @click="removePlace(index)"
                           class="text-red-500 hover:text-red-700 text-xl leading-none font-bold px-2 cursor-pointer">&times;</button>
                     </div>
                  </div>

                  <p v-if="placeError" class="text-red-500 text-sm mt-1 italic">{{ placeError }}</p>
               </div>
            </div>

            <!-- Display error -->
            <div v-if="props.updateError" class="mt-4 text-red-500 text-sm italic">{{ props.updateError }}</div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
               <button type="button" @click="close"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm duration-200 ease-in-out cursor-pointer">Cancel</button>
               <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm duration-200 ease-in-out cursor-pointer">
                  <span v-if="props.loading" class="loader">
                  </span>
                  <span v-else>Save</span>
               </button>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'
// Interfaces
import type { AddCollection, Collection } from '@/interfaces/collectionTypes'
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore'

const placesStore = usePlacesStore()

const props = defineProps({
   collection: { type: Object as PropType<Collection>, required: true },
   userId: { type: String, required: true },
   updateError: { type: [String, null], default: null },
   loading: { type: Boolean, default: false }
})

//-- Edit
console.log('Edit Collection:', props.collection)
const editCollection = ref<AddCollection>({
   _createdBy: props.userId,
   name: props.collection.name,
   places: [...props.collection.places!] as any,
   visible: props.collection.visible
})

// Add Place
const availablePlaces = computed(() => placesStore.filterPlacesByApproved(true));
const selectedPlace = ref<any>(null)
const placeError = ref<string | null>(null)

const addPlace = () => {
   if (selectedPlace.value === null) return

   // Check if the selected place is already in the collection
   const alreadyAdded = editCollection.value.places?.find((place) => typeof place === 'object' ? place._id === selectedPlace.value?._id : place === selectedPlace.value?._id)
   if (alreadyAdded) {
      placeError.value = 'This place is already added.'
      return
   }

   editCollection.value.places?.push(selectedPlace.value)
   selectedPlace.value = null
   placeError.value = null
}

const removePlace = (index: number) => {
   editCollection.value.places?.splice(index, 1)
   placeError.value = null
}

//-- Emits
const emit = defineEmits(['close', 'submit'])

const close = () => {
   emit('close')
}

const submit = () => {
   emit('submit', editCollection.value, props.collection._id, props.userId)
}

onMounted(async () => {
   await placesStore.fetchPlaces();
})
</script>

<style scoped>
.loader {
   border: 3px solid #f3f3f3;
   border-top: 3px solid #3498db;
   border-radius: 50%;
   width: 16px;
   height: 16px;
   animation: spin 1s linear infinite;
   display: flex;
   justify-content: center;
   align-items: center;
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