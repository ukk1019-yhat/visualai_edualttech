const BACKEND_URL = "https://neuralflow-backend.vercel.app/api";

export function getApiUrl(path: string): string {
  if (typeof window === "undefined") return `/api/backend${path}`;
  const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  return isDev ? `/api/backend${path}` : `${BACKEND_URL}${path}`;
}
