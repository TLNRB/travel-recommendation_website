<template>
  <footer class="bg-white text-black py-6 border-t-[1px] border-gray-300">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <!-- Logo and Name -->
      <div class="flex items-center">
        <RouterLink to="/">
          <img class="w-16 h-16" src="../assets/images/planet-2.svg" alt="logo">
        </RouterLink>
      </div>

      <!-- Navigation Links -->
      <div class="flex justify-end gap-6 text-sm mt-4 md:ml-[52px] md:mt-0">
        <RouterLink to="/" class="hover:text-blue-500 duration-[.2s] ease-in-out">Home</RouterLink>
        <RouterLink v-if="userStore.getUser?._id" :to="`/profile/${userStore.getUser?._id}`"
          class="hover:text-blue-500 duration-[.2s] ease-in-out">
          Profile</RouterLink>
        <RouterLink v-else to="/auth" class="hover:text-blue-500 duration-[.2s] ease-in-out">Login</RouterLink>
      </div>

      <!-- Social Media Links -->
      <div class="flex gap-[10px] mt-6 justify-start md:mt-0">
        <a v-for="(social, index) in socials" :key="index" :href="social.link" target="_blank"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-gray-500 duration-[.2s] ease-in-out">
          <i class="bx text-[18px]" :class="social.icon"></i>
        </a>
      </div>
    </div>

    <!-- Copyright -->
    <div class="text-center text-sm mt-6">© 2025 All rights reserved.</div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
// Stores
import { useUserStore } from '@/stores/userStore';

// Data
const socials = [
  { icon: 'bx bxl-facebook', link: 'https://www.facebook.com/' },
  { icon: 'bx bxl-twitter', link: 'https://twitter.com/' },
  { icon: 'bx bxl-instagram', link: 'https://www.instagram.com/' }
];

const userStore = useUserStore();
</script>
