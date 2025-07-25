import { getToken } from '@/utils/keycloak.util'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { mockUser } from '@/mockUser'

export interface Report {
  id: number
  folder: string
  title: string
  description: string
  notif_rules: string
}

export interface ReportInstance {
  id: number
  report_id: number
  report: Report
  title: string
  summary: string
  day: string
  tags: string[]
  minio_id: string
}

export function useReports(): Report[] {
  const [reports, setReports] = useState<Report[]>([])

  const getReports = async () => {
    const token = await getToken()
    console.log(token)
    const response = await fetch('http://localhost:3000/reports', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    const data = await response.json()
    setReports(data)
  }

  useEffect(() => {
    void getReports()
  }, [])

  return reports
}

export function useReportInstanceByGrant(accessToken: string) {
  const [reportInstance, setReportInstance] = useState<ReportInstance | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return

    const fetchGrantReport = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = await getToken()
        const response = await fetch(
          `http://localhost:3000/grants/${accessToken}`,
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        )

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(data)
        setReportInstance(data.reportInstance)
      } catch (err: any) {
        setError(err.message || 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    fetchGrantReport()
  }, [accessToken])

  return { reportInstance, loading, error }
}

export function useReportInstances() {
  const [instances, setInstances] = useState<ReportInstance[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 10

  const getInstances = useCallback(async (nextPage: number) => {
    const token = await getToken()

    const params = new URLSearchParams()
    if (mockUser?.id) {
      params.append('userId', mockUser.id.toString())
    }
    params.append('page', nextPage.toString())
    params.append('limit', limit.toString())

    const url = `http://localhost:3000/report-instances?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

    const data = await response.json()
    console.log(data)
    if (nextPage === 1) {
      setInstances(data.data)
    } else {
      setInstances((prev) => [...prev, ...data.data])
    }

    setHasMore(data.hasMore)
    setPage(nextPage)
  }, [])

  useEffect(() => {
    void getInstances(1)
  }, [getInstances])

  const loadMore = () => {
    if (hasMore) {
      void getInstances(page + 1)
    }
  }

  return { instances, loadMore, hasMore }
}

export function useGroupedReportInstances(instances: ReportInstance[]): {
  byDay: Record<string, ReportInstance[]>
  byFolder: Record<string, ReportInstance[]>
} {
  const byDay = useMemo(() => {
    return instances.reduce<Record<string, ReportInstance[]>>((acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = []
      }
      acc[item.day].push(item)
      return acc
    }, {})
  }, [instances])

  const byFolder = useMemo(() => {
    return instances.reduce<Record<string, ReportInstance[]>>((acc, item) => {
      const folder = item.report.folder
      if (!acc[folder]) {
        acc[folder] = []
      }
      acc[folder].push(item)
      return acc
    }, {})
  }, [instances])

  return { byDay, byFolder }
}
