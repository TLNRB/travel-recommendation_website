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
            :deleteError="rolesStore.getDeleteError" @edit="handleEdit" @delete="handleDeleteRole" />
         <div v-else class="text-gray-500">No user roles to display.</div>

         <!-- Add Card -->
         <RoleAddModal v-if="showAddModal" :addError="rolesStore.getAddError" :loading="rolesStore.getIsLoading"
            @submit="handleAddRole" @close="handleCloseAdd" />

         <!-- Edit Card -->
         <RoleEditModal v-if="showEditModal" :role="rolesStore.getRoleById(editRoleId!)!"
            :updateError="rolesStore.getUpdateError" :loading="rolesStore.getIsLoading" @submit="handleUpdateRole"
            @close="handleCloseEdit" />
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import RoleCard from '@/components/admin/roles/RoleCard.vue';
import RoleAddModal from '@/components/admin/roles/RoleAddModal.vue';
import RoleEditModal from '@/components/admin/roles/RoleEditModal.vue';
// Stores
import { useRolesStore } from '@/stores/crud/rolesStore'
import { usePermissionsStore } from '@/stores/permissionsStore';
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { AddRole } from '@/interfaces/roleTypes';

const rolesStore = useRolesStore();
const permissionsStore = usePermissionsStore();
const authStore = useAuthStore();

const roles = computed(() => rolesStore.getRoles);

//-- Add
// Add Modal
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
};

const handleCloseEdit = () => {
   showEditModal.value = false;
   editRoleId.value = null;
   rolesStore.clearErrors();
};

const handleUpdateRole = async (updatedRole: AddRole, roleId: string): Promise<void> => {
   try {
      await rolesStore.updateRole(updatedRole, roleId, authStore.getToken!);

      if (!rolesStore.getUpdateError) {
         handleCloseEdit();
      }
   } catch (error) {
      console.error('Error updating role:', error);
   }
};

//-- Delete
const handleDeleteRole = async (roleId: string): Promise<void> => {
   try {
      await rolesStore.deleteRole(roleId, authStore.getToken!)

      if (!rolesStore.getDeleteError) {
         handleCloseEdit();
      }
   } catch (error) {
      console.error('Error deleting role: ', error)
   }
}

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