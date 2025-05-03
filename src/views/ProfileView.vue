<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 space-y-8 md:px-6">
    <!-- Header Section -->
    <ProfileCard :user="user!" :roleName="roleName!" />

    <!-- Recommendations Section -->
    <h2 class="text-xl font-bold mt-16 mb-4">Latest Recommendations</h2>
    <div v-if="recommendationsStore.getIsLoading" class="loader"></div>

    <RecommendationsSection v-else-if="!recommendationsStore.getIsLoading && recommendations.length > 0"
      :recommendations="recommendations" />
    <div v-else class="text-gray-500">No recommendations to display.</div>

    <!-- Collections Section -->
    <h2 class="text-xl font-bold mt-16 mb-4">Collections</h2>
    <div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <!-- Placeholder Collections -->
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
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// Components
import ProfileCard from '@/components/profile/ProfileCard.vue';
import RecommendationsSection from '@/components/profile/RecommendationsSection.vue';
// Stores
import { useUserStore } from '@/stores/userStore';
import { useUsersStore } from '@/stores/crud/usersStore';
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';
import { useRolesStore } from '@/stores/rolesStore';

const userStore = useUserStore();
const recommendationsStore = useRecommendationsStore();
const usersStore = useUsersStore();
const rolesStore = useRolesStore();

// Router
const route = useRoute();


// Fetch user data
const user = computed(() => { return usersStore.getUserById(route.params.id as string) });
const roleName = computed(() => { return rolesStore.getRoleById(user.value?.role as string)?.name });
const recommendations = computed(() => {
  return recommendationsStore.getRecommendationsByUserId(user.value?._id);
});

onMounted(async () => {
  await usersStore.fetchUsers();
  await rolesStore.fetchRoles();
  await recommendationsStore.fetchRecommendations(false, 'true');

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
