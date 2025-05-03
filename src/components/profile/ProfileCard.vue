<template>
   <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <!-- Avatar -->
      <img v-if="props.user?.profilePicture" :src="props.user?.profilePicture" alt="Profile picture"
        class="w-32 h-32 rounded-full border-4 border-blue-500 object-cover" />
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
              <span v-if="props.user?.role.name !== 'User'" class="text-sm font-medium text-blue-500">
                {{ props.user?.role.name }}
              </span>
            </div>
          </div>
          <button class="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Edit Profile
          </button>
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
          {{ props.user?.bio }} 🌍✈️
        </p>

        <!-- Socials -->
        <div v-if="props.user?.socials.length >= 0" class="flex gap-[10px] mt-6 justify-center sm:justify-start">
          <!-- <a :href="props.user?.socials.link"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-blue-500 duration-[.2s] ease-in-out">
            <i class="bx text-[18px]" :class="props.user?.icon"></i>
          </a> -->
          <a href=""
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-blue-500 duration-[.2s] ease-in-out">
            <i class="bx bxl-facebook text-[18px] text-blue-500"></i>
          </a>
          <a href=""
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-pink-600 duration-[.2s] ease-in-out">
            <i class="bx bxl-instagram text-[18px] text-pink-600"></i>
          </a>
          <a href=""
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-blue-400 duration-[.2s] ease-in-out">
            <i class="bx bxl-twitter text-[18px] text-blue-400"></i>
          </a>
          <a href=""
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-blue-600 duration-[.2s] ease-in-out">
            <i class="bx bxl-linkedin text-[18px] text-blue-500"></i>
          </a>
          <a href=""
            class="w-8 h-8 flex items-center justify-center rounded-full bg-white border-[1px] border-gray-300 hover:border-red-600 duration-[.2s] ease-in-out">
            <i class="bx bxl-youtube text-[18px] text-red-600"></i>
          </a>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
  user: { type: Object, required: true}
});
</script>