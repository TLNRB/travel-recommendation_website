import { defineStore } from "pinia";
import { ref } from 'vue';
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/interfaces/interfaces";

export const useUserStore = defineStore('userStore', {
   state: () => ({
      user: ref<User | null>(null),
      error: ref<string | null>(null),
   }),

   actions: {
      async fetchUserData(): Promise<void> {
         const authStore = useAuthStore()
         const userId: string | null = authStore.getUserId;

         if (!authStore.getIsLoggedIn || !userId) {
            this.error = 'User is not authenticated!';
            this.user = null;
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
            this.error = null
            return
         }
         catch (err) {
            this.error = (err as Error).message
            this.user = null;
            return
         }
      },

      resetUserData(): void {
         this.user = null
      }
   },

   getters: {
      getUser: (state) => state.user,
      getError: (state) => state.error
   }
})