import { ref } from "vue";
import type { Continent, Country, City, ApiResponse } from "@/interfaces/interfaces";

  export const externalAPI = () => {

    const loading = ref(true)

    const continent = ref<Continent | null>(null)
    const country = ref<Country | null>(null)
    const city = ref<City | null>(null)

    const continents = ref<Continent[]>([])
    const popularCountries = ref<Country[]>([])
    const allCountries = ref<Country[]>([])
    const popularCities = ref<City[]>([])
    const allCities = ref<City[]>([])

  const fetchContinents = async () => {
    try {
      const response = await fetch('https://parseapi.back4app.com/classes/Continent?limit=10', {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
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

      const continentRes = await fetch(`https://parseapi.back4app.com/classes/Continent/${id}`, {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
        }
      })
      const continentData = await continentRes.json()
      continent.value = continentData

      const where = encodeURIComponent(JSON.stringify({
        continent: {
          "__type": "Pointer",
          "className": "Continent",
          "objectId": id
        }
      }))
      const countryRes = await fetch(
        `https://parseapi.back4app.com/classes/Country?limit=8&order=-capital&include=continent&keys=name,emoji,code,capital,continent,continent.name&where=${where}`,
        {
          headers: {
            'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
            'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
          }
        }
      )
      const countryData = await countryRes.json()
      popularCountries.value = countryData.results

      const allRes = await fetch(
        `https://parseapi.back4app.com/classes/Country?include=continent&keys=name,emoji,code,capital,continent,continent.name&where=${where}`,
        {
          headers: {
            'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
            'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
          }
        }
      )
      allCountries.value = (await allRes.json()).results

    } catch (error) {
      console.error('Error loading continent or countries:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchCountryAndCities = async (id: string) => {
    try{
      loading.value = true
      const countryResponse = await fetch(
          `https://parseapi.back4app.com/classes/Country/${id}`,
          {
            headers: {
              'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
              'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH',
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
    const cityResponse = await fetch(
      `https://parseapi.back4app.com/classes/City?limit=8&order=-population&where=${where}`,
      {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
        }
      }
    )
    const cityData = await cityResponse.json()
    popularCities.value = cityData.results

    const allCitiesRes = await fetch(
      `https://parseapi.back4app.com/classes/City?order=-population&where=${where}`,
      {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
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

      const cityResponse = await fetch(`https://parseapi.back4app.com/classes/City/${id}`, {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
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
    popularCountries,
    popularCities,
    allCities,
    fetchContinents,
    fetchContinentAndCountries,
    fetchCountryAndCities,
    fetchSingleCity

  }
}
