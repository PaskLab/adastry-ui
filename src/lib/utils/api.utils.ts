import { isTokenValid, jwt } from '$lib/stores/session.store';
import { get } from 'svelte/store';

type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function request(
  endpoint: string,
  method: HTTPMethod = 'GET',
  body?: object,
  headers?: object,
  doNotThrowOn: number[] = []
): Promise<any> {
  const credentials: { Authorization?: string } = get(jwt).length
    ? { Authorization: 'Bearer ' + get(jwt) }
    : {};

  const result = await fetch(endpoint, {
    method: method,
    headers: Object.assign(
      {
        'Content-Type': 'application/json',
        accept: 'application/json',
        ...credentials
      },
      headers ? headers : {}
    ),
    body: body ? JSON.stringify(body) : undefined
  });

  if (!result) throw Error('Failed to fetch data');

  if (result.status === 401) {
    isTokenValid.set(false);
    if (!doNotThrowOn.includes(result.status)) {
      throw Error('Unauthorized');
    }
  }

  const json = await result.json();

  if (result.status >= 400 && !doNotThrowOn.includes(result.status)) {
    throw Error(`Error ${result.status} - ${json.message}`);
  }

  return json;
}
