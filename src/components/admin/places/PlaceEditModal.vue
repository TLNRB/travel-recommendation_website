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
                  <input v-model="editPlace.name" type="text" required class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Description -->
               <div>
                  <label class="block text-sm font-medium mb-1">Description</label>
                  <textarea v-model="editPlace.description" rows="3" required
                     class="w-full px-3 py-2 border rounded-lg"></textarea>
               </div>

               <!-- Location fields -->
               <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Continent</label>
                     <select v-model="editPlace.location.continent"
                        class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none">
                        <option value="" disabled>Select Continent</option>
                        <option v-for="continent in continents" :key="continent" :value="continent" :class="[
                           'py-2',
                           editPlace.location.continent === continent
                              ? 'bg-gray-200 font-semibold'
                              : 'bg-white'
                        ]">
                           {{ continent }}
                        </option>
                     </select>
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Country</label>
                     <input v-model="editPlace.location.country" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">City</label>
                     <input v-model="editPlace.location.city" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Street</label>
                     <input v-model="editPlace.location.street" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Street Number</label>
                     <input v-model="editPlace.location.streetNumber" type="text" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
               </div>

               <!-- Tags -->
               <div>
                  <label class="block text-sm font-medium mb-1">Tags</label>

                  <div v-for="(tag, index) in editPlace.tags" :key="index"
                     class="flex items-center gap-2 mb-2 duration-200 ease-in-out cursor-pointer">
                     <input v-model="editPlace.tags[index]" type="text" required
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
                  <input v-model="editPlace.approved" type="checkbox" id="approved"
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                  <label for="approved" class="pl-2 text-sm font-medium cursor-pointer">Approved</label>
               </div>
            </div>

            <!-- Display error -->
            <div v-if="props.error" class="mt-4 text-red-500 text-sm italic">{{ props.error }}</div>

            <div class="mt-6 flex justify-end gap-3">
               <button type="button" @click="emit('close')"
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
import { ref } from 'vue'
import type { EditPlace } from '@/interfaces/placeTypes'

const props = defineProps({
   place: { type: Object, required: true },
   recommendations: { type: Array, default: () => [] },
   error: { type: String, default: null },
   loading: { type: Boolean, default: false },
})

//--Edit
const continents = [
   'Africa',
   'Asia',
   'Europe',
   'North America',
   'South America',
   'Oceania',
   'Antarctica',
]

const editPlace = ref<EditPlace>({
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
   editPlace.value.tags.push('')
}

const removeTag = (index: number) => {
   editPlace.value.tags.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['close', 'submit'])

const emitClose = () => {
   emit('close')
}

const submit = () => {
   emit('submit', editPlace.value, props.place._id)
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