<script lang="ts">
  import { assets } from '$app/paths';
  import { beforeUpdate } from 'svelte';
  import { initSession } from '$lib/stores/session.store';

  let firstLoad = true;

  beforeUpdate(() => {
    if (firstLoad) {
      firstLoad = false;
      initSession();
    }
  });
</script>

<svelte:head>
  <title>Adastry</title>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700"
  />
  <link href="{assets}/css/plugins.bundle.css" rel="stylesheet" type="text/css" />
  <link href="{assets}/css/styles.min.css" rel="stylesheet" type="text/css" />
</svelte:head>

<slot />
