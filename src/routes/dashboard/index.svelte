<script lang="ts">
  import { jwt, isTokenValid, initSession } from '$lib/stores/session.store';
  import { onMount } from 'svelte';

  onMount(() => {
    initSession();
  });
</script>

<h1>Welcome to your Dashboard!!!!</h1>
<p>Your token is {$jwt} {$isTokenValid}</p>
