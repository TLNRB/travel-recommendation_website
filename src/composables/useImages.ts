export const useImages = () => {
   const uploadImages = async (images: File[], folder: string): Promise<{ urls: string[], error: string | null }> => {
      const uploadedUrls: string[] = []
      let error: string | null = null

      // Loop through each image and upload it to Cloudinary
      for (const image of images) {
         const imageName = image.name
         const imageExists = await checkIfImageExists(imageName, folder)

         if (imageExists) {
            console.log(`Image ${imageName} already exists in Cloudinary.`)
            error = `Image ${imageName} already exists in Cloudinary.`
            continue // Skip uploading if the image already exists
         }

         let formData = new FormData()

         // Construct the form data for the Cloudinary upload
         formData.append('file', image)
         formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
         formData.append('folder', folder)

         try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
               method: 'POST',
               body: formData
            })

            if (!response.ok) {
               throw new Error(`Failed to upload image: ${response.statusText}`)
            }

            const data = await response.json()

            // Check if the response contains a secure URL and add it to the array
            if (data.secure_url) {
               uploadedUrls.push(data.secure_url)
            }
            else {
               throw new Error('No secure URL returned from Cloudinary')
            }
         }
         catch (err: any) {
            console.error('Error uploading image:', err)
            error = `Error uploading image: ${err.message}`;
         }
      }
      return { urls: uploadedUrls, error }
   }

   const checkIfImageExists = async (fileName: string, folder: string): Promise<boolean | null> => {
      try {
         const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/resources/image/upload?folder=${folder}&public_id=${fileName}`;

         // Request to search for the image in Cloudinary
         const response = await fetch(url, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${import.meta.env.VITE_CLOUDINARY_API_KEY}`
            }
         })

         if (!response.ok) {
            throw new Error(`Failed to check image existence: ${response.statusText}`)
         }

         const searchResult = await response.json()

         console.log('Search result:', searchResult)

         // Check if the image exists in the response
         if (searchResult.resources && searchResult.resources.length > 0) {
            return true // Image exists
         }
         else {
            return false // Image does not exist
         }
      }
      catch (err) {
         console.error('Error checking image existence:', err)
         return null
      }
   }

   return { uploadImages }
}