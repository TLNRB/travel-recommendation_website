import type { CountryImage } from "./countryImageTypes"

export type Role = {
  name: string,
  permissions: string[]
}

export type Social = {
  name: string,
  link: string,
  icon: string
}

export type Continent = {
  objectId: string
  name: string
}
export type ApiResponse = {
  results: Continent[]
}

export type ApiResponseCountries = {
  results: Country[]
}

export type Country = {
  objectId: string
  name: string
  emoji: string
  code: string
  capital?: string
  continent: {
    objectId: string
    name: string
  }
  cities: City[]

}

export type City = {
  objectId: string
  cityId: number
  name: string
  population: number
  country: {
    objectId: string
    name: string
  },
  adminCode: string
  places: Place[]
}

export type Place = {
  name: string,
  description: string,
  images: (File | string)[],
  location: {
    continent: string,
    country: string,
    city: string,
    street: string,
    streetNumber: string
  },
  upvotes: number,
  tags: string[],
  approved: boolean,
  _createdBy: string
}


export type AddPlace = Omit<Place, '_createdBy'>

export type EditPlace = Omit<Place, '_createdBy'> & { newImages?: File[] }

