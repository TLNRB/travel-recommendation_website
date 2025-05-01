<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->

      <div class="my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">

         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Edit Place</h2>

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

               <!-- Images -->
               <div>
                  <label class="block text-sm font-medium mb-1">
                     Images
                     <span class="text-xs text-gray-500 font-normal mt-1 italic">(You must upload at least one
                        image.)</span>
                  </label>
                  <div class="flex flex-wrap gap-3 mb-2">
                     <div v-for="(img, index) in editPlace.images" :key="index"
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

                  <div v-if="editPlace.newImages!.length > 0" class="flex flex-wrap gap-2 mt-2">
                     <div v-for="(image, index) in editPlace.newImages" :key="index"
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
                  <div v-if="imageError || editPlace.newImages!.length === 0" class="mt-2 text-red-500 text-sm italic">
                     {{ imageError }}
                  </div>
               </div>

               <!-- Location fields -->
               <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Continent</label>
                     <select v-model="editPlace.location.continent"
                        class="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none cursor-pointer">
                        <option value="" disabled>Select Continent</option>
                        <option v-for="continent in continents" :key="continent" :value="continent"
                           class="cursor-pointer" :class="[
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
                  <div><label class="block text-sm font-medium mb-1">
                        City
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="editPlace.location.city" type="text" placeholder="City"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div><label class="block text-sm font-medium mb-1">
                        Street
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="editPlace.location.street" type="text" placeholder="Street Name"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">
                        Street Number
                        <span class="text-xs text-gray-500 font-normal mt-1 italic">(Optional)</span>
                     </label>
                     <input v-model="editPlace.location.streetNumber" type="text" placeholder="Street Number"
                        class="w-full px-3 py-2 border rounded-lg" />
                  </div>
               </div>

               <!-- Upvotes -->
               <div>
                  <label class="block text-sm font-medium mb-1">Upvotes</label>
                  <input v-model="editPlace.upvotes" type="number" required min="0"
                     class="w-full px-3 py-2 border rounded-lg" />
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
            <div v-if="props.updateError" class="mt-4 text-red-500 text-sm italic">{{ props.updateError }}</div>

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
import { ref } from 'vue'
// Components
import type { EditPlace } from '@/interfaces/placeTypes'
// Data
import { continents } from '@/data/continents.json'

const props = defineProps({
   place: { type: Object, required: true },
   recommendations: { type: Array, default: () => [] },
   updateError: { type: [String, null], default: null },
   loading: { type: Boolean, default: false },
})

//-- Edit
const editPlace = ref<EditPlace>({
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
   const existingNames = new Set(editPlace.value.newImages?.map((image: File) => image.name))

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

   editPlace.value.newImages = [...editPlace.value.newImages!, ...newFiles]
}


const removeImage = (index: number) => {
   editPlace.value.images.splice(index, 1)
}

const removeNewImage = (index: number) => {
   editPlace.value.newImages!.splice(index, 1)
}

// Tags
const addTag = () => {
   editPlace.value.tags.push('')
}

const removeTag = (index: number) => {
   editPlace.value.tags.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['close', 'submit'])

const close = () => {
   emit('close')
}

const submit = () => {
   if (editPlace.value.location.city === '') {
      delete editPlace.value.location.city
   }
   if (editPlace.value.location.street === '') {
      delete editPlace.value.location.street
   }
   if (editPlace.value.location.streetNumber === '') {
      delete editPlace.value.location.streetNumber
   }

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
