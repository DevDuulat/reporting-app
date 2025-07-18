import axios from 'axios'
import type { Report } from '@/types/report'

const API_URL = 'http://localhost:3000/reports'

export const getReports = () => axios.get<Report[]>(API_URL)
export const getReport = (id: number) => axios.get<Report>(`${API_URL}/${id}`)
export const createReport = (data: Partial<Report>) =>
  axios.post<Report>(API_URL, data)
export const updateReport = (id: number, data: Partial<Report>) =>
  axios.put<Report>(`${API_URL}/${id}`, data)
export const deleteReport = (id: number) => axios.delete(`${API_URL}/${id}`)

export const getReportUsers = (id: number) =>
  axios.get(`${API_URL}/${id}/users`)
export const setReportUsers = (id: number, userIds: number[]) =>
  axios.post(`${API_URL}/${id}/users`, { userIds })
