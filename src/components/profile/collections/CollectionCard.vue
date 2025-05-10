<template>
   <div v-if="props.collection.visible || authStore.isLoggedIn && authStore.getUserId === route.params.id"
      :class="activeCollection === collection._id ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50' : ''">
      <div @click="openCollection(collection._id, props.collection.places!.length)"
         :class="[activeCollection === collection._id ? 'my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll' : 'bg-white rounded-2xl shadow-sm border border-gray-200 p-4 transition', props.collection.places!.length > 2 ? 'hover:shadow-md cursor-pointer' : '']">
         <!-- Collection Info -->
         <div class=" flex gap-3 items-center mb-2">
            <h3 class="text-base font-semibold text-gray-800 truncate mr-auto">{{ props.collection.name }}</h3>
            <span v-if="authStore.isLoggedIn && authStore.getUserId === route.params.id"
               class="text-xs px-2 py-0.5 rounded-full"
               :class="props.collection.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">
               {{ props.collection.visible ? 'Public' : 'Private' }}
            </span>
            <button v-if="activeCollection === collection._id" @click.stop="activeCollection = null"
               class="text-gray-400 hover:text-red-700 text-xl translate-y-[-2px] duration-200 ease-in-out cursor-pointer">
               &times;
            </button>
         </div>

         <!-- Normal Place Display -->
         <div v-if="activeCollection !== collection._id">
            <!-- Places Preview (stacked) -->
            <div class="flex flex-col gap-2">
               <div v-if="props.collection.places!.length > 0"
                  v-for="(place, index) in props.collection.places!.slice(0, 2)" :key="index"
                  class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
                     <img :src="typeof place === 'object' ? place.images?.[0] as string : ''" alt="Place image"
                        class="w-full h-full object-cover" />
                  </div>
                  <div class="text-sm text-gray-700">
                     <p class="font-medium text-gray-800 truncate">{{ typeof place === 'object' ? place.name : '' }}</p>
                     <p class="text-xs text-gray-500">
                        📍 {{ typeof place === 'object' && place.location?.city ? place.location.city + ', ' : '' }}
                        {{ typeof place === 'object' && place.location?.country }}, {{ typeof place === 'object' ?
                           place.location?.continent : '' }}
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

         <!-- Large Place Display -->
         <div v-else class="mt-4 flex flex-col gap-3">
            <!-- TODO: link to place page -->
            <RouterLink to="/settings" v-if="props.collection.places!.length > 0"
               v-for="(place, index) in props.collection.places" :key="index" class="flex items-center gap-3">
               <div class="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0">
                  <img :src="typeof place === 'object' ? place.images?.[0] as string : ''" alt="Place image"
                     class="w-full h-full object-cover" />
               </div>
               <div class="text-sm text-gray-700">
                  <p class="font-medium text-gray-800 truncate">{{ typeof place === 'object' ? place.name : '' }}</p>
                  <p class="text-xs text-gray-500">
                     📍 {{ typeof place === 'object' && place.location?.city ? place.location.city + ', ' : '' }}
                     {{ typeof place === 'object' ? place.location?.country : '' }}, {{ typeof place === 'object' ?
                        place.location?.continent : '' }}
                  </p>
               </div>
            </RouterLink>
            <div v-else class="text-gray-500 text-sm">No places in this collection.
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
import { useRoute } from 'vue-router'
// Stores
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { Collection } from '@/interfaces/collectionTypes';

const authStore = useAuthStore();

//-- Router
const route = useRoute()

//-- Props
const props = defineProps({
   collection: { type: Object as PropType<Collection>, required: true }
})

const activeCollection = ref<string | null>(null)

const openCollection = (collectionId: string, placesLength: number) => {
   if (placesLength <= 2) return

   else {
      activeCollection.value = collectionId
   }
}
</script>

<style scoped></style>