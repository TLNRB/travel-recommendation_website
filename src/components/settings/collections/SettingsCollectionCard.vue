<template>
   <div>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 transition">
         <div class=" flex gap-3 items-center mb-2">
            <h3 class="text-base font-semibold text-gray-800 truncate mr-auto">{{ props.collection.name }}</h3>
            <!-- Collection Status -->
            <span class="text-xs px-2 py-0.5 rounded-full"
               :class="props.collection.visible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'">
               {{ props.collection.visible ? 'Public' : 'Private' }}
            </span>

            <!-- Dropdown Actions -->
            <div class="mt-auto relative dropdown-actions">
               <button @click="toggleMenu(props.collection._id)"
                  class="w-[28px] h-[28px] rounded-full border-[1px] border-gray-200 text-gray-800 hover:bg-gray-200 duration-[.15s] ease-in cursor-pointer"
                  :class="activeMenuId === props.collection._id ? 'bg-gray-200' : 'bg-gray-100'">
                  ⋮
               </button>
               <div v-if="activeMenuId === props.collection._id"
                  class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button @click="editEvent"
                     class="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer rounded-t-md">
                     Edit
                  </button>
                  <button @click="deleteEvent"
                     class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 duration-[.15s] ease-in cursor-pointer rounded-b-md">
                     Delete
                  </button>
               </div>
            </div>
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

         <!-- Display error -->
         <div v-if="props.deleteError" class="mt-4 text-red-500 text-sm italic">{{ props.deleteError }}</div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

//-- Props
const props = defineProps({
   collection: { type: Object, required: true },
   deleteError: { type: [String, null], default: null }
})

//-- Emits
const emit = defineEmits(['delete', 'edit']);

const deleteEvent = () => {
   emit('delete', props.collection._id);
   activeMenuId.value = null;
}

const editEvent = () => {
   emit('edit', props.collection._id);
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