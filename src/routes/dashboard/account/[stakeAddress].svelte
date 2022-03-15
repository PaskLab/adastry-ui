<script lang="ts">
  import config from '$lib/config.json';
  import { page } from '$app/stores';
  import { getAccount } from '$lib/api/wallets.ts';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import RightArrow from '$lib/components/icons/right-arrow.svelte';
  import GiftIcon from '$lib/components/icons/gift.svelte';
  import TrophyIcon from '$lib/components/icons/trophy.svelte';
  import BankIcon from '$lib/components/icons/bank.svelte';
  import HourglassIcon from '$lib/components/icons/hourglass.svelte';
  import { toAda } from '$lib/utils/helper.utils';
  import { tweened } from 'svelte/motion';
  import { expoOut } from 'svelte/easing';
  import { getContext, onDestroy, onMount, setContext, SvelteComponent } from 'svelte';
  import InfoBox from './_cpnt/_info-box.svelte';
  import type { AccountType } from '$lib/api/types/account.type';
  import { Writable, writable } from 'svelte/store';
  import HistoryList from './_cpnt/_history/_list.svelte';
  import TxList from './_cpnt/_transactions/_list.svelte';
  import MainViewNav from './_cpnt/_main-view-nav.svelte';

  let pAccount: Promise<AccountType> = Promise.reject();
  let account: AccountType;

  const colors = config.theme.colors;
  const lifetimeRewards = tweened(0.0, {
    duration: 1600,
    easing: expoOut
  });
  const loyalty = tweened(0, {
    duration: 1600,
    easing: expoOut
  });
  const syncEpoch = tweened(0, {
    duration: 1600,
    easing: expoOut
  });

  // Main View Routing
  let mainView: typeof SvelteComponent;
  setContext('mainView', writable<typeof SvelteComponent>(HistoryList));
  let unsubsriber = getContext<Writable<typeof SvelteComponent>>('mainView').subscribe(
    (v) => (mainView = v)
  );
  const mainViewOptions = [
    { id: 'history', component: HistoryList, text: 'History' },
    { id: 'transactions', component: TxList, text: 'Transaction' }
  ];

  onMount(() => {
    pAccount = getAccount($page.params.stakeAddress);
    pAccount.then((res) => {
      account = res;
      lifetimeRewards.set(toAda(res.rewardsSum));
      loyalty.set(res.loyalty);
      syncEpoch.set(res.epoch ? res.epoch : 0);
    });
  });

  onDestroy(() => {
    unsubsriber();
  });
</script>

<svelte:head>
  <title>Account - Adastry</title>
</svelte:head>

<div class="content flex-row-fluid">
  <div class="card mb-6 mb-xl-9">
    {#await pAccount}
      <Skeleton height="270px" />
    {:then account}
      <div class="card-body pt-9 pb-0">
        <div class="d-flex flex-wrap flex-sm-nowrap mb-6">
          <div
            class="d-flex flex-center flex-shrink-0 bg-light rounded w-100px h-100px w-lg-150px h-lg-150px me-7 mb-4"
          >
            <span id="wallet-icon">
              <WalletIcon
                --color="{$page.url.searchParams.has('color')
                  ? colors[$page.url.searchParams.get('color')]
                  : '#009ef7'}"
              />
            </span>
          </div>

          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center mb-1">
                  <h2 class="text-gray-800 fs-2 fw-bolder me-3">
                    {account.name}
                  </h2>
                  {#if account.loyalty > 0}
                    <div class="badge badge-info mb-2">Armada Supporter</div>
                  {/if}
                </div>

                <div class="d-flex flex-wrap fw-bold mb-4 fs-5 text-gray-400">
                  {#await pAccount then account}
                    <span style="overflow-wrap: anywhere;">{account.stakeAddress}</span>
                  {/await}
                </div>
              </div>
              <div class="card-toolbar">
                <a
                  href="/dashboard"
                  type="button"
                  class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
                >
                  Back to dashboard
                  <span class="svg-icon svg-icon-2">
                    <RightArrow />
                  </span>
                </a>
              </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start">
              <div class="d-flex flex-wrap">
                <InfoBox label="Lifetime Rewards" info="{$lifetimeRewards.toFixed(6)} ₳">
                  <GiftIcon --color="#8bc34a" />
                </InfoBox>

                <InfoBox label="Current delegation" info="{account.pool.name}">
                  <BankIcon --color="#616161" />
                </InfoBox>

                <InfoBox label="Last Sync" info="Epoch {$syncEpoch.toFixed(0)}">
                  <HourglassIcon --color="#8d6e63" />
                </InfoBox>

                <InfoBox
                  label="Armada Loyalty"
                  info="{$loyalty.toFixed(0)} Epoch{account.loyalty > 0 ? 's' : ''}"
                >
                  <TrophyIcon --color="#ffb300" />
                </InfoBox>
              </div>
            </div>
          </div>
        </div>

        <div class="separator"></div>

        <MainViewNav options="{mainViewOptions}" />
      </div>
    {:catch error}
      <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
    {/await}
  </div>

  <svelte:component this="{mainView}" />
</div>

<style lang="scss">
  #wallet-icon {
    :global(svg) {
      height: 100px;
      width: 100px;
    }
  }
</style>
