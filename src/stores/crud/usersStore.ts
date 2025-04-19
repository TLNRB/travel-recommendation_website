import { defineStore } from "pinia";
import { ref } from 'vue';
import type { User } from "@/interfaces/interfaces";

export const useUsersStore = defineStore('usersStore', {
   state: () => ({
      users: ref<User[]>([]),
      error: ref<string | null>(null),
      isUsersLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),


   actions: {
      async fetchUsers(): Promise<void> {
         if (this.isUsersLoaded || this.isLoading) return // Prevents multiple calls to the API

         this.isLoading = true;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
               method: 'GET'
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const usersData = await response.json()
            this.users = usersData.data;
            this.error = null;
            this.isUsersLoaded = true;

            console.log('Users fetched successfully:', this.users)
         }
         catch (err) {
            this.error = (err as Error).message
            this.users = [];
            this.isUsersLoaded = false;
         }
         finally {
            this.isLoading = false;
         }

      }
   },

   getters: {
      getUsers: (state) => state.users,
      getError: (state) => state.error,
      getIsUsersLoaded: (state) => state.isUsersLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})