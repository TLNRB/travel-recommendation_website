<template>
  <div class="max-w-3xl mx-auto px-4 py-8 space-y-10">

    <!-- Page Header -->
    <h1 class="text-3xl font-bold mb-6 text-center sm:text-left">Settings</h1>

    <!-- Account Settings -->
    <section class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Account</h2>
        <button class="text-sm text-blue-600 hover:underline">Edit</button>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Username</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200" value="johndoe123" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-600">Email</label>
          <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200" value="john@example.com" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Change Password</label>
          <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 mt-1" placeholder="New Password" />
        </div>
      </div>
    </section>

    <!-- Preferences -->
    <section class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Preferences</h2>
        <button class="text-sm text-blue-600 hover:underline">Edit</button>
      </div>
      <div class="bg-white p-4 rounded-lg shadow grid gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-600">Language</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 mt-1">
            <option>English</option>
            <option>German</option>
            <option>Spanish</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Theme</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 mt-1">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Privacy Settings -->
    <section class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Privacy</h2>
        <button class="text-sm text-blue-600 hover:underline">Edit</button>
      </div>
      <div class="bg-white p-4 rounded-lg shadow space-y-4">
        <div class="flex justify-between items-center">
          <span>Make my profile public</span>
          <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600" checked />
        </div>
        <div class="flex justify-between items-center">
          <span>Allow message requests</span>
          <input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 " />
        </div>
      </div>
    </section>

    <!-- Danger Zone -->
    <section>
      <h2 class="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
      <div class="bg-red-50 p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p class="text-red-800 mb-2 sm:mb-0">Permanently delete your account and all associated data.</p>
        <button class="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete Account
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// You’ll later hook up v-models and API calls here
</script>


