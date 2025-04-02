<template>
  <footer class="bg-gray-100 text-black py-6">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <!-- Logo and Name -->
      <div class="flex items-center">
        <RouterLink to="/">
          <img class="w-16 h-16" src="../assets/images/planet-2.svg" alt="logo">
        </RouterLink>
      </div>

      <!-- Navigation Links -->
      <div class="flex justify-end gap-6 text-sm mt-4 md:mt-0">
        <RouterLink to="/about" class="hover:underline">About Us</RouterLink>
        <RouterLink to="/contact" class="hover:underline">Contact</RouterLink>
        <RouterLink to="/privacy" class="hover:underline">Privacy Policy</RouterLink>
        <RouterLink to="/terms" class="hover:underline">Terms of Service</RouterLink>
      </div>

      <!-- Social Media Links -->
      <div class="flex gap-4 mt-4 md:mt-0">
        <a href="#" class="hover:text-gray-600">fb</a>
        <a href="#" class="hover:text-gray-600">tw</a>
        <a href="#" class="hover:text-gray-600">ig</a>
      </div>
    </div>

    <!-- Copyright -->
    <div class="text-center text-sm mt-6">© 2025 Explore the World. All rights reserved.</div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
