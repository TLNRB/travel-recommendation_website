<template>
  <!-- HERO Section -->
<div class="relative h-[60vh] w-full overflow-hidden">
  <!-- Background Image -->
  <img
    v-if="singlePlace?.images?.length"
    :src="singlePlace.images[0] as string"
    alt="Place hero image"
    class="absolute inset-0 w-full h-full object-cover brightness-75"
  />

  <!-- Title and Back button -->
  <div class="relative z-10 flex flex-col justify-center items-start h-full px-8 md:px-16">
    <h1 class="text-white text-2xl md:text-4xl lg:text-6xl font-bold drop-shadow-lg">
      {{ singlePlace?.name || 'Place' }}
    </h1>
    <RouterLink
      v-if="cityId"
      class="md:left-16 z-20 mt-4 md:px-4 md:py-2 py-1 px-2 text-sm  bg-white text-green-600 font-semibold rounded hover:bg-green-100 transition"
      :to="`/city/${cityId}`"
    >
      🔙
    </RouterLink>
  </div>

    <!-- Desktop (lg+): Original floating style -->
    <div class="absolute bottom-0 right-4 z-20 hidden lg:flex gap-4">
      <button @click="activeTab = 'info'" :class="[
        'px-16 py-3 rounded-t-xl font-medium transition',
        activeTab === 'info' ? 'bg-white text-black shadow' : 'bg-gray-100 text-gray-600'
      ]">
        Info & Gallery
      </button>
      <button @click="activeTab = 'recommendations'" :class="[
        'px-16 py-3 rounded-t-xl font-medium transition',
        activeTab === 'recommendations' ? 'bg-white text-black shadow' : 'bg-gray-100 text-gray-600'
      ]">
        Recommendations
      </button>
    </div>

  </div>


   <!-- CONTENT Section -->
  <div class="max-w-6xl 2xl:max-w-7xl mx-auto px-4 md:px-8 py-8">
    <div v-if="loading" class="text-center text-gray-500 text-lg">Loading place...</div>

    <div v-else-if="error" class="text-center text-red-500 text-lg">{{ error }}</div>

    <div v-else-if="singlePlace">
  <!-- Info and Gallery Tab Content -->
  <div v-show="activeTab === 'info'">
    <!-- Place Info (unchanged) -->
    <div class="bg-white rounded-xl shadow p-6 mb-8">
    <div class="flex justify-between">
<h2 class="text-2xl font-bold text-green-800 mb-4">{{ singlePlace.name }}</h2>
       <div v-if="authStore.getIsLoggedIn" class="flex gap-3">
              <!-- Place Upvotes -->
              <button @click="upvotePlace"
                class="h-[34px] flex justify-center items-center gap-1 bg-gray-50 border-[1px] px-2 text-sm border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 duration-200 ease-in-out">
                <i class='bx duration-200 ease-in-out'
                  :class="isPlaceUpvoted ? 'bxs-upvote text-blue-500' : 'bx-upvote text-gray-500'"></i>
                <span class="text-sm text-gray-500 font-semibold">
                  {{ singlePlace.upvotes.length }}
                </span>
              </button>

              <!-- Save Button -->
              <div class="relative">
                <button @click="toggleSaveMenu"
                  class="flex justify-center items-center bg-blue-600 text-sm text-white h-[34px] p-2 rounded-lg hover:bg-blue-700 duration-200 ease-in-out cursor-pointer sm:px-4">
                  <span class=" sm:hidden"><i
                      class='bx bx-pin flex justify-center items-center text-[18px] translate-y-[1px]'></i></span>
                  <span class="hidden sm:flex">Save Place</span>
                </button>

                <!-- Dropdown -->
                <div v-if="isSaveMenuOpen"
                  class="absolute right-0 mt-2 p-4 bg-white shadow-lg rounded-lg pt-2 border-[1px] border-gray-300 z-50 w-80"
                  :class="isSaveMenuOpen ? 'block' : 'hidden'">
                  <div class="flex justify-between items-center mb-3">
                    <label class="text-sm font-medium">Your Collections</label>
                    <button @click="isSaveMenuOpen = false"
                      class="text-gray-400 hover:text-red-500 duration-200 ease-in-out cursor-pointer text-lg"
                      title="Close">
                      &times;
                    </button>
                  </div>

                  <div v-if="availableCollections.length === 0" class="text-sm text-gray-500">
                    You have no collections yet.
                    <RouterLink :to="`/profile/${userStore.getUser?._id}`" class="text-blue-600 hover:underline">
                      Go to your profile to create one.
                    </RouterLink>
                  </div>

                  <!-- Collections List -->
                  <div v-else class="space-y-2 max-h-60 overflow-y-auto">
                    <div v-for="collection in availableCollections" :key="collection._id"
                      class="flex items-center justify-between gap-3 bg-gray-50 border-[1px] border-gray-300 px-3 py-2 rounded-lg duration-200 ease-in-out">
                      <span class="truncate text-sm">{{ collection.name }}</span>
                      <button @click="toggleSaveToCollection(collection._id)"
                        class="text-sm font-medium px-2 py-1 rounded duration-200 ease-in-out cursor-pointer" :class="isPlaceInCollection(collection._id)
                          ? 'bg-red-200 text-red-600 hover:bg-red-200'
                          : 'bg-green-200 text-green-600 hover:bg-green-200'">
                        {{ isPlaceInCollection(collection._id) ? 'Remove' : 'Save' }}
                      </button>
                    </div>
                    <!-- Error Display -->
                    <div v-if="collectionsStore.getUpdateError" class="text-red-500 text-sm mt-2">
                      {{ collectionsStore.getUpdateError }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>

      <p class="text-gray-700 mb-4">{{ singlePlace.description }}</p>
      <div class="flex flex-col md:flex-row md:space-x-8 text-gray-600 text-sm">
        <p><strong>City:</strong> {{ singlePlace.location.city }}</p>
        <p><strong>Country:</strong> {{ singlePlace.location.country }}</p>
        <p><strong>Street:</strong> {{ singlePlace.location.street }} {{ singlePlace.location.streetNumber }}</p>
      </div>
    </div>

    <!-- Gallery (unchanged) -->
    <div>
      <h3 class="text-xl font-semibold text-green-800 mb-4">Gallery</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <img
          v-for="(img, idx) in singlePlace.images"
          :key="idx"
          :src="img as string"
          alt="Gallery image"
          class="w-full h-64 object-cover rounded-xl shadow"
        />
      </div>
    </div>

  </div>
</div>


  <!-- RECOMMENDATIONS Header -->
  <UpdateRecModal ref="editModal" @updated="handleUpdate" />
  <!-- Recommendations Tab Content -->
  <div v-show="activeTab === 'recommendations'" class="mt-0">
  <h3 class="text-2xl font-bold text-green-800 mb-6">Visitor Recommendations</h3>

  <!-- Responsive Wrapper: side-by-side on lg+, stacked on md and below -->
  <div class="flex flex-col lg:flex-row gap-8">

    <!-- Recommendations Grid -->
    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      <div
        v-for="(rec, idx) in recommendations"
        :key="idx"
        class="bg-white rounded-xl relative shadow p-5 hover:shadow-lg transition-shadow"
      >
        <h4 class="text-lg font-bold text-green-700 mb-2">
          {{ rec.title }}
          <span class="ms-2 text-sm text-gray-400 font-light">
            {{ typeof rec._createdBy === 'object' ? rec._createdBy.username : '' }}
          </span>
        </h4>
        <p class="text-sm text-gray-700 mb-4">{{ rec.content }}</p>
        <div class="text-sm text-gray-500 mt-4">
          <p><strong>Visited:</strong> {{ formatDate(rec.dateOfVisit) }}</p>
          <p><strong>Rating:</strong> ⭐ {{ rec.rating }}/5</p>
        </div>
        <div
    v-if="rec._createdBy && typeof rec._createdBy === 'object' && rec._createdBy._id === currentUser"
    class="flex gap-2 justify-between absolute bottom-4 right-4"
  >
  <button
  @click="handleDelete(rec)"
  class="px-2 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white"> Delete </button>

  <button
  @click="tryOpenEditModal(rec)"
  class="px-2 py-1 rounded-lg bg-blue-400 text-white hover:bg-blue-500"> Edit </button>
  </div>
   <button v-if="authStore.getIsLoggedIn" @click="upvoteRecommendation(rec._id)"
                class="h-[34px] flex justify-center items-center gap-1 bg-gray-50 border-[1px] px-2 text-sm border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 duration-200 ease-in-out">
                <i class='bx duration-200 ease-in-out'
                  :class="isRecommendationUpvoted(rec._id) ? 'bxs-upvote text-blue-500' : 'bx-upvote text-gray-500'"></i>
                <span class="text-sm text-gray-500 font-semibold">
                  {{ rec.upvotes.length }}
                </span>
              </button>
      </div>
    </div>

    <!-- Form Column -->
    <div v-if="authStore.userId!" class="w-full lg:w-[400px] xl:w-[450px] shrink-0">
      <div class="bg-white p-4 md:p-6 rounded-xl shadow w-full">
        <h4 class="text-lg md:text-xl font-semibold mb-3 text-green-700">Add a Recommendation</h4>

        <form @submit.prevent="submitRecommendation" class="space-y-3">
          <input
            v-model="newRecommendation.title"
            type="text"
            placeholder="Title"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            required
          />
          <textarea
            v-model="newRecommendation.content"
            placeholder="Your experience..."
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            rows="3"
            required
          ></textarea>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              v-model="newRecommendation.dateOfVisit"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
            <input
              v-model.number="newRecommendation.rating"
              type="number"
              min="1"
              max="5"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              required
            />
          </div>
          <div class="text-right">
            <div v-if="errorMessage" class="text-red-600 text-sm mb-3">
              {{ errorMessage }}
            </div>
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>

  <!-- No recommendations message -->
  <div v-if="!recommendations.length" class="text-gray-500 mt-6">No recommendations yet. Be the first to add one!</div>
</div>
</div>



      <!-- No recommendations message -->
      <div v-if="!recommendations.length" class="text-gray-500 mt-6">No recommendations yet. Be the first to add one!
      </div>

</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePlaces } from '@/modules/places/usePlaces';
// Interfaces
import type { Recommendation, AddRecommendation } from '@/interfaces/recommendationTypes';
// Stores
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useCollectionsStore } from '@/stores/crud/collectionsStore';

import UpdateRecModal from '@/components/place/updateRecModal.vue'


const route = useRoute();

const { getPlaceByName, singlePlace, loading, error } = usePlaces();
const recommendationsStore = useRecommendationsStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const placesStore = usePlacesStore();
const collectionsStore = useCollectionsStore();

const placeName = route.params.id as string;

const paramsActiveTab = route.query.activeTab as 'info' | 'recommendations' || 'info'; // Default value is 'info' if no query param is provided
const errorMessage = ref<string | null>(null);


const editModal = ref<InstanceType<typeof UpdateRecModal> | null>(null)
const cityId = route.query.cityId as string;

const activeTab = ref<'info' | 'recommendations'>(paramsActiveTab);

const newRecommendation = ref<AddRecommendation>({
  title: '',
  content: '',
  dateOfVisit: '',
  rating: 5,
  upvotes: [],
});

const recommendations = computed(() =>
  singlePlace.value?._id
    ? recommendationsStore.recommendationsMap[singlePlace.value._id] || []
    : []
);

watch(recommendations, (newVal) => {
  console.log('Recommendations updated:', newVal)
});

const handleUpdate = () => {
  if (singlePlace.value?._id) {
    // Optionally refetch if needed:
    recommendationsStore.fetchRecommendationsByPlace(singlePlace.value._id);
  }
};

onMounted(async () => {
  await getPlaceByName(placeName);
  if (singlePlace.value?._id) {
    await recommendationsStore.fetchRecommendationsByPlace(singlePlace.value._id);
  }
});

const submitRecommendation = async () => {
  // Clear any previous error messages
  errorMessage.value = null;

  // Validate the time field
  const { title, content, dateOfVisit, rating } = newRecommendation.value;

  const visitDate = new Date(dateOfVisit);
  const today = new Date();
  if (visitDate > today) {
    errorMessage.value = "Date of visit cannot be in the future.";
    return;
  }

  // Prepare the recommendation payload
  const newRec: Partial<Recommendation> = {
    title,
    content,
    dateOfVisit,
    rating,
    upvotes: [],
    place: singlePlace.value._id,
    _createdBy: authStore.userId!
  };

  console.log("Submitting recommendation payload:", newRec);

  // Try adding the recommendation using the store
  try {
    await recommendationsStore.addRecommendation(newRec, authStore.token!);

    // Reset form after successful submission
    newRecommendation.value = {
      title: '',
      content: '',
      dateOfVisit: '',
      rating: 5,
      upvotes: [],
    };
  } catch (err) {
    errorMessage.value = "Failed to submit recommendation.";
    console.error("Error adding recommendation:", err);
  }
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });}


const currentUser = authStore.userId

const handleDelete = async (rec: Recommendation) => {
  const confirmed = confirm('Are you sure you want to delete this recommendation?');
  if (!confirmed) return;

  try {
    const placeId = typeof rec.place === 'string' ? rec.place : rec.place._id;
    await recommendationsStore.deleteRecommendation(rec._id, authStore.token!, placeId);
  } catch (err) {
    console.error('Failed to delete recommendation:', err);
  }
}

//-- Upvotes
// Place
const isPlaceUpvoted = computed(() => {
  return placesStore.getIsPlaceUpvoted(singlePlace.value!._id, authStore.userId!);
});

const upvotePlace = async () => {
  try {
    await placesStore.updatePlaceUpvotes(singlePlace.value!._id, authStore.userId!, authStore.token!);
  }
  catch (error) {
    console.error('Error upvoting place:', error);
  }
}

// Recommendation
const isRecommendationUpvoted = (recommendationId: string) => {
  return recommendationsStore.getIsRecommendationUpvoted(singlePlace.value!._id, recommendationId, authStore.userId!);
};

const upvoteRecommendation = async (recommendationId: string) => {
  try {
    await recommendationsStore.updateRecommendationUpvotes(singlePlace.value!._id, recommendationId, authStore.userId!, authStore.token!);
  }
  catch (error) {
    console.error('Error upvoting recommendation:', error);
  }
}

const tryOpenEditModal = (rec: Recommendation) => {
  if (editModal.value) {
    editModal.value.open(rec)
  } else {
    console.warn('Edit modal is not yet mounted.')
  }
}


//-- Save Place
const isSaveMenuOpen = ref(false)
const availableCollections = computed(() =>
  collectionsStore.getCollectionsByUserId(authStore.getUserId!)
)

const toggleSaveMenu = () => {
  isSaveMenuOpen.value = !isSaveMenuOpen.value
}

const isPlaceInCollection = (collectionId: string) => {
  /* console.log("Checking if place is in collection:", collectionId, singlePlace.value!._id, authStore.getUserId!)
  console.log("result", collectionsStore.isPlaceInCollection(collectionId, singlePlace.value!._id, authStore.getUserId!)) */
  return collectionsStore.isPlaceInCollection(collectionId, singlePlace.value!._id, authStore.getUserId!)
}

const toggleSaveToCollection = async (collectionId: string) => {
  const placeId = singlePlace.value!._id

  if (isPlaceInCollection(collectionId)) {
    await collectionsStore.removePlaceFromCollection(collectionId, placeId, authStore.getUserId!, authStore.token!)
  } else {
    await collectionsStore.addPlaceToCollection(collectionId, placeId, authStore.getUserId!, authStore.token!)
  }
}


onMounted(async () => {
  await getPlaceByName(placeName);
  if (singlePlace.value?._id) {
    await recommendationsStore.fetchRecommendationsByPlace(singlePlace.value._id, false, 'true');
  }

  await collectionsStore.fecthCollectionsByUserId(authStore.getUserId!, false, 'false')
})
</script>
