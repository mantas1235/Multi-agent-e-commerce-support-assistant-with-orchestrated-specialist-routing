const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function sendChatMessage(text) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error(`Serverio klaida: ${response.status}`)
  }

  const data = await response.json()
  return data.answer
}
