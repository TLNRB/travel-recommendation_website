<template>
  <div class="flex flex-col sm:flex-row sm:my-auto">
    <!-- Welcome Info -->
    <div class="flex flex-col justify-center p-16 sm:w-1/2">
      <h1 class="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
      <p class="text-lg text-gray-600 mb-8">Join us and explore amazing experiences around the world. Sign up now to get
        started!</p>
    </div>

    <!-- Auth Card -->
    <div class="flex justify-center pb-[64px] sm:w-1/2 sm:py-[64px]">
      <div class="bg-white p-10 rounded-2xl shadow-lg w-full  max-w-md">
        <h2 v-if="activeTab === 'register'" class="text-2xl font-bold text-center mb-6">Create your account</h2>
        <h2 v-else class="text-2xl font-bold text-center mb-6">Log in to your Account</h2>

        <div class="flex justify-between mb-6 border-b pb-3">
          <button data-test="tab-login" class="w-1/2 text-lg font-semibold py-3 transition duration-200 cursor-pointer"
            :class="{ 'border-b-4 border-blue-500 text-blue-600': activeTab === 'login', 'text-gray-500': activeTab !== 'login' }"
            @click="activeTab = 'login'">
            Login
          </button>
          <button data-test="tab-register" class="w-1/2 text-lg font-semibold py-3 transition duration-200 cursor-pointer"
            :class="{ 'border-b-4 border-blue-500 text-blue-600': activeTab === 'register', 'text-gray-500': activeTab !== 'register' }"
            @click="activeTab = 'register'">
            Register
          </button>
        </div>

        <!--change to from later on after testing for password reset, also make a function which handles the login and the redirect to the homepage instead of binding fetchtoken-->
        <div v-if="activeTab === 'login'" class="space-y-4">
          <input type="email" v-model="authStore.email" placeholder="Email" class="input-field" required />
          <input type="password" v-model="authStore.password" placeholder="Password" class="input-field" required />
          <div v-if="authStore.error" class="text-red-500 text-sm mt-2">
            {{ authStore.error }}
          </div>
          <button data-test="submit-button" @click="loginAndRedirect(authStore.email, authStore.password)" type="submit"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
            :disabled="loading">
            <span v-if="loading" class="loader"></span>
            <span v-else>Login</span>
          </button>
        </div>
        <!--change to from later on after testing for password reset, also make a function which handles the register and the redirect to the homepage instead of binding fetchtoken-->
        <div v-if="activeTab === 'register'" class="space-y-4">
          <input type="text" v-model="authStore.firstName" placeholder="First Name" class="input-field" required />
          <input type="text" v-model="authStore.lastName" placeholder="Last Name" class="input-field" required />
          <input type="text" v-model="authStore.username" placeholder="Username" class="input-field" required />
          <input type="email" v-model="authStore.email" placeholder="Email Address" class="input-field" required />
          <input type="password" v-model="authStore.password" placeholder="Password" class="input-field" required />
          <div v-if="authStore.error" class="text-red-500 text-sm mt-2">
            {{ authStore.error }}
          </div>
          <button
            @click="registerAndSwitchTab(authStore.firstName, authStore.lastName, authStore.username, authStore.email, authStore.password)"
            type="submit"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
            :disabled="loading">
            <span v-if="loading" class="loader"></span>
            <span v-else>Register</span>
          </button>
        </div>

        <p v-if="activeTab === 'register'" class="text-center text-gray-500 mt-4">Already have an account? <button
            @click="switchTab()" class="text-blue-600 hover:underline cursor-pointer">Log in</button></p>
        <p v-if="activeTab === 'login'" class="text-center text-gray-500 mt-4">Don't have an account yet? <button
            @click="switchTab()" class="text-blue-600 hover:underline cursor-pointer">Register</button></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const activeTab = ref<'login' | 'register'>('login');

const loginAndRedirect = async (email: string, password: string): Promise<void> => {
  loading.value = true;
  try {
    const success: boolean = await authStore.fetchToken(email, password);
    if (success) {
      await nextTick();
      router.push('/');
    } else {
      throw new Error('Login failed!')
    }
  } catch (err) {
    console.error('Error logging in:', err);
  } finally {
    loading.value = false;
  }
};

const registerAndSwitchTab = async (firstName: string, lastName: string, username: string, email: string, password: string): Promise<void> => {
  loading.value = true;
  try {
    const success: boolean = await authStore.registerUser(firstName, lastName, username, email, password);
    if (success) {
      switchTab();
    } else {
      throw new Error('Registration failed!')
    }
  } catch (err) {
    console.error('Error registering:', err);
  } finally {
    loading.value = false;
  }
};

const switchTab = () => {
  if (activeTab.value === 'login') {
    activeTab.value = 'register';
  } else {
    activeTab.value = 'login';
  }
};

</script>


<style scoped>
.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
}

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
