import { defineStore } from "pinia";
import type { Recommendation } from "@/interfaces/recommendationTypes";
import { reactive } from 'vue'

export const useRecommendationsStore = defineStore('recommendationsStore', {
   state: () => ({
      recommendationsMap: reactive({}) as Record<string, Recommendation[]>,
      error: null as string | null,
      addError: null as string | null,
      updateError: null as string | null,
      deleteError: null as string | null,
      updateError: null as string | null,
      isLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchRecommendations(force = false, populatePlace = 'false'): Promise<void> {
         // Prevents multiple calls to the API
         if (!force && (this.isLoaded || this.isLoading)) {
            console.log('Recommendations already loaded or loading, skipping fetch')
            return;
         }

         this.isLoading = true

         try {
            console.log('Fetching all recommendations from API...');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/?populateCreatedBy=true&populatePlace=${populatePlace}`, {
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
                  const placeId = populatePlace === 'true' && typeof recommendation.place === 'object' ? recommendation.place._id : recommendation.place;

                  if (!this.recommendationsMap[placeId as string]) {
                     this.recommendationsMap[placeId as string] = []; // Initialize if not present
                  }

                  // Check if the recommendation already exists in the array
                  const exists = this.recommendationsMap[placeId as string].some((rec) => rec._id === recommendation._id);
                  if (!exists) {
                     this.recommendationsMap[placeId as string].push(recommendation); // Push the recommendation to the array
                  }
               })
               this.isLoaded = true;
               this.error = null;
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

      async fetchRecommendationsByPlace(placeId: string, force = false, populatePlace = 'false'): Promise<void> {
         if (!force && (this.recommendationsMap[placeId] || this.isLoading)) {
            console.log("Recommendations already loaded or loading for this place, skipping fetch");
            return;
         }

         this.isLoading = true;

         try {
            console.log(`Fetching recommendations for place with Id: ${placeId}...`);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/query?field=place&value=${placeId}&populateCreatedBy=true&populatePlace=${populatePlace}`, {
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
               this.isLoaded = true;
               this.error = null;
            } else {
               // Do not store anything if the array is empty
               console.log(`No recommendations found for place with Id: ${placeId}`);
               throw new Error('No recommendations found for this place.');
            }
         }
         catch (err) {
            this.error = (err as Error).message;
            this.isLoaded = false;
         }
         finally {
            this.isLoading = false;
         }
      },

      async fetchRecommendationById(recommendationId: string, populatePlace = 'false'): Promise<Recommendation | null> {
         this.isLoading = true;
         this.error = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/query?field=_id&value=${recommendationId}&populateCreatedBy=true&populatePlace=${populatePlace}`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const recommendationsData = await response.json()
            console.log('Feteched recommendation by id: ', recommendationsData.data);

            this.error = null;
            return recommendationsData.data[0];
         }
         catch (err) {
            this.error = (err as Error).message;
            return null;
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
            console.log('Submitting recommendation payload:', recommendation);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(recommendation)
            })

            if (!response.ok) {
               const errorResponse = await response.json();
               console.error('Error response body:', errorResponse);
               throw new Error(errorResponse.error || JSON.stringify(errorResponse));
            }

            const recommendationData = await response.json()
            console.log('Add recommendation response:', recommendationData)

            await this.fetchRecommendationsByPlace(recommendationData.data.place, true, 'true'); // Fetch recommendations for the specific place by force

            this.addError = null;
         }
         catch (err) {
            this.addError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      async updateRecommendationUpvotes(placeId: string, recommendationId: string, userId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/upvotes/${recommendationId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify({ userId })
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update upvote');
            }
            else {
               const responseText = await response.text()
               console.log('Update recommendation upvotes response:', responseText)
            }

            const updatedRecommendation: Recommendation | null = await this.fetchRecommendationById(recommendationId, 'true'); // Fetch the updated recommendation by ID

            console.log('Updated recommendation from database: ', updatedRecommendation);

            if (updatedRecommendation) {
               // Update the recommendation in the recommendationsMap
               const index = this.recommendationsMap[placeId].findIndex((recommendation) => recommendation._id === updatedRecommendation._id);
               if (index !== -1) {
                  this.recommendationsMap[placeId][index] = updatedRecommendation;
               }

               console.log('Updated recommendation in recommendationsMap: ', this.recommendationsMap[placeId][index]);
            }
            else {
               throw new Error('Failed to fetch updated recommendation');
            }
         }
         catch (err) {
            this.updateError = (err as Error).message;
         }
         finally {
            this.isLoading = false;
         }
      },

      async updateRecommendation(recommendationId: string, updatedData: Partial<Recommendation>, token: string ): Promise<void> {
        this.isLoading = true;
        this.updateError = null;

        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations/${recommendationId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token
            },
            body: JSON.stringify(updatedData)
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error response:', errorResponse); // Log the error response
            throw new Error(errorResponse.error || 'Failed to update recommendation');
          }

          const updatedRecommendation = await response.json();
          console.log('Updated recommendation:', updatedRecommendation);

          // Update the recommendation in the local store
          for (const placeId in this.recommendationsMap) {
            const index = this.recommendationsMap[placeId].findIndex(r => r._id === recommendationId);
            if (index !== -1) {
              // Clone array to trigger reactivity
              const newArray = [...this.recommendationsMap[placeId]];
              newArray[index] = {
                ...newArray[index],
                ...updatedRecommendation.data // ensure this has correct structure
              };

              // Reassign the entire array
              this.recommendationsMap[placeId] = newArray;
              break;
            }
          }
        } catch (err) {
          this.updateError = (err as Error).message;
        } finally {
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
         this.updateError = null;
         this.deleteError = null;
      }
   },

   getters: {
      getRecommendationsByPlaceId: (state) => {
         return (placeId: string) => state.recommendationsMap[placeId] || [];
      },
      getRecommendationsByUserId: (state) => {
         return (userId: string) => {
            const recommendations: Recommendation[] = [];
            for (const placeId in state.recommendationsMap) {
               const userRecommendations = state.recommendationsMap[placeId].filter((recommendation) => typeof recommendation._createdBy === 'object' ? recommendation._createdBy._id === userId : recommendation._createdBy === userId);
               if (userRecommendations.length > 0) {
                  recommendations.push(...userRecommendations);
               }
            }
            return recommendations;
         }
      },
      getApprovedRecommendationsByUserId: (state) => {
         return (userId: string) => {
            const recommendations: Recommendation[] = [];
            for (const placeId in state.recommendationsMap) {
               const userRecommendations = state.recommendationsMap[placeId].filter((recommendation) => (typeof recommendation._createdBy === 'object' ? recommendation._createdBy._id === userId : recommendation._createdBy === userId) && (typeof recommendation.place === 'object' ? recommendation.place.approved : false));
               console.log('userRecommendations:', userRecommendations);
               if (userRecommendations.length > 0) {
                  recommendations.push(...userRecommendations);
               }
            }
            return recommendations;
         }
      },
      getIsRecommendationUpvoted: (state) => {
         return (placeId: string, recommendationId: string, userId: string) => {
            const recommendation = state.recommendationsMap[placeId]?.find((recomendation) => recomendation._id === recommendationId);
            if (recommendation) {
               return recommendation.upvotes.includes(userId);
            }
            return false;
         }
      },
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsLoaded: (state) => state.isLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})
