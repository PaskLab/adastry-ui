import config from '../config.json';

const PROVIDER = config.provider.adastry;

export async function login(username: string, password: string) {
  const result = await fetch(PROVIDER.url + PROVIDER.endpoints.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  return result.json();
}
