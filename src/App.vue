<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/nav-bar.vue'
import footerElement from '@/components/footer-element.vue';
</script>

<template>
  <Navbar/>
  <RouterView />
  <footerElement/>
</template>

<style scoped></style>
