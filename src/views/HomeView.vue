<script setup lang="ts">
import { ref } from 'vue'
import LogoutBtn from '@/components/logoutBtn.vue';
import footerElement from '@/components/footer-element.vue';

const activeTab = ref<'destinations' | 'atractions'>('destinations');
const activeTabTwo = ref<'beaches' | 'museums' | 'monuments' | 'other'>('beaches');

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

  <!-- Title for the inspired section -->
    <div class="container-fluid flex justify-end pe-4">
      <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
        Top Atractions
      </div>
    </div>

     <!-- Get Inspired Section -->
    <div class="container-fluid flex flex-col md:flex-row bg-gray-100 ">
        <!-- tabs for get inspired also needs some scaling and fixing and visual stuff -->
        <div class="w-full md:w-1/4 flex flex-row md:flex-col justify-start">
          <button @click="activeTabTwo = 'beaches'" class="py-6 px-4 border-b border-e">
            Beaches
          </button>
          <button @click="activeTabTwo = 'museums'" class="py-6 px-4 border-b">
            Museums
          </button>
          <button @click="activeTabTwo = 'monuments'" class="py-6 px-4 border-b">
            Monuments
          </button>
          <button @click="activeTabTwo = 'other'" class="py-6 px-4 border-b">
            Other
          </button>
        </div>
        <!-- Get Inspired fields -->
        <div v-if="activeTabTwo === 'beaches'" class="w-full flex justify-center md:w-3/4  bg-gray-100">
          <div class="grid grid-cols-2 mx-auto md:grid-cols-2 gap-4 px-10 py-10">
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div v-if="activeTabTwo === 'museums'" class="w-full flex justify-center md:w-3/4  bg-gray-100">
          <div class="grid grid-cols-2 mx-auto md:grid-cols-2 gap-4 px-10 py-10">
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-gray-600 rounded-lg"></div>
          </div>
        </div>
        <div v-if="activeTabTwo === 'monuments'" class="w-full flex justify-center md:w-3/4  bg-gray-100">
          <div class="grid grid-cols-2 mx-auto md:grid-cols-2 gap-4 px-10 py-10">
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-red-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-red-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-red-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-red-200 rounded-lg"></div>
          </div>
        </div>
        <div v-if="activeTabTwo === 'other'" class="w-full flex justify-center md:w-3/4  bg-gray-100">
          <div class="grid grid-cols-2 mx-auto md:grid-cols-2 gap-4 px-10 py-10">
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-green-600 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-green-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-green-200 rounded-lg"></div>
            <div class="w-40 h-28 md:w-64 md:h-40 2xl:w-72 2xl:h-54 bg-green-200 rounded-lg"></div>
          </div>
        </div>
    </div>

     <!-- Where next title  -->
    <div class="container-fluid flex justify-start ps-4 bg-gray-100">
        <div class="text-black px-16 py-3 rounded-t-xl bg-white">
          Where to go next?
        </div>
    </div>
      <!-- Where next Section -->
    <div class="container-fluid w-full flex justify-center">
      <div class="grid grid-cols-2 mx-auto lg:grid-cols-4 gap-4 px-10 py-10">
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
            <div class="w-40 h-28 sm:w-52 sm:h-32 md:w-64 md:h-40  bg-gray-600 rounded-lg"></div>
      </div>
    </div>

    <!-- FAQ Section -->
     <div class="container-fluid h-32 p-6 bg-green-100">
        <h2 class="font-bold text-2xl flex justify-center"> Any additional Questions? </h2>
        <h3 class=" font-bold text-lg"> sample question </h3>
        <p class="ms-4"> sample answer sample answer sample answer sample answer </p>
        <p class="flex justify-end">link to faq page maybe idk</p>
     </div>

     <!-- Footer -->
    <footerElement/>

    <LogoutBtn />
  </main>
</template>
