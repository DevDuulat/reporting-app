import { getToken, isLoggedIn } from '@/utils/keycloak.util'

export async function saveView({
  user_id,
  report_id,
  type
}: {
  user_id?: number
  report_id: number
  type?: 'auth' | 'open'
}) {
  try {
    const authenticated = await isLoggedIn()
    const token = authenticated ? await getToken() : null

    const finalType = type ?? (authenticated ? 'auth' : 'open')

    const res = await fetch('http://localhost:3000/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        user_id: user_id ?? null,
        report_id,
        type: finalType
      })
    })

    if (!res.ok) {
      const errorBody = await res.text()
      throw new Error(`Ошибка: ${res.status} - ${errorBody}`)
    }
  } catch (err) {
    console.error('Ошибка при сохранении просмотра отчета', err)
  }
}
