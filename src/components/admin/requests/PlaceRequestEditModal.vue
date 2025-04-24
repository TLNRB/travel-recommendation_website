<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->
      <div class="my-8 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">
         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Edit Place Request</h2>

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

               <!-- Images -->
               <div>
                  <label class="block text-sm font-medium mb-1">
                     Images
                     <span class="text-xs text-gray-500 font-normal mt-1 italic">(You must upload at least one
                        image.)</span>
                  </label>
                  <div class="flex flex-wrap gap-3 mb-2">
                     <div v-for="(img, index) in editPlaceRequest.images" :key="index"
                        class="relative w-24 h-24 rounded overflow-hidden border">
                        <img :src="(img as string)" alt="Place Image" class="w-full h-full object-cover" />
                        <button type="button" @click="removeImage(index)"
                           class="absolute top-0 right-0 bg-red-500/90 rounded-bl  text-white text-xs px-1 cursor-pointer"
                           title="Remove image">
                           &times;
                        </button>
                     </div>
                  </div>

                  <input type="file" multiple @change="handleImageUpload"
                     class="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />

                  <div v-if="editPlaceRequest.newImages!.length > 0" class="flex flex-wrap gap-2 mt-2">
                     <div v-for="(image, index) in editPlaceRequest.newImages" :key="index"
                        class="text-xs px-2 py-1 bg-gray-100 rounded">
                        {{ typeof image === 'string' ? image : image.name }}
                        <span type="button" @click="removeNewImage(index)"
                           class="text-red-500 hover:text-red-700 pl-1 duration-200 ease-in-out cursor-pointer"
                           title="Remove image">
                           &times;
                        </span>
                     </div>
                  </div>
                  <!-- Image Error -->
                  <div v-if="imageError || editPlaceRequest.newImages!.length === 0"
                     class="mt-2 text-red-500 text-sm italic">
                     {{ imageError }}
                  </div>
               </div>

               <!-- Location fields -->
               <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Continent</label>
                     <select v-model="editPlaceRequest.location.continent"
                        class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none cursor-pointer">
                        <option value="" disabled>Select Continent</option>
                        <option v-for="continent in continents" :key="continent" :value="continent"
                           class="cursor-pointer" :class="[
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
                     <label class="block text-sm font-medium mb-1">
                        City
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="editPlaceRequest.location.city" type="text" placeholder="City"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">
                        Street
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="editPlaceRequest.location.street" type="text" placeholder="Street Name"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">
                        Street Number
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="editPlaceRequest.location.streetNumber" type="text" placeholder="Street Number"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
               </div>

               <!-- Upvotes -->
               <div>
                  <label class="block text-sm font-medium mb-1">Upvotes</label>
                  <input v-model="editPlaceRequest.upvotes" type="number" required min="0"
                     class="w-full px-3 py-2 border rounded-lg" />
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
            <div v-if="props.updateError" class="mt-4 text-red-500 text-sm italic">{{ props.updateError }}</div>

            <div class="mt-6 flex justify-end gap-3">
               <button type="button" @click="close"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm duration-200 ease-in-out cursor-pointer">Cancel</button>
               <button type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm duration-200 ease-in-out cursor-pointer">
                  <span v-if="props.placeLoading" class="loader">
                  </span>
                  <span v-else>Save</span>
               </button>
            </div>
         </form>

         <div class="mt-8">
            <h3 class="text-lg font-medium mb-2">Recommendations</h3>
            <ul v-if="recommendations?.length > 0" class="space-y-2">
               <li v-if="!recommendationLoading" v-for="recommendation in recommendations" :key="recommendation?._id"
                  class="bg-gray-50 p-3 rounded-md flex justify-between items-center text-sm">
                  <!-- title -->
                  <div class="flex flex-col gap-1">
                     <span class="text-gray-500 text-xs">@{{ recommendation?._createdBy.username }}</span>
                     <span class="mt-1 font-semibold text-gray-700">{{ recommendation?.title }}</span>
                     <span class="line-clamp-2">{{ recommendation.content }}</span>
                  </div>
                  <button type="button" @click="deleteRecommendation(recommendation?._id)"
                     class="text-red-500 hover:text-red-700 flex justify-center items-center mb-auto text-[20px] w-[20px] h-[20px] duration-200 ease-in-out cursor-pointer"
                     title="Remove tag">
                     &times;
                  </button>
               </li>
               <!-- Loading -->
               <div v-else-if="recommendationLoading" class="space-y-4 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                  <span class="recommendationLoader"></span>
               </div>
               <!-- Error -->
               <div v-if="props.deleteError" class="mt-4 text-red-500 text-sm italic">{{ props.deleteError }}</div>
            </ul>
            <div v-else class="p-3 mt-4 bg-gray-50 rounded-md text-gray-500 text-sm italic">No recommendations
               available.</div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Components
import type { EditPlace } from '@/interfaces/placeTypes'
// Data
import { continents } from '@/data/continents.json'

const props = defineProps({
   place: { type: Object, required: true },
   recommendations: { type: Array, default: () => [] }, // Fresh empty array in default to prevent shared state 
   updateError: { type: String, default: null },
   placeLoading: { type: Boolean, default: false },
   recommendationLoading: { type: Boolean, default: false },
})

//-- Edit
const editPlaceRequest = ref<EditPlace>({
   name: props.place.name,
   images: [...props.place.images],
   newImages: [],
   description: props.place.description,
   location: {
      continent: props.place.location.continent,
      country: props.place.location.country,
      city: props.place.location.city,
      street: props.place.location.street,
      streetNumber: props.place.location.streetNumber
   },
   upvotes: props.place.upvotes,
   tags: [...props.place.tags],
   approved: props.place.approved,
})

// Image Upload
const imageError = ref<string | null>(null)

const handleImageUpload = (event: Event) => {
   const target = event.target as HTMLInputElement

   const files = target.files

   if (!files || files.length === 0) return

   // Check and create an array of the selected image names to avoid duplicates
   const existingNames = new Set(editPlaceRequest.value.newImages?.map((image: File) => image.name))

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

   editPlaceRequest.value.newImages = [...editPlaceRequest.value.newImages!, ...newFiles]
}


const removeImage = (index: number) => {
   editPlaceRequest.value.images.splice(index, 1)
}

const removeNewImage = (index: number) => {
   editPlaceRequest.value.newImages!.splice(index, 1)
}

// Tags
const addTag = () => {
   editPlaceRequest.value.tags.push('')
}

const removeTag = (index: number) => {
   editPlaceRequest.value.tags.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['close', 'submit', 'delete-recommendation'])

const close = () => {
   emit('close')
}

const submit = () => {
   if (editPlaceRequest.value.location.city === '') {
      delete editPlaceRequest.value.location.city
   }
   if (editPlaceRequest.value.location.street === '') {
      delete editPlaceRequest.value.location.street
   }
   if (editPlaceRequest.value.location.streetNumber === '') {
      delete editPlaceRequest.value.location.streetNumber
   }

   emit('submit', editPlaceRequest.value, props.place._id)
}

const deleteRecommendation = (recommendationId: string) => {
   emit('delete-recommendation', recommendationId, props.place._id)
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

.recommendationLoader {
   border: 3px solid #afafaf;
   border-top: 3px solid #404040;
   border-radius: 50%;
   width: 16px;
   height: 16px;
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