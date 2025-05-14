<template>
   <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <!-- Modal box -->

      <div class="my-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-6 absolute top-0 bottom-0 overflow-y-scroll">

         <!-- Close button -->
         <button @click="close"
            class="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-xl duration-200 ease-in-out cursor-pointer ">
            &times;
         </button>

         <h2 class="text-xl font-semibold mb-4">Edit Role</h2>

         <form @submit.prevent="submit">
            <div class="space-y-4">
               <!-- Name -->
               <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <input v-model="editRole.name" type="text" placeholder="Role Name" required
                     class="w-full px-3 py-2 border rounded-lg" />
               </div>

               <!-- Add Permission -->
               <div>
                  <label class="block text-sm font-medium mb-1">Add Permission</label>
                  <div class="flex gap-2 items-center mb-2">
                     <select v-model="selectedPermissions" class="w-full px-3 py-2 border rounded-lg bg-white">
                        <option disabled value="">Select a permission</option>
                        <option v-for="permission in availablePermissions" :key="permission._id" :value="permission">
                           {{ permission.name }}
                        </option>
                     </select>
                     <button type="button" @click="addPermission"
                        class="h-[40px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer duration-[.25s] ease-in-out">
                        Add
                     </button>
                  </div>

                  <!-- Display Selected Permissions -->
                  <div v-if="editRole.permissions!.length > 0" class="space-y-2">
                     <div v-for="(permission, index) in editRole.permissions" :key="index"
                        class="flex items-center gap-3 justify-between p-2 border border-gray-200 rounded-lg">
                        <div class="flex items-start gap-2">
                           <span>-</span>
                           <div>
                              <div class="font-medium text-sm text-gray-800">{{ typeof permission === 'object' ?
                                 permission.name : permission }} </div>
                              <div class="text-gray-600 text-xs">{{ typeof permission === 'object' ?
                                 permission.description : permission }}</div>
                           </div>
                        </div>
                        <button type="button" @click="removePermission(index)"
                           class="text-red-500 hover:text-red-700 text-xl leading-none font-bold px-2 cursor-pointer">&times;</button>
                     </div>
                     <p v-if="permissionError" class="text-red-500 text-sm mt-1 italic">{{ permissionError }}</p>
                  </div>
               </div>
            </div>

            <!-- Display Error -->
            <div v-if="props.updateError" class="mt-4 text-red-500 text-sm italic">{{ props.updateError }}</div>

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
import type { Role, AddRole } from '@/interfaces/roleTypes'
// Store
import { usePermissionsStore } from '@/stores/permissionsStore'

const permissionsStore = usePermissionsStore()

const props = defineProps({
   role: { type: Object as PropType<Role>, required: true },
   updateError: { type: [String, null], default: null },
   loading: { type: Boolean, default: false }
})

//-- Edit
const editRole = ref<AddRole>({
   name: props.role.name,
   permissions: [...props.role.permissions] as any
})

// Add Permission
const availablePermissions = computed(() => permissionsStore.getPermissions);
const selectedPermissions = ref<any>(null)
const permissionError = ref<string | null>(null)

const addPermission = () => {
   if (selectedPermissions.value === null) return

   // Check if the selected permission is already in the array
   const alreadyAdded = editRole.value.permissions?.find((permission) => typeof permission === 'object' ? permission._id === selectedPermissions.value?._id : permission === selectedPermissions.value?._id)
   if (alreadyAdded) {
      permissionError.value = 'This permission is already added.'
      return
   }

   editRole.value.permissions?.push(selectedPermissions.value)
   selectedPermissions.value = null
   permissionError.value = null
}

const removePermission = (index: number) => {
   editRole.value.permissions?.splice(index, 1)
   permissionError.value = null
}

//-- Emits
const emit = defineEmits(['submit', 'close'])

const close = () => emit('close')
const submit = () => {
   emit('submit', editRole.value, props.role._id)
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
