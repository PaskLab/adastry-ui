<script lang="ts">
  import { onMount } from 'svelte';

  export let customClass = '';
  let count = 0;

  onMount(() => {
    const interval = setInterval(() => {
      count = (count + 1) % 4;
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="badge badge-light-warning w-80px pe-8 {customClass}">
  Syncing {'.'.repeat(count)}
</div>
