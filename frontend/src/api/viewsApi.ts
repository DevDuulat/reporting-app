import { getToken } from '@/utils/keycloak.util'

export async function getViewsByUser(userId: number) {
  const res = await fetch(`/api/views/by-user/${userId}`)
  if (!res.ok) throw new Error('Не удалось загрузить просмотры')
  return res.json()
}

export async function saveView({
  user_id,
  report_id,
  type = 'open'
}: {
  user_id: number
  report_id: number
  type?: string
}) {
  try {
    const token = await getToken()

    const res = await fetch('http://localhost:3000/views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id,
        report_id,
        type
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
