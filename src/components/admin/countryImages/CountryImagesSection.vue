<template>
   <section>
      <h2 class="text-xl font-semibold">Country Images</h2>
      <div class="flex space-x-4 mt-4">
         <!-- Tabs -->
         <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="[
            'relative px-4 py-2 rounded-full border text-sm text-gray-800 font-medium duration-[.15s] ease-in cursor-pointer',
            activeTab === tab ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' : 'bg-transparent border-gray-200 hover:border-gray-300'
         ]">
            {{ tab }}
            <span v-if="tab === 'Active' && activeCountriesCount > 0"
               class="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center border-[1.5px] border-white">
               {{ activeCountriesCount }}
            </span>
            <span v-else-if="tab === 'Missing'"
               class="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center border-[1.5px] border-white">
               {{ missingCountriesCount }}
            </span>
            <span v-else-if="tab === 'Unused'"
               class="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-[20px] h-[20px] flex items-center justify-center border-[1.5px] border-white">
               {{ unusedCountriesCount }}
            </span>
         </button>
      </div>
      <!-- Error Message -->
      <div v-if="countriesStore.getError" class="text-red-500 text-center h-32">
         {{ countriesStore.getError }}
      </div>
      <div v-else>
         <!-- Display Cards Based On Active Tab -->
         <div v-if="activeTab === 'Active'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CountryImageCard v-if="activeCountries.length" v-for="country in activeCountries" :key="country.name"
               :country="country" tab="Active" @edit="handleEdit" />
            <div v-else class="text-gray-500">No countries to display.</div>
         </div>
         <div v-else-if="activeTab === 'Missing'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CountryImageCard v-if="missingCountries.length" v-for="country in missingCountries" :key="country"
               :country="country" tab="Missing" @edit="handleEdit" />
            <div v-else class="text-gray-500">No countries to display.</div>
         </div>
         <div v-else-if="activeTab === 'Unused'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <CountryImageCard v-if="unusedCountries.length" v-for="country in unusedCountries" :key="country.name"
               :deleteError="countriesStore.getDeleteError" :country="country" tab="Unused" @edit="handleEdit"
               @delete="handleDelete" />
            <div v-else class="text-gray-500">No countries to display.</div>
         </div>
         <!-- Edit Card -->
         <CountryImageEditModal v-if="showEditModal"
            :country="activeTab !== 'Missing' ? countriesStore.getCountryImagesByName(editCountryName!) : countriesStore.getUniqueCountryByName(editCountryName!)"
            :addError="countriesStore.addError" :updateError="countriesStore.getUpdateError"
            :loading="countriesStore.getIsLoading" @submit="handleSubmit" @close="handleCloseEdit" />
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// Components
import CountryImageCard from '@/components/admin/countryImages/CountryImageCard.vue';
import CountryImageEditModal from '@/components/admin/countryImages/CountryImageEditModal.vue';
// Stores
import { useCountriesStore } from '@/stores/crud/countriesStore';
import { useAuthStore } from '@/stores/authStore';
// Interfaces
import type { CountryImage, EditCountryImage } from '@/interfaces/countryImageTypes';

const countriesStore = useCountriesStore();
const authStore = useAuthStore();

//-- Computed Country Lists
const activeCountries = computed(() => {
   const result: CountryImage[] = [];

   for (const country of countriesStore.getUniqueCountries) {
      const countryImage: CountryImage | null = countriesStore.getCountryImagesByName(country);

      if (countryImage) {
         result.push(countryImage);
      }
   }

   console.log('Active Countries:', result);
   return result;
})

const missingCountries = computed(() => {
   const result: string[] = [];

   for (const country of countriesStore.getUniqueCountries) {
      const countryImage: CountryImage | null = countriesStore.getCountryImagesByName(country);

      if (!countryImage) {
         result.push(country);
      }
   }

   console.log('Missing Cities:', result);
   return result;
});

const unusedCountries = computed(() => {
   const result: CountryImage[] = [];

   for (const countryImage of countriesStore.getCountryImages) {
      const country: string | null = countriesStore.getUniqueCountryByName(countryImage.name);
      if (!country) {
         result.push(countryImage);
      }
   }

   console.log('Unused Cities:', result);
   return result;
});

const activeCountriesCount = computed(() => activeCountries.value.length);
const missingCountriesCount = computed(() => missingCountries.value.length);
const unusedCountriesCount = computed(() => unusedCountries.value.length);

// Edit Modal
const showEditModal = ref<boolean>(false);
const editCountryName = ref<string | null>(null);

const handleEdit = (countryId: string) => {
   editCountryName.value = countryId;
   showEditModal.value = true;
};

const handleCloseEdit = () => {
   showEditModal.value = false;
   editCountryName.value = null;
   countriesStore.clearErrors();
};

// Handle Submit for Update or Add
const handleSubmit = (countryData: EditCountryImage, countryId: string) => {
   if (activeTab.value === 'Missing') handleAddCountry(countryData);
   else handleUpdateCountry(countryData, countryId);
}

//-- Edit
const handleUpdateCountry = async (updatedCountry: EditCountryImage, countryId: string) => {
   console.log('Update Country:', updatedCountry, countryId);

   try {
      await countriesStore.updateCountryImage(countryId, updatedCountry, authStore.getToken!);
      if (!countriesStore.getUpdateError) {
         handleCloseEdit();
      }
   } catch (err) {
      console.error('Error updating country image:', err);
   }
};

//-- Add
const handleAddCountry = async (newCountry: EditCountryImage): Promise<void> => {
   console.log('Add Country:', newCountry);
   try {
      await countriesStore.addCountryImage(newCountry, authStore.getToken!)

      if (!countriesStore.getAddError) {
         handleCloseEdit();
      }
   }
   catch (err) {
      console.error('Error adding country image:', err);
   }
};

//-- Delete
const handleDelete = async (countryId: string) => {
   console.log('Delete Country:', countryId);

   try {
      await countriesStore.deleteCountryImage(countryId, authStore.getToken!);

      if (!countriesStore.getDeleteError) {
         handleCloseEdit();
      }
   } catch (err) {
      console.error('Error deleting country image:', err);
   }
};

//-- Tabs
const tabs = ['Active', 'Missing', 'Unused'];
const activeTab = ref('Active');

onMounted(async () => {
   await countriesStore.fetchUniqueCountries();
   await countriesStore.fetchCountryImages();
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