import { defineStore } from "pinia";
import type { CityImage, UniqueCity } from "@/interfaces/cityImageTypes";
// Composables
import { useImages } from "@/composables/useImages";
// Stores
import { usePlacesStore } from "@/stores/crud/placesStore";

const { uploadImages } = useImages()

export const useCitiesStore = defineStore('citiesStore', {
   state: () => ({
      cityImagesMap: {} as Record<string, CityImage>,
      uniqueCities: {} as Record<string, UniqueCity>,
      error: null as string | null,
      addError: null as string | null,
      updateError: null as string | null,
      deleteError: null as string | null,
      isCityImagesLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchUniqueCities() {
         const placesStore = usePlacesStore()

         // If the places are not loaded, fetch them
         if (!placesStore.isPlacesLoaded) {
            await placesStore.fetchPlaces();
         }

         // Get the approved places only
         const approvedPlaces = placesStore.filterPlacesByApproved(true)
         // Create a map to store unique cities with city_country pairs as keys
         const cityMap: Record<string, UniqueCity> = {};

         for (const place of approvedPlaces) {
            if (!place.location.city || !place.location.country) continue // Skip if there is no city or country

            // Create a unique key for each city-country pair
            const key = `${place.location.city.toLowerCase()}_${place.location.country.toLowerCase()}`;

            // If the key doesn't exist add it
            if (!cityMap[key]) {
               cityMap[key] = {
                  name: place.location.city,
                  country: place.location.country
               }
            }
         }

         this.uniqueCities = cityMap // Assign the map to the state
      },

      async fetchCityImages(force = false): Promise<void> {
         if (force && (this.isCityImagesLoaded || this.isLoading)) {
            console.log('City images already loaded or loading')
            return
         }

         this.isLoading = true

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cities-images`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available')
            }

            const cityImagesData = await response.json()

            // If the data is valid and not an empty array, store it
            if (cityImagesData && Array.isArray(cityImagesData.data)) {
               // Create a map to store unique cities with city_country pairs as keys
               const cityImagesMap: Record<string, CityImage> = {};

               for (const cityImage of cityImagesData.data) {
                  if (!cityImage.name || !cityImage.country) continue // Skip if there is no city or country

                  // Create a unique key for each city-country pair
                  const key = `${cityImage.name.toLowerCase()}_${cityImage.country.toLowerCase()}`;

                  // If the key doesn't exist add it
                  if (!cityImagesMap[key]) {
                     cityImagesMap[key] = {
                        name: cityImage.name,
                        country: cityImage.country,
                        images: cityImage.images || [] // Initialize images as an empty array if not present
                     }
                  }
               }

               this.cityImagesMap = cityImagesMap // Assign the map to the state
               this.isCityImagesLoaded = true
               this.error = null
            } else {
               console.log('No city images found.')
               throw new Error('No city images found.')
            }
         }
         catch (err) {
            this.error = (err as Error).message
            this.isCityImagesLoaded = false
         }
         finally {
            this.isLoading = false
         }
      }

   },

   getters: {
      getUniqueCities: (state) => state.uniqueCities,
      getCityImagesMap: (state) => state.cityImagesMap,
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsCityImagesLoaded: (state) => state.isCityImagesLoaded,
      getIsLoading: (state) => state.isLoading
   }
})