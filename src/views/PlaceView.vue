<template>
  <div class="container-fluid bg-green-200 h-96 flex flex-col justify-between">
    <h1 class="text-2xl md:text-4xl lg:text-6xl mt-16 ms-16"> Place </h1>
    <RouterLink class="ms-16 w-16" to="/city">🔙</RouterLink>
  </div>
  <div class="container-fluid flex justify-center md:justify-end md:pe-4 bg-green-200">
        <div class="text-black px-16 py-3 rounded-t-xl bg-gray-100">
          Most Popular Places
        </div>
  </div>
  </template>
  <script setup lang="ts">
  import { RouterLink } from 'vue-router';
  // create a interface of a continent, create continents in db, make useContinents to fetch them,
  // display content based on clicked continent
  </script>
