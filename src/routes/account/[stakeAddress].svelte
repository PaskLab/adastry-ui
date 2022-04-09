<script lang="ts">
  import config from '$lib/config.json';
  import { page } from '$app/stores';
  import { getAccount } from '$lib/api/wallets.ts';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import GiftIcon from '$lib/components/icons/gift.svelte';
  import TrophyIcon from '$lib/components/icons/trophy.svelte';
  import BankIcon from '$lib/components/icons/bank.svelte';
  import HourglassIcon from '$lib/components/icons/hourglass.svelte';
  import { toAda } from '$lib/utils/helper.utils';
  import { getURL } from '$lib/utils/api.utils';
  import { tweened } from 'svelte/motion';
  import { expoOut } from 'svelte/easing';
  import { getContext, onDestroy, onMount, setContext } from 'svelte';
  import InfoBox from './_cpnt/_info-box.svelte';
  import { Writable, writable } from 'svelte/store';
  import HistoryList from './_cpnt/_history/_list.svelte';
  import TxList from './_cpnt/_transactions/_list.svelte';
  import ExportView from './_cpnt/_export/_export.svelte';
  import MainViewNav from './_cpnt/_main-view-nav.svelte';
  import type { AccountType } from '$lib/api/types/account.type';
  import type { ViewType } from '$lib/types/view.type';

  setContext('historyPage', writable<number>(1));
  setContext('transactionPage', writable<number>(1));
  setContext('isOwner', writable<boolean>(false));

  let pAccount: Promise<AccountType> = Promise.reject();
  let account: AccountType;
  let owner = getContext<Writable<boolean>>('isOwner');

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
  let mainView: ViewType;

  const mainViewOptions: { id: string; view: ViewType; text: string }[] = [
    { id: 'history', view: { component: HistoryList, props: {} }, text: 'History' },
    { id: 'transactions', view: { component: TxList, props: {} }, text: 'Transaction' },
    { id: 'export', view: { component: ExportView, props: {} }, text: 'Export Data' }
  ];

  setContext('mainView', writable<ViewType>(mainViewOptions[0].view));
  let unsubsriber = getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));

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
                  {#if $owner}
                    <div class="badge badge-light-primary mx-1 mb-2">Pool Owner</div>
                  {/if}
                  {#if account.loyalty > 0}
                    <div class="badge badge-light-info mx-1 mb-2">Armada Supporter</div>
                  {/if}
                </div>

                <div class="d-flex flex-wrap fw-bold mb-4 fs-5 text-gray-400">
                  <span style="overflow-wrap: anywhere;">{account.stakeAddress}</span>
                </div>
              </div>
              <div class="card-toolbar">
                <a
                  href="{getURL(config.routing.dashboard)}"
                  class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
                >
                  <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
                    <BackArrow />
                  </span>
                  Back to dashboard
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

  <svelte:component this="{mainView.component}" {...mainView.props} />
</div>

<style lang="scss">
  #wallet-icon {
    :global(svg) {
      height: 100px;
      width: 100px;
    }
  }
</style>
