<template>
  <div>
    <nav v-if="route.path !== '/auth'"
      class="flex justify-between items-center py-3 px-4 md:px-6 bg-gray-100 text-black relative">

      <div class="flex items-center gap-x-4 flex-shrink-0">
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 -ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <RouterLink to="/" class="hidden md:flex items-center">
          <img class="w-16 h-16" src="../assets/images/planet-2.svg" alt="logo">
        </RouterLink>

        <div class="hidden md:flex items-center gap-4">
          <div class="relative">
            <button @click="toggleDropdown" class="px-4 py-2 text-black rounded-lg flex items-center">
              Explore
              <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" :class="{ 'transform rotate-180': isOpen }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="isOpen" class="absolute left-0 mt-2 w-auto bg-white rounded-lg shadow-lg z-20">
              <continentList @continentSelected="isOpen = false" />
            </div>
          </div>
          <div v-if="userStore.getUser" class="flex w-64 justify-center">
          <button @click="handleAdd"
            class="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg duration-[.2s] ease-in-out text-sm cursor-pointer">
            Suggest a Place
          </button>

          <!-- Suggestion Modal -->
          <PlaceAddModal v-if="showAddModal" :addError="placesStore.getAddError" :loading="placesStore.getIsLoading"
            @submit="handleAddPlace" @close="handleCloseAdd" />

          <!-- Failed Recommendation Card -->
          <PlaceRecommendationFail v-else-if="showRecommendationModal"
            :place="placesStore.getPlaceById(failedRecommendationPlaceId!)!" :recommendation="failedRecommendation!"
            :addError="recommendationsStore.getAddError" :loading="recommendationsStore.getIsLoading"
            @submit="handleAddRecommendation" @close="handleCloseAddRecommendation" />
        </div>
        </div>
      </div>

      <div class="md:hidden flex-grow flex justify-center">
        <RouterLink to="/">
          <img class="w-12 h-12" src="../assets/images/planet-2.svg" alt="logo">
        </RouterLink>
      </div>

      <div class="flex justify-end items-center flex-shrink-0">
        <div v-if="authStore.isLoggedIn" class="relative">
          <img @click="toggleProfileDropdown" src="https://i.pravatar.cc/40" alt="avatar"
            class="w-10 h-10 rounded-full cursor-pointer border border-gray-300" />

          <div v-if="profileDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg pt-2 z-50">
            <RouterLink to="/profile" @click="closeProfileDropdown" class="block px-4 py-2 text-sm hover:bg-gray-100">Profile</RouterLink>
            <RouterLink to="/settings" @click="closeProfileDropdown" class="block px-4 py-2 text-sm hover:bg-gray-100">Settings</RouterLink>
            <RouterLink v-if="userStore.getUser?.role?.name !== 'user'" to="/dashboard" @click="closeProfileDropdown"
              class="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard
            </RouterLink>
            <LogoutBtn @click="closeProfileDropdown" @loggedOut="profileDropdownOpen = false" />
          </div>
        </div>

        <RouterLink v-else to="/auth" class="text-blue-600 hover:underline px-3 py-2">
          Login
        </RouterLink>
      </div>

      <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="transform -translate-x-full"
          enter-to-class="transform translate-x-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="transform translate-x-0"
          leave-to-class="transform -translate-x-full"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-y-0 left-0 w-64 bg-gray-100 shadow-lg z-40 p-4 md:hidden">
          <button @click="mobileMenuOpen = false" class="absolute top-3 right-3 p-1">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
               <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
             </svg>
          </button>

          <div class="mt-10 space-y-4">
            <div class="relative">
              <button @click="toggleDropdown" class="px-4 py-2 text-black rounded-lg flex items-center w-full justify-between">
                Explore
                <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" :class="{ 'transform rotate-180': isOpen }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="isOpen" class="mt-2 w-full bg-white rounded-lg shadow-lg z-20">
                  <continentList @continentSelected="closeMobileMenu(); isOpen = false" />
               </div>
            </div>

            <button @click="openSuggestModalAndCloseMenu"
              class="w-full px-4 py-2 bg-blue-200 hover:bg-blue-400 text-black rounded transition text-sm text-left">
              Suggest a Place
            </button>
          </div>
        </div>
      </transition>
       <div v-if="mobileMenuOpen" @click="mobileMenuOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>

    </nav>

    <nav v-else class="absolute m-5">
      <RouterLink to="/">
        <img class="w-32 h-32" src="../assets/images/planet-2.svg" alt="logo">
      </RouterLink>
    </nav>

    

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useUsers } from '@/modules/auth/useUsers';
import LogoutBtn from '@/components/logoutBtn.vue';
import continentList from '@/components/continentList.vue';
import PlaceAddModal from '@/components/admin/places/PlaceAddModal.vue';
import PlaceRecommendationFail from '@/components/admin/places/PlaceRecommendationFail.vue';
// Interfaces
import type { Place, AddPlace } from '@/interfaces/placeTypes'
import type { AddRecommendation, Recommendation } from '@/interfaces/recommendationTypes';
// Stores
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { usePlacesStore } from '@/stores/crud/placesStore';
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore';

const authStore = useAuthStore();
const userStore = useUserStore();
const placesStore = usePlacesStore();
const recommendationsStore = useRecommendationsStore();

const { token } = useUsers();

//correctly displays

console.log(token.value)

const mobileMenuOpen = ref(false);

const route = useRoute();
const isOpen = ref(false);
const profileDropdownOpen = ref(false)
const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value
}

const closeProfileDropdown = (event: Event) => {
  if (!(event.target as HTMLElement).closest(".relative")) {
    profileDropdownOpen.value = false;
  }
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = (event: Event) => {
  if (!(event.target as HTMLElement).closest(".relative")) {
    isOpen.value = false;
  }
};

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
}


//-- Add Place
const showAddModal = ref<boolean>(false);

const failedRecommendationPlaceId = ref<string | null>(null);
const failedRecommendation = ref<AddRecommendation | null>(null);
const showRecommendationModal = ref<boolean>(false);

// Place
const handleAdd = () => {
  showAddModal.value = true;
};

const handleCloseAdd = () => {
  showAddModal.value = false;
  placesStore.clearErrors();
};

const handleAddPlace = async (newPlace: AddPlace, recommendation: AddRecommendation): Promise<void> => {
  const placeData: Place = {
    ...newPlace,
    _createdBy: authStore.getUserId!,
  };

  try {
    const placeId = await placesStore.addPlace(placeData, authStore.getToken!);

    // Check if the place was added successfully
    if (placeId) {
      // If there are no recommendations, close the modal
      if (!recommendation) {
        handleCloseAddRecommendation();
      }
      // If there are recommendations, add them
      else {
        const recommendationData: Partial<Recommendation> = { // Leaving the dayOfWriting out
          ...recommendation,
          place: placeId,
          _createdBy: authStore.getUserId!,
        };

        console.log('recommendationData', recommendationData);

        await recommendationsStore.addRecommendation(recommendationData, authStore.getToken!);

        if (!recommendationsStore.getAddError) {
          console.log('Recommendation added successfully');
          // If the recommendation is added successfully, close the modal
          handleCloseAddRecommendation();
        }
        else {
          console.log('Recommendation failed to add');
          // If the recommendation fails, set the failed recommendation place's ID
          handleOpenAddRecommendation(placeId, recommendation);
        }
      }
    }

    if (!placesStore.getAddError) {
      handleCloseAdd();
    }
  } catch (err) {
    console.error('Error adding place request:', err);
  }
};

// Recommendation
const handleOpenAddRecommendation = (placeId: string, recommendation: AddRecommendation) => {
  failedRecommendationPlaceId.value = placeId;
  failedRecommendation.value = recommendation;
  showRecommendationModal.value = true;
};

const handleCloseAddRecommendation = () => {
  showRecommendationModal.value = false;
  failedRecommendationPlaceId.value = null;
  failedRecommendation.value = null;
  recommendationsStore.clearErrors();
};

const handleAddRecommendation = async (placeId: string, recommendation: AddRecommendation): Promise<void> => {
  // If there are no recommendations, close the modal
  if (!recommendation) {
    handleCloseAddRecommendation();
    console.log('No recommendation provided');
  }
  else {
    const recommendationData: Partial<Recommendation> = {
      ...recommendation,
      place: failedRecommendationPlaceId.value!,
      _createdBy: authStore.getUserId!,
    };
    console.log('recommendationData', recommendationData);

    try {
      await recommendationsStore.addRecommendation(recommendationData, authStore.getToken!);

      if (!recommendationsStore.getAddError) {
        handleCloseAddRecommendation();
      }
    } catch (err) {
      console.error('Error adding recommendation request:', err);
    }
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
  document.addEventListener("click", closeProfileDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  document.removeEventListener("click", closeProfileDropdown);
});
</script>

<style scoped>
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }
</style>
