<template>
   <section>
      <h2 class="text-xl font-semibold">Place Requests</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <PlaceRequestCard v-if="places" v-for="(place, index) in places" :key="index" :place="place" :index="index" />
         <div v-else class="text-gray-500">No place requests yet.</div>
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PlaceRequestCard from '@/components/admin/requests/PlaceRequestCard.vue';

const places = ref([
   {
      location: {
         continent: 'Europe',
         country: 'Italy',
         city: 'Rome',
         street: 'Via dei Fori Imperiali',
         streetNumber: '1A'
      },
      tags: ['historical', 'tourist'],
      name: 'Colosseum',
      description: 'An ancient amphitheater in the center of Rome.',
      images: ['https://picsum.photos/400/400'],
      recommendation: 'A must-see historical wonder of the world, especially at sunset.',
      upvotes: 120,
   },
   {
      location: {
         continent: 'Europe',
         country: 'Italy',
         city: 'Rome',
         street: 'Via dei Fori Imperiali',
         streetNumber: '1A'
      },
      tags: ['historical', 'tourist'],
      name: 'Colosseum',
      description: 'An ancient amphitheater in the center of Rome.',
      images: ['https://picsum.photos/400/400'],
      recommendation: 'A must-see historical wonder of the world, especially at sunset.',
      upvotes: 120,
   }
]);
</script>