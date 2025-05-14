import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/interfaces/userTypes";

export const useUserStore = defineStore('userStore', {
   state: () => ({
      user: null as User | null,
      error: null as string | null,
      isUserLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchUserData(force = false): Promise<void> {
         if (!force && (this.isUserLoaded || this.isLoading)) return // Prevents multiple calls to the API

         this.isLoading = true
         const authStore = useAuthStore()
         const userId: string | null = authStore.getUserId;

         if (!authStore.getIsLoggedIn || !userId) {
            this.error = 'User is not authenticated!';
            this.user = null;
            this.isUserLoaded = false;
            this.isLoading = false;
            return
         }

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/query?field=_id&value=${userId}&populate=true`, {
               method: 'GET'
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const userData = await response.json()
            this.user = userData.data[0]; // It should be an array of objects with one object inside
            this.error = null;
            this.isUserLoaded = true;
            return
         }
         catch (err) {
            this.error = (err as Error).message
            this.user = null;
            this.isUserLoaded = false;
            return
         }
         finally {
            this.isLoading = false
         }
      }
   },

   persist: {
      storage: localStorage,
      pick: ['user', 'isUserLoaded'],
   },

   getters: {
      getUser: (state) => state.user,
      getError: (state) => state.error,
      getIsUserLoaded: (state) => state.isUserLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})
