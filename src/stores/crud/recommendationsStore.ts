import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Recommendation } from "@/interfaces/interfaces";

export const useRecommendationsStore = defineStore('recommendationsStore', {
   state: () => ({
      recommendationsMap: {} as Record<string, Recommendation[]>,
      error: null as string | null,
      isLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchRecommendations(): Promise<void> {
         // Prevents multiple calls to the API
         if (this.isLoaded || this.isLoading) {
            console.log('Recommendations already loaded or loading, skipping fetch')
            return;
         }

         this.isLoading = true

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/?populateCreatedBy=true&populatePlace=false`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const recommendationsData = await response.json()

            // If the data is valid and not an empty array, store it
            if (recommendationsData && Array.isArray(recommendationsData.data)) {
               recommendationsData.data.forEach((recommendation: Recommendation) => {
                  const placeId = recommendation.place;

                  if (!this.recommendationsMap[placeId]) {
                     this.recommendationsMap[placeId] = []; // Initialize if not present
                  }
                  this.recommendationsMap[placeId].push(recommendation); // Push the recommendation to the array
                  this.isLoaded = true;
                  this.error = null;
               })
            } else {
               // Do not store anything if the array is empty
               console.log('No recommendations found.');
               throw new Error('No recommendations found.');
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

      async fetchRecommendationsByPlace(placeId: string): Promise<void> {
         if (this.recommendationsMap[placeId] || this.isLoading) {
            return;
         }

         this.isLoading = true;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/query?field=place&value=${placeId}&populateCreatedBy=true&populatePlace=false`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const recommendationsData = await response.json()

            // If the data is valid and not an empty array, store it
            if (recommendationsData && Array.isArray(recommendationsData.data) && recommendationsData.data.length > 0) {
               this.recommendationsMap[placeId] = recommendationsData.data;
               this.error = null;
            } else {
               // Do not store anything if the array is empty
               console.log(`No recommendations found for place with Id: ${placeId}`);
               throw new Error('No recommendations found for this place.');
            }
         }
         catch (err) {
            this.error = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      }
   },

   getters: {
      getRecommendationsByPlaceId: (state) => {
         return (placeId: string) => state.recommendationsMap[placeId] || [];
      },
      getIsloading: (state) => state.isLoading,
   }
})