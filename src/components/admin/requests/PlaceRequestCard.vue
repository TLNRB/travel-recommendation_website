<template>
   <div class="bg-white shadow-md rounded-2xl p-6 space-y-4">
      <!-- Title -->
      <div>
         <h3 class="text-xl font-bold text-gray-800">{{ place.name }}</h3>
         <p class="text-sm text-gray-500">{{ place.description }}</p>
      </div>

      <!-- Image -->
      <div v-if="place.images?.length">
         <img :src="place.images[0]" alt="Place image" class="w-full h-48 object-cover rounded-lg border" />
      </div>

      <!-- Location -->
      <div class="text-sm text-gray-600 space-y-1">
         <p>
            <strong>Location:</strong>
            {{ place.location.street }} {{ place.location.streetNumber }},
            {{ place.location.city }}, {{ place.location.country }}
            ({{ place.location.continent }})
         </p>
      </div>

      <!-- Tags & Upvotes -->
      <div class="flex justify-between items-center">
         <div class="flex flex-wrap gap-1">
            <span v-for="(tag, index) in place.tags" :key="index"
               class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
               {{ tag }}
            </span>
         </div>
         <div class="text-gray-500 text-sm font-medium">
            👍 {{ place.upvotes }}
         </div>
      </div>

      <!-- Recommendation -->
      <div v-if="place.recommendation" class="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
         <p class="line-clamp-3">
            {{ place.recommendation }}
         </p>
      </div>

      <!-- Actions & Status -->
      <div class="flex justify-between items-center pt-3 border-t text-sm">
         <span :class="place.approved ? 'text-green-600' : 'text-yellow-500'" class="font-medium text-xs">
            {{ place.approved ? 'Approved' : 'Pending Approval' }}
         </span>

         <!-- Dropdown Actions -->
         <div class="relative">
            <button @click="toggleMenu(index)"
               class="w-[28px] h-[28px] rounded-full border-[1px] border-gray-200 text-gray-800 hover:bg-gray-200 duration-[.15s] ease-in cursor-pointer"
               :class="activeMenuId === index ? 'bg-gray-200' : 'bg-gray-100'">
               ⋮
            </button>
            <div v-if="activeMenuId === index"
               class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
               <button @click=""
                  class="block w-full text-left px-4 py-2 text-sm text-green-600  hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer">
                  Approve
               </button>
               <button @click=""
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer">
                  Reject
               </button>
               <button @click=""
                  class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer">
                  Edit
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const { place, index } = defineProps(['place', 'index']);

// State for dropdown menu visibility
const activeMenuId = ref<string | null>(null)

// Toggle the dropdown menu
const toggleMenu = (id: string): void => {
   // If the same menu is clicked, it closes, otherwise it opens
   activeMenuId.value = activeMenuId.value === id ? null : id
   console.log(activeMenuId.value)
}

</script>