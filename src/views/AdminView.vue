<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 mb-6 border-b">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="px-4 py-2 text-sm font-medium border-b-2"
        :class="{
          'border-blue-600 text-blue-600': activeTab === tab,
          'border-transparent text-gray-500 hover:text-gray-700': activeTab !== tab
        }"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'Requests'" class="space-y-4">
      <h2 class="text-xl font-semibold">Place Suggestions</h2>
      <div v-if="requests.length">
        <div v-for="(request, index) in requests" :key="index" class="bg-white shadow p-4 rounded-lg">
          <p><strong>Continent:</strong> {{ request.continent }}</p>
          <p><strong>Country:</strong> {{ request.country }}</p>
          <p><strong>City:</strong> {{ request.city }}</p>
          <p><strong>Place:</strong> {{ request.place }}</p>
          <p><strong>Recommendation:</strong> {{ request.recommendation }}</p>
          <a :href="request.link" class="text-blue-600 underline" target="_blank">Google Maps</a>
          <div class="mt-2 flex gap-2">
            <button class="text-green-600 hover:underline">Approve</button>
            <button class="text-red-600 hover:underline">Reject</button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">No requests at the moment.</div>
    </div>

    <div v-else-if="activeTab === 'Users'" class="space-y-4">
      <h2 class="text-xl font-semibold">Registered Users</h2>
      <div v-if="users.length">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white shadow p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Username:</strong> {{ user.username }}</p>
          </div>
          <button class="text-red-600 hover:underline">Delete</button>
        </div>
      </div>
      <div v-else class="text-gray-500">No users found.</div>
    </div>

    <div v-else-if="activeTab === 'Reported'" class="space-y-4">
      <h2 class="text-xl font-semibold">Reported Content</h2>
      <div class="text-gray-500 italic">Feature coming soon…</div>
    </div>

    <div v-else-if="activeTab === 'Places & Recommendations'" class="space-y-4">
      <h2 class="text-xl font-semibold">Approved Places & Recommendations</h2>
      <div v-if="places.length">
        <div
          v-for="place in places"
          :key="place.id"
          class="bg-white shadow p-4 rounded-lg"
        >
          <p><strong>Place:</strong> {{ place.name }}</p>
          <p><strong>Location:</strong> {{ place.city }}, {{ place.country }}</p>
          <p><strong>Recommended by:</strong> {{ place.recommendedBy }}</p>
        </div>
      </div>
      <div v-else class="text-gray-500">No data yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tabs = ['Requests', 'Users', 'Reported', 'Places & Recommendations'];
const activeTab = ref('Requests');

// Sample Data (replace with API later)
const requests = ref([
  {
    continent: 'Europe',
    country: 'Italy',
    city: 'Rome',
    place: 'Colosseum',
    link: 'https://maps.google.com',
    recommendation: 'A must-see historical wonder.'
  }
]);

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johnd' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janes' }
]);

const places = ref([
  { id: 1, name: 'Eiffel Tower', city: 'Paris', country: 'France', recommendedBy: 'Alice' },
  { id: 2, name: 'Mount Fuji', city: 'Fujinomiya', country: 'Japan', recommendedBy: 'Bob' }
]);
</script>
