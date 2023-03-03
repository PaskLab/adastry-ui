<script lang="ts">
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import AccountList from './list.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  export let categoryName = '';
  export let categorySlug = '';
  export let categoryColor = '';

  // Routing
  let mainView: ViewType;
  setContext(
    'accountView',
    writable<ViewType>({
      component: AccountList,
      props: { categoryName, categorySlug, categoryColor },
    }),
  );
  const unsubscriber = getContext<Writable<ViewType>>('accountView').subscribe(
    (v) => (mainView = v),
  );

  $: mainView = {
    component: AccountList,
    props: { categoryName, categorySlug, categoryColor },
  };

  onDestroy(() => {
    unsubscriber();
  });
</script>

<svelte:component this="{mainView.component}" {...mainView.props} />
