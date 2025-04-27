import { defineStore } from "pinia";
import type { CityImage, UniqueCity, EditCityImage } from "@/interfaces/cityImageTypes";
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
         console.log('Fetching unique cities...')
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
         if (!force && (this.isCityImagesLoaded || this.isLoading)) {
            console.log('City images already loaded or loading')
            return
         }

         console.log('Fetching city images...')

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
                     cityImagesMap[key] = cityImage
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
      },

      async addCityImage(newCity: EditCityImage, token: string): Promise<void> {
         this.isLoading = true;
         this.addError = null;

         try {
            const imagesFile = [...newCity.newImages!] as File[]; // Get the images from the newCity object

            // Upload images to Cloudinary and get the URLs
            const { urls, error } = await uploadImages(imagesFile, 'cities')

            if (error) {
               throw new Error(error)
            }

            // Create the images object array with the URLs and alt text
            const imagesData = urls.map((url, index) => ({
               url: url,
               alt: 'Image ' + (index + 1) + ' of ' + newCity.name + ' ' + newCity.country  // Add an alt text for each image
            }))

            // Create the cityImage object
            const cityImageData: CityImage = {
               name: newCity.name,
               country: newCity.country,
               images: imagesData
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cities-images`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(cityImageData)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to add city images')
            }
            else {
               const responseData = await response.json()
               console.log('Add response:', responseData)

               await this.fetchCityImages(true) // Fetch the updated city images
            }
         }
         catch (err) {
            this.addError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      async updateCityImage(cityImageId: string, updatedCity: EditCityImage, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         // Create the cityImageData object with the existing images
         let cityImageData: CityImage = {
            name: updatedCity.name,
            country: updatedCity.country,
            images: [...updatedCity.images]
         }

         try {
            // Check if images and newImages are empty arrays
            if (updatedCity.images.length === 0 && updatedCity.newImages!.length === 0) {
               throw new Error('Upload at least one image')
            }

            // Check if there are newImages to upload
            if (updatedCity.newImages && updatedCity.newImages.length > 0) {
               const imagesFile = [...updatedCity.newImages] as File[]; // Get the images from the updatedCity object

               // Upload images to Cloudinary and get the URLs
               const { urls, error } = await uploadImages(imagesFile, 'cities')

               if (error) {
                  throw new Error(error)
               }

               // Create the images object array with the URLs and alt text
               const newImagesData = urls.map((url, index) => ({
                  url: url,
                  alt: 'Image ' + (index + 1) + ' of ' + updatedCity.name + ' ' + updatedCity.country
               }))

               const imagesData = [...updatedCity.images, ...newImagesData] // Combine existing images with new images

               // Update the cityImageData.images with the new images included
               cityImageData.images = imagesData;
            }

            console.log('City image data before sending:', cityImageData.images)

            // Remove _id property from each image object
            const cleanImages = cityImageData.images.map(image => ({
               url: image.url,
               alt: image.alt,
            }));

            cityImageData.images = cleanImages // Clean the images object to remove any unnecessary properties

            console.log('City image data after cleaning:', cityImageData.images)

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cities-images/${cityImageId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(cityImageData)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update city images')
            }
            else {
               const responseData = await response.json()
               console.log('Update response:', responseData)

               await this.fetchCityImages(true) // Fetch the updated city images
            }
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      async deleteCityImage(cityImageId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.deleteError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cities-images/${cityImageId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               }
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to delete city images')
            }
            else {
               const responseData = await response.json()
               console.log('Delete response:', responseData)

               await this.fetchCityImages(true) // Fetch the updated city images
            }
         }
         catch (err) {
            this.deleteError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      clearErrors(): void {
         this.error = null
         this.addError = null
         this.updateError = null
         this.deleteError = null
      }
   },

   getters: {
      getUniqueCities: (state) => state.uniqueCities,
      getCityImagesMap: (state) => state.cityImagesMap,
      getCityImagesByKey: (state) => (key: string) => state.cityImagesMap[key] || null,
      getUniqueCityByKey: (state) => (key: string) => state.uniqueCities[key] || null,
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsCityImagesLoaded: (state) => state.isCityImagesLoaded,
      getIsLoading: (state) => state.isLoading
   }
})