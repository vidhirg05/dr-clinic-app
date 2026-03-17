// frontend/src/config/api.ts

const isDev = window.location.hostname === "localhost";

export const API_URL = isDev
  ? "http://localhost:5000"
  : "https://dr-clinic-app.onrender.com";
