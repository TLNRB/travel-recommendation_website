// stores/useExternalAPIStore.ts

import { defineStore } from 'pinia'
import type { Continent, Country, City, ApiResponse, ApiResponseCountries } from "@/interfaces/interfaces"

export const useExternalAPIStore = defineStore('externalAPIStore', {
   state: () => ({
      loading: true,

      continent: null as Continent | null,
      country: null as Country | null,
      city: null as City | null,

      continents: [] as Continent[],
      allCountriesGlobal: [] as Country[],
      allCountries: [] as Country[],
      allCities: [] as City[],
   }),

   actions: {
      async fetchContinents() {
         try {
            const response = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Continent?limit=10`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            const data: ApiResponse = await response.json()
            this.continents = data.results
         } catch (error) {
            console.error('Error fetching continents:', error)
         }
      },

      async fetchAllCountries() {
         try {
            const response = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country?limit=300&keys=name,emoji`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            const data: ApiResponseCountries = await response.json()
            this.allCountriesGlobal = data.results
         } catch (error) {
            console.error('Error fetching all countries:', error)
         }
      },

      async fetchContinentAndCountries(id: string) {
         try {
            this.loading = true

            const continentRes = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Continent/${id}`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            this.continent = await continentRes.json()

            const where = encodeURIComponent(JSON.stringify({
               continent: {
                  "__type": "Pointer",
                  "className": "Continent",
                  "objectId": id
               }
            }))

            const allRes = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country?include=continent&keys=name,emoji,code,capital,continent,continent.name&where=${where}`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            this.allCountries = (await allRes.json()).results

            const cityFetches = this.allCountries.map(async (country) => {
               const cityWhere = encodeURIComponent(JSON.stringify({
                  country: {
                     "__type": "Pointer",
                     "className": "Country",
                     "objectId": country.objectId
                  }
               }))
               const res = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?limit=1000&order=-population&include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location&where=${cityWhere}`, {
                  headers: {
                     'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                     'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
                  }
               })
               const data = await res.json()
               return data.results
            })

            const cityResults = await Promise.all(cityFetches)
            this.allCities = cityResults.flat()

         } catch (error) {
            console.error('Error loading continent, countries, or cities:', error)
         } finally {
            this.loading = false
         }
      },

      async fetchCountryAndCities(id: string) {
         try {
            this.loading = true

            const res = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country/${id}`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            this.country = await res.json()

            const where = encodeURIComponent(JSON.stringify({
               country: {
                  "__type": "Pointer",
                  "className": "Country",
                  "objectId": id
               }
            }))

            const cityRes = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?limit=100&order=-population&include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location&where=${where}`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            const data = await cityRes.json()
            this.allCities = data.results
         } catch (error) {
            console.error('Error loading a country or cities:', error)
         } finally {
            this.loading = false
         }
      },

      async fetchCitiesForCountry(countryId: string) {
         const where = encodeURIComponent(JSON.stringify({
            country: {
               "__type": "Pointer",
               "className": "Country",
               "objectId": countryId
            }
         }))

         const res = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?limit=100&order=-population&include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location&where=${where}`, {
            headers: {
               'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
               'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
            }
         })
         const data = await res.json()
         return data.results
      },

      async fetchSingleCity(id: string) {
         try {
            this.loading = true
            const res = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City/${id}?include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location,cityId`, {
               headers: {
                  'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
                  'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
               }
            })
            this.city = await res.json()
         } catch (error) {
            console.error('Error fetching city:', error)
         } finally {
            this.loading = false
         }
      },

      async validateCountry(countryName: string) {
         try {
            this.loading = true
            const where = encodeURIComponent(JSON.stringify({
               name: {
                  "$regex": `^${countryName}$`,
                  "$options": "i"
               }
            }))
            const res = await fetch(`https://parseapi.back4app.com/classes/Country?where=${where}`, {
               headers: {
                  'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
                  'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
               }
            })
            const data = await res.json()
            return data.results.length > 0 ? data.results[0] : null
         } catch (error) {
            console.error('Error validating a country:', error)
         } finally {
            this.loading = false
         }
      },

      async validateCity(cityName: string, countryId: string) {
         try {
            this.loading = true
            const where = encodeURIComponent(JSON.stringify({
               name: {
                  "$regex": `^${cityName}$`,
                  "$options": "i"
               },
               country: {
                  "__type": "Pointer",
                  "className": "Country",
                  "objectId": countryId
               }
            }))
            const res = await fetch(`https://parseapi.back4app.com/classes/City?where=${where}`, {
               headers: {
                  'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
                  'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
               }
            })
            const data = await res.json()
            return data.results.length > 0 ? data.results[0] : null
         } catch (error) {
            console.error('Error validating a city:', error)
         } finally {
            this.loading = false
         }
      }
   },

   getters: {
      getLoading: (state) => state.loading,
      getContinent: (state) => state.continent,
      getCountry: (state) => state.country,
      getCity: (state) => state.city,

      getContinents: (state) => state.continents,
      getCountriesGlobal: (state) => state.allCountriesGlobal,
      getCountries: (state) => state.allCountries,
      getCities: (state) => state.allCities,
   }
})
