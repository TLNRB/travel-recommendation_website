<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">
         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Add New Collection</h2>

         <form @submit.prevent="submit">
            <div class="space-y-4">
               <!-- Collection Name -->
               <div>
                  <label class="block text-sm font-medium mb-1">Collection Name</label>
                  <input v-model="newCollection.name" type="text" placeholder="Collection Name" required
                     class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Visibility -->
               <div>
                  <label class="block text-sm font-medium mb-1">Visibility</label>
                  <select v-model="newCollection.visible" required
                     class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none cursor-pointer">
                     <option :value="true">Public</option>
                     <option :value="false">Private</option>
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
                  <div v-if="newCollection.places!.length > 0" class="space-y-2">
                     <div v-for="(place, index) in newCollection.places" :key="place._id"
                        class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                        <div class="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
                           <img :src="place.images?.[0]" alt="Place image" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1">
                           <p class="text-sm font-medium text-gray-800 truncate">{{ place.name }}</p>
                           <p class="text-xs text-gray-500">
                              📍 {{ place.location?.city ? place.location.city + ', ' : '' }}
                              {{ place.location?.country }}, {{ place.location?.continent }}
                           </p>
                        </div>
                        <button type="button" @click="removePlace(index)"
                           class="text-red-500 hover:text-red-700 text-xl leading-none font-bold px-2 cursor-pointer">&times;</button>
                     </div>
                  </div>

                  <p v-if="placeError" class="text-red-500 text-sm mt-1 italic">{{ placeError }}</p>
               </div>
            </div>

            <!-- Error -->
            <div v-if="props.addError" class="mt-4 text-red-500 text-sm italic">{{ props.addError }}</div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-3">
               <button type="button" @click="close"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm duration-200 ease-in-out cursor-pointer">Cancel</button>
               <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm duration-200 ease-in-out cursor-pointer">
                  <span v-if="props.loading" class="loader"></span>
                  <span v-else>Save</span>
               </button>
            </div>
         </form>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// Interfaces
import type { Collection } from '@/interfaces/collectionTypes'
import type { Place } from '@/interfaces/placeTypes'
// Stores
import { usePlacesStore } from '@/stores/crud/placesStore'

const placesStore = usePlacesStore()

const props = defineProps({
   loading: { type: Boolean, default: false },
   userId: { type: String, required: true },
   addError: { type: [String, null], default: null }
})

//-- Add
const newCollection = ref<Collection>({
   _createdBy: props.userId,
   name: '',
   places: [],
   visible: true
})

// Add Place
const availablePlaces = computed(() => placesStore.filterPlacesByApproved(true));
const selectedPlace = ref<Place | null>(null)
const placeError = ref<string | null>(null)

const addPlace = () => {
   if (selectedPlace.value === null) return

   // Check if the selected place is already in the collection
   const alreadyAdded = newCollection.value.places?.find((place) => place._id === selectedPlace.value?._id)
   if (alreadyAdded) {
      placeError.value = 'This place is already added.'
      return
   }

   newCollection.value.places?.push(selectedPlace.value)
   selectedPlace.value = null
   placeError.value = null
}

const removePlace = (index: number) => {
   newCollection.value.places?.splice(index, 1)
   placeError.value = null
}

//-- Emits
const emit = defineEmits(['submit', 'close'])

const close = () => emit('close')

const submit = () => {
   emit('submit', newCollection.value)
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
