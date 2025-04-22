<template>
    <ul class="py-2">
              <li v-for="continent in continents"
                :key="continent.objectId"
                class="px-4 py-2 hover:bg-gray-200"
                @click="selectContinent(continent)">

                <RouterLink  class="block w-full h-full" :to="`/continent/${continent.objectId}`">
                    {{ continent.name }}
                </RouterLink>
              </li>
    </ul>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { externalAPI } from '@/modules/api/externalFetch';
import { defineEmits } from 'vue';

const emit = defineEmits(['continentSelected']);

const selectContinent = (continent: object) => {
  emit('continentSelected', continent);
};
const {fetchContinents, continents } = externalAPI()

onMounted(() => {
  fetchContinents()
})
</script>
