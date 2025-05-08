<template>
  <div class="max-w-6xl w-full mx-auto py-16 px-4 space-y-8 md:px-6">
    <UpdateProfileSection />

    <UpdateCollectionsSection />
  </div>
</template>

<script setup lang="ts">
// Components
import UpdateProfileSection from '@/components/settings/UpdateProfileSection.vue'
import UpdateCollectionsSection from '@/components/settings/collections/SettingsCollectionsSection.vue'
</script>

<style scoped></style>