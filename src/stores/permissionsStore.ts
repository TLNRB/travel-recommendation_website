import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Permission } from "@/interfaces/interfaces";

export const usePermissionsStore = defineStore('permissionsStore', {
   state: () => ({
      permissions: ref<Permission[]>([]),
      error: ref<string | null>(null),
      isPermissionsLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),


   actions: {
      async fetchPermissions(force = false): Promise<void> {
         if (!force && (this.isPermissionsLoaded || this.isLoading)) return // Prevents multiple calls to the API

         this.isLoading = true;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/permissions`, {
               method: 'GET'
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const permissionsData = await response.json()
            this.permissions = permissionsData.data;
            this.error = null;
            this.isPermissionsLoaded = true;
         }
         catch (err) {
            this.error = (err as Error).message
            this.permissions = [];
            this.isPermissionsLoaded = false;
         }
         finally {
            this.isLoading = false;
         }
      },

      clearErrors(): void {
         this.error = null;
      }
   },

   getters: {
      getPermissions: (state) => state.permissions,
      getError: (state) => state.error,
      getIsPermissionsLoaded: (state) => state.isPermissionsLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})
