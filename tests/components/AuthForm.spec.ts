import { mount } from '@vue/test-utils'
import AuthView from '../../src/views/AuthView.vue'
import { useAuthStore } from '../../src/stores/authStore'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { usePlacesStore } from '../../src/stores/crud/placesStore'
import LogoutBtn from '../../src/components/LogoutBtn.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('AuthForm.vue', () => {
  let wrapper: any
  let authStore: any
  let store: ReturnType<typeof usePlacesStore>
  let router: any

  beforeEach(() => {
    const pinia = createTestingPinia({ stubActions: false })

    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/auth', name: 'Auth', component: { template: '<div>Auth Page</div>' } }],
    })

    wrapper = mount(AuthView, {
      global: {
        plugins: [pinia, router],
      },
    })

    authStore = useAuthStore()
    store = usePlacesStore()
  })

  it('shows login form by default', () => {
    expect(wrapper.text()).toContain('Log in to your Account')
  })

  it('switches to register tab when clicking Register', async () => {
    const registerButton = wrapper.findAll('button').find(b => b.text() === 'Register')
    await registerButton?.trigger('click')

    expect(wrapper.text()).toContain('Create your account')
  })

  it('logs in user with valid credentials', async () => {
    const fetchTokenSpy = vi.spyOn(authStore, 'fetchToken').mockResolvedValue(true)

    await wrapper.find('[data-test="tab-login"]').trigger('click')
    await wrapper.find('input[placeholder="Email"]').setValue('user@email.com')
    await wrapper.find('input[placeholder="Password"]').setValue('123456')
    await wrapper.find('[data-test="submit-button"]').trigger('click')

    await flushPromises()

    expect(fetchTokenSpy).toHaveBeenCalledWith('user@email.com', '123456')
  })

  it('logs out and redirects to /auth', async () => {
    const logoutWrapper = mount(LogoutBtn, {
      global: {
        plugins: [createTestingPinia({ stubActions: false }), router],
      },
    })

    const logoutSpy = vi.spyOn(authStore, 'logout').mockResolvedValue(authStore)
    const routerPushSpy = vi.spyOn(router, 'push')

    await router.isReady()
    await logoutWrapper.find('button').trigger('click')
    await flushPromises()

    expect(routerPushSpy).toHaveBeenCalledWith('/auth')
  })
})
