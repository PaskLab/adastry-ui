<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let result;

	// todo: Change the API KEY
	const API_KEY = 'CHANGE THIS FOR YOUR API KEY';

	/**
	 * Because of server rendering, you have to make sure that the call is made
	 * only in browser. You have 2 options, using the helper "browser",
	 * or running the fetch call in the onMount method.
	 *
	 * Also, be mindful that you need to "guard/test" against undefined value in the
	 * view as it will be pre-rendered on the server.
	 */

	// Using the "browser" helper.
	if (browser) {
		const test = fetch('/api/ada-seal?apiKey=adalovelace', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			}
		});
	}

	// Using the "onMount". "onMount" is only called in the browser once the DOM is completely generated.
	onMount(async () => {
		const response = await fetch(`/api/ada-seal?apiKey=${API_KEY}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			}
		});

		result = await response.json();
		console.log(result.data);
	});
</script>

<h1>Hello World</h1>

<p>API Key = {result ? result.apiKey : ' ... wait, the API is sometime slow ...'}</p>

<pre>
  {result ? JSON.stringify(result.data, null, 2) : ''}
</pre>
