import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendChatMessage } from '../chat'

describe('sendChatMessage', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('sends a POST request to /chat with the correct body', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: 'Produkto specifikacijos...' }),
    })

    const result = await sendChatMessage('Kokios specifikacijos?')

    expect(global.fetch).toHaveBeenCalledOnce()
    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toMatch(/\/chat$/)
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual({ text: 'Kokios specifikacijos?' })
    expect(result).toBe('Produkto specifikacijos...')
  })

  it('throws an error when the server returns a non-ok status', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 })
    await expect(sendChatMessage('test')).rejects.toThrow('500')
  })

  it('throws when fetch itself rejects (network error)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))
    await expect(sendChatMessage('test')).rejects.toThrow('Network error')
  })
})
