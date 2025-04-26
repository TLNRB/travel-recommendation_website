<template>
   <section>
      <h2 class="text-xl font-semibold">City Images</h2>
      <!-- Error Message -->
      <div v-if="citiesStore.getError" class="text-red-500 text-center h-32">
         {{ citiesStore.getError }}
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
         <!-- Display Cards -->
         <CityImageCard v-if="cities" v-for="(city, index) in cities" :key="index" :city="city" />
         <div v-else class="text-gray-500">No cities to display.</div>

         <!-- Edit Card -->
         <!-- <UserEditModal v-if="showEditModal" :user="usersStore.getUserById(editUserId)" :roles="roles"
            :error="usersStore.getUpdateError" :loading="usersStore.getIsLoading" @submit="handleUpdateUserRole"
            @close="handleClose" /> -->
      </div> 
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import CityImageCard from '@/components/admin/cityImages/CityImageCard.vue';
// Stores
import { useCitiesStore } from '@/stores/crud/citiesStore';

const citiesStore = useCitiesStore();
const cities = computed(() => citiesStore.getUniqueCities);

onMounted(async () => { 
   await citiesStore.fetchUniqueCities();
   await citiesStore.fetchCityImages();
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