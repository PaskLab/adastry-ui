import { writable } from 'svelte/store';

export const jwt = writable('');
export const isTokenValid = writable(false);
export const darkMode = writable(false);

export function initSession(): void {
  // jwt
  jwt.set(localStorage.getItem('jwt') || '');
  jwt.subscribe((v) => localStorage.setItem('jwt', v));
  // isTokenValid
  isTokenValid.set(localStorage.getItem('isTokenValid') === 'true' || false);
  isTokenValid.subscribe((v) => localStorage.setItem('isTokenValid', v ? 'true' : 'false'));
  // darkMode
  darkMode.set(localStorage.getItem('darkMode') === 'true' || false);
  darkMode.subscribe((v) => {
    localStorage.setItem('darkMode', v ? 'true' : 'false');
    if (v) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}
