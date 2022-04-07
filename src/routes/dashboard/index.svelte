<script lang="ts">
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import MainViewNav from './_cpnt/_main-view-nav.svelte';
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import Accounts from './_cpnt/_accounts/_accounts.svelte';
  import Pools from './_cpnt/_pools.svelte';
  import type { SvelteComponent } from 'svelte';
  import type { Writable } from 'svelte/store';
  import Stats from './_cpnt/_stats/_stats.svelte';

  // Main View Routing
  let mainView: typeof SvelteComponent;
  setContext('mainView', writable<typeof SvelteComponent>(Accounts));
  getContext<Writable<typeof SvelteComponent>>('mainView').subscribe((v) => (mainView = v));
  const mainViewOptions = [
    { id: 'account', component: Accounts, icon: WalletIcon, text: 'Wallet <br/> Accounts' },
    { id: 'pools', component: Pools, icon: WalletIcon, text: 'Stake <br/> Pools' }
  ];
</script>

<svelte:head>
  <title>Dashboard - Adastry</title>
</svelte:head>

<div class="content flex-row-fluid">
  <div class="row gy-0 gx-10">
    <div class="col-xl-8 pb-10 pb-xl-0">
      <MainViewNav options="{mainViewOptions}" />
      <svelte:component this="{mainView}" />
    </div>
    <div class="col-xl-4">
      <Stats />
    </div>
  </div>
</div>
