import { ref } from "vue";
import type { Continent, Country, City, ApiResponse, ApiResponseCountries } from "@/interfaces/interfaces";

  export const externalAPI = () => {

    const loading = ref(true)

    const continent = ref<Continent | null>(null)
    const country = ref<Country | null>(null)
    const city = ref<City | null>(null)


    const continents = ref<Continent[]>([])
    const allCountriesGlobal = ref<Country[]>([])
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

  const fetchAllCountries = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country?limit=300&keys=name,emoji`, {
        headers: {
          'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
          'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
        }
      })

      const data: ApiResponseCountries = await response.json()
      allCountriesGlobal.value = data.results
      console.log('Continents:', data.results)
    } catch (error) {
      console.error('Error fetching all countries across the globe:', error)
    }
  }
  const fetchContinentAndCountries = async (id: string) => {
    try {
      loading.value = true;

      // 1. Fetch continent
      const continentRes = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Continent/${id}`, {
        headers: {
          'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
          'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
        }
      });
      const continentData = await continentRes.json();
      continent.value = continentData;

      // 2. Fetch countries in continent
      const where = encodeURIComponent(JSON.stringify({
        continent: {
          "__type": "Pointer",
          "className": "Continent",
          "objectId": id
        }

      }));

      const allRes = await fetch(
        `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/Country?include=continent&keys=name,emoji,code,capital,continent,continent.name&where=${where}`,

        {
          headers: {
            'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
            'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
          }
        }
      );
      allCountries.value = (await allRes.json()).results;

      // 3. Fetch cities per country in parallel
      const cityFetchPromises = allCountries.value.map(async (country) => {
        const cityWhere = encodeURIComponent(JSON.stringify({
          country: {
            "__type": "Pointer",
            "className": "Country",
            "objectId": country.objectId
          }
        }));

        const cityRes = await fetch(
          `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?limit=1000&order=-population&include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location&where=${cityWhere}`,
          {
            headers: {
              'X-Parse-Application-Id': `${import.meta.env.VITE_EXTERNAL_API_HEADERS_ID}`,
              'X-Parse-Master-Key': `${import.meta.env.VITE_EXTERNAL_API_MASTER_KEY}`
            }
          }
        );
        const { results } = await cityRes.json();
        return results;
      });

      // 4. Wait for all city fetches and flatten results
      const cityResults = await Promise.all(cityFetchPromises);
      allCities.value = cityResults.flat();


    } catch (error) {
      console.error('Error loading continent, countries, or cities:', error);
    } finally {
      loading.value = false;
    }
  };



  const fetchCountryAndCities = async (id: string) => {
    try {
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
      `${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City?limit=100&order=-population&include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location&where=${where}`,
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

      const cityResponse = await fetch(`${import.meta.env.VITE_EXTERNAL_API_URL}/classes/City/${id}?include=country,country.continent&keys=name,country,country.name,country.continent,country.continent.name,population,location,cityId`, {
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

  const validateCountry = async (countryName: string) => {
    try {
      loading.value = true;

      const where = encodeURIComponent(JSON.stringify({
        name: {
          "$regex": `^${countryName}$`,
          "$options": "i"
        }
      }))

      const response = await fetch(`https://parseapi.back4app.com/classes/Country?where=${where}`, {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
        }
      })

      const data = await response.json()
      if (data.results.length > 0) {
        return data.results[0]
      } else {
        return null
      }
    }
    catch (error) {
      console.error('Error validating a country:', error)
    }
    finally {
      loading.value = false
    }
  }

  const validateCity = async (cityName: string, countryId: string) => {
    try {
      loading.value = true;

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

      const response = await fetch(`https://parseapi.back4app.com/classes/City?where=${where}`, {
        headers: {
          'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja',
          'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH'
        }
      })

      const data = await response.json()
      if (data.results.length > 0) {
        return data.results[0]
      }
      else {
        return null
      }
    }
    catch (error) {
      console.error('Error validating a city:', error)
    }
    finally {
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
    fetchSingleCity,
    fetchAllCountries,
    allCountriesGlobal,
    validateCountry,
    validateCity

  }
}
