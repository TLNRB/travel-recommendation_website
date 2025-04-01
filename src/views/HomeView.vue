<script setup lang="ts">
import { ref } from 'vue'
import LogoutBtn from '@/components/logoutBtn.vue';

const activeTab = ref<'destinations' | 'atractions'>('destinations');

</script>

<template>
  <main>
    <!-- Search Section -->
    <div class="container-fluid bg-gray-100 mx-auto px-4 sm:px-16 lg:px-64 xl:px-80 2xl:px-96 py-8">
        <!-- Search  -->
      <div class="mb-8 w-full">
        <div class="flex gap-4 justify-start mb-4">
          <span class="cursor-pointer px-3 py-1 ">All</span>
          <span class="cursor-pointer px-3 py-1">Museums</span>
          <span class="cursor-pointer px-3 py-1 rounded">Monuments</span>
          <span class="cursor-pointer px-3 py-1">Beaches</span>
          <span class="cursor-pointer px-3 py-1">etc.</span>
        </div>
        <div class="w-full">
          <input
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-3 border rounded-2xl shadow-md"
          />
        </div>
      </div>

      <!-- Most Rated -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Most Rated</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
          <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
          <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
          <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
          <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
          <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Tabs for the Top Section -->
    <div class="container-fluid flex justify-start ps-4 gap-2 bg-gray-100">
      <button
      :class="{ 'text-blue-600': activeTab === 'destinations',
      'text-gray-500': activeTab !== 'destinations' }"
      @click="activeTab = 'destinations'"
      class="text-black px-16 py-3 rounded-t-xl bg-white">
        Top Destinations
      </button>
      <button
      :class="{ 'text-blue-600': activeTab === 'atractions',
      'text-gray-500': activeTab !== 'atractions' }"
      @click="activeTab = 'atractions'"
       class="text-black px-16 py-3 rounded-t-xl bg-white">
        Top Atractions
      </button>
    </div>

    <!-- Top Section -->
     <div v-if="activeTab === 'destinations'" class="container-fluid flex justify-center">
        <!-- Destinations tab -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-10 py-32">
            <div class="w-50 h-80 bg-green-400 rounded-xl"></div>
            <div class="w-50 h-80 bg-green-400 rounded-xl"></div>
            <div class="w-50 h-80 bg-green-400 rounded-xl"></div>
            <div class="w-50 h-80 bg-green-400 rounded-xl"></div>
          </div>
     </div>
     <div v-if="activeTab === 'atractions'" class="container-fluid flex justify-center">
        <!-- Atractions tab -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-10 py-32">
            <div class="w-50 h-80 bg-blue-400 rounded-xl"></div>
            <div class="w-50 h-80 bg-blue-400 rounded-xl"></div>
            <div class="w-50 h-80 bg-blue-400 rounded-xl"></div>
            <div class="w-50 h-80 bg-blue-400 rounded-xl"></div>
          </div>
     </div>
    <LogoutBtn />
  </main>
</template>
