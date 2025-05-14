<template>
   <section>
      <div class="flex justify-between items-center gap-4">
         <h2 class="text-xl font-semibold">User Roles</h2>
         <!--  Add Role Button -->
         <button @click="handleAdd"
            class="bg-blue-600 text-sm text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition duration-200 ease-in-out cursor-pointer">
            Add Role
         </button>
      </div>

      <!-- Error Message -->
      <div v-if="rolesStore.getError" class="text-red-500 text-center h-32">
         {{ rolesStore.getError }}
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <RoleCard v-if="roles" v-for="(role, index) in roles" :key="index" :role="role" :loading="rolesStore.isLoading"
            @edit="handleEdit" />
         <div v-else class="text-gray-500">No user roles to display.</div>

         <!-- Add Card -->
         <RoleAddModal v-if="showAddModal" :addError="rolesStore.getAddError" :loading="rolesStore.getIsLoading"
            @submit="handleAddRole" @close="handleCloseAdd" />

         <!-- Edit Card -->
         <!-- <UserEditModal v-if="showEditModal" :user="usersStore.getUserById(editUserId!)!" :roles="roles"
            :error="usersStore.getUpdateError" :loading="usersStore.getIsLoading" @submit="handleUpdateUserRole"
            @close="handleClose" /> -->
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import RoleCard from '@/components/admin/roles/RoleCard.vue';
import RoleAddModal from '@/components/admin/roles/RoleAddModal.vue';
/* import RoleEditModal from '@/components/admin/roles/RoleEditModal.vue'; */
// Stores
import { useRolesStore } from '@/stores/crud/rolesStore'
import { usePermissionsStore } from '@/stores/permissionsStore';
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { Role, AddRole } from '@/interfaces/roleTypes';

const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();
const authStore = useAuthStore();

const roles = computed(() => rolesStore.getRoles);

//-- Add Place
const showAddModal = ref<boolean>(false);

const handleAdd = () => {
   showAddModal.value = true;
};

const handleCloseAdd = () => {
   showAddModal.value = false;
   rolesStore.clearErrors();
};

const handleAddRole = async (newRole: AddRole): Promise<void> => {
   try {
      await rolesStore.addRole(newRole, authStore.getToken!);

      if (!rolesStore.getAddError) {
         handleCloseAdd();
      }
   } catch (error) {
      console.error('Error adding role:', error);
   }
};

//-- Edit
// Edit Modal
const showEditModal = ref<boolean>(false);
const editRoleId = ref<string | null>(null);

const handleEdit = (roleId: string) => {
   editRoleId.value = roleId;
   showEditModal.value = true;
   console.log('Edit role ID:', roleId);
};

const handleClose = () => {
   showEditModal.value = false;
   editRoleId.value = null;
   rolesStore.clearErrors();
};

/* const handleUpdateUserRole = async (userRole: string, userId: string): Promise<void> => {
}; */

onMounted(async () => {
   await rolesStore.fetchRoles();
   await permissionsStore.fetchPermissions();
}); 
</script>

<style scoped>
.loader {
   border: 3px solid #afafaf;
   border-top: 3px solid #404040;
   border-radius: 50%;
   width: 18px;
   height: 18px;
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