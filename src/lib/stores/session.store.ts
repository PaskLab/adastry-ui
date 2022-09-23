import { writable, get } from 'svelte/store';
import type { Unsubscriber } from 'svelte/store';
import { browser } from '$app/environment';

export const jwt = writable(browser && localStorage ? localStorage.getItem('jwt') || '' : '');
export const isTokenValid = writable(
	browser && localStorage ? localStorage.getItem('isTokenValid') === 'true' : false
);
export const isSessionExpired = writable(
	browser && localStorage ? localStorage.getItem('isSessionExpired') === 'true' : false
);
export const darkMode = writable(
	browser && localStorage ? localStorage.getItem('darkMode') === 'true' : false
);

export function subscribe(): Unsubscriber[] {
	if (!(browser && localStorage)) return [];

	const unsubscribers: Unsubscriber[] = [];
	// jwt
	unsubscribers.push(jwt.subscribe((v) => localStorage.setItem('jwt', v)));

	// isTokenValid
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
	unsubscribers.push(
		isSessionExpired.subscribe((v) =>
			localStorage.setItem('isSessionExpired', v ? 'true' : 'false')
		)
	);

	// darkMode
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
