<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import AccountList from './_list.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Routing
  let mainView: ViewType;
  setContext('mainView', writable<ViewType>({ component: AccountList, props: {} }));
  getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));
</script>

<svelte:component this="{mainView.component}" {...mainView.props} />
