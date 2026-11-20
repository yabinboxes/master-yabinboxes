const activeKey = 'snow.auth.provider';

export type StoredAuthProvider = 'gitlab' | 'github';

export function readActiveAuthProvider(): StoredAuthProvider | null {
  try {
    const value = localStorage.getItem(activeKey);
    return value === 'github' || value === 'gitlab' ? value : null;
  } catch {
    return null;
  }
}

export function writeActiveAuthProvider(provider: StoredAuthProvider): void {
  try {
    localStorage.setItem(activeKey, provider);
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}

export function clearActiveAuthProvider(): void {
  try {
    localStorage.removeItem(activeKey);
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
  }
}
