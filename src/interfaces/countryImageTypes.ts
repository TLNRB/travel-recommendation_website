export type CountryImage = {
  _id: string
  name: string
  images: Array<{
    url: string
    alt: string
  }>
}

export type EditCountryImage = {
  name: string,
  images: Array<{
    url: string
    alt: string
  }>,
  newImages?: File[]
}
