import ky from "ky";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1/";

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});
