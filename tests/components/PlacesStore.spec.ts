import { setActivePinia, createPinia } from 'pinia'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { usePlacesStore } from './src/stores/crud/placesStore'

global.fetch = vi.fn()

describe('placesStore', () => {
  let store: ReturnType<typeof usePlacesStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePlacesStore()
    vi.clearAllMocks()
  })

  it('adds a place successfully', async () => {
    const mockId = 'place123'

    // Mock response for place creation
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { _id: mockId } }),
    })

    // Mock image upload + image update (Cloudinary + DB PUT)
    ;(fetch as any).mockResolvedValueOnce({ ok: true, text: async () => 'OK' })
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })

    const newPlace = {
      name: 'Test Place',
      images: [new File(['dummy'], 'image.png')],
      location: {
        country: 'France',
        city: 'Paris',
      },
    }

    const token = 'mock-token'
    const result = await store.addPlace(newPlace as any, token)

    expect(result).toBe(mockId)
    expect(store.addError).toBeNull()
  })

  it('updates a place successfully', async () => {
    const placeId = 'place456'

    ;(fetch as any).mockResolvedValueOnce({ ok: true, text: async () => 'OK' })
    ;(fetch as any).mockResolvedValueOnce({ ok: true, text: async () => 'OK' })
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })

    const updatedPlace = {
      name: 'Updated Name',
      location: {
        country: 'Spain',
        city: 'Barcelona',
      },
      images: ['existing-image-url.jpg'],
      newImages: [new File(['new-image'], 'new.jpg')],
    }

    const token = 'mock-token'
    const createdBy = 'user123'

    await store.updatePlace(placeId, updatedPlace as any, token, createdBy)

    expect(store.updateError).toBeNull()
  })

  it('deletes a place successfully', async () => {
    const placeId = 'place789'

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => 'Deleted',
    })
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })

    const token = 'mock-token'
    await store.deletePlace(placeId, token)

    expect(store.deleteError).toBeNull()
  })
})
