<template>
   <section>
      <h2 class="text-xl font-semibold">Users</h2>
      <!-- Loader -->
      <div v-if="usersStore.getIsLoading" class="flex justify-center items-center h-32">
         <span class="loader"></span>
      </div>
      <!-- Error Message -->
      <div v-else-if="usersStore.getError" class="text-red-500 text-center h-32">
         {{ usersStore.getError }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <UserCard v-if="users" v-for="(user, index) in users" :key="index" :user="user" :roles="roles"
            @edit="handleEdit" />
         <!-- Role Info Table -->

         <div v-else class="text-gray-500">No users to display.</div>

         <!-- Edit Card -->
         <UserEditModal v-if="showEditModal" @submit="handleUpdateUserRole" @close="handleClose" />
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import UserCard from '@/components/admin/users/UserCard.vue';
import UserEditModal from '@/components/admin/users/UserEditModal.vue';
// Stores
import { useUsersStore } from '@/stores/crud/usersStore';
import { useRolesStore } from '@/stores/rolesStore';
// Interfaces
/* import type { User } from '@/interfaces/interfaces' */

const usersStore = useUsersStore();
const rolesStore = useRolesStore();

const users = computed(() => usersStore.getUsers);
const roles = computed(() => rolesStore.getRoles);

//-- Edit
// Edit Modal
const showEditModal = ref<boolean>(false);
const editUserId = ref<string | null>(null);

const handleEdit = (userId: string) => {
   editUserId.value = userId;
   showEditModal.value = true;
   console.log('Edit user ID:', userId);
};

const handleClose = () => {
   showEditModal.value = false;
   editUserId.value = null;
   /* usersStore.clearErrors(); */
};

onMounted(async () => {
   await usersStore.fetchUsers();
   await rolesStore.fetchRoles();
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