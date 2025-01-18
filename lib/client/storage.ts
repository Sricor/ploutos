export function getLocalStorageItem(key: string) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }

  return null;
}
