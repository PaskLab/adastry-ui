<script lang="ts">
  import config from '$lib/config.json';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import BankIcon from '$lib/components/icons/bank.svelte';
  import BranchIcon from '$lib/components/icons/branch.svelte';
  import MainViewNav from './cpnt/main-view-nav.svelte';
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Accounts from './cpnt/accounts/accounts.svelte';
  import Pools from './cpnt/pools/list.svelte';
  import Stats from './cpnt/stats/stats.svelte';
  import type { Writable } from 'svelte/store';
  import type { NavOptionType } from '$lib/types/nav-option.type';
  import type { ViewType } from '$lib/types/view.type';

  // Events
  setContext('add-account', writable<Date>(new Date()));

  // Main View Routing
  const mainViewOptions: NavOptionType[] = [
    {
      id: 'account',
      type: 'view',
      view: { component: Accounts, props: {} },
      icon: WalletIcon,
      text: 'Wallet <br/> Accounts',
    },
    {
      id: 'pools',
      type: 'view',
      view: { component: Pools, props: {} },
      icon: BankIcon,
      text: 'Stake <br/> Pools',
    },
    {
      id: 'mapping',
      type: 'link',
      href: config.routing.mapping,
      icon: BranchIcon,
      text: 'Asset <br/> Mapping',
    },
  ];

  let mainView: ViewType;
  setContext('mainView', writable<ViewType>(mainViewOptions[0].view));
  const unsubscriber = getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));

  onDestroy(() => {
    unsubscriber();
  });
</script>

<svelte:head>
  <title>Dashboard - Adastry</title>
</svelte:head>

<div class="content flex-row-fluid">
  <div class="row gy-0 gx-10">
    <div class="col-xl-8 pb-10 pb-xl-0">
      <MainViewNav options="{mainViewOptions}" />
      <svelte:component this="{mainView.component}" />
    </div>
    <div class="col-xl-4">
      <Stats />
    </div>
  </div>
</div>
