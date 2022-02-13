import { isTokenValid } from '$lib/stores/session.store';

type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function request(
  endpoint: string,
  method: HTTPMethod = 'GET',
  body?: object,
  headers?: object
) {
  const result = await fetch(endpoint, {
    method: method,
    headers: Object.assign(
      {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      headers ? headers : {}
    ),
    body: body ? JSON.stringify(body) : undefined
  });

  if (result && result.status === 403) {
    isTokenValid.set(false);
    location.href = '/';
  }

  return result ? result.json() : null;
}
