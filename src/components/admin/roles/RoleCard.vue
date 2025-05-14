<template>
   <div class="bg-white rounded-2xl shadow-md p-6 w-full max-w-md transition-all duration-300">
      <!-- User Role Info -->
      <div class="flex flex-col gap-2">
         <div class="flex justify-between items-center mb-2">
            <div class="text-lg font-semibold">
               {{ props.role.name }}
            </div>

            <!-- Base Role Badge -->
            <span v-if="isBaseRole"
               class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
               Base Role
            </span>

            <!-- Dropdown Actions -->
            <div v-else class="relative dropdown-actions">
               <button @click="toggleMenu(props.role._id)"
                  class="w-[28px] h-[28px] rounded-full border-[1px] border-gray-200 text-gray-800 hover:bg-gray-200 duration-[.15s] ease-in cursor-pointer"
                  :class="activeMenuId === props.role._id ? 'bg-gray-200' : 'bg-gray-100'">
                  ⋮
               </button>
               <div v-if="activeMenuId === props.role._id"
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

         <ul v-if="props.role.permissions.length" class="space-y-2">
            <li v-for="(permission, index) in props.role.permissions" :key="index">
               <div v-if="typeof permission === 'object'" class="flex items-start gap-2">
                  <span>-</span>
                  <div>
                     <div class="font-medium text-sm text-gray-800">{{ permission.name }} </div>
                     <div class="text-gray-600 text-xs">{{ permission.description }}</div>
                  </div>
               </div>
               <div v-else class="flex items-start gap-2">
                  <span>-</span>
                  <div class="text-gray-800">{{ permission }}</div>
               </div>
            </li>
         </ul>
         <div v-else class="text-gray-500 text-sm">No permissions</div>

         <!-- Display error -->
         <div v-if="props.deleteError" class="mt-4 text-red-500 text-sm italic">{{ props.deleteError }}</div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
// Interfaces
import type { Role } from '@/interfaces/roleTypes'
// Data
import { baseRoles } from '@/data/baseRoles.json'

const props = defineProps({
   role: { type: Object as PropType<Role>, required: true },
   loading: { type: Boolean, default: false },
   deleteError: { type: [String, null], default: null }
});

// Check if the role is a base role
const isBaseRole = computed(() => {
   return baseRoles.some((baseRole) => baseRole === props.role.name);
});

//-- Emits
const emit = defineEmits(['delete', 'edit']);

const deleteEvent = () => {
   emit('delete', props.role._id);
   activeMenuId.value = null;
}

const editEvent = () => {
   emit('edit', props.role._id);
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
.fade-enter-active,
.fade-leave-active {
   transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
   opacity: 0;
}
</style>