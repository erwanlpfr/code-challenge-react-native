import { QueryClient } from "@tanstack/react-query";

const KANPLA_API_KEY = process.env.EXPO_PUBLIC_KANPLA_API_KEY;

// Direct validation of the API key
if (!KANPLA_API_KEY) {
  throw new Error("{KANPLA_API_KEY} Missing API key");
}

/**
 * Fetches data from the Kanpla API.
 * @param url relative URL to the API. Base URL already included.
 * @param options
 * @returns
 */
export const kanplaFetch = (url: string, options?: RequestInit) => {
  const headers = new Headers(options?.headers);
  headers.append("x-auth-user", KANPLA_API_KEY);

  return fetch(`https://kanpla-code-challenge.up.railway.app/${url}`, {
    headers,
    ...options,
  });
};

export const queryClient = new QueryClient();
