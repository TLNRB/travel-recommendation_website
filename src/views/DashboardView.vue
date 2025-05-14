<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 md:px-6">
    <h1 class="text-3xl font-bold mb-6 text-center">Dashboard</h1>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" class="px-4 py-2 text-sm font-medium border-b-2"
        :class="{
          'border-blue-600 text-blue-600': activeTab === tab,
          'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer': activeTab !== tab,
          'hidden': (tab === 'Users' && !canEditUsers) || (tab === 'User Roles' && !canManageRoles),
        }">
        {{ tab }}
      </button>
    </div>

    <!-- Requests Tab -->
    <PlaceRequestsSection v-if="activeTab === 'Requests' && canEditPlaces" />

    <!-- Approved Places Tab -->
    <PlacesSections v-else-if="activeTab === 'Places' && canEditPlaces" />

    <!-- City Images Tab -->
    <CityImagesSection v-else-if="activeTab === 'City Images' && canEditPlaces" />

    <!-- Country Images Tab -->
    <CountryImagesSection v-else-if="activeTab === 'Country Images' && canEditPlaces" />

    <!-- Users Tab -->
    <UsersSection v-else-if="activeTab === 'Users' && canEditUsers" />

    <!-- Roles Tab -->
    <RolesSection v-else-if="activeTab === 'User Roles' && canManageRoles" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import PlaceRequestsSection from '@/components/admin/requests/PlaceRequestsSection.vue';
import PlacesSections from '@/components/admin/places/PlacesSection.vue';
import UsersSection from '@/components/admin/users/UsersSection.vue';
import RolesSection from '@/components/admin/roles/RolesSection.vue';
import CityImagesSection from '@/components/admin/cityImages/CityImagesSection.vue';
import CountryImagesSection from '@/components/admin/countryImages/CountryImagesSection.vue';
// Stores
import { useUserStore } from '@/stores/userStore';
import { useRolesStore } from '@/stores/crud/rolesStore'

const userStore = useUserStore();
const rolesStore = useRolesStore();

//-- Permission Check
// Get the permission Id for the ability to assign roles
const permissionIdRoles = computed((): string | null => rolesStore.getPermissionIdByPermissionName('user:assignRoles')!);

// Check if the user has the permission to edit users
const canEditUsers = computed(() => {
  const userRole = userStore.getUser!.role;
  if (!permissionIdRoles.value || typeof userRole === 'string') return false; // No permission Id found

  return userRole.permissions.some(permission => typeof permission === 'string' ? permission === permissionIdRoles.value : permission._id === permissionIdRoles.value);
})

// Get the permission Id for the ability to edit places / requests
const permissionIdPlaces = computed((): string | null => rolesStore.getPermissionIdByPermissionName('content:managePlaces')!);

// Check if the user has the permission to manage plcaes
const canEditPlaces = computed(() => {
  const userRole = userStore.getUser!.role;
  if (!permissionIdPlaces.value || typeof userRole === 'string') return false; // No permission Id found

  return userRole.permissions.some(permission => typeof permission === 'string' ? permission === permissionIdPlaces.value : permission._id === permissionIdPlaces.value);
})

// Get the permission Id for the ability to edit roles
const permissionIdManageRoles = computed((): string | null => rolesStore.getPermissionIdByPermissionName('user:manageRoles')!);

// Check if the user has the permission to edit users
const canManageRoles = computed(() => {
  const userRole = userStore.getUser!.role;
  if (!permissionIdManageRoles.value || typeof userRole === 'string') return false; // No permission Id found

  return userRole.permissions.some(permission => typeof permission === 'string' ? permission === permissionIdManageRoles.value : permission._id === permissionIdManageRoles.value);
})

//-- Tabs
const tabs = ['Requests', 'Places', 'Users', 'User Roles', 'City Images', 'Country Images'];
const activeTab = ref('Requests');

onMounted(async () => {
  await rolesStore.fetchRoles();
});
</script>
