import type { CountryImage } from "./countryImageTypes"
import type { Place } from "./placeTypes"

export type Permission = {
  _id: string,
  name: string,
  description: string
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