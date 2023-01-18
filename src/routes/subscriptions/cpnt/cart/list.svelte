<script lang="ts">
  import config from '$lib/config.json';
  import PlusIcon from '$lib/components/icons/plus.svelte';
  import { getContext } from 'svelte';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import BankIcon from '$lib/components/icons/bank.svelte';
  import AddMenu from './add-menu.svelte';
  import PayView from './pay.svelte';
  import TrashIcon from '$lib/components/icons/trash.svelte';
  import type { ViewType } from '$lib/types/view.type';
  import type { Writable } from 'svelte/store';
  import type { AccountListType } from '$lib/api/types/account-list.type';
  import type { PoolType } from '$lib/api/types/pool.type';
  import { toAda } from '$lib/utils/helper.utils.js';

  const colors = config.theme.colors;

  // Routing
  let mainView = getContext<Writable<ViewType>>('mainView');

  // Products
  const selectedAccounts = getContext<Writable<AccountListType>>('selectedAccounts');
  const selectedPools = getContext<Writable<PoolType[]>>('selectedPools');

  function removeAccount(stakeAddress: string): void {
    const sA = [...$selectedAccounts];
    const i = sA.findIndex((a) => a.stakeAddress === stakeAddress);
    if (i >= 0) {
      sA.splice(i, 1);
      selectedAccounts.set(sA);
    }
  }

  function removePool(poolId: string): void {
    const sP = [...$selectedPools];
    const i = sP.findIndex((p) => p.poolId === poolId);
    if (i >= 0) {
      sP.splice(i, 1);
      selectedPools.set(sP);
    }
  }
</script>

<div class="card mb-xl-8 mb-10">
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Cart</span>
      <span class="text-muted fw-bold fs-7"
        >{$selectedAccounts.length} item{$selectedAccounts.length > 1 ? 's' : ''}</span
      >
    </h3>

    <div class="card-toolbar">
      <button
        on:click="{() => mainView.set({ component: AddMenu, props: {} })}"
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2">
          <PlusIcon />
        </span>
        Add Product
      </button>
    </div>
  </div>

  <div class="card-body py-3">
    {#if $selectedAccounts.length < 1 && $selectedPools.length < 1}
      <div class="p-20 text-center fs-5 text-muted fw-bold">
        <p>Cart empty</p>
        <p>
          <button
            on:click="{() => mainView.set({ component: AddMenu, props: {} })}"
            type="button"
            class="btn btn-sm btn-primary"
          >
            <span class="svg-icon svg-icon-2">
              <PlusIcon />
            </span>
            Add Product
          </button>
        </p>
      </div>
    {:else}
      {#if $selectedAccounts.length > 0}
        <div class="d-flex flex-column card card-dashed p-5">
          <h2>
            Selected Accounts (<span class="text-primary"
              >₳{toAda(config.billing.accountUnitPrice)}</span
            > each)
          </h2>
          {#each $selectedAccounts as account, i (account.stakeAddress)}
            <div
              class="d-flex flex-row py-2 justify-content-between bg-hover-lighten cursor-default rounded p-2"
            >
              <div class="d-flex flex-row py-2">
                <div class="d-flex align-items-center me-4">
                  <span class="symbol-label">
                    <WalletIcon --color="{colors[i % colors.length]}" />
                  </span>
                </div>
                <div class="d-flex flex-column">
                  <span class="fw-bolder fs-6">{account.name}</span>
                  <span class="fw-bold fs-7 text-muted text-truncate mw-150px mw-sm-450px">
                    {account.stakeAddress}</span
                  >
                </div>
              </div>
              <div class="d-flex align-items-center">
                <button
                  on:click="{() => removeAccount(account.stakeAddress)}"
                  type="button"
                  tabindex="0"
                  class="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                >
                  <span class="svg-icon svg-icon-2">
                    <TrashIcon />
                  </span>
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      {#if $selectedPools.length > 0}
        <div class="d-flex flex-column card card-dashed p-5 mt-4">
          <h2>
            Selected Pools (<span class="text-primary">₳{toAda(config.billing.poolUnitPrice)}</span>
            each)
          </h2>
          {#each $selectedPools as pool, i (pool.poolId)}
            <div
              class="d-flex flex-row py-2 justify-content-between bg-hover-lighten cursor-default rounded p-2"
            >
              <div class="d-flex flex-row py-2">
                <div class="d-flex align-items-center me-4">
                  <span class="symbol-label">
                    <BankIcon --color="{colors[i % colors.length]}" />
                  </span>
                </div>
                <div class="d-flex flex-column">
                  <span class="fw-bolder fs-6">{pool.name}</span>
                  <span class="fw-bold fs-7 text-muted text-truncate mw-150px mw-sm-450px">
                    {pool.poolId}</span
                  >
                </div>
              </div>
              <div class="d-flex align-items-center">
                <button
                  on:click="{() => removePool(pool.poolId)}"
                  type="button"
                  tabindex="0"
                  class="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                >
                  <span class="svg-icon svg-icon-2">
                    <TrashIcon />
                  </span>
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      <div class="d-flex flex-row justify-content-between card card-dashed mt-6 p-5 border-primary">
        <h2 class="d-flex align-items-center mb-0">
          Total : <span class="fs-xl-1 mx-2 text-primary"
            >₳{toAda(
              config.billing.accountUnitPrice * $selectedAccounts.length +
                config.billing.poolUnitPrice * $selectedPools.length,
            )}</span
          >
        </h2>
        <button
          on:click="{() => mainView.set({ component: PayView, props: {} })}"
          type="button"
          class="btn btn-primary">Pay</button
        >
      </div>
    {/if}
  </div>
</div>
