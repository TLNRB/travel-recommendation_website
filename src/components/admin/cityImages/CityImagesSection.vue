<template>
   <section>
      <h2 class="text-xl font-semibold">City Images</h2>
      <div class="flex space-x-4 mt-4">
         <!-- Tabs -->
         <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="[
            'relative px-4 py-2 rounded-full border text-sm text-gray-800 font-medium duration-[.15s] ease-in cursor-pointer',
            activeTab === tab ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' : 'bg-transparent border-gray-200 hover:border-gray-300'
         ]">
            {{ tab }}
            <span v-if="tab === 'Active' && activeCitiesCount > 0"
               class="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center border-[1.5px] border-white">
               {{ activeCitiesCount }}
            </span>
            <span v-else-if="tab === 'Missing'"
               class="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center border-[1.5px] border-white">
               {{ missingCitiesCount }}
            </span>
            <span v-else-if="tab === 'Unused'"
               class="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center border-[1.5px] border-white">
               {{ unusedCitiesCount }}
            </span>
         </button>
      </div>
      <!-- Error Message -->
      <div v-if="citiesStore.getError" class="text-red-500 text-center h-32">
         {{ citiesStore.getError }}
      </div>
      <div v-else>
         <!-- Display Cards Based On Active Tab -->
         <div v-if="activeTab === 'Active'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CityImageCard v-if="Object.keys(activeCities).length"
               v-for="([cityKey, city]) in Object.entries(activeCities)" :key="cityKey" :city="city" :cityKey="cityKey"
               tab="Active" @edit="handleEdit" />
            <div v-else class="text-gray-500">No cities to display.</div>
         </div>
         <div v-else-if="activeTab === 'Missing'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CityImageCard v-if="Object.keys(missingCities).length"
               v-for="([cityKey, city]) in Object.entries(missingCities)" :key="cityKey" :city="city" :cityKey="cityKey"
               tab="Missing" @edit="handleEdit" />
            <div v-else class="text-gray-500">No cities to display.</div>
         </div>
         <div v-else-if="activeTab === 'Unused'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CityImageCard v-if="Object.keys(unusedCities).length"
               v-for="([cityKey, city]) in Object.entries(unusedCities)" :key="cityKey" :city="city" :cityKey="cityKey"
               tab="Unused" @edit="handleEdit" @delete="handleDelete" />
            <div v-else class="text-gray-500">No cities to display.</div>
         </div>
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
// Interfaces
import type { CityImage, UniqueCity } from '@/interfaces/cityImageTypes';

const citiesStore = useCitiesStore();

//-- Computed City Lists
const activeCities = computed(() => {
   const result: Record<string, CityImage> = {};

   for (const key in citiesStore.getUniqueCities) {
      if (citiesStore.getCityImagesMap[key]) {
         result[key] = citiesStore.getCityImagesMap[key];
      }
   }

   console.log('Active Cities:', result);
   return result;
})

const missingCities = computed(() => {
   const result: Record<string, UniqueCity> = {};

   for (const key in citiesStore.getUniqueCities) {
      if (!citiesStore.getCityImagesMap[key]) {
         result[key] = {
            name: citiesStore.getUniqueCities[key].name,
            country: citiesStore.getUniqueCities[key].country,
         };
      }
   }

   console.log('Missing Cities:', result);
   return result;
});

const unusedCities = computed(() => {
   const result: Record<string, CityImage> = {};

   for (const key in citiesStore.getCityImagesMap) {
      if (!citiesStore.getUniqueCities[key]) {
         result[key] = citiesStore.getCityImagesMap[key];
      }
   }

   console.log('Unused Cities:', result);
   return result;
});

const activeCitiesCount = computed(() => Object.keys(activeCities.value).length);
const missingCitiesCount = computed(() => Object.keys(missingCities.value).length);
const unusedCitiesCount = computed(() => Object.keys(unusedCities.value).length);

//-- Edit
const handleEdit = (cityKey: string) => {
   console.log('Edit City:', cityKey);
};

//-- Delete
const handleDelete = (cityKey: string) => {
   console.log('Delete City:', cityKey);
};

//-- Tabs
const tabs = ['Active', 'Missing', 'Unused'];
const activeTab = ref('Active');

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