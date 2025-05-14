import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import ContinentList from '../../src/components/ContinentList.vue'
import { vi } from 'vitest'
import flushPromises from 'flush-promises'
import { useExternalAPIStore } from '../../src/stores/externalAPIStore'

const mockContinents = [
  { objectId: 'X2rEcTJnsE', name: 'Africa' },
  { objectId: 'mSxk54vkg6', name: 'Asia' },
]

describe('ContinentList.vue', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/continent/:id', name: 'Continent', component: { template: '<div />' } }],
    })
  })

  it('renders continents and routes correctly on click', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })

    const wrapper = mount(ContinentList, {
      global: {
        plugins: [pinia, router],
      },
    })

    const store = useExternalAPIStore()

    // Mock getter
    store.getContinents = mockContinents as any

    // Stub fetch method (which runs on mount)
    store.fetchContinents = vi.fn().mockResolvedValue(undefined)

    await router.isReady()
    await flushPromises()

    const links = wrapper.findAllComponents({ name: 'RouterLink' })
    expect(links).toHaveLength(mockContinents.length)

    await links[0].trigger('click')
    expect(links[0].props('to')).toBe('/continent/X2rEcTJnsE')
  })

  it('emits continentSelected when a continent is clicked', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    })

    const wrapper = mount(ContinentList, {
      global: {
        plugins: [pinia, router],
      },
    })

    const store = useExternalAPIStore()

    store.getContinents = mockContinents as any
    store.fetchContinents = vi.fn().mockResolvedValue(undefined)

    await flushPromises()

    const firstItem = wrapper.find('li')
    expect(firstItem.exists()).toBe(true)

    await firstItem.trigger('click')

    expect(wrapper.emitted('continentSelected')).toBeTruthy()
    expect(wrapper.emitted('continentSelected')![0]).toEqual([mockContinents[0]])
  })
})
