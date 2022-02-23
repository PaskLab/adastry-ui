<script lang="ts">
  import { beforeUpdate } from 'svelte';
  import { isTokenValid } from '$lib/stores/session.store';

  beforeUpdate(() => {
    if (!$isTokenValid) {
      location.href = '/';
    }
  });
</script>

<svelte:head>
  <title>Dashboard - Adastry</title>
</svelte:head>

<slot />
