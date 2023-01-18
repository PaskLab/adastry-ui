<script lang="ts">
  import { onMount } from 'svelte';

  export let text = 'Pending';
  export let customClass = 'badge badge-light-warning w-80px pe-8';
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

<div class="{customClass}">
  {text}
  {'.'.repeat(count)}
</div>
