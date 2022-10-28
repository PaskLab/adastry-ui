<script lang="ts">
	import { onMount } from 'svelte';
	let result;
	onMount(async () => {
		const response = await fetch('/api/ada-seal?apiKey=adalovelace', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			}
		});

		result = await response.json();
		console.log(result.apiKey);
	});
</script>

Hello World API Key = {result ? result.apiKey : ''}
