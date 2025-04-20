import { defineStore } from "pinia";
import { ref } from 'vue';
import type { User, UpdateProfile } from "@/interfaces/userTypes";

export const useUsersStore = defineStore('usersStore', {
   state: () => ({
      users: ref<User[]>([]),
      error: ref<string | null>(null),
      updateError: ref<string | null>(null),
      isUsersLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),


   actions: {
      async fetchUsers(force = false): Promise<void> {
         if (!force && (this.isUsersLoaded || this.isLoading)) return // Prevents multiple calls to the API

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
      },

      async updateUser(userId: string, editingUserId: string, updatedData: UpdateProfile, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}?editingUserId=${editingUserId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update user')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)
            }

            await this.fetchUsers(true);
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      clearErrors(): void {
         this.error = null;
         this.updateError = null;
      }
   },

   getters: {
      getUsers: (state) => state.users,
      getUserById: (state) => (id: string) => state.users.find(user => user._id === id),
      getError: (state) => state.error,
      getUpdateError: (state) => state.updateError,
      getIsUsersLoaded: (state) => state.isUsersLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})