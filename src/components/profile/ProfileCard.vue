<template>
  <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
    <!-- Avatar -->
    <img v-if="props.user?.profilePicture" :src="props.user?.profilePicture" alt="Profile picture"
      class="w-32 h-32 rounded-full object-cover"
      :class="props.user.profilePicture ? 'border-1 border-gray-300' : 'border-4 border-blue-500'" />
    <div v-else class="min-w-32 min-h-32 w-32 h-32 rounded-full bg-white border-[1px] border-gray-400">
      <!-- Initial first letter -->
      <span class="text-4xl text-blue-500 flex items-center justify-center h-full">
        {{ props.user?.firstName.charAt(0) }}{{ props.user?.lastName.charAt(0) }}
      </span>
    </div>

    <!-- User Info -->
    <div class="text-center sm:text-left w-full">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold">{{ props.user?.firstName }} {{ props.user?.lastName }}</h2>
          <div class="flex items-center gap-2">
            <p class="text-gray-500 text-sm">@{{ props.user?.username }}</p>
            <span class="text-gray-500 text-sm">·</span>
            <span v-if="roleName !== 'User'" class="text-sm font-medium text-blue-500">
              {{ roleName }}
            </span>
          </div>
        </div>
        <RouterLink to="/settings" v-if="authStore.isLoggedIn && authStore.getUserId === route.params.id"
          class="bg-blue-600 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 ease-in-out cursor-pointer">
          Edit Profile
        </RouterLink>
      </div>

      <!-- Location and register date -->
      <div class="mt-2 flex gap-2 text-sm text-gray-500">
        <div v-if="props.user?.city || props.user?.country" class="flex items-center">
          📍
          <span v-if="props.user?.city">{{ props.user?.city }},&nbsp;</span>
          <span v-if="props.user?.country">{{ props.user?.country }}</span>
        </div>
        <span v-if="props.user?.city || props.user?.country" class="text-sm text-gray-500">·</span>
        <span>Joined {{ new Date(props.user?.registerDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }) }}</span>
      </div>

      <!-- Bio -->
      <p v-if="props.user?.bio" class="mt-6 text-gray-700">
        {{ props.user?.bio }}
      </p>

      <!-- Socials -->
      <div v-if="props.user?.socials.length >= 0" class="flex gap-[10px] mt-6 justify-center sm:justify-start">
        <a v-for="(social, index) in props.user.socials" :key="index" :href="social.link" target="_blank"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-gray-500 duration-[.2s] ease-in-out">
          <i class="bx text-[18px]" :class="social.icon"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
// Stores
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// Router
const route = useRoute();

const props = defineProps({
  user: { type: Object, required: true },
  roleName: { type: String, required: true }
});
</script>