import { defineStore } from "pinia";
import type { Place } from "@/interfaces/placeTypes";
// Composables
import { useImages } from "@/composables/useImages";

export const usePlacesStore = defineStore('placesStore', {
   state: () => ({
      places: [] as Place[],
      error: null as string | null,
      addError: null as string | null,
      updateError: null as string | null,
      deleteError: null as string | null,
      isPlacesLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchPlaces(force = false): Promise<void> {
         // Check if places are already loaded or loading to avoid multiple API calls
         if (!force && (this.isPlacesLoaded || this.isLoading)) {
            console.log('Places already loaded or loading, skipping fetch')
            return;
         }

         this.isLoading = true;

         try {
            console.log('Fetching places data...')
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const placesData = await response.json()
            this.places = placesData.data;

            console.log('Fetched places data:', placesData.data)

            this.error = null;
            this.isPlacesLoaded = true;
         }
         catch (err) {
            this.error = (err as Error).message;
            this.isPlacesLoaded = false;
         }
         finally {
            this.isLoading = false;
         }
      },


      filterPlacesByApproved(approved: boolean): Place[] {
         if (this.places.length === 0) {
            return []
         }
         return this.places.filter((place) => place.approved === approved)
      },

      async addPlace(newPlace: Place, token: string): Promise<void> {
         this.isLoading = true;
         this.addError = null
         const { uploadImages } = useImages()

         try {
            // Upload images to Cloudinary and get the URLs
            const { urls, error } = await uploadImages(newPlace.images as File[], 'places')

            if (error) {
               throw new Error(error)
            }

            // Replace the images in the newPlace object with the uploaded URLs
            newPlace.images = urls

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(newPlace)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to add place')
            }
            else {
               const responseData = await response.json()
               this.places.push(responseData.data) // Add the new place to the local state
               console.log('Add response:', responseData)
            }

         }
         catch (err) {
            this.addError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      async updatePlace(placeId: string, updatedData: Place, token: string): Promise<void> {
         this.isLoading = true
         this.updateError = null

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places/${placeId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(updatedData)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update place')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)
            }

            await this.fetchPlaces(true) // Force refresh the places after update
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      async deletePlace(placeId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.deleteError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places/${placeId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               }
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to delete place')
            }
            else {
               const responseText = await response.text()
               console.log('Delete response:', responseText)
            }

            await this.fetchPlaces(true) // Force refresh the places after deletion
         }
         catch (err) {
            this.deleteError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      clearErrors(): void {
         this.error = null;
         this.addError = null;
         this.updateError = null;
         this.deleteError = null;
      }
   },

   persist: {
      storage: localStorage,
      pick: ['places', 'isPlacesLoaded'],
   },

   getters: {
      getPlaceById: (state) => {
         return (placeId: string) => state.places.find((place) => place._id === placeId) || null
      },
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsLoading: (state) => state.isLoading,
   }
})