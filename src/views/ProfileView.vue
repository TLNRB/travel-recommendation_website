<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 space-y-8 md:px-6">
    <!-- Header Section -->
    <ProfileCard :user="user!" />

    <!-- Recommendations Section -->
    <h2 class="text-xl font-bold mt-16 mb-4">Latest Recommendations</h2>
    <div v-if="recommendationsStore.getIsLoading" class="loader"></div>

    <RecommendationsSection v-else-if="!recommendationsStore.getIsLoading && recommendations"
      :recommendations="recommendations" />
    <div v-else class="text-gray-500">No recommendations to display.</div>

    <!-- Collections Section -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-semibold">Your Collections</h3>
        <button class="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Edit
        </button>
      </div>
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
// Components
import ProfileCard from '@/components/profile/ProfileCard.vue';
import RecommendationsSection from '@/components/profile/RecommendationsSection.vue';
// Stores
import { useUserStore } from '@/stores/userStore';
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';

const userStore = useUserStore();
const recommendationsStore = useRecommendationsStore();


// Fetch user data
const user = computed(() => userStore.getUser);
const recommendations = computed(() => { // Switch the id to the user id coming from the path
  return recommendationsStore.getRecommendationsByUserId(user.value?._id);
});

onMounted(async () => {
  await recommendationsStore.fetchRecommendations(true, 'true');
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
