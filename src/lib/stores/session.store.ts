import { writable } from 'svelte/store';

export const jwt = writable('');
export const isTokenValid = writable(false);

export function initSession(): void {
  jwt.set(localStorage.getItem('jwt') || '');
  isTokenValid.set(localStorage.getItem('isTokenValid') === 'true' || false);
  jwt.subscribe((v) => localStorage.setItem('jwt', v));
  isTokenValid.subscribe((v) => localStorage.setItem('isTokenValid', v ? 'true' : 'false'));
}
