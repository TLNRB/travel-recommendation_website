g<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->
      <div
         class="my-auto h-fit bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">
         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">
            Edit Country Images
         </h2>

         <div class="flex items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">
               {{ typeof props.country === 'object' && props.country ? props.country.name : props.country }}
            </h3>
         </div>

         <form @submit.prevent="submit">

            <!-- Images -->
            <div>
               <label class="block text-sm font-medium mb-1">
                  Images
                  <span class="text-xs text-gray-500 font-normal mt-1 italic">(You must upload at least one
                     image.)</span>
               </label>
               <div class="flex flex-wrap gap-3 mb-2">
                  <div v-for="(img, index) in editCountryImage.images" :key="index"
                     class="relative w-24 h-24 rounded overflow-hidden border">
                     <img :src="(img.url as string)" :alt="img.alt" class="w-full h-full object-cover" />
                     <button type="button" @click="removeImage(index)"
                        class="absolute top-0 right-0 bg-red-500/90 rounded-bl  text-white text-xs px-1 cursor-pointer"
                        title="Remove image">
                        &times;
                     </button>
                  </div>
               </div>

               <input type="file" multiple @change="handleImageUpload"
                  class="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />

               <div v-if="editCountryImage.newImages!.length > 0" class="flex flex-wrap gap-2 mt-2">
                  <div v-for="(image, index) in editCountryImage.newImages" :key="index"
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
               <div v-if="imageError || editCountryImage.newImages!.length === 0"
                  class="mt-2 text-red-500 text-sm italic">
                  {{ imageError }}
               </div>
            </div>

            <!-- Display error -->
            <div v-if="props.addError" class="mt-4 text-red-500 text-sm italic">{{ props.addError }}</div>
            <div v-else-if="props.updateError" class="mt-4 text-red-500 text-sm italic">{{ props.updateError }}</div>

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
import type { PropType } from 'vue'
// Interfaces
import type { CountryImage, EditCountryImage } from '@/interfaces/countryImageTypes'

const props = defineProps({
   country: { type: [Object, String] as PropType<CountryImage | string>, required: true },
   addError: { type: [String, null], default: null },
   updateError: { type: [String, null], default: null },
   loading: { type: Boolean, default: false },
})

//-- Edit
const editCountryImage = ref<EditCountryImage>({
   name: typeof props.country === 'object' && props.country ? props.country.name : props.country,
   images: typeof props.country === 'object' && props.country ? [...props.country.images] : [],
   newImages: []
})

// Image Upload
const imageError = ref<string | null>(null)

const handleImageUpload = (event: Event) => {
   const target = event.target as HTMLInputElement

   const files = target.files

   if (!files || files.length === 0) return

   // Check and create an array of the selected image names to avoid duplicates
   const existingNames = new Set(editCountryImage.value.newImages?.map((image: File) => image.name))

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

   editCountryImage.value.newImages = [...editCountryImage.value.newImages!, ...newFiles]
}


const removeImage = (index: number) => {
   editCountryImage.value.images.splice(index, 1)
}

const removeNewImage = (index: number) => {
   editCountryImage.value.newImages!.splice(index, 1)
}

//-- Emits
const emit = defineEmits(['close', 'submit'])

const close = () => {
   emit('close')
}

const submit = () => {
   if ((!editCountryImage.value.images || editCountryImage.value.images.length === 0) && (!editCountryImage.value.newImages || editCountryImage.value.newImages.length === 0)) {
      imageError.value = 'You must upload at least one image.'
      return
   }

   emit('submit', editCountryImage.value, typeof props.country === 'object' && props.country ? props.country._id : '')
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