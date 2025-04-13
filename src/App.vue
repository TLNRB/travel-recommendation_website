<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { state } from '@/modules/states/state';
import Navbar from '@/components/nav-bar.vue'
import footerElement from '@/components/footer-element.vue';

import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();


const isLoading = computed(() => state.isLoading);

onMounted(() => {
  userStore.fetchUserData();
});
</script>

<template>
  <Navbar />
  <!-- Loading -->
  <div v-if="isLoading">Loading...</div>
  <RouterView v-else />
  <footerElement />
</template>

<style scoped></style>
