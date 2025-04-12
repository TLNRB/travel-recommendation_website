<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { state } from '@/modules/states/state';
import Navbar from '@/components/nav-bar.vue'
import footerElement from '@/components/footer-element.vue';


const isLoading = computed(() => state.isLoading);
</script>

<template>
  <Navbar />
  <!-- Loading -->
  <div v-if="isLoading">Loading...</div>
  <RouterView v-else />
  <footerElement />
</template>

<style scoped></style>
