import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Role, AddRole } from "@/interfaces/roleTypes";
// Data
import { baseRoles } from "@/data/baseRoles.json";

export const useRolesStore = defineStore('rolesStore', {
   state: () => ({
      roles: ref<Role[]>([]),
      error: ref<string | null>(null),
      addError: ref<string | null>(null),
      updateError: ref<string | null>(null),
      deleteError: ref<string | null>(null),
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

            const permissionIds = newRole.permissions.map((permission) =>
               typeof permission === 'object' ? permission._id : permission);
            newRole.permissions = permissionIds;

         }


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

      async updateRole(updatedRole: AddRole, roleId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         // Check if the role has permissions and get the permission IDs
         if (updatedRole.permissions.length > 0) {

            const permissionIds = updatedRole.permissions.map((permission) =>
               typeof permission === 'object' ? permission._id : permission);
            updatedRole.permissions = permissionIds;

         }

         try {
            // Check if the role is a base role
            const isBaseRole = baseRoles.some((baseRole) => baseRole === updatedRole.name);

            if (isBaseRole) {
               throw new Error('Cannot update a base role');
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/roles/${roleId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(updatedRole)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update role');
            }
            else {

               await this.fetchRoles(true); // Refresh the roles list after updating a role
            }
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      async deleteRole(roleId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.deleteError = null;

         try {
            // Check if the role is a base role
            const deletedRole = this.getRoleById(roleId);
            const isBaseRole = baseRoles.some((baseRole) => baseRole === deletedRole!.name);

            if (isBaseRole) {
               throw new Error('Cannot delete a base role');
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/roles/${roleId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
            });

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to delete role');
            }
            else {
               const responseData = await response.json();

               await this.fetchRoles(true); // Refresh the roles list after deleting a role
            }
         }
         catch (err) {
            this.deleteError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      clearErrors(): void {
         this.error = null;
         this.addError = null;
         this.updateError = null;
         this.deleteError = null;
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
      getDeleteError: (state) => state.deleteError,
      getIsRolesLoaded: (state) => state.isRolesLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})
