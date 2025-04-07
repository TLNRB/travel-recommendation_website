<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Welcome Info -->
    <div class="w-1/2 flex flex-col justify-center p-16">
      <h1 class="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
      <p class="text-lg text-gray-600 mb-8">Join us and explore amazing experiences around the world. Sign up now to get started!</p>
    </div>

    <!-- Auth Card -->
    <div class="w-1/2 flex justify-center">
      <div class="bg-white p-10 rounded-2xl shadow-lg w-full  max-w-md">
        <h2 v-if="activeTab === 'register'" class="text-2xl font-bold text-center mb-6">Create your account</h2>
        <h2 v-else class="text-2xl font-bold text-center mb-6">Log in to your Account</h2>

        <div class="flex justify-between mb-6 border-b pb-3">
          <button
            class="w-1/2 text-lg font-semibold py-3 transition duration-200"
            :class="{ 'border-b-4 border-blue-500 text-blue-600': activeTab === 'login', 'text-gray-500': activeTab !== 'login' }"
            @click="activeTab = 'login'">
            Login
          </button>
          <button
            class="w-1/2 text-lg font-semibold py-3 transition duration-200"
            :class="{ 'border-b-4 border-blue-500 text-blue-600': activeTab === 'register', 'text-gray-500': activeTab !== 'register' }"
            @click="activeTab = 'register'">
            Register
          </button>
        </div>

        <button class="w-full py-3 border rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 transition mb-4">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" class="w-5 h-5" />
          Sign up with Google
        </button>

        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink mx-4 text-gray-400">or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>
      <!--change to from later on after testing for password reset, also make a function which handles the login and the redirect to the homepage instead of binding fetchtoken-->
        <div v-if="activeTab === 'login'"  class="space-y-4">
          <input type="email" v-model="email" placeholder="Email" class="input-field" required />
          <input type="password" v-model="password" placeholder="Password" class="input-field" required />
          <button
            @click="loginAndRedirect(email, password)"
            type="submit"
            class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            :disabled="loading"
          >
            <span v-if="loading" class="loader"></span>
            <span v-else>Login</span>
          </button>
        </div>
  <!--change to from later on after testing for password reset, also make a function which handles the register and the redirect to the homepage instead of binding fetchtoken-->
        <div v-if="activeTab === 'register'"  class="space-y-4">
          <input type="text" v-model="firstName" placeholder="First Name" class="input-field" required />
          <input type="text" v-model="lastName" placeholder="Last Name" class="input-field" required />
          <input type="text" v-model="username" placeholder="Username" class="input-field" required />
          <input type="email" v-model="email" placeholder="Email Address" class="input-field" required />
          <input type="password" v-model="password" placeholder="Password" class="input-field" required />
          <p class="text-xs text-gray-500">By creating an account, I am agreeing to the company's <span class="text-blue-400 font-bold">Terms of Service</span>  and <span class="text-blue-400 font-bold">Privacy Policy.</span> </p>
          <button @click="registerUser(firstName, lastName, username, email, password)" type="submit" class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Register</button>
        </div>

        <p v-if="activeTab === 'register'" class="text-center text-gray-500 mt-4">Already have an account? <button @click="switchTab()" class="text-blue-600 hover:underline">Log in</button></p>
        <p v-if="activeTab === 'login'" class="text-center text-gray-500 mt-4">Don't have an account yet? <button @click="switchTab()" class="text-blue-600 hover:underline">Register</button></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useUsers } from '@/modules/auth/useUsers';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const activeTab = ref<'login' | 'register'>('register');
const {fetchToken, registerUser, firstName, lastName, username, email, password} = useUsers()

const loginAndRedirect = async (email: string, password: string) => {
  loading.value = true;
  try {
    await fetchToken(email, password);
    await nextTick()
    router.push('/')
  } catch (error) {
    console.error('Error logging in:', error);
  } finally {
    loading.value = false;
  }
};

const switchTab = () => {
  if (activeTab.value === 'login'){
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

