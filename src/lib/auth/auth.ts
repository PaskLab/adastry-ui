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

export async function create(username: string, password: string, name?: string) {
  const result = await fetch(PROVIDER.url + PROVIDER.endpoints.createUserAccount, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      username: username,
      name: name ? name : '',
      password: password,
      currency: 'USD'
    })
  });

  return result.json();
}
