import { defineStore } from "pinia";
import type { Place, EditPlace, AddPlace } from "@/interfaces/placeTypes";
// Composables
import { useImages } from "@/composables/useImages";
import { normalize } from "@/composables/normalizeString";
// External API
import { externalAPI } from "@/modules/api/externalFetch";

const { uploadImages } = useImages()
const { validateCountry, validateCity } = externalAPI()

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

      async addPlace(newPlace: Place, token: string): Promise<string | null> {
         this.isLoading = true;
         this.addError = null

         const imagesData = [...newPlace.images] as File[]; // Get the images from the newPlace object
         newPlace.images = []; // Clear the images array in the newPlace object to send an empty array to the server (if there is an error in place creation, the images will not be uploaded)

         // Normalize newPlace strings
         newPlace = this.normalizePlace(newPlace)

         try {
            // Validate country and city
            const country = await validateCountry(newPlace.location.country)
            if (!country) {
               throw new Error('Invalid country')
            }
            else if (country && newPlace.location.city) {
               const city = await validateCity(newPlace.location.city, country.objectId)
               if (!city) {
                  throw new Error('Invalid city')
               }
            }


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
               console.log('Add response:', responseData)

               // Upload images to Cloudinary and update the place with the URLs
               await this.addUpdateImages(responseData.data._id, imagesData, token)

               await this.fetchPlaces(true) // Force refresh the places after adding a new one

               return responseData.data._id // Return the ID of the newly created place
            }
         }
         catch (err) {
            this.addError = (err as Error).message
            return null
         }
         finally {
            this.isLoading = false
         }
      },

      async addUpdateImages(placeId: string, images: File[], token: string): Promise<void> {
         try {
            // Upload images to Cloudinary and get the URLs
            const { urls, error } = await uploadImages(images, 'places')

            if (error) {
               throw new Error(error)
            }

            // Update the place with the new image URLs
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places/images/${placeId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify({ images: urls })
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update images')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)
            }
         }
         catch (err) {
            console.error('Error uploading images:', err)
            this.addError = (err as Error).message
         }
      },

      async editUpdateImages(placeId: string, newImages: File[], existingImages: string[], token: string): Promise<void> {
         try {
            // Upload images to Cloudinary and get the URLs
            const { urls, error } = await uploadImages(newImages, 'places')

            if (error) {
               console.log('error')
               throw new Error(error)
            }

            // Combine existing images with new images
            const allImages = [...existingImages, ...urls]

            // Update the place with the new image URLs
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places/images/${placeId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify({ images: allImages })
            })

            console.log('allImages:', allImages)

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update images')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)
            }
         }
         catch (err) {
            console.error('Error uploading images:', err)
            this.addError = (err as Error).message
         }
      },

      async updatePlace(placeId: string, updatedData: EditPlace, token: string, createdBy: string): Promise<void> {
         this.isLoading = true
         this.updateError = null

         // Extract the new images from the updatedData object
         const { newImages, ...placeData } = updatedData;

         // Add the createdBy field to the updated place data
         let updatedPlace: Place = {
            ...placeData,
            _createdBy: createdBy
         }

         // Normalize updatedPlace strings
         updatedPlace = this.normalizePlace(updatedPlace)

         try {
            // Check if images and newImages are empty arrays
            if (updatedData.images.length === 0 && (updatedData.newImages && updatedData.newImages.length === 0)) {
               throw new Error('Upload at least one image')
            }

            // Validate country and city
            const country = await validateCountry(updatedData.location.country)
            if (!country) {
               throw new Error('Invalid country')
            }
            else if (country && updatedData.location.city) {
               const city = await validateCity(updatedData.location.city, country.objectId)
               if (!city) {
                  throw new Error('Invalid city')
               }
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/places/${placeId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(updatedPlace)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update place')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)

               console.log('New images:', newImages)
               console.log('Updated place:', updatedPlace)

               // Upload images to Cloudinary and update the place with the URLs
               if (newImages && newImages.length > 0) {
                  await this.editUpdateImages(placeId, newImages as File[], updatedPlace.images as string[], token)
               }

               await this.fetchPlaces(true) // Force refresh the places after update
            }
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

      normalizePlace(place: Place): Place {
         place.name = normalize(place.name);
         place.location.country = normalize(place.location.country);

         if (place.location.city) place.location.city = normalize(place.location.city);
         if (place.location.street) place.location.street = normalize(place.location.street);
         if (place.location.streetNumber) place.location.streetNumber = place.location.streetNumber.trim();
         if (place.tags) place.tags = place.tags.map(tag => normalize(tag));

         return place
      },

      clearErrors(): void {
         this.error = null;
         this.addError = null;
         this.updateError = null;
         this.deleteError = null;
      }
   },

   getters: {
      getPlaces: (state) => state.places,
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
