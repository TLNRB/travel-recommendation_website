<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 space-y-8 md:px-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <!-- Avatar -->
      <img v-if="user?.profilePicture" :src="user?.profilePicture" alt="Profile picture"
        class="w-32 h-32 rounded-full border-4 border-blue-500 object-cover" />
      <div v-else class="min-w-32 min-h-32 w-32 h-32 rounded-full bg-white border-[1px] border-gray-400">
        <!-- Initial first letter -->
        <span class="text-4xl text-blue-500 flex items-center justify-center h-full">
          {{ user?.firstName.charAt(0) }}{{ user?.lastName.charAt(0) }}
        </span>
      </div>

      <!-- User Info -->
      <div class="text-center sm:text-left w-full">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">{{ user?.firstName }} {{ user?.lastName }}</h2>
            <p class="text-gray-500 text-sm">@{{ user?.username }}</p>
          </div>
          <button class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
        <p v-if="user?.bio" class="mt-2 text-gray-700">
          {{ user?.bio }} 🌍✈️
        </p>
        <div class="flex text-sm text-gray-500 mt-1">
          <div v-if="user?.city || user?.country" class="flex items-center">
            📍
            <span v-if="user?.city">{{ user?.city }},&nbsp;</span>
            <span v-if="user?.country">{{ user?.country }}&nbsp;</span>
          </div>
          <span>· Joined {{ new Date(user?.registerDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }) }}</span>
        </div>

        <!-- Social Links -->
        <div class="flex gap-4 mt-3 justify-center sm:justify-start">
          <a href="#" class="text-blue-500 hover:underline">@Twitter</a>
          <a href="#" class="text-pink-600 hover:underline">@Instagram</a>
          <a href="#" class="text-gray-800 hover:underline">@Website</a>
        </div>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-semibold">Your Recommendations</h3>
        <button class="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Edit
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Placeholder Recommendations -->
        <div class="p-4 border rounded-lg shadow-sm">
          <h4 class="font-medium">Top Cafés in Paris</h4>
          <p class="text-sm text-gray-600">Shared 3 days ago</p>
        </div>
        <div class="p-4 border rounded-lg shadow-sm">
          <h4 class="font-medium">Best Street Food in Bangkok</h4>
          <p class="text-sm text-gray-600">Shared 1 week ago</p>
        </div>
      </div>
    </div>

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
import { computed } from 'vue';
// Stores
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const user = computed(() => userStore.getUser);
</script>
