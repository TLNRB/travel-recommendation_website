import { defineStore } from "pinia";
import type { Place } from "@/interfaces/interfaces";

export const usePlacesStore = defineStore('placesStore', {
   state: () => ({
      places: [] as Place[],
      error: null as string | null,
      isPlacesLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchPlaces(): Promise<void> {
         // Check if places are already loaded or loading to avoid multiple API calls
         if (this.isPlacesLoaded || this.isLoading) {
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
      }
   },

   persist: {
      storage: localStorage,
      pick: ['places', 'isPlacesLoaded'],
   },

   getters: {
   }
})