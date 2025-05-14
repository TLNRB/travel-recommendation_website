<template>
  <button @click="logoutAndRedirect()"
    class="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer"
    :disabled="loading">
    <span v-if="loading" class="loader"></span>
    <span v-else>Logout</span>
  </button>

</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const logoutAndRedirect = async () => {
  loading.value = true;
  try {
    await authStore.logout();
    router.push('/auth');
  } catch (error) {
    console.error('Error logging out:', error);
  } finally {
    loading.value = false;
  }
};



</script>

<style scoped>
.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
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
