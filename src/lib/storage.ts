export function loadJsonFromStorage<T>(key: string): T | null {
  if (typeof globalThis.localStorage === 'undefined') {
    return null
  }

  const rawValue = globalThis.localStorage.getItem(key)

  if (rawValue === null) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

export function saveJsonToStorage<T>(key: string, value: T) {
  if (typeof globalThis.localStorage === 'undefined') {
    return
  }

  globalThis.localStorage.setItem(key, JSON.stringify(value))
}

export function removeFromStorage(key: string) {
  if (typeof globalThis.localStorage === 'undefined') {
    return
  }

  globalThis.localStorage.removeItem(key)
}
