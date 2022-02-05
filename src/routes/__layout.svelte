<script>
  import { assets } from '$app/paths';
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700"
  />
  <link href="{assets}/css/plugins.bundle.css" rel="stylesheet" type="text/css" />
  <link href="{assets}/css/style.bundle.css" rel="stylesheet" type="text/css" />
</svelte:head>

<slot />
