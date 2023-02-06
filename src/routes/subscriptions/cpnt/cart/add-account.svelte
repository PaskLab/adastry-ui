<script lang="ts">
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import { getContext } from 'svelte';
  import AddMenu from './add-menu.svelte';
  import CartList from './list.svelte';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';
  import type { Readable, Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { AccountListType } from '$lib/api/types/account-list.type';
  import type { AccountStateType } from '$lib/api/types/account-state.type';

  // Routing
  let mainView = getContext<Writable<ViewType>>('mainView');

  // Context
  const selectedAccounts = getContext<Writable<AccountListType>>('selectedAccounts');
  const pAccounts = getContext<Readable<Promise<AccountStateType[]>>>('accountsState');

  // Process data
  const pInactiveAccounts = filterInactiveAccounts();

  // Form
  let wait = false;

  interface InactiveAccountType extends AccountStateType {
    selected: boolean;
  }

  async function filterInactiveAccounts(): Promise<InactiveAccountType[]> {
    try {
      const accounts = await $pAccounts;

      return accounts
        .filter(
          (a) =>
            !(a.active || a.pending) &&
            !$selectedAccounts.some((sA) => sA.stakeAddress === a.stakeAddress),
        )
        .map((a) => ({ ...a, selected: false }));
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  async function select(): Promise<void> {
    wait = true;
    const inactiveAccounts = await pInactiveAccounts;
    const selection = inactiveAccounts.filter((a) => a.selected);
    selectedAccounts.set([...$selectedAccounts, ...selection]);
    mainView.set({ component: CartList, props: {} });
  }
</script>

<div class="card card-bordered mb-xl-8 mb-10">
  <div class="card-header">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Add Accounts to cart</span>
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{() => mainView.set({ component: AddMenu, props: {} })}"
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
          <BackArrow />
        </span>
        Back
      </button>
    </div>
  </div>

  <div class="card-body py-10  d-flex flex-column">
    {#await pInactiveAccounts}
      {#each [1, 2, 3, 4] as _}
        <div class="d-flex flex-row py-2">
          <div
            class="d-flex justify-content-center me-5 form-check form-check-custom form-check-solid form-check-inline"
          >
            <Skeleton height="23px" width="23px" />
          </div>
          <div class="d-flex flex-column">
            <span class="py-1"><Skeleton height="18px" width="130px" /></span>
            <span><Skeleton height="14px" width="430px" /></span>
          </div>
        </div>
      {/each}
    {:then accounts}
      {#if accounts.length < 1}
        <div class="p-20 text-center fs-5 text-muted fw-bold">No inactive account to select</div>
      {:else}
        {#each accounts as account}
          <div class="d-flex flex-row py-2">
            <div
              class="d-flex justify-content-center me-4 form-check form-check-custom form-check-solid form-check-inline"
            >
              <input class="form-check-input" type="checkbox" bind:checked="{account.selected}" />
            </div>
            <div
              on:click="{() => (account.selected = !account.selected)}"
              class="d-flex flex-column bg-hover-light p-2 rounded"
            >
              <span class="fw-bolder fs-6">{account.name}</span>
              <span class="fw-bold fs-7 text-muted text-truncate mw-250px mw-sm-450px">
                {account.stakeAddress}</span
              >
            </div>
          </div>
        {/each}
        <div class="text-center">
          <ActionBtn wait="{wait}" action="{select}" type="button" text="Select" />
        </div>
      {/if}
    {:catch error}
      <div class="text-center text-danger">
        {error.message}
      </div>
    {/await}
  </div>
</div>
