import { defineStore } from "pinia";
import { ref } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/interfaces/interfaces";

export const useUserStore = defineStore('userStore', {
   state: () => ({
      user: ref<User | null>(null),
      error: ref<string | null>(null),
      isUserLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),

   actions: {
      async fetchUserData(): Promise<void> {
         if (this.isUserLoaded || this.isLoading) return // Prevents multiple calls to the API

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
            const response = await fetch(`https://travel-recommendations-api.onrender.com/api/users/query?field=_id&value=${userId}&populate=true`, {
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
            this.isLoading = false;
            return
         }
         catch (err) {
            this.error = (err as Error).message
            this.user = null;
            this.isUserLoaded = false;
            this.isLoading = false;
            return
         }
      },

      resetUserData(): void {
         this.user = null;
         this.isUserLoaded = false;
         this.isLoading = false;
         this.error = null;
      }
   },

   getters: {
      getUser: (state) => state.user,
      getError: (state) => state.error,
      getIsUserLoaded: (state) => state.isUserLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})