// src/hooks/useReportInstanceByGrantNoAuth.ts
import { useEffect, useState } from 'react'

export function useReportInstanceByGrantNoAuth(accessToken: string) {
  const [reportInstance, setReportInstance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:3000/grants/${accessToken}`)

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
  }, [accessToken])

  return { reportInstance, loading, error }
}
