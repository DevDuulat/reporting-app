import { useState, useEffect } from 'react'
import { useKeycloak } from '@/hooks/useKeycloak'

export function useReportInstanceByGrant(accessToken: string) {
  const {
    getValidToken,
    loading: keycloakLoading,
    authenticated
  } = useKeycloak()

  const [reportInstance, setReportInstance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    if (keycloakLoading) {
      return
    }

    if (!authenticated) {
      setLoading(false)
      setError('Пользователь не аутентифицирован')
      return
    }
    async function fetchReport() {
      setLoading(true)
      setError(null)
      try {
        const token = await getValidToken()

        if (!token) {
          throw new Error('Keycloak token is not available yet')
        }

        const res = await fetch(`http://localhost:3000/grants/${accessToken}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
  }, [accessToken, keycloakLoading, authenticated, getValidToken])

  return { reportInstance, loading, error }
}
