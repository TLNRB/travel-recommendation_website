import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Optionally: silence unnecessary warnings in test logs
config.global.mocks = {
  $t: (msg: string) => msg // if using vue-i18n
}

// Add any global setup or mocking
globalThis.fetch = vi.fn()
