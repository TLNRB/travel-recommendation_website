<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->
      <div class="my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">
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

               <!-- Images -->
               <div>
                  <label class="block text-sm font-medium mb-1">
                     Images
                     <span class="text-xs text-gray-500 font-normal mt-1 italic">(You must upload at least one
                        image.)</span>
                  </label>
                  <input type="file" multiple @change="handleImageUpload"
                     class="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                  <div v-if="newPlace.images.length > 0" class="flex flex-wrap gap-2 mt-2">
                     <div v-for="(image, index) in newPlace.images" :key="index"
                        class="text-xs px-2 py-1 bg-gray-100 rounded">
                        {{ typeof image === 'string' ? image : image.name }}
                        <span type="button" @click="removeImage(index)"
                           class="text-red-500 hover:text-red-700 pl-1 duration-200 ease-in-out cursor-pointer"
                           title="Remove image">
                           &times;
                        </span>
                     </div>
                  </div>
                  <!-- Image Error -->
                  <div v-if="imageError || newPlace.images.length === 0" class="mt-2 text-red-500 text-sm italic">{{
                     imageError }}</div>
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
                     <label class="block text-sm font-medium mb-1">
                        City
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="newPlace.location.city" type="text" placeholder="City"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">
                        Street
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="newPlace.location.street" type="text" placeholder="Street Name"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">
                        Street Number
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="newPlace.location.streetNumber" type="text" placeholder="Street Number"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
               </div>

               <!-- Upvotes -->
               <div v-if="canManagePlaces">
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
               <div v-if="canManagePlaces" class="flex items-center mt-4">
                  <input v-model="newPlace.approved" type="checkbox" id="approved"
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                  <label for="approved" class="pl-2 text-sm font-medium cursor-pointer">Approved</label>
               </div>

               <!-- Recommendation -->
               <div class="mt-6 border-t pt-4">
                  <h3 class="text-lg font-medium mb-2">Recommendation</h3>
                  <div v-if="showRecommendation" class="space-y-4">
                     <div>
                        <label class="block text-sm font-medium mb-1">Title</label>
                        <input v-model="recommendation.title" :required="showRecommendation" type="text"
                           placeholder="Recommendation Title" class="w-full px-3 py-2 border rounded-lg" />
                     </div>
                     <div>
                        <label class="block text-sm font-medium mb-1">Content</label>
                        <textarea v-model="recommendation.content" :required="showRecommendation" rows="3"
                           placeholder="What do you recommend?" class="w-full px-3 py-2 border rounded-lg"></textarea>
                     </div>
                     <div>
                        <label class="block text-sm font-medium mb-1">Date of Visit</label>
                        <input v-model="recommendation.dateOfVisit" :required="showRecommendation" type="date"
                           class="w-full px-3 py-2 border rounded-lg" />
                     </div>
                     <div>
                        <label class="block text-sm font-medium mb-1">Rating (1-5)</label>
                        <input v-model="recommendation.rating" :required="showRecommendation" type="number" min="1"
                           max="5" class="w-full px-3 py-2 border rounded-lg" />
                     </div>
                  </div>
                  <button type="button" @click="toggleRecommendation"
                     class="mt-2  text-sm hover:underline duration-200 ease-in-out cursor-pointer" :class="{
                        'text-red-600': showRecommendation,
                        'text-blue-600': !showRecommendation
                     }">
                     {{ showRecommendation ? '- Remove Recommendation' : '+ Add Recommendation' }}
                  </button>
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
import { ref, computed } from 'vue'
import type { AddPlace } from '@/interfaces/placeTypes'
import type { AddRecommendation } from '@/interfaces/recommendationTypes'
// Store
import { useUserStore } from '@/stores/userStore'
import { useRolesStore } from '@/stores/rolesStore'
// Data
import { continents } from '@/data/continents.json'

const userStore = useUserStore()
const rolesStore = useRolesStore()

// Get the permission Id for the ability to edit places / requests
const permissionIdPlaces = computed((): string | null => rolesStore.getPermissionIdByPermissionName('content:managePlaces'));

// Check if the user has the permission to manage plcaes
const canManagePlaces = computed(() => {
   const userRole = userStore.getUser!.role;
   if (!permissionIdPlaces.value) return false; // No permission Id found

   return userRole.permissions.includes(permissionIdPlaces.value);
})

const props = defineProps({
   loading: { type: Boolean, default: false },
   addError: { type: [String, null], default: null }
})

//-- Add
const imageError = ref<string | null>(null)

const newPlace = ref<AddPlace>({
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

// Recommendation
const showRecommendation = ref<boolean>(false)
const toggleRecommendation = () => {
   showRecommendation.value = !showRecommendation.value
}
const recommendation = ref<AddRecommendation>({
   title: '',
   content: '',
   dateOfVisit: '',
   rating: 0,
   upvotes: 0,
})

// Image Upload
const handleImageUpload = (event: Event) => {
   const target = event.target as HTMLInputElement

   const files = target.files

   if (!files || files.length === 0) return

   // Check and create an array of the selected image names to avoid duplicates
   const existingNames = new Set(newPlace.value.images.map((image: File | string) => typeof image === 'string' ? image : image.name))

   const duplicateFiles: string[] = [] // Array to store duplicate file names
   const newFiles: File[] = [] // Array to store new files

   // Check for duplicates and add new files to the newFiles array
   Array.from(files).forEach((file: File) => {
      if (existingNames.has(file.name)) {
         duplicateFiles.push(file.name)
      } else {
         newFiles.push(file)
      }
   })

   if (duplicateFiles.length > 0) {
      imageError.value = `Duplicate file: ${duplicateFiles.join(', ')}`
      return
   } else {
      imageError.value = null // Clear error if no duplicates
   }

   newPlace.value.images = [...newPlace.value.images, ...newFiles]
}

// Remove Image
const removeImage = (index: number) => {
   newPlace.value.images.splice(index, 1);
   imageError.value = null;
}

// Tags
const addTag = () => {
   newPlace.value.tags.push('')
}

const removeTag = (index: number) => {
   newPlace.value.tags.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['submit', 'close'])

const close = () => emit('close')
const submit = () => {
   if (!newPlace.value.images || newPlace.value.images.length === 0) {
      imageError.value = 'You must upload at least one image.'
      return
   }

   if (newPlace.value.location.city === '') {
      delete newPlace.value.location.city
   }
   if (newPlace.value.location.street === '') {
      delete newPlace.value.location.street
   }
   if (newPlace.value.location.streetNumber === '') {
      delete newPlace.value.location.streetNumber
   }

   emit('submit', newPlace.value, showRecommendation.value ? recommendation.value : null)
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
