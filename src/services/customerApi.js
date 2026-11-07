const API_ROOT = '/api/customer';

export async function customerApi(path, options = {}) {
  const response = await fetch(`${API_ROOT}/${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'No se pudo completar la operación.');
  }
  return payload;
}
