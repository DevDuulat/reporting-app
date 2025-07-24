import { useState, useEffect } from 'react'

export function useReportInstanceByGrant(
  accessToken: string,
  withAuth: boolean = true
) {
  const [reportInstance, setReportInstance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    async function fetchReport() {
      setLoading(true)
      setError(null)

      try {
        const headers: HeadersInit = {}

        if (withAuth) {
          // динамический импорт useKeycloak только при необходимости
          const { useKeycloak } = await import('@/hooks/useKeycloak')
          const {
            getValidToken,
            loading: keycloakLoading,
            authenticated
          } = useKeycloak()

          if (keycloakLoading) return

          if (!authenticated) {
            throw new Error('Пользователь не аутентифицирован')
          }

          const token = await getValidToken()
          if (!token) throw new Error('Токен Keycloak недоступен')

          headers.Authorization = `Bearer ${token}`
        }

        const res = await fetch(`http://localhost:3000/grants/${accessToken}`, {
          headers
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(errText || 'Ошибка загрузки отчёта')
        }

        const data = await res.json()
        setReportInstance(data.reportInstance)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    void fetchReport()
  }, [accessToken, withAuth])

  return { reportInstance, loading, error }
}
