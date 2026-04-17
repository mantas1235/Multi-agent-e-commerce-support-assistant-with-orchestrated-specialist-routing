const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function sendChatMessage(text, history = []) {
  const token = localStorage.getItem('litit_token')
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ text, history }),
  })
  if (!res.ok) throw new Error(`Serverio klaida: ${res.status}`)
  const data = await res.json()
  return data.response
}
