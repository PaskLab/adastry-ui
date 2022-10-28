import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const apiKey: string | null = url.searchParams.get('apiKey') ?? null;

	if (!apiKey) {
		throw error(400, 'Missing parameter: apiKey');
	}

	let response;

	try {
		response = await fetch('https://vm.adaseal.eu/api.php?action=treasury_read', {
			headers: {
				Authentication: 'Bearer Token',
				'X-API-Token': apiKey,
				'Content-Type': 'application/json',
				accept: 'application/json'
			}
		});
	} catch (e) {
		console.log(e);
	}

	const result = response ? await response.json() : null;

	return json({ apiKey: apiKey, data: result });
};
