import { defineStore } from "pinia";
import type { Collection } from "@/interfaces/collectionType";

export const useCollectionsStore = defineStore('collectionsStore', {
   state: () => ({
      collectionsMap: {} as Record<string, Collection[]>,
      error: null as string | null,
      addError: null as string | null,
      updateError: null as string | null,
      deleteError: null as string | null,
      isLoaded: false,
      isLoading: false,
   }),

   actions: {

      async fecthCollectionsByUserId(userId: string, force = false, populateUser = 'false'): Promise<void> {
         if (!force && (this.isLoaded || this.isLoading)) {
            console.log('Collections already loaded or loading, skipping fetch')
            return;
         }

         this.isLoading = true

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections/query?field=_createdBy&value=${userId}&populateCreatedBy=${populateUser}&populatePlace=true`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const collectionsData = await response.json()
            // If the data is valid and not an empty array, store it
            if (collectionsData && Array.isArray(collectionsData.data) && collectionsData.data.length > 0) {
               if (!this.collectionsMap[userId]) {
                  this.collectionsMap[userId] = collectionsData.data;
                  this.isLoaded = true;
                  this.error = null;
               }
            } else {
               // Do not store anything if the array is empty
               console.log('No collections found.');
               throw new Error('No collections found.');
            }

         }
         catch (err) {
            this.error = (err as Error).message
            this.isLoaded = false;
         }
         finally {
            this.isLoading = false;
         }

      },

      clearErrors() {
         this.error = null;
         this.addError = null;
         this.updateError = null;
         this.deleteError = null;
      }
   },

   getters: {
      getCollectionsByUserId: (state) => {
         return (userId: string) => state.collectionsMap[userId] || [];
      },
      getAllCollections: (state) => state.collectionsMap,
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsLoaded: (state) => state.isLoaded,
      getIsLoading: (state) => state.isLoading,
   }
});