<script lang="ts">
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import AccountList from './list.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Routing
  let mainView: ViewType;
  setContext('mainView', writable<ViewType>({ component: AccountList, props: {} }));
  const unsubscriber = getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));

  onDestroy(() => {
    unsubscriber();
  });
</script>

<svelte:component this="{mainView.component}" {...mainView.props} />
