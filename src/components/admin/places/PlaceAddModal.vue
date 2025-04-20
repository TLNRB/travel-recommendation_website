<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Add New Place</h2>

         <form @submit.prevent="submit">
            <div class="space-y-4">
               <!-- Name -->
               <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <input v-model="newPlace.name" type="text" placeholder="Place Name" required
                     class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Description -->
               <div>
                  <label class="block text-sm font-medium mb-1">Description</label>
                  <textarea v-model="newPlace.description" rows="3" placeholder="Place Description" required
                     class="w-full px-3 py-2 border rounded-lg"></textarea>
               </div>

               <!-- Location fields -->
               <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Continent</label>
                     <select v-model="newPlace.location.continent" required
                        class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none cursor-pointer">
                        <option value="" disabled>Select Continent</option>
                        <option v-for="continent in continents" :key="continent" :value="continent"
                           class="cursor-pointer" :class="[
                              'py-2',
                              newPlace.location.continent === continent
                                 ? 'bg-gray-200 font-semibold'
                                 : 'bg-white'
                           ]">
                           {{ continent }}
                        </option>
                     </select>
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Country</label>
                     <input v-model="newPlace.location.country" type="text" placeholder="Country" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">City</label>
                     <input v-model="newPlace.location.city" type="text" placeholder="City" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Street</label>
                     <input v-model="newPlace.location.street" type="text" placeholder="Street Name" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Street Number</label>
                     <input v-model="newPlace.location.streetNumber" type="text" placeholder="Street Number" required
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
               </div>

               <!-- Upvotes -->
               <div>
                  <label class="block text-sm font-medium mb-1">Upvotes</label>
                  <input v-model="newPlace.upvotes" type="number" min="0" class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Tags -->
               <div>
                  <label class="block text-sm font-medium mb-1">Tags</label>
                  <div v-for="(tag, index) in newPlace.tags" :key="index"
                     class="flex items-center gap-2 mb-2 duration-200 ease-in-out cursor-pointer">
                     <input v-model="newPlace.tags[index]" type="text" required
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
                  <input v-model="newPlace.approved" type="checkbox" id="approved"
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                  <label for="approved" class="pl-2 text-sm font-medium cursor-pointer">Approved</label>
               </div>
            </div>

            <div v-if="props.addError" class="mt-4 text-red-500 text-sm italic">{{ props.addError }}</div>

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
import { ref } from 'vue'
import type { EditPlace } from '@/interfaces/placeTypes'

const props = defineProps({
   loading: { type: Boolean, default: false },
   addError: { type: String, default: null }
})

const continents = [
   'Africa', 'Asia', 'Europe', 'North America',
   'South America', 'Oceania', 'Antarctica',
]

//-- Add
const newPlace = ref<EditPlace>({
   name: '',
   images: [],
   description: '',
   location: {
      continent: '',
      country: '',
      city: '',
      street: '',
      streetNumber: ''
   },
   upvotes: 0,
   tags: [],
   approved: false
})

const addTag = () => {
   newPlace.value.tags.push('')
}

const removeTag = (index: number) => {
   newPlace.value.tags.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['submit', 'close'])

const close = () => emit('close')
const submit = () => emit('submit', newPlace.value)
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
