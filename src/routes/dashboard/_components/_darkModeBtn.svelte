<script lang="ts">
  import { darkMode, initSession } from '$lib/stores/session.store';
  import { onMount } from 'svelte';

  function toggleDarkMode() {
    darkMode.set(!$darkMode);
  }

  onMount(() => {
    initSession();
  });
</script>

<div
  on:click="{toggleDarkMode}"
  class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
>
  <i class="fonticon-sun fs-2"></i>
</div>
