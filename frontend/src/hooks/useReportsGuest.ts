import { useEffect, useState } from 'react'
import { mockUser } from '@/mockUser'

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

export function useGuestReportInstances(): ReportInstance[] {
  const [instances, setInstances] = useState<ReportInstance[]>([])

  useEffect(() => {
    const getInstances = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/report-instances${
            mockUser?.id ? `?userId=${mockUser.id}` : ''
          }`
        )

        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`)
        }

        const data = await response.json()
        setInstances(data)
      } catch (err) {
        console.error('Ошибка при получении отчетов:', err)
        setInstances([])
      }
    }

    void getInstances()
  }, [])

  return instances
}
