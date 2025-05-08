<template>
   <section class="space-y-4">
      <div class="flex justify-between items-center">
         <h2 class="text-xl font-semibold">Profile</h2>
         <button v-if="!showEditUser" @click="handleEditUser"
            class="text-blue-600 text-sm hover:text-blue-800 font-medium duration-200 ease-in-out cursor-pointer">
            Edit
         </button>
         <div v-else class="flex justify-end gap-3">
            <button type="button" @click="handleCloseEditUser"
               class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm duration-200 ease-in-out cursor-pointer">
               Cancel
            </button>
            <button type="button" @click="handleUpdateUser"
               class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm duration-200 ease-in-out cursor-pointer">
               <span v-if="usersStore.getIsLoading" class="loader"></span>
               <span v-else>Save</span>
            </button>
         </div>
      </div>

      <div class="bg-white shadow-md rounded-2xl p-6 space-y-4">
         <!-- Name -->
         <div class="flex flex-wrap justify-between">
            <div class="w-[48%] md:w-[32%]">
               <label class="block text-sm font-medium mb-1">First Name</label>
               <div v-if="!showEditUser" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">{{
                  user?.firstName }}</div>
               <input v-else type="text" v-model="editUser.firstName" required placeholder="e.g. Peter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none" />
            </div>
            <div class="w-[48%] md:w-[32%]">
               <label class="block text-sm font-medium mb-1">Last Name</label>
               <div v-if="!showEditUser" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">{{
                  user?.lastName }}</div>
               <input v-else type="text" v-model="editUser.lastName" required placeholder="e.g. Parker"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none" />
            </div>

            <!-- Username -->
            <div class="w-full md:w-[32%]">
               <label class="block text-sm font-medium mb-1">Username</label>
               <div v-if="!showEditUser" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">{{
                  user?.username }}</div>
               <input v-else type="text" v-model="editUser.username" required placeholder="e.g. spiderman"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none" />
            </div>
         </div>



         <div class="flex flex-wrap justify-between">
            <!-- Images -->
            <div class="w-full md:w-[49%]">
               <label class="block text-sm font-medium mb-1">
                  Profile Picture
                  <span v-if="showEditUser" class="text-gray-500 font-normal text-xs italic">(Optional)</span>
               </label>
               <div class="flex gap-4">
                  <div>
                     <div v-if="editUser.profilePicture" class="flex flex-wrap gap-3 mb-2 relative">
                        <img :src="editUser.profilePicture" :alt="`Place picture of ${user?.username}`"
                           class="w-[89px] h-[89px] rounded-lg object-cover" />
                        <button v-if="showEditUser" type="button" @click="removeImage"
                           class="absolute top-0 right-0 bg-red-500/90 rounded-bl rounded-tr text-white text-xs px-1 cursor-pointer"
                           title="Remove image">
                           &times;
                        </button>
                     </div>
                     <div v-else
                        class="min-w-[89px] min-h-[89px] w-[89px] h-[89px] rounded-full bg-white border-[1px] border-gray-400">
                        <span class="text-4xl text-blue-500 flex items-center justify-center h-full">
                           {{ user?.firstName.charAt(0) }}{{ user?.lastName.charAt(0) }}
                        </span>
                     </div>
                  </div>

                  <div v-if="showEditUser">
                     <input type="file" @change="handleImageUpload"
                        class="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />

                     <div v-if="editUser.newImage" class="mt-2 w-fit text-xs px-2 py-1 bg-gray-100 rounded">
                        {{ typeof editUser.newImage === 'string' ? editUser.newImage : editUser.newImage.name }}
                        <span type="button" @click="removeNewImage(index)"
                           class="text-red-500 hover:text-red-700 pl-1 duration-200 ease-in-out cursor-pointer"
                           title="Remove image">
                           &times;
                        </span>
                     </div>
                     <!-- Image Error -->
                     <div v-if="imageError || !editUser.newImage" class="mt-2 text-red-500 text-sm italic">
                        {{ imageError }}
                     </div>
                  </div>
               </div>
            </div>

            <!-- Bio -->
            <div class="w-full md:w-[49%]">
               <label class="block text-sm font-medium mb-1">
                  Bio
                  <span v-if="showEditUser" class="text-gray-500 font-normal text-xs italic">(Optional)</span>
               </label>
               <div v-if="!showEditUser"
                  class="min-h-[89px] w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 whitespace-pre-wrap">
                  {{ user?.bio
                     ||
                     '—' }}</div>
               <textarea v-else v-model="editUser.bio" rows="3" placeholder="e.g. I love to travel..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none"></textarea>
            </div>
         </div>

         <!-- Location -->
         <div class="flex flex-wrap justify-between">
            <div class="w-[48%] md:w-[49%]">
               <label class="block text-sm font-medium mb-1">
                  Country
                  <span v-if="showEditUser" class="text-gray-500 font-normal text-xs italic">(Optional)</span>
               </label>
               <div v-if="!showEditUser" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">{{
                  user?.country || '—' }}</div>
               <input v-else type="text" v-model="editUser.country" placeholder="e.g. Hungary"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none" />
            </div>
            <div class="w-[48%] md:w-[49%]">
               <label class="block text-sm font-medium mb-1">
                  City
                  <span v-if="showEditUser" class="text-gray-500 font-normal text-xs italic">(Optional)</span>
               </label>
               <div v-if="!showEditUser" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">{{
                  user?.city || '—' }}</div>
               <input v-else type="text" v-model="editUser.city" placeholder="e.g. Budapest"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none" />
            </div>
         </div>

         <!-- Social Media Links -->
         <div>
            <label class="block text-sm font-medium mb-1">
               Social Media Links
               <span v-if="showEditUser" class="text-gray-500 font-normal text-xs italic">(Optional)</span>
            </label>
            <!-- Existing Socials -->
            <div v-if="editUser.socials!.length > 0" v-for="(social, index) in editUser.socials" :key="index"
               class="flex items-center gap-2 mb-2 duration-200 ease-in-out">
               <div class="w-[40%] px-3 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center gap-2">
                  <i :class="`bx text-[18px] ${social.icon}`"></i>
                  {{ social.name }}
               </div>
               <div v-if="showEditUser" class="w-full flex">
                  <input type="url" v-model="editUser.socials![index].link" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none"
                     placeholder="https://yourlink.com" />
                  <button type="button" @click="removeSocial(index)"
                     class="text-red-500 hover:text-red-700 px-2 cursor-pointer" title="Remove">
                     &times;
                  </button>
               </div>
               <div v-else class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">
                  {{ editUser.socials![index].link }}
               </div>
            </div>
            <div v-else-if="editUser.socials!.length === 0 && !showEditUser"
               class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400">
               —
            </div>

            <!-- Add New Social -->
            <div v-if="availableSocialOptions.length > 0 && showEditUser" class="flex items-center gap-2 mt-1">
               <select v-model="selectedSocial"
                  class="w-[40%] px-3 py-2 border border-gray-300 rounded-lg cursor-pointer">
                  <option disabled value="">Select platform</option>
                  <option v-for="option in availableSocialOptions" :key="option.name" :value="option">
                     {{ option.name }}
                  </option>
               </select>
               <input type="url" required v-model="socialLink" :disabled="!selectedSocial"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 outline-none"
                  placeholder="https://yourprofile.com" />
               <button type="button" @click="addSocial"
                  class="h-[41px] px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
                  Add
               </button>
            </div>
            <div v-else-if="!availableSocialOptions.length && showEditUser" class="text-gray-500 text-sm italic mt-2">
               No more social media platforms available.
            </div>
         </div>

         <!-- Error Display -->
         <div v-if="usersStore.updateError" class="mt-4 text-red-500 text-sm italic">{{ usersStore.updateError }}
         </div>
      </div>
   </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UpdateProfile } from '@/interfaces/userTypes'
import socialMedias from '@/data/socialMedias.json'
// Stores
import { useUserStore } from '@/stores/userStore'
import { useUsersStore } from '@/stores/crud/usersStore'
import { useAuthStore } from '@/stores/authStore';

const userStore = useUserStore()
const usersStore = useUsersStore()
const authStore = useAuthStore()

const user = computed(() => userStore.getUser)

//-- Edit
// User
const showEditUser = ref<boolean>(false)

const handleEditUser = () => {
   showEditUser.value = true
}
const handleCloseEditUser = () => {
   showEditUser.value = false
   populateEditUser()
}

const editUser = ref<UpdateProfile>({
   firstName: user.value?.firstName!,
   lastName: user.value?.lastName!,
   username: user.value?.username!,
   profilePicture: user.value?.profilePicture || '',
   newImage: '',
   bio: user.value?.bio || '',
   country: user.value?.country || '',
   city: user.value?.city || '',
   socials: user.value?.socials?.length! > 0 ? [...user.value?.socials!] : [],
   role: user.value?.role._id,
})

// Populate Edit User
const populateEditUser = () => {
   editUser.value = ({
      firstName: user.value?.firstName!,
      lastName: user.value?.lastName!,
      username: user.value?.username!,
      profilePicture: user.value?.profilePicture || '',
      newImage: '',
      bio: user.value?.bio || '',
      country: user.value?.country || '',
      city: user.value?.city || '',
      socials: user.value?.socials?.length! > 0 ? [...user.value?.socials!] : [],
      role: user.value?.role._id,
   })
}

// Image Upload
const imageError = ref<string | null>(null)

const handleImageUpload = (event: Event) => {
   const target = event.target as HTMLInputElement
   const file = target.files?.[0]

   if (!file) return

   imageError.value = null // Clear previous errors

   // Store file or URL as needed
   editUser.value.newImage = file
}


const removeImage = () => {
   editUser.value.profilePicture = ''
   imageError.value = null
}

const removeNewImage = () => {
   editUser.value.newImage = ''
   imageError.value = null
}


// Socials
const selectedSocial = ref<any | null>(null)
const socialLink = ref<string>('')

const availableSocialOptions = computed(() =>
   socialMedias.data.filter(option => !editUser.value.socials?.find(social => social.name === option.name))
)

const addSocial = () => {
   if (!selectedSocial.value || !socialLink.value) return
   editUser.value.socials?.push({
      name: selectedSocial.value.name,
      icon: selectedSocial.value.icon,
      link: socialLink.value
   })
   selectedSocial.value = null
   socialLink.value = ''
}

const removeSocial = (index: number) => {
   editUser.value.socials?.splice(index, 1)
}

// Update User
const handleUpdateUser = async (): Promise<void> => {
   console.log('userData: ', editUser.value);
   try {
      await usersStore.updateUser(authStore.getUserId!, authStore.getUserId!, editUser.value, authStore.getToken!);

      if (!usersStore.getUpdateError) {
         await userStore.fetchUserData(true);
         handleCloseEditUser();
      }

   } catch (err) {
      console.error('Error updating place request:', err);
   }
};
</script>

<style scoped>
.loader {
   border: 3px solid #f3f3f3;
   border-top: 3px solid #3498db;
   border-radius: 50%;
   width: 16px;
   height: 16px;
   animation: spin 1s linear infinite;
   display: flex;
   justify-content: center;
   align-items: center;
}

@keyframes spin {
   0% {
      transform: rotate(0deg);
   }

   100% {
      transform: rotate(360deg);
   }
}
</style>