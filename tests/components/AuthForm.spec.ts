import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AuthView from '@/views/AuthView'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/authStore'

describe('AuthForm.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(AuthView, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      }
    })
  })

  it('shows login form by default', () => {
    expect(wrapper.text()).toContain('Log in to your Account')
  })

  it('switches to register tab when clicking Register', async () => {
    const registerButton = wrapper.findAll('button')
      .find(b => b.text() === 'Register')
    await registerButton?.trigger('click')

    expect(wrapper.text()).toContain('Create your account')
  })

  it('logs in user with valid credentials', async () => {
    const authStore = useAuthStore()

    wrapper.vm.activeTab = 'login'
    await wrapper.find('input[placeholder="Email"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('password123')

    vi.spyOn(authStore, 'fetchToken').mockResolvedValue(true)

    const loginButton = wrapper.find('button').element as HTMLButtonElement
    await wrapper.find('button').trigger('click')

    await flushPromises()

    expect(authStore.fetchToken).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('registers user with valid input', async () => {
    const authStore = useAuthStore()

    wrapper.vm.activeTab = 'register'
    await flushPromises()

    await wrapper.find('input[placeholder="First Name"]').setValue('John')
    await wrapper.find('input[placeholder="Last Name"]').setValue('Doe')
    await wrapper.find('input[placeholder="Username"]').setValue('johndoe')
    await wrapper.find('input[placeholder="Email Address"]').setValue('john@example.com')
    await wrapper.find('input[placeholder="Password"]').setValue('secret')

    vi.spyOn(authStore, 'registerUser').mockResolvedValue(true)

    const registerButton = wrapper.find('button').element as HTMLButtonElement
    await wrapper.find('button').trigger('click')

    await flushPromises()

    expect(authStore.registerUser).toHaveBeenCalledWith(
      'John',
      'Doe',
      'johndoe',
      'john@example.com',
      'secret'
    )
  })
})
