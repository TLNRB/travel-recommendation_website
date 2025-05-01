<template>
   <div class="bg-white shadow-md rounded-2xl p-6 space-y-4 flex flex-col">
      <div class="flex items-start justify-between">
         <!-- Country Info -->
         <div>
            <h3 class="text-xl font-bold text-gray-800">{{ props.country.name ? props.country.name : props.country }}
            </h3>
         </div>
         <!-- Dropdown Actions -->
         <div v-if="props.tab == 'Unused'" class="relative dropdown-actions">
            <button @click="toggleMenu(props.country._id)"
               class="w-[28px] h-[28px] rounded-full border-[1px] border-gray-200 text-gray-800 hover:bg-gray-200 duration-[.15s] ease-in cursor-pointer"
               :class="activeMenuId === props.country._id ? 'bg-gray-200' : 'bg-gray-100'">
               ⋮
            </button>
            <div v-if="activeMenuId === props.country._id"
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
         <button v-else @click="editEvent"
            class="text-blue-600 text-sm hover:text-blue-800 font-medium duration-200 ease-in-out cursor-pointer">
            Edit
         </button>
      </div>

      <!-- Image -->
      <div v-if="props.country.images?.length">
         <img :src="props.country.images[0].url" :alt="props.country.images[0].alt"
            class="w-full h-48 object-cover rounded-lg border" />
      </div>
      <!-- Placeholder when there is no image -->
      <div v-else
         class="w-full h-48 bg-gray-100 rounded-lg border border-dashed border-gray-400 flex items-center justify-center">
         <span class="text-gray-400 text-sm italic">No Image Available</span>
      </div>


      <!-- Display error -->
      <div v-if="props.deleteError && tab == 'Unused'" class="mt-4 text-red-500 text-sm italic">{{ props.deleteError }}
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
   country: { type: [Object, String], required: true },
   tab: { type: String, required: true },
   deleteError: { type: [String, null], default: null },
});

//-- Emits
const emit = defineEmits(['delete', 'edit']);

const deleteEvent = () => {
   emit('delete', props.country._id);
   activeMenuId.value = null;
}

const editEvent = () => {
   emit('edit', props.country.name ? props.country.name : props.country);
   activeMenuId.value = null;
}

//-- Dropdown
const activeMenuId = ref<string | null>(null)

const toggleMenu = (key: string): void => {
   activeMenuId.value = activeMenuId.value === key ? null : key
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
