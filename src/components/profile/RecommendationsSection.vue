<template>
  <section class="mt-16">
    <h2 class="text-xl font-bold mb-4">Latest Recommendations</h2>
    <!-- Loader -->
    <div v-if="recommendationsStore.getIsLoading" class="loader"></div>

    <!-- Recommendations -->
    <div v-else-if="!recommendationsStore.getIsLoading && recommendations.length > 0" class="flex flex-col gap-6">
      <RouterLink :to="{ path: `/place/${recommendation.place.name}`, query: { activeTab: 'recommendations' } }"
        v-for="recommendation in recommendations" :key="recommendation._id"
        class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex gap-4">
        <!-- Place Image -->
        <div v-if="recommendation.place.images.length" class="w-24 h-24 shrink-0 rounded-md overflow-hidden">
          <img :src="recommendation.place.images[0]" alt="Place image" class="w-full h-full object-cover" />
        </div>


        <div class="flex flex-col justify-between w-full space-y-2">
          <!-- Place info -->
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-base font-semibold text-gray-800">
                {{ recommendation.title }}
              </h3>
              <p class="text-sm text-gray-500">
                📍 {{ recommendation.place.name }} — {{ recommendation.place.location.city }},
                {{ recommendation.place.location.country }}
              </p>
            </div>
            <span class="text-yellow-500 font-semibold whitespace-nowrap">⭐ {{ recommendation.rating }}/5</span>
          </div>

          <!-- Content -->
          <p class="text-sm text-gray-700 whitespace-pre-line">
            {{ recommendation.content }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1 text-xs text-blue-600">
            <span v-for="(tag, tagIndex) in recommendation.place.tags" :key="tagIndex"
              class="bg-blue-100 px-2 py-0.5 rounded-full">
              #{{ tag }}
            </span>
          </div>

          <!-- Dates and upvotes -->
          <div class="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
            <div class="space-y-0.5">
              <p>Visited: {{ formatDate(recommendation.dateOfVisit) }}</p>
              <p>Written: {{ formatDate(recommendation.dateOfWriting) }}</p>
            </div>
            <div class="text-sm">👍 {{ recommendation.upvotes }}</div>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Error -->
    <div v-else-if="recommendationsStore.getError" class="text-red-500 text-sm">{{ recommendationsStore.getError
      }}</div>

    <div v-else class="text-gray-500">No recommendations to display.</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onMounted } from 'vue';
// Stores 
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';

const recommendationsStore = useRecommendationsStore();

//-- Props
const props = defineProps({
  userId: { type: String, required: true }
});

const recommendations = computed(() => {
  return recommendationsStore.getRecommendationsByUserId(props.userId);
});

//-- Date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(async () => {
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