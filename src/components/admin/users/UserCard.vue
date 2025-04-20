<template>
   <div class="bg-white rounded-2xl shadow-md p-6 w-full max-w-md transition-all duration-300">
      <!-- User Info -->
      <div class="flex flex-col gap-2">
         <div class="flex justify-between items-center mb-2">
            <div class="text-lg font-semibold">
               {{ props.user.firstName }} {{ props.user.lastName }}
            </div>
            <button @click="$emit('edit', props.user._id)"
               class="text-blue-600 text-sm hover:text-blue-800 font-medium duration-200 ease-in-out cursor-pointer">
               Edit
            </button>
         </div>

         <div class="text-sm text-gray-600">@{{ props.user.username }}</div>
         <div class="text-sm text-gray-700">{{ props.user.email }}</div>

         <div class="mt-2 text-sm flex items-center">
            <span class="font-medium text-gray-800">Role:</span>

            <div class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs ml-1">
               <span v-if="props.loading">Loading...</span>
               <span v-else>{{ userRole?.name }}</span>
            </div>
         </div>

         <div class="text-sm text-gray-500">
            <span class="font-medium text-gray-800">Registered:</span>
            {{ new Date(props.user.registerDate).toLocaleDateString() }}
         </div>
      </div>

      <!-- Permissions -->
      <div class="mt-4 text-sm">
         <div v-if="props.loading">Loading...</div>
         <button v-else-if="userRole?.permissions.length > 0" @click="showPermissions = !showPermissions"
            class="text-blue-500 hover:text-blue-700 transition cursor-pointer">
            {{ showPermissions ? 'Hide' : 'Show' }} Permissions
         </button>
         <div v-else class="text-gray-500">No permissions</div>

         <transition name="expand">
            <div v-if="showPermissions" class="overflow-hidden mt-3 bg-gray-50 p-4 rounded-md text-sm">
               <div class="font-semibold text-gray-700 mb-2">
                  Permissions for: <span class="text-blue-500">{{ userRole?.name }}</span>
               </div>
               <ul class="space-y-2">
                  <li v-for="(permission, index) in userRole?.permissions" :key="index" class="flex items-start gap-2">
                     <span>-</span>
                     <div>
                        <div class="font-medium text-gray-800">{{ permission.name }}</div>
                        <div class="text-gray-600 text-xs">{{ permission.description }}</div>
                     </div>
                  </li>
               </ul>
            </div>
         </transition>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// Interfaces
import type { Role } from '@/interfaces/interfaces'

const props = defineProps({
   user: { type: Object, required: true },
   roles: { type: Array, required: true },
   loading: { type: Boolean, default: false },
});

const userRole = computed(() => props.roles.find((role) => role._id === props.user.role) as Role)

//-- Show Permissions
const showPermissions = ref(false)
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