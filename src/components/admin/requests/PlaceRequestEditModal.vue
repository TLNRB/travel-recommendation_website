<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
         <!-- Close button -->
         <button @click="emitClose"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Edit Item</h2>

         <form @submit.prevent="submit">
            <div class="space-y-4">
               <!-- Name -->
               <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <input v-model="editPlaceRequest.name" type="text" required
                     class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Description -->
               <div>
                  <label class="block text-sm font-medium mb-1">Description</label>
                  <textarea v-model="editPlaceRequest.description" rows="3" required
                     class="w-full px-3 py-2 border rounded-lg"></textarea>
               </div>

               <!-- Location fields -->
               <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Continent</label>
                     <select v-model="editPlaceRequest.location.continent"
                        class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none">
                        <option value="" disabled>Select Continent</option>
                        <option v-for="continent in continents" :key="continent" :value="continent" :class="[
                           'py-2',
                           editPlaceRequest.location.continent === continent
                              ? 'bg-gray-200 font-semibold'
                              : 'bg-white'
                        ]">
                           {{ continent }}
                        </option>
                     </select>
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Country</label>
                     <input v-model="editPlaceRequest.location.country" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">City</label>
                     <input v-model="editPlaceRequest.location.city" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Street</label>
                     <input v-model="editPlaceRequest.location.street" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Street Number</label>
                     <input v-model="editPlaceRequest.location.streetNumber" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
               </div>

               <!-- Tags -->
               <div>
                  <label class="block text-sm font-medium mb-1">Tags</label>

                  <div v-for="(tag, index) in editPlaceRequest.tags" :key="index"
                     class="flex items-center gap-2 mb-2 duration-200 ease-in-out cursor-pointer">
                     <input v-model="editPlaceRequest.tags[index]" type="text" required
                        class="w-full px-3 py-2 border rounded-lg duration-200 ease-in-out cursor-pointer"
                        placeholder="Tag" />
                     <button type="button" @click="removeTag(index)"
                        class="text-red-500 hover:text-red-700 px-2 duration-200 ease-in-out cursor-pointer"
                        title="Remove tag">
                        &times;
                     </button>
                  </div>

                  <button type="button" @click="addTag"
                     class="mt-1 text-blue-600 text-sm hover:underline duration-200 ease-in-out cursor-pointer">
                     + Add Tag
                  </button>
               </div>

               <!-- Approved -->
               <div class="flex items-center mt-4">
                  <input v-model="editPlaceRequest.approved" type="checkbox" id="approved"
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                  <label for="approved" class="pl-2 text-sm font-medium cursor-pointer">Approved</label>
               </div>
            </div>

            <!-- Display error -->
            <div v-if="error" class="mt-4 text-red-500 text-sm italic">{{ error }}</div>

            <div class="mt-6 flex justify-end gap-3">
               <button type="button" @click="emit('close')"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm duration-200 ease-in-out cursor-pointer">Cancel</button>
               <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm duration-200 ease-in-out cursor-pointer">
                  <span v-if="loading" class="loader">
                  </span>
                  <span v-else>Save</span>
               </button>
            </div>
         </form>

         <div class="mt-8">
            <h3 class="text-lg font-medium mb-2">Recommendations</h3>
            <ul v-if="recommendations?.length" class="space-y-2">
               <li v-for="recommendation in recommendations" :key="recommendation._id"
                  class="bg-gray-50 p-3 rounded-md flex justify-between items-center text-sm">
                  <!-- title -->
                  <div class="flex flex-col gap-1">
                     <span class="text-gray-500 text-xs">@{{ recommendation._createdBy.username }}</span>
                     <span class="mt-1 font-semibold text-gray-700">{{ recommendation.title }}</span>
                     <span class="line-clamp-2">{{ recommendation.content }}</span>
                  </div>
                  <button type="button" @click="emit('delete-recommendation', recommendation._id)"
                     class="text-red-500 hover:text-red-700 flex justify-center items-center mb-auto text-[20px] w-[20px] h-[20px] duration-200 ease-in-out cursor-pointer"
                     title="Remove tag">
                     &times;
                  </button>
               </li>
            </ul>
            <div v-else class="p-3 mt-4 bg-gray-50 rounded-md text-gray-500 text-sm italic">No recommendations
               available.</div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { EditPlace } from '@/interfaces/placeTypes'

const props = defineProps({
   place: { type: Object, required: true },
   recommendations: { type: Array, default: () => [] },
   error: { type: String, default: null },
   loading: { type: Boolean, default: false },
})

//-- Edit
const continents = [
   'Africa',
   'Asia',
   'Europe',
   'North America',
   'South America',
   'Oceania',
   'Antarctica',
]

const editPlaceRequest = ref<EditPlace>({
   name: props.place.name,
   images: [...props.place.images],
   description: props.place.description,
   location: {
      continent: props.place.location.continent,
      country: props.place.location.country,
      city: props.place.location.city,
      street: props.place.location.street,
      streetNumber: props.place.location.streetNumber
   },
   tags: [...props.place.tags],
   approved: props.place.approved,
})

const addTag = () => {
   editPlaceRequest.value.tags.push('')
}

const removeTag = (index: number) => {
   editPlaceRequest.value.tags.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['close', 'submit'])

const emitClose = () => {
   emit('close')
}

const submit = () => {
   emit('submit', editPlaceRequest.value, props.place._id)
}
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