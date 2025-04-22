<template>
  <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-6">
      <h2 class="text-xl font-semibold text-center">Suggest a Place</h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Continent</label>
          <select v-model="form.continent" class="input mt-1">
            <option disabled value="">Select continent</option>
            <option>Africa</option>
            <option>Asia</option>
            <option>Europe</option>
            <option>North America</option>
            <option>South America</option>
            <option>Oceania</option>
            <option>Antarctica</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Country</label>
          <input type="text" v-model="form.country" class="input mt-1" placeholder="Country" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">City</label>
          <input type="text" v-model="form.city" class="input mt-1" placeholder="City" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Place Name</label>
          <input type="text" v-model="form.place" class="input mt-1" placeholder="E.g. Eiffel Tower" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Google Maps Link</label>
          <input type="url" v-model="form.link" class="input mt-1" placeholder="https://..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Recommendation (optional)</label>
          <textarea
            v-model="form.recommendation"
            class="input mt-1"
            rows="3"
            placeholder="What makes this place special?"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t mt-6">
          <button type="button" @click="close" class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits(['close', 'submit']);

const form = reactive({
  continent: '',
  country: '',
  city: '',
  place: '',
  link: '',
  recommendation: '',
});

const close = () => emit('close');

const submitForm = () => {
  // TODO: validation if needed
  emit('submit', { ...form });
  close();
};
</script>
