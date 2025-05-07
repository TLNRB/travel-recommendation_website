<template>
   <div v-if="props.collection.visible || authStore.isLoggedIn && authStore.getUserId === route.params.id"
      :class="activeCollection === collection._id ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50' : ''">
      <div class="" @click="toggleCollection(collection._id)"
         :class="activeCollection === collection._id ? 'my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll' : 'bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer'">
         <!-- Collection Info -->
         <div class=" flex justify-between items-center mb-2">
            <h3 class="text-base font-semibold text-gray-800 truncate">{{ props.collection.name }}</h3>
            <span v-if="authStore.isLoggedIn && authStore.getUserId === route.params.id"
               class="text-xs px-2 py-0.5 rounded-full"
               :class="props.collection.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">
               {{ props.collection.visible ? 'Public' : 'Private' }}
            </span>
         </div>

         <!-- Places Preview (stacked) -->
         <div class="flex flex-col gap-2">
            <div v-if="props.collection.places!.length > 0"
               v-for="(place, index) in props.collection.places!.slice(0, 2)" :key="index"
               class="flex items-center gap-3">
               <div class="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
                  <img :src="place.images?.[0]" alt="Place image" class="w-full h-full object-cover" />
               </div>
               <div class="text-sm text-gray-700">
                  <p class="font-medium text-gray-800 truncate">{{ place.name }}</p>
                  <p class="text-xs text-gray-500">
                     📍 {{ place.location?.city ? place.location.city + ', ' : '' }}
                     {{ place.location?.country }}, {{ place.location?.continent }}
                  </p>
               </div>
            </div>
            <div v-else class="text-gray-500 text-sm">No places in this collection.
            </div>
         </div>

         <!-- More Places Count -->
         <div v-if="props.collection.places!.length > 2" class="text-xs text-gray-500 mt-2">
            +{{ props.collection.places!.length - 2 }} more place(s)
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// Stores
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

//-- Router
const route = useRoute()

//-- Props
const props = defineProps({
   collection: { type: Object, required: true }
})

const activeCollection = ref<string | null>(null)
const toggleCollection = (collectionId: string) => {
   if (activeCollection.value === collectionId) {
      activeCollection.value = null
   } else {
      activeCollection.value = collectionId
   }
}
</script>

<style scoped></style>