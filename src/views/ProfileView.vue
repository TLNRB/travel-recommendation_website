<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 space-y-8 md:px-6">
    <div v-if="usersStore.getIsLoading" class="loader"></div>
    <ProfileCard v-else :user="user!" :roleName="roleName!" />

    <RecommendationsSection :userId="user?._id" />

    <CollectionsSection :userId="user?._id" />

    <!-- Collections Section -->
    <!-- <h2 class="text-xl font-bold mt-16 mb-4">Collections</h2>
    <div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div class="bg-gray-100 rounded-lg p-4 text-center shadow-sm">
          <p class="font-medium">Hidden Beaches 🌊</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4 text-center shadow-sm">
          <p class="font-medium">Weekend Getaways 🚗</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4 text-center shadow-sm">
          <p class="font-medium">Foodie Heaven 🍜</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// Components
import ProfileCard from '@/components/profile/ProfileCard.vue';
import RecommendationsSection from '@/components/profile/RecommendationsSection.vue';
import CollectionsSection from '@/components/profile/collections/CollectionsSection.vue';
// Stores
import { useUsersStore } from '@/stores/crud/usersStore';
import { useRolesStore } from '@/stores/rolesStore';
import { useCollectionsStore } from '@/stores/crud/collectionsStore'

const usersStore = useUsersStore();
const rolesStore = useRolesStore();
const collectionsStore = useCollectionsStore();

// Router
const route = useRoute();


// Fetch user data
const user = computed(() => { return usersStore.getUserById(route.params.id as string) });
const roleName = computed(() => {
  return rolesStore.getRoleById(user.value?.role as string)?.name
});

onMounted(async () => {
  await usersStore.fetchUsers();
  await rolesStore.fetchRoles();
  await collectionsStore.fecthCollectionsByUserId(user.value?._id, false, 'false')
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
