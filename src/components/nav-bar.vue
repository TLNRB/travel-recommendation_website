<template>
  <nav v-if="route.path !== '/auth'"
    class="flex justify-between gap-10 items-center py-3 px-6 space-x-4 bg-gray-100  text-black">
    <div class="flex gap-4 items-center w-64 justify-center">
      <RouterLink to="/">
        <img class="w-16 h-16" src="../assets/images/planet-2.svg" alt="logo">
      </RouterLink>
      <div class="relative">
        <button @click="toggleDropdown" class="px-4 py-2  text-black rounded-lg flex items-center">
          Explore
          <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="isOpen" class="absolute left-0 mt-2 w-auto bg-white rounded-lg shadow-lg">
          <continentList />
        </div>
      </div>
    </div>
    <div class="flex w-64 justify-center">
      <button @click="showModal = true"
        class="px-4 py-2 bg-blue-200 hover:bg-blue-400 text-black rounded transition text-sm">
        Suggest a Place
      </button>
      <SuggestPlaceModal v-if="showModal" @close="showModal = false" @submit="handleSuggestion" />
    </div>
    <div class="flex gap-4 items-center w-64 justify-center">
      <div v-if="authStore.isLoggedIn" class="relative">
        <img @click="toggleProfileDropdown" src="https://i.pravatar.cc/40" alt="avatar"
          class="w-10 h-10 rounded-full cursor-pointer border border-gray-300" />

        <!-- Dropdown -->
        <div v-if="profileDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg pt-2 z-50">
          <RouterLink to="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100">Profile</RouterLink>
          <RouterLink to="/settings" class="block px-4 py-2 text-sm hover:bg-gray-100">Settings</RouterLink>
          <RouterLink to="/dashboard" class="block px-4 py-2 text-sm hover:bg-gray-100">Dashboard</RouterLink>
          <LogoutBtn />
        </div>
      </div>

      <!-- If not logged in -->
      <RouterLink v-else to="/auth" class="text-blue-600 hover:underline">
        Login
      </RouterLink>
    </div>
  </nav>


  <!-- Navbar for the auth page -->
  <nav v-else class="absolute m-5">
    <RouterLink to="/">
      <img class="w-32 h-32" src="../assets/images/planet-2.svg" alt="logo">
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useUsers } from '@/modules/auth/useUsers';
import LogoutBtn from '@/components/logoutBtn.vue';
import SuggestPlaceModal from '@/components/suggestionModal.vue';
import continentList from '@/components/continentList.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const { token } = useUsers();
// fix the state not being updated reactively for some reason, after the refresh the state
//correctly displays

console.log(token.value)
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

onMounted(() => {
  document.addEventListener("click", closeDropdown);
  document.addEventListener("click", closeProfileDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  document.removeEventListener("click", closeProfileDropdown);
});
</script>
