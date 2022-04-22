import { isTokenValid, jwt } from '$lib/stores/session.store';
import { get } from 'svelte/store';
import config from '$lib/config.json';

type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export async function request(
  endpoint: string,
  method: HTTPMethod = 'GET',
  body?: object,
  headers?: object,
  doNotThrowOn: number[] = [],
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
        ...credentials,
      },
      headers ? headers : {},
    ),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!result) return Promise.reject(config.messages.failedFetch);

  if (result.status === 401) {
    isTokenValid.set(false);
    if (!doNotThrowOn.includes(result.status)) {
      return Promise.reject('Unauthorized');
    }
  }

  const json = await result.json();

  if (result.status >= 400 && !doNotThrowOn.includes(result.status)) {
    return Promise.reject(`Error ${result.status} - ${json.message}`);
  }

  return json;
}

export function getURL(
  url: string,
  params: { [key: string]: string | number | undefined } = {},
): string {
  let parsedURL = url;
  let haveQueryParam = false;

  for (const key in params) {
    if (params[key] !== undefined) {
      if (parsedURL.indexOf('{' + key + '}') === -1) {
        parsedURL = `${parsedURL}${haveQueryParam ? '&' : '?'}${key}=${params[key]}`;
        haveQueryParam = true;
      } else {
        parsedURL = parsedURL.replace('{' + key + '}', params[key]!.toString());
      }
    }
  }
  return parsedURL;
}
