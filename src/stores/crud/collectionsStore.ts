import { defineStore } from "pinia";
import type { AddCollection, Collection } from "@/interfaces/collectionTypes";

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
               this.collectionsMap[userId] = collectionsData.data;
               this.isLoaded = true;
               this.error = null;
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

      async addCollection(newCollection: AddCollection, token: string): Promise<void> {
         this.isLoading = true;
         this.addError = null;

         // Check if the collection has places and get their IDs
         if (newCollection.places!.length > 0) {

            const placeIds: string[] = newCollection.places!.map((place) => typeof place === 'object' ? place._id : place);
            newCollection.places = placeIds;
         }


         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(newCollection)
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Failed to add collection');
            }
            else {
               await this.fecthCollectionsByUserId(newCollection._createdBy as string, true, 'false'); // Refresh the collections for the user
            }


         }
         catch (err) {
            this.addError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      async updateCollection(collectionId: string, updatedCollection: Collection, userId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         // Check if the collection has places and get their IDs
         if (updatedCollection.places!.length > 0) {

            const placeIds: string[] = updatedCollection.places!.map((place) => typeof place === 'object' ? place._id : place);
            updatedCollection.places = placeIds;

         }


         try {
            const reponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections/${collectionId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(updatedCollection)
            });

            if (!reponse.ok) {
               const errorResponse = await reponse.json();
               throw new Error(errorResponse.error || 'Failed to update collection');
            }
            else {
               await this.fecthCollectionsByUserId(userId, true, 'false'); // Refresh the collections for the user
            }
         }
         catch (err) {
            this.updateError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      async addPlaceToCollection(collectionId: string, placeId: string, userId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         // Find the collection to update
         const collection = this.collectionsMap[userId].find((collection) => collection._id === collectionId);

         const updatedCollection: AddCollection = {
            _createdBy: collection!._createdBy as string,
            name: collection!.name,
            places: collection!.places ? collection!.places.map((place) => typeof place === 'object' ? place._id : place) : [],
            visible: collection!.visible,
         }

         if (updatedCollection && updatedCollection.places) {
            // Normalize the places to their IDs
            const placeIds: string[] = updatedCollection.places!.map((place) => typeof place === 'string' ? place : place._id);
            updatedCollection.places = placeIds;

            updatedCollection.places.push(placeId); // Add the place ID to the collection
         }
         else {
            this.updateError = 'Collection not found or no places available';
            return;
         }


         try {
            // Send the updated collection to the server
            const reponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections/${collectionId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(updatedCollection)
            });

            if (!reponse.ok) {
               const errorResponse = await reponse.json();
               throw new Error(errorResponse.error || 'Failed to add place to collection');
            }
            else {
               await this.fecthCollectionsByUserId(userId, true, 'false'); // Refresh the collections for the user
            }
         }
         catch (err) {
            this.updateError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      async removePlaceFromCollection(collectionId: string, placeId: string, userId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         this.isLoading = true;
         this.updateError = null;

         // Find the collection to update
         const collection = this.collectionsMap[userId].find((collection) => collection._id === collectionId);

         const updatedCollection: AddCollection = {
            _createdBy: collection!._createdBy as string,
            name: collection!.name,
            places: collection!.places ? collection!.places.map((place) => typeof place === 'object' ? place._id : place) : [],
            visible: collection!.visible,
         }

         if (updatedCollection && updatedCollection.places) {
            // Normalize the places to their IDs
            const placeIds: string[] = updatedCollection.places!.map((place) => typeof place === 'string' ? place : place._id);
            updatedCollection.places = placeIds;

            // Remove the place ID from the collection
            updatedCollection.places = updatedCollection.places.filter((place) => place !== placeId);
         }
         else {
            this.updateError = 'Collection not found or no places available';
            return;
         }

         try {
            const reponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections/${collectionId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(updatedCollection)
            });

            if (!reponse.ok) {
               const errorResponse = await reponse.json();
               throw new Error(errorResponse.error || 'Failed to remove place from collection');
            }
            else {

               await this.fecthCollectionsByUserId(userId, true, 'false'); // Refresh the collections for the user
            }
         }
         catch (err) {
            this.updateError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      async deleteCollection(collectionId: string, userId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.deleteError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/collections/${collectionId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               }
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Failed to delete collection');
            }

            await this.fecthCollectionsByUserId(userId, true, 'false'); // Refresh the collections for the user
         }
         catch (err) {
            this.deleteError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      isPlaceInCollection(collectionId: string, placeId: string, userId: string): boolean {
         const collections = this.collectionsMap[userId] || []; // Get the collections for the user
         const collection = collections.find((collection) => collection._id === collectionId); // Find the collection by ID

         // Check if the collection exists and if the place is in that specific collection
         if (collection) {
            return collection.places!.some((place) => typeof place === 'object' ? place._id === placeId : place === placeId);
         }
         return false;
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
      getCollectionById: (state) => {
         return (userId: string, collectionId: string) => {
            const collections = state.collectionsMap[userId] || [];
            return collections.find((collection) => collection._id === collectionId) || null;
         }
      },
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsLoaded: (state) => state.isLoaded,
      getIsLoading: (state) => state.isLoading,
   }
});
