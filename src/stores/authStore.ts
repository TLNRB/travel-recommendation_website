import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

export const useAuthStore = defineStore('authStore', {
   state: () => ({
      token: ref<string | null>(localStorage.getItem('lsToken') || null),
      userId: ref<string | null>(localStorage.getItem('userId') || null),
      isLoggedIn: ref<boolean>(localStorage.getItem('lsToken') ? true : false),
      error: ref<string | null>(null),

      firstName: ref<string>(''),
      lastName: ref<string>(''),
      username: ref<string>(''),
      email: ref<string>(''),
      password: ref<string>('')
   }),

   actions: {
      async registerUser(firstName: string, lastName: string, username: string, email: string, password: string): Promise<boolean> {
         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/register`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ firstName, lastName, username, email, password })
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Failed to regsiter');
            }

            const authData = await response.json()
            this.error = null;
            // Setting the input values to empty strings after successful registration
            this.firstName = '';
            this.lastName = '';
            this.username = '';

            return true;
         }
         catch (err) {
            this.error = (err as Error).message
            this.isLoggedIn = false

            return false;
         }
      },

      // Login user
      async fetchToken(email: string, password: string): Promise<boolean> {
         try {
            const response = await fetch('https://travel-recommendations-api.onrender.com/api/user/login', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Invalid credentials');
            }

            const authData = await response.json();
            this.token = authData.data.token;
            this.userId = authData.data.userId;
            this.isLoggedIn = true;
            this.error = null;
            // Setting the input values to empty strings after successful login
            this.email = '';
            this.password = '';

            localStorage.setItem('lsToken', authData.data.token);
            localStorage.setItem('userId', authData.data.userId);

            const userStore = useUserStore();
            await userStore.fetchUserData(); // Fetch user data after login to the state

            return true;
         } catch (err) {
            this.error = (err as Error).message;
            this.isLoggedIn = false;

            return false;
         }
      },

      // Logout user
      logout(): void {
         this.token = null;
         this.userId = null;
         this.isLoggedIn = false;
         this.error = null;

         localStorage.removeItem('lsToken');
         localStorage.removeItem('userId');

         const userStore = useUserStore();
         userStore.$reset();
      }
   },

   getters: {
      getToken: (state) => state.token,
      getUserId: (state) => state.userId,
      getIsLoggedIn: (state) => state.isLoggedIn,
      getError: (state) => state.error,
   },
})
