import { defineStore } from "pinia";
import type { CountryImage, EditCountryImage } from "@/interfaces/countryImageTypes";
// Composables
import { useImages } from "@/composables/useImages";
// Stores
import { usePlacesStore } from "@/stores/crud/placesStore";

const { uploadImages } = useImages()

export const useCountriesStore = defineStore('countriesStore', {
   state: () => ({
      countryImages: [] as CountryImage[],
      uniqueCountries: [] as string[],
      error: null as string | null,
      addError: null as string | null,
      updateError: null as string | null,
      deleteError: null as string | null,
      isCountryImagesLoaded: false,
      isLoading: false,
   }),

   actions: {
      async fetchUniqueCountries() {
         console.log('Fetching unique countries...')
         const placesStore = usePlacesStore()

         // If the places are not loaded, fetch them
         if (!placesStore.isPlacesLoaded) {
            await placesStore.fetchPlaces();
         }

         // Get the approved places only
         const approvedPlaces = placesStore.filterPlacesByApproved(true)
         // Create an array for the unique countries
         const uniqueCountriesArray: string[] = [];

         for (const place of approvedPlaces) {
            // Check if the unique array already contains the country
            const countryExists = uniqueCountriesArray.some((country) => country === place.location.country);

            // If the country doesn't exist add it
            if (!countryExists) {
               uniqueCountriesArray.push(place.location.country); // Add the country to the unique array
            }
         }

         this.uniqueCountries = uniqueCountriesArray // Assign the the array to the state
      },

      async fetchCountryImages(force = false): Promise<void> {
         if (!force && (this.isCountryImagesLoaded || this.isLoading)) {
            console.log('Country images already loaded or loading')
            return
         }

         console.log('Fetching country images...')

         this.isLoading = true

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/countries-images`, {
               method: 'GET',
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available')
            }

            const countryImagesData = await response.json()

            // If the data is valid and not an empty array, store it
            if (countryImagesData && Array.isArray(countryImagesData.data)) {
               const countryImagesArray: CountryImage[] = [] // Create an array for the country images

               for (const countryImage of countryImagesData.data) {
                  // Check if the country images array already contains the country images
                  const countryImagesExists = countryImagesArray.some((country) => country.name === countryImage.name);

                  // If the country doesn't exist add it
                  if (!countryImagesExists) {
                     countryImagesArray.push(countryImage);
                  }
               }

               this.countryImages = countryImagesArray // Assign the array to the state
               this.isCountryImagesLoaded = true
               this.error = null
            } else {
               throw new Error('No country images found.')
            }
         }
         catch (err) {
            this.error = (err as Error).message
            this.isCountryImagesLoaded = false
         }
         finally {
            this.isLoading = false
         }
      },

      async addCountryImage(newCountry: EditCountryImage, token: string): Promise<void> {
         this.isLoading = true;
         this.addError = null;

         try {
            const imagesFile = [...newCountry.newImages!] as File[]; // Get the images from the newCountry object

            // Upload images to Cloudinary and get the URLs
            const { urls, error } = await uploadImages(imagesFile, 'countries')

            if (error) {
               throw new Error(error)
            }

            // Create the images object array with the URLs and alt text
            const imagesData = urls.map((url, index) => ({
               url: url,
               alt: 'Image ' + (index + 1) + ' of ' + newCountry.name // Add an alt text for each image
            }))

            // Create the countryImage object
            const countryImageData: CountryImage = {
               name: newCountry.name,
               images: imagesData
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/countries-images`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(countryImageData)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to add country images')
            }
            else {
               const responseData = await response.json()
               console.log('Add response:', responseData)

               await this.fetchCountryImages(true) // Fetch the updated country images
            }
         }
         catch (err) {
            this.addError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      async updateCountryImage(countryImageId: string, updatedCountry: EditCountryImage, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         // Create the countryImageData object with the existing images
         let countryImageData: CountryImage = {
            name: updatedCountry.name,
            images: [...updatedCountry.images]
         }

         try {
            // Check if images and newImages are empty arrays
            if (updatedCountry.images.length === 0 && updatedCountry.newImages!.length === 0) {
               throw new Error('Upload at least one image')
            }

            // Check if there are newImages to upload
            if (updatedCountry.newImages && updatedCountry.newImages.length > 0) {
               const imagesFile = [...updatedCountry.newImages] as File[]; // Get the images from the updatedCountry object

               // Upload images to Cloudinary and get the URLs
               const { urls, error } = await uploadImages(imagesFile, 'countries')

               if (error) {
                  throw new Error(error)
               }

               // Create the images object array with the URLs and alt text
               const newImagesData = urls.map((url, index) => ({
                  url: url,
                  alt: 'Image ' + (index + 1) + ' of ' + updatedCountry.name
               }))

               const imagesData = [...updatedCountry.images, ...newImagesData] // Combine existing images with new images

               // Update the countryImageData.images with the new images included
               countryImageData.images = imagesData;
            }

            console.log('Country image data before sending:', countryImageData.images)

            // Remove _id property from each image object
            const cleanImages = countryImageData.images.map(image => ({
               url: image.url,
               alt: image.alt,
            }));

            countryImageData.images = cleanImages // Clean the images object to remove any unnecessary properties

            console.log('Country image data after cleaning:', countryImageData.images)

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/countries-images/${countryImageId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               },
               body: JSON.stringify(countryImageData)
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update country images')
            }
            else {
               const responseData = await response.json()
               console.log('Update response:', responseData)

               await this.fetchCountryImages(true) // Fetch the updated country images
            }
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false
         }
      },

      async deleteCountryImage(countryImageId: string, token: string): Promise<void> {
         this.isLoading = true;
         this.deleteError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/countries-images/${countryImageId}`, {
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token,
               }
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to delete country images')
            }
            else {
               const responseData = await response.json()
               console.log('Delete response:', responseData)

               await this.fetchCountryImages(true) // Fetch the updated country images
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
      getUniqueCountries: (state) => state.uniqueCountries,
      getCountryImages: (state) => state.countryImages,
      getCountryImagesByName: (state) => (name: string) => state.countryImages.find((country) => country.name === name) || null,
      getUniqueCountryByName: (state) => (name: string) => state.uniqueCountries.find((country) => country === name) || null,
      getError: (state) => state.error,
      getAddError: (state) => state.addError,
      getUpdateError: (state) => state.updateError,
      getDeleteError: (state) => state.deleteError,
      getIsCountryImagesLoaded: (state) => state.isCountryImagesLoaded,
      getIsLoading: (state) => state.isLoading
   }
})