import type { Place } from "@/interfaces/interfaces";
import { ref } from "vue";

export const usePlaces = () => {
  const loading = ref(true);
  const places = ref<Place[]>([]);
  const error = ref<string | null>(null);
  const singlePlace = ref<Place | null>(null);

  const getPlaces = async () => {
    loading.value = true;
    try {
      const response = await fetch("https://travel-recommendations-api.onrender.com/api/places");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      places.value = json.data;
    } catch (error) {
      console.error("Failed to fetch places:", error);
      places.value = [];
    } finally {
      loading.value = false;
    }
  }

  const getPlaceByName = async (name: string) => {
    loading.value = true;
    try {
      const response = await fetch(`https://travel-recommendations-api.onrender.com/api/places/query?field=name&value=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const json = await response.json();
      singlePlace.value = json.data[0];
    } catch (err) {
      console.error("Failed to fetch place by name:", err);
      error.value = (err as Error).message;
      singlePlace.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    places,
    error,
    getPlaces,
    getPlaceByName,
    singlePlace
  };
};


