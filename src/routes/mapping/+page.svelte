<script lang="ts">
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import MainViewNav from '$lib/components/global/nav-bar.svelte';
  import UserMapping from './user/mapping.svelte';
  import GlobalMapping from './global/mapping.svelte';
  import RequestMapping from './request/request.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { NavOptionType } from '$lib/types/nav-option.type';

  // Pagination Context
  setContext('userMappingPage', writable<number>(1));
  setContext('globalMappingPage', writable<number>(1));

  // Main View Routing
  let mainView: ViewType;

  const mainViewOptions: NavOptionType[] = [
    { id: 'user', type: 'view', view: { component: UserMapping, props: {} }, text: 'Mapping' },
    {
      id: 'global',
      type: 'view',
      view: { component: GlobalMapping, props: {} },
      text: 'Global Mapping',
    },
    {
      id: 'request',
      type: 'view',
      view: { component: RequestMapping, props: {} },
      text: 'Mapping Request',
    },
  ];

  setContext('mainView', writable<ViewType>(mainViewOptions[0].view));
  let unsubscriber = getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));

  onDestroy(() => {
    unsubscriber();
  });
</script>

<svelte:head>
  <title>Mapping - Adastry</title>
</svelte:head>

<div class="content flex-row-fluid">
  <div class="card mb-5 mb-xl-10">
    <div class="card-header border-0">
      <MainViewNav contextKey="mainView" options="{mainViewOptions}" />
    </div>
  </div>

  <svelte:component this="{mainView.component}" {...mainView.props} />
</div>
