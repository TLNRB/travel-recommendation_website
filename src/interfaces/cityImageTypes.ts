export type CityImage = {
   _id: string,
   name: string,
   country: string,
   images: Array<{
      url: string
      alt: string
   }>
}

export type EditCityImage = {
   name: string,
   country: string,
   images: Array<{
      url: string
      alt: string
   }>,
   newImages?: File[]
}

export type UniqueCity = {
   name: string,
   country: string
}
