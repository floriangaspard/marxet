import { API_KEY, EXPLORER_API_URL } from "@/config";

function updateOptions(options?: RequestInit) {
  const update = options ? { ...options } : { headers: new Headers() };
  update.headers = {
    ...update.headers,
    "x-api-key": API_KEY,
  };
  return update;
}

export default function fetchExplorer(
  url: string | URL | Request,
  options?: RequestInit
) {
  return fetch(EXPLORER_API_URL + url, updateOptions(options));
}
