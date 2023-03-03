<script lang="ts">
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import CategoryList from './list.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Routing
  let categoryView: ViewType;
  setContext('categoryView', writable<ViewType>({ component: CategoryList, props: {} }));
  const unsubscriber = getContext<Writable<ViewType>>('categoryView').subscribe(
    (v) => (categoryView = v),
  );

  onDestroy(() => {
    unsubscriber();
  });
</script>

<svelte:component this="{categoryView.component}" {...categoryView.props} />
