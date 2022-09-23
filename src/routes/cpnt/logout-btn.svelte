<script lang="ts">
  import ArrowOutIcon from '$lib/components/icons/arrow-out.svelte';
  import { logout } from '$lib/utils/helper.utils';
</script>

<div
  on:click="{logout}"
  class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
>
  <span class="svg-icon svg-icon-2x">
    <ArrowOutIcon />
  </span>
</div>
