<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 space-y-8 md:px-6">
    <div v-if="usersStore.getIsLoading" class="loader"></div>
    <ProfileCard v-else-if="user" :user="user!" :roleName="roleName!" />

    <RecommendationsSection v-if="user" :userId="user?._id" />

    <CollectionsSection v-if="user" :userId="user?._id" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
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

// Watch for changes in params and fetch user data
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await collectionsStore.fecthCollectionsByUserId(user.value?._id as string, true, 'false');
  }
})

onMounted(async () => {
  await usersStore.fetchUsers();
  await rolesStore.fetchRoles();
  await collectionsStore.fecthCollectionsByUserId(user.value?._id as string, false, 'false')
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
