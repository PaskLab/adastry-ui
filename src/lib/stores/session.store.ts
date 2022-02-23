import { writable, get } from 'svelte/store';
import type { Unsubscriber } from 'svelte/store';

export const jwt = writable('');
export const isTokenValid = writable(false);
export const isSessionExpired = writable(false);
export const darkMode = writable(false);

export function initSession(): Unsubscriber[] {
  const unsubscribers: Unsubscriber[] = [];
  // jwt
  jwt.set(localStorage.getItem('jwt') || '');
  unsubscribers.push(jwt.subscribe((v) => localStorage.setItem('jwt', v)));

  // isTokenValid
  isTokenValid.set(localStorage.getItem('isTokenValid') === 'true');
  unsubscribers.push(
    isTokenValid.subscribe((v) => {
      if (v !== (localStorage.getItem('isTokenValid') === 'true')) {
        localStorage.setItem('isTokenValid', v ? 'true' : 'false');
        if (!v && get(jwt).length) {
          jwt.set('');
          isSessionExpired.set(true);
          location.href = '/';
        }
      }
    })
  );

  // isSessionValid
  isSessionExpired.set(localStorage.getItem('isSessionExpired') === 'true');
  unsubscribers.push(
    isSessionExpired.subscribe((v) =>
      localStorage.setItem('isSessionExpired', v ? 'true' : 'false')
    )
  );

  // darkMode
  darkMode.set(localStorage.getItem('darkMode') === 'true');
  unsubscribers.push(
    darkMode.subscribe((v) => {
      localStorage.setItem('darkMode', v ? 'true' : 'false');
      if (v) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    })
  );

  return unsubscribers;
}
