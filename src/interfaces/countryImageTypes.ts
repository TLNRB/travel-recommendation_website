export type CountryImage = {
   name: string,
   images: Array<object>
}

export type EditCountryImage = {
   name: string,
   images: Array<object>,
   newImages?: File[]
}