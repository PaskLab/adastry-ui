<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import AccountList from './_list.svelte';
  import type { SvelteComponent } from 'svelte';
  import type { Writable } from 'svelte/store';

  // Routing
  let mainView: typeof SvelteComponent;
  setContext('mainView', writable<typeof SvelteComponent>(AccountList));
  getContext<Writable<typeof SvelteComponent>>('mainView').subscribe((v) => (mainView = v));
</script>

<div class="col-xl-8">
  <svelte:component this="{mainView}" />
</div>
