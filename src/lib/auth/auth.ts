import config from '../config.json';
import { request } from '$lib/utils/api.utils';

const PROVIDER = config.provider.adastry;

export async function login(username: string, password: string) {
  return request(PROVIDER.url + PROVIDER.endpoints.login, 'POST', {
    username: username,
    password: password
  });
}

export async function create(username: string, password: string, name?: string) {
  return request(PROVIDER.url + PROVIDER.endpoints.createUserAccount, 'POST', {
    username: username,
    name: name ? name : '',
    password: password,
    currency: 'USD'
  });
}
