import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const apiKey: string | null = url.searchParams.get('apiKey') ?? null;

	if (!apiKey) {
		throw error(400, 'Missing parameter: apiKey');
	}

	return json({ apiKey: apiKey });
};
