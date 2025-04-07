<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">

    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <!-- Avatar -->
      <img
        src="https://i.pravatar.cc/150"
        alt="Profile picture"
        class="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
      />

      <!-- User Info -->
      <div class="text-center sm:text-left w-full">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold">John Doe</h2>
            <p class="text-gray-500 text-sm">@johndoe</p>
          </div>
          <button class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
        <p class="mt-2 text-gray-700">
          Passionate traveler. Sharing tips and hidden gems from around the world. 🌍✈️
        </p>
        <p class="text-sm text-gray-500 mt-1">📍 Berlin, Germany · Joined Jan 2022</p>

        <!-- Social Links -->
        <div class="flex gap-4 mt-3 justify-center sm:justify-start">
          <a href="#" class="text-blue-500 hover:underline">@Twitter</a>
          <a href="#" class="text-pink-600 hover:underline">@Instagram</a>
          <a href="#" class="text-gray-800 hover:underline">@Website</a>
        </div>
      </div>
    </div>

    <!-- Recommendations Section -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-semibold">Your Recommendations</h3>
        <button class="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Edit
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Placeholder Recommendations -->
        <div class="p-4 border rounded-lg shadow-sm">
          <h4 class="font-medium">Top Cafés in Paris</h4>
          <p class="text-sm text-gray-600">Shared 3 days ago</p>
        </div>
        <div class="p-4 border rounded-lg shadow-sm">
          <h4 class="font-medium">Best Street Food in Bangkok</h4>
          <p class="text-sm text-gray-600">Shared 1 week ago</p>
        </div>
      </div>
    </div>

    <!-- Collections Section -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-semibold">Your Collections</h3>
        <button class="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Edit
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <!-- Placeholder Collections -->
        <div class="bg-gray-100 rounded-lg p-4 text-center shadow-sm">
          <p class="font-medium">Hidden Beaches 🌊</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4 text-center shadow-sm">
          <p class="font-medium">Weekend Getaways 🚗</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-4 text-center shadow-sm">
          <p class="font-medium">Foodie Heaven 🍜</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// Later you'll inject props or pull user data from your store/API
</script>

