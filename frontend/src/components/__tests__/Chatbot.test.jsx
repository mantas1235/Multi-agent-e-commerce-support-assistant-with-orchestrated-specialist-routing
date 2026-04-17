import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Chatbot from '../Chatbot'
import * as chatApi from '../../api/chat'

vi.mock('../../api/chat')

describe('Chatbot component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    chatApi.sendChatMessage.mockResolvedValue('AI atsakymas į klausimą.')
  })

  it('renders the initial greeting message', () => {
    render(<Chatbot />)
    expect(screen.getByText(/Sveiki/)).toBeInTheDocument()
    expect(screen.getByText(/ABIBAS AI asistentė/)).toBeInTheDocument()
  })

  it('renders all four suggested question chips', () => {
    render(<Chatbot />)
    expect(screen.getByText(/techninės specifikacijos/)).toBeInTheDocument()
    expect(screen.getByText(/kainuoja pristatymas/)).toBeInTheDocument()
    expect(screen.getByText(/grąžinti prekę/)).toBeInTheDocument()
    expect(screen.getByText(/užsakymo statusas/)).toBeInTheDocument()
  })

  it('sends a message when the form is submitted', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    const input = screen.getByPlaceholderText(/klausimą/)
    await user.type(input, 'Mano klausimas')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(chatApi.sendChatMessage).toHaveBeenCalledWith('Mano klausimas')
    })
  })

  it('clears the input after sending', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    const input = screen.getByPlaceholderText(/klausimą/)
    await user.type(input, 'Klausimas')
    await user.keyboard('{Enter}')

    expect(input.value).toBe('')
  })

  it('displays the user message in the chat', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    await user.type(screen.getByPlaceholderText(/klausimą/), 'Mano klausimas')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Mano klausimas')).toBeInTheDocument()
  })

  it('displays the AI response after the API resolves', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    await user.type(screen.getByPlaceholderText(/klausimą/), 'Klausimas')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('AI atsakymas į klausimą.')).toBeInTheDocument()
    })
  })

  it('sends a message when a suggested question chip is clicked', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    const chip = screen.getByText(/kainuoja pristatymas/)
    await user.click(chip)

    await waitFor(() => {
      expect(chatApi.sendChatMessage).toHaveBeenCalledWith(
        'Kiek kainuoja pristatymas?'
      )
    })
  })

  it('shows an error message when the API call fails', async () => {
    chatApi.sendChatMessage.mockRejectedValueOnce(new Error('Server error'))
    const user = userEvent.setup()
    render(<Chatbot />)

    await user.type(screen.getByPlaceholderText(/klausimą/), 'Klausimas')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText(/įvyko klaida/)).toBeInTheDocument()
    })
  })

  it('sends message from trigger prop', async () => {
    const trigger = { text: 'Kaip grąžinti?', id: 1 }
    render(<Chatbot trigger={trigger} />)

    await waitFor(() => {
      expect(chatApi.sendChatMessage).toHaveBeenCalledWith('Kaip grąžinti?')
    })
  })

  it('resets chat when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<Chatbot />)

    // Send a message first
    await user.type(screen.getByPlaceholderText(/klausimą/), 'Testas')
    await user.keyboard('{Enter}')
    await waitFor(() => screen.getByText('Testas'))

    // Clear
    await user.click(screen.getByTitle(/Išvalyti pokalbį/))

    // User message should be gone
    expect(screen.queryByText('Testas')).not.toBeInTheDocument()
  })
})
