import { defineStore } from "pinia";
import type { Recommendation } from "@/interfaces/interfaces";

export const useRecommendationsStore = defineStore('recommendationsStore', {
   state: () => ({
      recommendationsMap: {} as Record<string, Recommendation[]>,
      error: null as string | null,
      addError: null as string | null,
      deleteError: null as string | null,
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

      async fetchRecommendationsByPlace(placeId: string, force = false): Promise<void> {
         if (!force && (this.recommendationsMap[placeId] || this.isLoading)) {
            console.log("Recommendations already loaded or loading for this place, skipping fetch");
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
      },

      async addRecommendation(recommendation: Partial<Recommendation>, token: string): Promise<void> {
         this.isLoading = true;
         this.addError = null;

         try {
            // Check if the recommendation visit date is valid
            const isValid: boolean = this.validateRecommendationDate(new Date(recommendation.dateOfVisit!));
            if (!isValid) {
               throw new Error('Date of visit cannot be in the future.');
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(recommendation)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const recommendationData = await response.json()
            console.log('Add recommendation response:', recommendationData)

            await this.fetchRecommendationsByPlace(recommendationData.data.place, true); // Fetch recommendations for the specific place by force

            this.addError = null;
         }
         catch (err) {
            this.addError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      async deleteRecommendation(recommendationId: string, token: string, placeId: string): Promise<void> {
         this.isLoading = true;
         this.deleteError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/${recommendationId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               }
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }
            else {
               const responseText = await response.text()
               console.log('Delete recommendation response:', responseText)
            }

            // Remove the recommendation from the recommendationsMap, so updating the state
            for (const placeId in this.recommendationsMap) {
               this.recommendationsMap[placeId] = this.recommendationsMap[placeId].filter((recommendation) => recommendation._id !== recommendationId);
            }
         }
         catch (err) {
            this.deleteError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      validateRecommendationDate(date: Date): boolean {
         const today = new Date();
         const dateOfVisit = date;

         console.log('today:', today);
         console.log('dateOfVisit:', dateOfVisit);
         if (dateOfVisit > today) {
            return false;
         }
         else {
            this.addError = null;
            return true;
         }
      },

      clearErrors(): void {
         this.error = null;
         this.addError = null;
         this.deleteError = null;
      }
   },

   getters: {
      getRecommendationsByPlaceId: (state) => {
         return (placeId: string) => state.recommendationsMap[placeId] || [];
      },
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getDeleteError: (state) => state.deleteError,
      getIsLoaded: (state) => state.isLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})