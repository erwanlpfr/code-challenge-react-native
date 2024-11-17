import { QueryClient } from "@tanstack/react-query";
import { KanplaError } from "./errors";

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
export const kanplaFetch = async (url: string, options?: RequestInit) => {
  const headers = new Headers(options?.headers);
  headers.append("x-auth-user", KANPLA_API_KEY);

  const response = await fetch(`https://kanpla-code-challenge.up.railway.app/${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = new KanplaError(response.statusText);
    error.response = response;
    throw error;
  }

  return response;
};

export const queryClient = new QueryClient();
