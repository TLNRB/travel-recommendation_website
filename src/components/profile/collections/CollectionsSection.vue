<template>
   <section class="mt-16">
      <h2 class="text-xl font-bold mb-4">Collections</h2>

      <div v-if="collectionsStore.getIsLoading" class="loader"></div>

      <div v-else-if="collections.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <CollectionCard v-for="collection in collections" :key="collection._id" :collection="collection" />
      </div>

      <div v-else-if="collectionsStore.getError" class="text-red-500 text-sm">{{ collectionsStore.getError }}</div>

      <div v-else class="text-gray-500">No collections to display.</div>
   </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// Components
import CollectionCard from '@/components/profile/collections/CollectionCard.vue';
// Stores
import { useCollectionsStore } from '@/stores/crud/collectionsStore'
import { useAuthStore } from '@/stores/authStore';

const collectionsStore = useCollectionsStore()
const authStore = useAuthStore();

//-- Router
const route = useRoute()

//-- Props
const props = defineProps({
   userId: { type: String, required: true }
})

const collections = computed(() => collectionsStore.getCollectionsByUserId(props.userId))
</script>

<style scoped>
.loader {
   border: 3px solid #afafaf;
   border-top: 3px solid #404040;
   border-radius: 50%;
   width: 18px;
   height: 18px;
   animation: spin 1s linear infinite;
   display: flex;
   margin-inline: auto;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}
</style>