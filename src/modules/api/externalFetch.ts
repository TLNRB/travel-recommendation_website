import { ref } from "vue";
import type { Continent, Country, City, ApiResponse } from "@/interfaces/interfaces";

  export const externalAPI = () => {

    const loading = ref(true)

    const continent = ref<Continent | null>(null)
    const country = ref<Country | null>(null)
    const city = ref<City | null>(null)

    const continents = ref<Continent[]>([])
    const allCountries = ref<Country[]>([])
    const allCities = ref<City[]>([])

  const fetchContinents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Continent?limit=10`, {
        headers: {
          'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
          'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
        }
      })

      const data: ApiResponse = await response.json()
      continents.value = data.results
      console.log('Continents:', data.results)
    } catch (error) {
      console.error('Error fetching continents:', error)
    }
  }

  const fetchContinentAndCountries = async (id: string) => {
    try {
      loading.value = true

      // Fetch continent
      const continentRes = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Continent/${id}`, {
        headers: {
          'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
          'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
        }
      })
      const continentData = await continentRes.json()
      continent.value = continentData

      // Query filter for countries inside this continent
      const where = encodeURIComponent(JSON.stringify({
        continent: {
          "__type": "Pointer",
          "className": "Continent",
          "objectId": id
        }
      }))

      // Fetch all countries
      const allRes = await fetch(
        `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country?include=continent&keys=name,emoji,code,capital,continent,continent.name&where=${where}`,
        {
          headers: {
            'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
            'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
          }
        }
      )
      allCountries.value = (await allRes.json()).results

      // 🚀 Fetch cities in countries from this continent
      const countryIds = allCountries.value.map(c => c.objectId)

      // Use "in" operator in Parse to filter cities
      const cityWhere = encodeURIComponent(JSON.stringify({
        country: {
          "$inQuery": {
            "where": {
              "objectId": {
                "$in": countryIds
              }
            },
            "className": "Country"
          }
        }
      }))

      const cityRes = await fetch(
        `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?limit=1000&keys=name,population,country&include=country&where=${cityWhere}`,
        {
          headers: {
            'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
            'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
          }
        }
      )
      const cityData = await cityRes.json()
      allCities.value = cityData.results

    } catch (error) {
      console.error('Error loading continent or countries or cities:', error)
    } finally {
      loading.value = false
    }
  }


  const fetchCountryAndCities = async (id: string) => {
    try{
      loading.value = true
      const countryResponse = await fetch(
          `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country/${id}`,
          {
            headers: {
              'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
              'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
            }
          }
        );
        const countryData = await countryResponse.json()
        country.value = countryData

    const where = encodeURIComponent(JSON.stringify({
      country: {
        "__type": "Pointer",
        "className": "Country",
        "objectId": id
      }
    }))

    const allCitiesRes = await fetch(
      `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?order=-population&where=${where}`,
      {
        headers: {
          'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
          'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
        }
      }
    )
    const allCitiesData = await allCitiesRes.json()
    allCities.value = allCitiesData.results
    }
    catch (error) {
      console.error('Error loading a country or cities:', error)
    }
    finally {
      loading.value = false
    }
  }

  const fetchSingleCity = async (id: string) => {
    try {
      loading.value = true

      const cityResponse = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City/${id}`, {
        headers: {
          'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
          'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
        }
      })
      const continentData = await cityResponse.json()
      city.value = continentData
    } catch (error) {
      console.error('Error fetching continents:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    continent,
    country,
    city,
    continents,
    allCountries,
    allCities,
    fetchContinents,
    fetchContinentAndCountries,
    fetchCountryAndCities,
    fetchSingleCity

  }
}
