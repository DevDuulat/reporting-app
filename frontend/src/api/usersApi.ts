import axios from 'axios'
import type { User } from '@/types/user'
import { getToken } from '@/utils/keycloak.util'

const API_URL = 'http://localhost:3000/users'

export const getUsers = async (): Promise<User[]> => {
  const token = await getToken()

  const response = await axios.get<User[]>(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const createUser = async (data: Partial<User>): Promise<User> => {
  const token = await getToken()

  const response = await axios.post<User>(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
  const token = await getToken()

  const response = await axios.put<User>(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return response.data
}

export const deleteUser = async (id: number): Promise<void> => {
  const token = await getToken()

  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
