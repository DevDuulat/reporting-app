import { getToken } from '@/utils/keycloak.util'
import { useEffect, useState, useMemo } from 'react'

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

export function useReportInstances(): ReportInstance[] {
  const [instances, setInstances] = useState<ReportInstance[]>([])

  const getInstances = async () => {
    const token = await getToken()
    const response = await fetch('http://localhost:3000/report-instances', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    const data = await response.json()
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
