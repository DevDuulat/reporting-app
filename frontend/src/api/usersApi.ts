import axios from "axios";
import type { User } from "@/types/user";

export const getUsers = () => axios.get<User[]>("http://localhost:3000/users");
export const createUser = (data: Partial<User>) =>
  axios.post("http://localhost:3000/users", data);
export const updateUser = (id: number, data: Partial<User>) =>
  axios.put(`http://localhost:3000/users/${id}`, data);
export const deleteUser = (id: number) =>
  axios.delete(`http://localhost:3000/users/${id}`);
