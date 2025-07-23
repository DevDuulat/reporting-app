import { getToken } from '@/utils/keycloak.util'
import { useEffect, useState, useMemo } from 'react'
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

export function useReportInstances(): ReportInstance[] {
  const [instances, setInstances] = useState<ReportInstance[]>([])

  const getInstances = async () => {
    const token = await getToken()
    // const response = await fetch('http://localhost:3000/report-instances', {
    //   headers: {
    //     Authorization: 'Bearer ' + token
    //   }
    // })
    const response = await fetch(
      `http://localhost:3000/report-instances${
        mockUser?.id ? `?userId=${mockUser.id}` : ''
      }`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )

    const data = await response.json()

    const ids = data.map((item: { id: number }) => item.id)

    console.log('IDs:', ids)
    console.log('Mock User ID:', mockUser.id)

    setInstances(data)
  }

  useEffect(() => {
    void getInstances()
  }, [])

  return instances
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
