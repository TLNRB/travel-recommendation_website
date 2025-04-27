export type CityImage = {
   name: string,
   country: string,
   images: Array<object>
}

export type EditCityImage = {
   name: string,
   country: string,
   images: Array<object>,
   newImages?: File[]
}

export type UniqueCity = {
   name: string,
   country: string
}