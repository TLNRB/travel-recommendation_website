import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Role, AddRole } from "@/interfaces/roleTypes";

export const useRolesStore = defineStore('rolesStore', {
   state: () => ({
      roles: ref<Role[]>([]),
      error: ref<string | null>(null),
      addError: ref<string | null>(null),
      updateError: ref<string | null>(null),
      isRolesLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),


   actions: {
      async fetchRoles(force = false): Promise<void> {
         if (!force && (this.isRolesLoaded || this.isLoading)) return // Prevents multiple calls to the API

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
      },

      async addRole(newRole: AddRole, token: string): Promise<void> {
         this.isLoading = true;
         this.addError = null;

         // Check if the role has permissions and get the permission IDs
         if (newRole.permissions.length > 0) {
            console.log('Before permissions:', newRole.permissions);

            const permissionIds = newRole.permissions.map((permission) =>
               typeof permission === 'object' ? permission._id : permission);
            newRole.permissions = permissionIds;

            console.log('After permissions:', newRole.permissions);
         }

         console.log('Adding role:', newRole);

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/roles`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(newRole)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to add role');
            }
            else {
               const responseData = await response.json();
               console.log('Role added successfully:', responseData);

               await this.fetchRoles(true); // Refresh the roles list after adding a new role
            }
         }
         catch (err) {
            this.addError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      clearErrors(): void {
         this.error = null;
         this.addError = null;
         this.updateError = null;
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
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getIsRolesLoaded: (state) => state.isRolesLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})