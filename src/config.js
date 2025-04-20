export const API_URL = process.env.NODE_ENV === 'development'
  ? "http://localhost:3000/api"
  : "https://trade-tracker-api-n0dk.onrender.com/api";