import { defineStore } from "pinia";
import type { Place } from "@/interfaces/placeTypes";

export const usePlacesStore = defineStore('placesStore', {
   state: () => ({
      places: [] as Place[],
      error: null as string | null,
      addError: null as string | null,
      updateError: null as string | null,
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

      async updatePlace(placeId: string, updatedData: Place, token: string): Promise<void> {
         this.isLoading = true
         this.updateError = null

         try {
            console.log('Updating place with ID:', placeId)
            console.log('Updated data:', updatedData)
            console.log('Token:', token)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places/${placeId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(updatedData),
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

      clearErrors() {
         this.error = null
         this.addError = null
         this.updateError = null
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
      getError: (state) => {
         return state.error
      },
      getAddError: (state) => {
         return state.addError
      },
      getUpdateError: (state) => {
         return state.updateError
      },
      getIsLoading: (state) => {
         return state.isLoading
      },
   }
})