import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Role } from "@/interfaces/interfaces";

export const useRolesStore = defineStore('rolesStore', {
   state: () => ({
      roles: ref<Role[]>([]),
      error: ref<string | null>(null),
      isRolesLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),


   actions: {
      async fetchRoles(): Promise<void> {
         if (this.isRolesLoaded || this.isLoading) return // Prevents multiple calls to the API

         this.isLoading = true;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/roles?populate=true`, {
               method: 'GET'
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const rolesData = await response.json()
            this.roles = rolesData.data;
            this.error = null;
            this.isRolesLoaded = true;

            console.log('Roles fetched successfully:', this.roles)
         }
         catch (err) {
            this.error = (err as Error).message
            this.roles = [];
            this.isRolesLoaded = false;
         }
         finally {
            this.isLoading = false;
         }

      },

      async fetchRoleById(id: string): Promise<void> {
         if (this.isRolesLoaded || this.isLoading) return // Prevents multiple calls to the API

         this.isLoading = true;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/roles/query/?field=_id&value=${id}&populate=true`, {
               method: 'GET'
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const roleData = await response.json()
            this.roles = [roleData.data]; // Wrap in an array to maintain the same structure as fetchRoles
            this.error = null;
            this.isRolesLoaded = true;

            console.log('Role fetched successfully:', this.roles)
         }
         catch (err) {
            this.error = (err as Error).message
            this.roles = [];
            this.isRolesLoaded = false;
         }
         finally {
            this.isLoading = false;
         }
      }
   },

   getters: {
      getRoles: (state) => state.roles,
      getRoleById: (state) => (id: string) => state.roles.find(role => role._id === id),
      getPermissionIdByPermissionName: (state) => (name: string) => {
         const role = state.roles.find((role) => role.permissions.some((permission) => typeof permission === 'object' && 'name' in permission && permission.name === name));
         const permission = role?.permissions.find((permission) => typeof permission === 'object' && 'name' in permission && permission.name === name);
         return typeof permission === 'object' ? permission._id : null;
      },
      getError: (state) => state.error,
      getIsRolesLoaded: (state) => state.isRolesLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})