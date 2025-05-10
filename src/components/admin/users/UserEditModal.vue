<template>
   <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transition-all duration-300 ease-in-out scale-100">
         <!-- Modal Header -->
         <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Edit User Role</h2>
            <button @click="close"
               class="text-gray-500 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer">&times;</button>
         </div>

         <!-- User Info Display -->
         <div class="mb-4">
            <p class="text-sm text-gray-700"><span class="font-medium">Name:</span> {{ props.user.firstName }} {{
               user.lastName }}</p>
            <p class="text-sm text-gray-700"><span class="font-medium">Username:</span> {{ props.user.username }}</p>
            <p class="text-sm text-gray-700"><span class="font-medium">Email:</span> {{ props.user.email }}</p>
         </div>

         <!-- Role Selection -->
         <div class="mb-4">
            <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
            <select id="role" v-model="selectedRole"
               class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none cursor-pointer">
               <option v-for="role in roles" :key="role._id" :value="role._id" :class="[
                  'py-2',
                  role._id === selectedRole
                     ? 'bg-gray-200 font-semibold'
                     : 'bg-white'
               ]">
                  {{ role.name }}
               </option>
            </select>
         </div>
         <!-- Display error -->
         <div v-if="props.error" class="mt-4 text-red-500 text-sm italic">{{ props.error }}</div>
         <div v-else-if="noChangesError" class="mt-4 text-red-500 text-sm italic">{{ noChangesError }}</div>

         <!-- Modal Actions -->
         <div class="flex justify-end gap-3">
            <button @click="close"
               class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">Cancel</button>
            <button @click="submit"
               class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
               <span v-if="loading" class="loader"></span>
               <span v-else>Save</span>
            </button>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PropType } from 'vue'
// Interfaces
import type { User } from '@/interfaces/userTypes'
import type { Role } from '@/interfaces/interfaces'

const props = defineProps({
   user: { type: Object as PropType<User>, required: true },
   roles: { type: Array as PropType<Role[]>, required: true },
   error: { type: [String, null], default: null },
   loading: { type: Boolean, default: false },
})

//-- Edit
const selectedRole = ref<string>(props.user.role as string)
const noChangesError = ref<string>('')

//-- Emit
const emit = defineEmits(['submit', 'close'])

const close = () => {
   emit('close')
}

const submit = () => {
   if (selectedRole.value === props.user.role) {
      noChangesError.value = 'No changes made to the role.'
      return
   } else {
      noChangesError.value = '';
      emit('submit', selectedRole.value, props.user._id)
   }
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