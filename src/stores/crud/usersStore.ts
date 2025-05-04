import { defineStore } from "pinia";
import { ref } from 'vue';
import type { User, UpdateProfile } from "@/interfaces/userTypes";
import { useImages } from "@/composables/useImages";
import { normalize } from "@/composables/normalizeString";
// External API
import { externalAPI } from "@/modules/api/externalFetch";

const { uploadImages } = useImages()
const { validateCountry, validateCity } = externalAPI()

export const useUsersStore = defineStore('usersStore', {
   state: () => ({
      users: ref<User[]>([]),
      error: ref<string | null>(null),
      updateError: ref<string | null>(null),
      isUsersLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),


   actions: {
      async fetchUsers(force = false): Promise<void> {
         if (!force && (this.isUsersLoaded || this.isLoading)) return // Prevents multiple calls to the API

         this.isLoading = true;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
               method: 'GET'
            })

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'No data available');
            }

            const usersData = await response.json()
            this.users = usersData.data;
            this.error = null;
            this.isUsersLoaded = true;

            console.log('Users fetched successfully:', this.users)
         }
         catch (err) {
            this.error = (err as Error).message
            this.users = [];
            this.isUsersLoaded = false;
         }
         finally {
            this.isLoading = false;
         }
      },

      /* async updateUserRole(userId: string, editingUserId: string, updatedData: UpdateProfile, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}?editingUserId=${editingUserId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update user role')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)
            }

            await this.fetchUsers(true);
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      }, */

      async updateUser(userId: string, editingUserId: string, updatedData: UpdateProfile, token: string): Promise<void> {
         this.isLoading = true;
         this.updateError = null;

         // Exctract the new image from updatedData
         let { newImage, ...userData
         } = updatedData;

         // Normalize userData strings
         userData = this.normalizeUser(userData)

         try {
            // Validate country
            let country: any;
            if (userData.country !== '') {
               console.log('Country provided:', userData.country)
               country = await validateCountry(userData.country!);
               if (!country) {
                  throw new Error('Invalid country');
               }
            }
            if (!country && userData.city !== '') {
               throw new Error('Country is required when city is provided');
            }
            // Validate city
            if (country && userData.city !== '') {
               console.log('City provided:', userData.city)
               const isValidCity = await validateCity(userData.city!, country.objectId);
               if (!isValidCity) {
                  throw new Error('Invalid city');
               }
            }

            // Check if there are newImages to upload
            if (newImage !== '') {
               console.log('New image upload:', newImage)
               const imagesFile: File[] = [];
               imagesFile.push(newImage as File)

               // Upload images to Cloudinary and get the URLs
               const { urls, error } = await uploadImages(imagesFile, 'profile-pictures')

               if (error) {
                  throw new Error(error)
               }

               const imageData = urls[0] // Get the first image URL for the profile picture as we only upload one image

               userData.profilePicture = imageData;
            }

            console.log('Profile icture image data before sending:', userData.profilePicture)

            console.log('User data before sending:', userData)

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}?editingUserId=${editingUserId}`, {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
                  'auth-token': token
               },
               body: JSON.stringify(userData)
            });

            if (!response.ok) {
               const errorResponse = await response.json()
               throw new Error(errorResponse.error || 'Failed to update user')
            }
            else {
               const responseText = await response.text()
               console.log('Update response:', responseText)
            }

            await this.fetchUsers(true);
         }
         catch (err) {
            this.updateError = (err as Error).message
         }
         finally {
            this.isLoading = false;
         }
      },

      normalizeUser(user: UpdateProfile): UpdateProfile {
         if (user.country !== '') user.country = normalize(user.country!);
         if (user.city !== '') user.city = normalize(user.city!);

         return user;
      },

      clearErrors(): void {
         this.error = null;
         this.updateError = null;
      }
   },

   getters: {
      getUsers: (state) => state.users,
      getUserById: (state) => (id: string) => state.users.find(user => user._id === id),
      getError: (state) => state.error,
      getUpdateError: (state) => state.updateError,
      getIsUsersLoaded: (state) => state.isUsersLoaded,
      getIsLoading: (state) => state.isLoading,
   }
})