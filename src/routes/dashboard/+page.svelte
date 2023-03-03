<script lang="ts">
  import config from '$lib/config.json';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import BankIcon from '$lib/components/icons/bank.svelte';
  import BranchIcon from '$lib/components/icons/branch.svelte';
  import MainViewNav from './main-view-nav.svelte';
  import { getContext, onDestroy, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Accounts from './accounts/accounts.svelte';
  import Pools from './pools/list.svelte';
  import Stats from './stats/stats.svelte';
  import Categories from './category/category.svelte';
  import type { Writable } from 'svelte/store';
  import type { NavOptionType } from '$lib/types/nav-option.type';
  import type { ViewType } from '$lib/types/view.type';

  // Events
  setContext('add-account', writable<Date>(new Date()));
  setContext('refresh-category', writable<Date>(new Date()));

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

<div class="content">
  <div class="row">
    <div class="column col-xl-8 mb-7 mb-xl-0">
      <div class="row">
        <div class="column mb-7">
          <MainViewNav options="{mainViewOptions}" />
        </div>
        <div class="column">
          <svelte:component this="{mainView.component}" {...mainView.props} />
        </div>
      </div>
    </div>
    <div class="column col-xl-4">
      <div class="row">
        <div class="flex-column-fluid mb-7 mb-md-0 col-12 col-md-6 col-xl-12 mb-xl-7">
          <Categories />
        </div>
        <div class="flex-column-fluid col-12 col-md-6 col-xl-12">
          <Stats />
        </div>
      </div>
    </div>
  </div>
</div>
