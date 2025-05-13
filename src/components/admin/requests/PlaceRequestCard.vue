<template>
   <div class="bg-white shadow-md rounded-2xl p-6 space-y-4 flex flex-col">
      <!-- Title -->
      <div>
         <h3 class="text-xl font-bold text-gray-800">{{ props.place.name }}</h3>
         <p class="text-sm text-gray-500">{{ props.place.description }}</p>
      </div>

      <!-- Image -->
      <div v-if="props.place.images.length">
         <img :src="props.place.images[0] as string" :alt="`Image of ${props.place.name}`"
            class="w-full h-48 object-cover rounded-lg border" />
      </div>

      <!-- Location -->
      <div class="text-sm text-gray-600 space-y-1">
         <p>
            <strong>Location: </strong>
            <span v-if="props.place.location.street">{{ props.place.location.street }}&nbsp;</span>
            <span v-if="props.place.location.streetNumber">{{ props.place.location.streetNumber }}, </span>
            <span v-if="props.place.location.city">{{ props.place.location.city }}, </span>
            <span>{{ props.place.location.country }}&nbsp;</span>
            <span>({{ props.place.location.continent }})</span>
         </p>
      </div>

      <!-- Tags & Upvotes -->
      <div class="flex justify-between items-center">
         <div class="flex flex-wrap gap-1">
            <span v-for="(tag, index) in props.place.tags" :key="index"
               class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
               {{ tag }}
            </span>
         </div>
         <div class="text-gray-500 text-sm font-medium">
            👍 {{ props.place.upvotes.length }}
         </div>
      </div>

      <!-- Recommendations -->
      <div v-if="recommendations.length > 0 && !recommendationsStore.getIsLoading"
         class="space-y-4 bg-gray-50 p-4 rounded-md text-sm text-gray-800">
         <div v-for="recommendation in recommendations" :key="recommendation._id"
            class="p-3 bg-white rounded-md shadow-sm border border-gray-200">
            <!-- Title -->
            <h3 class="text-base font-semibold text-gray-900 mb-1">
               {{ recommendation.title }}
            </h3>

            <!-- Author and Dates -->
            <div class="text-xs text-gray-500 mb-2 flex flex-wrap justify-between gap-2">
               <span>
                  By {{ typeof recommendation._createdBy === 'object' ? recommendation._createdBy.username :
                     '' }}
               </span>
               <span class="text-[12px] font-medium text-yellow-600">
                  ⭐ {{ recommendation.rating }} / 5
               </span>
            </div>

            <!-- Content -->
            <p class="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
               {{ recommendation.content }}
            </p>
         </div>
      </div>
      <!-- Loading -->
      <div v-else-if="recommendationsStore.getIsLoading"
         class="space-y-4 bg-gray-50 p-4 rounded-md text-sm text-gray-600 italic">
         <span class="loader"></span>
      </div>

      <!-- Display error -->
      <div v-if="props.updateError" class="mt-4 text-red-500 text-sm italic">{{ props.updateError }}</div>
      <div v-else-if="props.deleteError" class="mt-4 text-red-500 text-sm italic">{{ props.deleteError }}</div>


      <!-- Actions & Status -->
      <div class="mt-auto flex justify-between items-center pt-3 border-t text-sm">
         <span :class="props.place.approved ? 'text-green-600' : 'text-yellow-500'" class="font-medium text-xs">
            {{ props.place.approved ? 'Approved' : 'Pending Approval' }}
         </span>

         <!-- Dropdown Actions -->
         <div class="relative dropdown-actions">
            <button @click="toggleMenu(props.place._id)"
               class="w-[28px] h-[28px] rounded-full border-[1px] border-gray-200 text-gray-800 hover:bg-gray-200 duration-[.15s] ease-in cursor-pointer"
               :class="activeMenuId === props.place._id ? 'bg-gray-200' : 'bg-gray-100'">
               ⋮
            </button>
            <div v-if="activeMenuId === props.place._id"
               class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
               <button @click="approve"
                  class="block w-full text-left px-4 py-2 text-sm text-green-600  hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer rounded-t-md">
                  Approve
               </button>
               <button @click="reject"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer">
                  Reject
               </button>
               <button @click="edit"
                  class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer rounded-b-md">
                  Edit
               </button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
// Interfaces
import type { EditPlace } from '@/interfaces/placeTypes'
// Stores
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore'
// Interfaces
import type { Place } from '@/interfaces/placeTypes'

const recommendationsStore = useRecommendationsStore()

const props = defineProps({
   place: { type: Object as PropType<Place>, required: true },
   updateError: { type: [String, null], default: null },
   deleteError: { type: [String, null], default: null },
});

//-- Recommendation
const recommendations = computed(() => recommendationsStore.getRecommendationsByPlaceId(props.place._id));

//-- Emits
const emit = defineEmits(['approve', 'reject', 'edit']);

const approve = () => {
   const approvedPlace = ref<EditPlace>({
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
      upvotes: [...props.place.upvotes],
      tags: [...props.place.tags],
      approved: true,
   })

   if (approvedPlace.value.location.city === '') {
      delete approvedPlace.value.location.city
   }
   if (approvedPlace.value.location.street === '') {
      delete approvedPlace.value.location.street
   }
   if (approvedPlace.value.location.streetNumber === '') {
      delete approvedPlace.value.location.streetNumber
   }

   emit('approve', approvedPlace.value, props.place._id);
   activeMenuId.value = null;
}

const reject = () => {
   emit('reject', props.place._id);
   activeMenuId.value = null;
}

const edit = () => {
   emit('edit', props.place._id);
   activeMenuId.value = null;
}

//-- Dropdown
const activeMenuId = ref<string | null>(null)

const toggleMenu = (id: string): void => {
   activeMenuId.value = activeMenuId.value === id ? null : id
}

const closeDropdown = (event: Event) => {
   if (!(event.target as HTMLElement).closest(".dropdown-actions")) {
      activeMenuId.value = null;
   }
};

onMounted(() => {
   document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
   document.removeEventListener("click", closeDropdown);
});

</script>

<style scoped>
.loader {
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