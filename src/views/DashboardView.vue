<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Dashboard</h1>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" class="px-4 py-2 text-sm font-medium border-b-2"
        :class="{
          'border-blue-600 text-blue-600': activeTab === tab,
          'border-transparent text-gray-500 hover:text-gray-700 cursor-pointer': activeTab !== tab
        }">
        {{ tab }}
      </button>
    </div>

    <!-- Requests Tab -->
    <PlaceRequestsSection v-if="activeTab === 'Requests'" />

    <!-- Users Tab -->
    <UsersSection v-else-if="activeTab === 'Users'" />

    <!-- Approved Places Tab -->
    <PlacesSections v-else-if="activeTab === 'Places'" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
//-- Components
import PlaceRequestsSection from '@/components/admin/requests/PlaceRequestsSection.vue';
import PlacesSections from '@/components/admin/places/PlacesSection.vue';
import UsersSection from '@/components/admin/users/UsersSection.vue';

const tabs = ['Requests', 'Places', 'Users'];
const activeTab = ref('Requests');

// Sample Data (replace with API later)


const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johnd' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janes' }
]);

const places = ref([
  { id: 1, name: 'Eiffel Tower', city: 'Paris', country: 'France', recommendedBy: 'Alice' },
  { id: 2, name: 'Mount Fuji', city: 'Fujinomiya', country: 'Japan', recommendedBy: 'Bob' }
]);
</script>
