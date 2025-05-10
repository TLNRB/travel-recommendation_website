<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->
      <div class="my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">
         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Add Recommendation To Place</h2>

         <form @submit.prevent="submit">
            <div class="space-y-4">
               <!-- Name -->
               <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <!-- I want a disabld look here -->

                  <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.name }}</div>
               </div>

               <!-- Description -->
               <div>
                  <label class="block text-sm font-medium mb-1">Description</label>
                  <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.description }}</div>
               </div>

               <!-- Images -->
               <div>
                  <label class="block text-sm font-medium mb-1">Images</label>
                  <div class="flex flex-wrap gap-3 mb-2">
                     <div v-for="(img, index) in props.place.images" :key="index"
                        class="relative w-24 h-24 rounded overflow-hidden border opacity-50">
                        <img :src="(img as string)" alt="Place Image" class="w-full h-full object-cover" />
                     </div>
                  </div>
               </div>

               <!-- Location fields -->
               <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Continent</label>
                     <div class="w-full px-3 py-2 border rounded-lg opacity-50">
                        {{ props.place.location.continent }}
                     </div>
                  </div>
                  <div>
                     <label class="block text-sm font-medium mb-1">Country</label>
                     <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.location.country }}</div>
                  </div>
                  <div v-if="props.place.location.city">
                     <label class="block text-sm font-medium mb-1">City</label>
                     <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.location.city }}</div>
                  </div>
                  <div v-if="props.place.location.street" class="col-span-2">
                     <label class="block text-sm font-medium mb-1">Street</label>
                     <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.location.street }}</div>
                  </div>
                  <div v-if="props.place.location.streetNumber !== ''">
                     <label class="block text-sm font-medium mb-1">Street Number</label>
                     <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.location.streetNumber }}
                     </div>
                  </div>
               </div>

               <!-- Upvotes -->
               <div v-if="canManagePlaces">
                  <label class="block text-sm font-medium mb-1">Upvotes</label>
                  <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{ props.place.upvotes }}</div>
               </div>

               <!-- Tags -->
               <div v-if="props.place.tags.length > 0">
                  <label class="block text-sm font-medium mb-1">Tags</label>
                  <div v-for="(tag, index) in props.place.tags" :key="index" class="flex items-center gap-2 mb-2">
                     <div class="w-full px-3 py-2 border rounded-lg opacity-50">{{
                        props.place.tags[index] }}</div>
                  </div>
               </div>

               <!-- Approved -->
               <div v-if="canManagePlaces" class="flex items-center mt-4 opacity-50">
                  <input v-model="props.place.approved" disabled type="checkbox" id="approved"
                     class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label for="approved" class="pl-2 text-sm font-medium">Approved</label>
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
import type { PropType } from 'vue'
// Interfaces
import type { AddRecommendation } from '@/interfaces/recommendationTypes'
import type { Place } from '@/interfaces/placeTypes'
// Store
import { useUserStore } from '@/stores/userStore'
import { useRolesStore } from '@/stores/rolesStore'

const userStore = useUserStore()
const rolesStore = useRolesStore()

// Get the permission Id for the ability to edit places / requests
const permissionIdPlaces = computed((): string | null => rolesStore.getPermissionIdByPermissionName('content:managePlaces'));

// Check if the user has the permission to manage plcaes
const canManagePlaces = computed(() => {
   const userRole = userStore.getUser!.role as { permissions: string[] };
   if (!permissionIdPlaces.value) return false; // No permission Id found

   return userRole.permissions.includes(permissionIdPlaces.value);
})

const props = defineProps({
   place: { type: Object as PropType<Place>, required: true },
   recommendation: { type: Object as PropType<AddRecommendation>, required: true },
   loading: { type: Boolean, default: false },
   addError: { type: [String, null], default: null }
})

//-- Add
// Recommendation
const showRecommendation = ref<boolean>(true)
const toggleRecommendation = () => {
   showRecommendation.value = !showRecommendation.value
}
const recommendation = ref<AddRecommendation>({
   title: props.recommendation.title,
   content: props.recommendation.content,
   dateOfVisit: props.recommendation.dateOfVisit,
   rating: props.recommendation.rating,
   upvotes: props.recommendation.upvotes,
})

//-- Emits
const emit = defineEmits(['submit', 'close'])

const close = () => emit('close')
const submit = () => {
   emit('submit', props.place._id, showRecommendation.value ? recommendation.value : null)
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
