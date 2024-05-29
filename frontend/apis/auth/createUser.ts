import { NewUser } from "@/models/users";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function createUser(user: NewUser) {
  try {
    const response = await api.post("/api/users/", user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
