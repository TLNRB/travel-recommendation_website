<template>
   <section class="flex flex-col justify-between space-y-4">
      <div class="flex justify-between items-center">
         <h2 class="text-xl font-semibold">Collections</h2>
         <button @click="handleAdd"
            class="text-blue-600 text-sm hover:text-blue-800 font-medium duration-200 ease-in-out cursor-pointer">
            Add Collection
         </button>
      </div>
      <!-- Loader -->
      <div v-if="collectionsStore.getIsLoading" class="loader"></div>
      <!-- Error Message -->
      <div v-else-if="collectionsStore.getError" class="text-red-500 text-sm">{{ collectionsStore.getError }}</div>
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <!-- Display Cards -->
         <SettingsCollectionCard v-if="collections.length > 0" v-for="collection in collections" :key="collection._id"
            :collection="collection" :deleteError="collectionsStore.getDeleteError" @edit="handleEdit"
            @delete="handleDeleteCollection" />
         <div v-else class="text-gray-500">No collections to display.</div>

         <!-- Add Modal -->
         <CollectionAddModal v-if="showAddModal" :addError="collectionsStore.getAddError" :userId="authStore.getUserId"
            :loading="collectionsStore.getIsLoading" @submit="handleAddCollection" @close="handleCloseAdd" />

      </div>

   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// Components
import SettingsCollectionCard from '@/components/settings/collections/SettingsCollectionCard.vue';
import CollectionAddModal from '@/components/settings/collections/CollectionAddModal.vue';
// Stores
import { useCollectionsStore } from '@/stores/crud/collectionsStore'
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { Collection } from '@/interfaces/collectionTypes'

const collectionsStore = useCollectionsStore()
const authStore = useAuthStore();

const collections = computed(() => collectionsStore.getCollectionsByUserId(authStore.getUserId!))

//-- Add Collection
const showAddModal = ref<boolean>(false);

const handleAdd = () => {
   showAddModal.value = true
};

const handleCloseAdd = () => {
   showAddModal.value = false;
   collectionsStore.clearErrors();
};

const handleAddCollection = async (newCollection: Collection): Promise<void> => {
   try {
      await collectionsStore.addCollection(newCollection, authStore.getToken!)

      if (!collectionsStore.getAddError) {
         handleCloseAdd();
      }
   } catch (error) {
      console.error('Error adding collection: ', error)
   }
}

//-- Edit Collection
const handleEdit = (collectionId: string): void => {
   console.log('Edit Collection: ', collectionId)
}

//-- Delete Collection
const handleDeleteCollection = async (collectionId: string): Promise<void> => {
   console.log('Delete Collection: ', collectionId)
}

onMounted(async () => {
   await collectionsStore.fecthCollectionsByUserId(authStore.getUserId!, false, 'false')
});
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