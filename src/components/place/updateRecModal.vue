<template>
  <dialog ref="dialogRef" class="rounded-xl mx-auto mt-10 p-6 bg-white shadow-xl w-full max-w-md">
    <form @submit.prevent="submitEdit">
      <h2 class="text-xl font-bold text-green-700 mb-4">Edit Recommendation</h2>

      <label class="block mb-2 text-sm font-medium">Title</label>
      <input v-model="form.title" type="text" class="w-full border p-2 rounded mb-4" required />

      <label class="block mb-2 text-sm font-medium">Content</label>
      <textarea v-model="form.content" class="w-full border p-2 rounded mb-4" required />

      <label class="block mb-2 text-sm font-medium">Date of Visit</label>
      <input v-model="form.dateOfVisit" type="date" class="w-full border p-2 rounded mb-4" required />

      <label class="block mb-2 text-sm font-medium">Rating</label>
      <input v-model.number="form.rating" type="number" min="1" max="5" class="w-full border p-2 rounded mb-4" required />

      <div class="flex justify-end gap-2">
        <button type="button" @click="close" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRecommendationsStore } from '@/stores/crud/recommendationsStore'
import { useAuthStore } from '@/stores/authStore'
import type { Recommendation } from '@/interfaces/recommendationTypes'

const emit = defineEmits(['updated'])

const recommendationsStore = useRecommendationsStore()
const authStore = useAuthStore()

const dialogRef = ref<HTMLDialogElement | null>(null)
const form = ref({
  _id: '',
  title: '',
  content: '',
  dateOfVisit: '',
  rating: 1,
  place: '',
  _createdBy: authStore.userId,
  upvotes: 0
})



const open = (rec: Recommendation) => {
  form.value = {
    _id: rec._id,
    title: rec.title,
    content: rec.content,
    dateOfVisit: new Date(rec.dateOfVisit).toISOString().split('T')[0],
    rating: rec.rating,
    place: typeof rec.place === 'string' ? rec.place : rec.place._id,
    _createdBy: authStore.userId,
    upvotes: rec.upvotes || 0
  }
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
}

const submitEdit = async () => {
  try {
    console.log("Sending update request:", {
      recommendationId: form.value._id,
      updatedData: {
        place: typeof form.value.place,
        title: form.value.title,
        content: form.value.content,
        dateOfVisit: form.value.dateOfVisit,
        rating: form.value.rating,
        _createdBy: authStore.userId,
        upvotes: form.value.upvotes
      },
      token: authStore.token
    })

    if (!authStore.userId) {
        throw new Error('User is not authenticated')
      }

    const response = await recommendationsStore.updateRecommendation(
      form.value._id,
      {
        place: form.value.place,
        title: form.value.title,
        content: form.value.content,
        dateOfVisit: form.value.dateOfVisit,
        rating: form.value.rating,
        _createdBy: authStore.userId,
        upvotes: form.value.upvotes
      },
      authStore.token!
    )
    console.log('dateOfVisit:', form.value.dateOfVisit)
    console.log("Updated recommendation response:", response)


    await recommendationsStore.fetchRecommendationsByPlace(form.value.place, true);
    emit('updated')
    dialogRef.value?.close();
    await nextTick();
  } catch (err) {
    console.error('Failed to update recommendation:', err)
  }
}

defineExpose({ open })

</script>
