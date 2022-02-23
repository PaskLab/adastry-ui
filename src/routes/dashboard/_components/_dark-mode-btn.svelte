<script lang="ts">
  import { darkMode } from '$lib/stores/session.store';

  function toggleDarkMode() {
    darkMode.set(!$darkMode);
  }
</script>

<div
  on:click="{toggleDarkMode}"
  class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
>
  <i class="fonticon-sun fs-2"></i>
</div>
