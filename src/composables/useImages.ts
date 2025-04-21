export const useImages = () => {
   const uploadImages = async (images: File[], folder: string): Promise<{ urls: string[], error: string | null }> => {
      const uploadedUrls: string[] = []
      let error: string | null = null

      // Loop through each image and upload it to Cloudinary
      for (const image of images) {
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

   return { uploadImages }
}