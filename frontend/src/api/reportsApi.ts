import axios from 'axios'
import type { Report } from '@/types/report'
import type { User } from '@/types/user'
import { getToken } from '@/utils/keycloak.util'

const API_URL = 'http://localhost:3000/reports'

export const getReports = async (): Promise<Report[]> => {
  const token = await getToken()
  console.log(token)
  const response = await axios.get<Report[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log(response.data)
  return response.data
}
export const getReportsPaginated = async (
  page = 1,
  limit = 10
): Promise<{
  data: Report[]
  total: number
  page: number
  limit: number
  totalPages: number
}> => {
  const token = await getToken()

  const response = await axios.get<{
    data: Report[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>(API_URL, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log(response.data)
  return response.data
}

export const getReport = async (id: number): Promise<Report> => {
  const token = await getToken()

  const response = await axios.get<Report>(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const createReport = async (data: Partial<Report>): Promise<Report> => {
  const token = await getToken()

  const response = await axios.post<Report>(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const updateReport = async (
  id: number,
  data: Partial<Report>
): Promise<Report> => {
  const token = await getToken()

  const response = await axios.put<Report>(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const deleteReport = async (id: number): Promise<void> => {
  const token = await getToken()

  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const getReportUsers = async (id: number): Promise<User[]> => {
  const token = await getToken()

  const response = await axios.get<User[]>(`${API_URL}/${id}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const setReportUsers = async (
  id: number,
  userIds: number[]
): Promise<void> => {
  const token = await getToken()

  await axios.post(
    `${API_URL}/${id}/users`,
    { userIds },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
}
