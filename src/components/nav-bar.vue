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
          <button @click="showModal = true"
            class="px-4 py-2 bg-blue-200 hover:bg-blue-400 text-black rounded transition text-sm">
            Suggest a Place
          </button>
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

    <div class="relative z-50">
       <SuggestPlaceModal v-if="showModal" @close="showModal = false" @submit="handleSuggestion" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useUsers } from '@/modules/auth/useUsers';
import LogoutBtn from '@/components/logoutBtn.vue';
import SuggestPlaceModal from '@/components/suggestionModal.vue';
import continentList from '@/components/continentList.vue';
// Stores
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

const authStore = useAuthStore();
const userStore = useUserStore();

const { token } = useUsers();

//correctly displays

console.log(token.value)
const mobileMenuOpen = ref(false);
const showModal = ref(false);
const route = useRoute();
const isOpen = ref(false);
const profileDropdownOpen = ref(false)
const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value
}
const handleSuggestion = (placeData: {
  continent: string;
  country: string;
  city: string;
  place: string;
  link: string;
  recommendation: string;
}) => {
  console.log('User submitted place suggestion:', placeData);
  alert('Thanks for your suggestion!');
};

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

const openSuggestModalAndCloseMenu = () => {
    showModal.value = true;
    mobileMenuOpen.value = false;
}

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
