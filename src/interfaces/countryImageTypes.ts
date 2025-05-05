export type CountryImage = {
  name: string
  images: Array<{
    url: string
    alt?: string
  }>
}

export type EditCountryImage = {
   name: string,
   images: Array<object>,
   newImages?: File[]
}
