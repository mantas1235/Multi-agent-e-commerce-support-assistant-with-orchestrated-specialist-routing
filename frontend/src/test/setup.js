import { vi } from 'vitest'
import '@testing-library/jest-dom'

// jsdom does not implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn()
