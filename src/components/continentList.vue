<template>
  <ul class="py-2">
    <li v-for="continent in externalAPIStore.getContinents" :key="continent.objectId"
      class="px-4 py-2 hover:bg-gray-200" @click="selectContinent(continent)">

      <RouterLink class="block w-full h-full" :to="`/continent/${continent.objectId}`">
        {{ continent.name }}
      </RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { defineEmits } from 'vue';
// Stores
import { useExternalAPIStore } from '@/stores/externalAPIStore';

const externalAPIStore = useExternalAPIStore();

const emit = defineEmits(['continentSelected']);

const selectContinent = (continent: object) => {
  emit('continentSelected', continent);
};

onMounted(async () => {
  await externalAPIStore.fetchContinents()
})
</script>
