<script lang="ts">
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import RightArrowIcon from '$lib/components/icons/right-arrow.svelte';
  import PlusIcon from '$lib/components/icons/plus.svelte';
  import CrossArrowIcon from '$lib/components/icons/cross-arrow.svelte';
  import ExportIcon from '$lib/components/icons/cloud-down.svelte';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import { deleteUserAccount, getUserAccounts } from '$lib/api/wallets';
  import { getContext } from 'svelte';
  import AddAccount from './add.svelte';
  import AddCategoryAccounts from '../category/add-account.svelte';
  import UpdateAccount from './update.svelte';
  import ExportMenu from './export-menu.svelte';
  import config from '$lib/config.json';
  import { getURL } from '$lib/utils/api.utils';
  import PencilIcon from '$lib/components/icons/pencil.svelte';
  import TrashIcon from '$lib/components/icons/trash.svelte';
  import Modal from '$lib/components/global/modal.svelte';
  import SyncBadge from '$lib/components/global/pending-badge.svelte';
  import { getCategoryAccountsList } from '$lib/api/category';
  import type { ViewType } from '$lib/types/view.type';
  import type { Writable } from 'svelte/store';
  import type { AccountListType } from '$lib/api/types/account-list.type';

  export let categoryName = '';
  export let categorySlug = '';
  export let categoryColor = '';

  let pAccounts: Promise<AccountListType>;
  $: pAccounts =
    categorySlug && categorySlug.length ? getCategoryAccountsList(categorySlug) : getUserAccounts();

  const colors = config.theme.colors;

  // Events
  const addAccountEvent = getContext<Writable<Date>>('add-account');
  const refreshCategory = getContext<Writable<Date>>('refresh-category');

  // Routing
  let mainView = getContext<Writable<ViewType>>('accountView');

  // Modals
  let errorModal: typeof Modal;
  let deleteModal: typeof Modal;
  let deleteAccountName = '';
  let deleteStakeAddress = '';

  // Delete account
  function handleDelete(accountName: string, stakeAddress: string): void {
    deleteAccountName = accountName;
    deleteStakeAddress = stakeAddress;
    deleteModal.open();
  }

  function handleAddAccount() {
    if (categorySlug && categorySlug.length) {
      mainView.set({
        component: AddCategoryAccounts,
        props: { categoryName, categorySlug, categoryColor },
      });
    } else {
      mainView.set({ component: AddAccount, props: {} });
    }
  }

  function deleteAction(): void {
    deleteModal.startWait();
    deleteUserAccount(deleteStakeAddress)
      .then(() => {
        pAccounts = getUserAccounts();
        refreshCategory.set(new Date());
      })
      .catch(() => {
        errorModal.open();
      })
      .finally(() => deleteModal.close());
  }
</script>

<div
  class="card"
  style="{categoryColor && categoryColor.length ? 'border: solid 3px ' + categoryColor : ''}"
>
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span
        class="card-label fw-bolder fs-3 mb-1"
        style="{categoryColor && categoryColor.length ? 'color: ' + categoryColor : ''}"
        >{categoryName && categoryName.length ? categoryName : 'My wallet accounts'}</span
      >
      {#await pAccounts then accounts}
        <span class="text-muted fw-bold fs-7"
          >{accounts.length} account{accounts.length > 1 ? 's' : ''}</span
        >
      {/await}
    </h3>
    <div class="card-toolbar">
      {#await pAccounts then accounts}
        {#if accounts.length > 1}
          <button
            on:click="{() =>
              mainView.set({
                component: ExportMenu,
                props: { categoryName, categorySlug, categoryColor },
              })}"
            type="button"
            class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
          >
            <span class="svg-icon svg-icon-2">
              <ExportIcon />
            </span>
            Bulk Export
          </button>
        {/if}
      {/await}
      <button
        on:click="{handleAddAccount}"
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2">
          {#if categorySlug && categorySlug.length}
            <CrossArrowIcon />
          {:else}
            <PlusIcon />
          {/if}
        </span>
        {categorySlug && categorySlug.length ? 'Manage' : 'Add account'}
      </button>
    </div>
  </div>

  <div class="card-body py-3">
    {#await pAccounts}
      <div class="table-responsive">
        <table class="table align-middle gs-0 gy-5">
          <thead>
            <tr>
              <th class="p-0 w-50px"></th>
              <th class="p-0 min-w-200px"></th>
              <th class="p-0 min-w-40px"></th>
            </tr>
          </thead>
          <tbody>
            {#each [1, 2, 3, 4] as _}
              <tr>
                <td>
                  <div class="symbol symbol-50px me-2">
                    <span class="symbol-label">
                      <Skeleton height="54px" />
                    </span>
                  </div>
                </td>
                <td>
                  <Skeleton width="50%" height="20px" />
                  <span class="text-muted fw-bold d-block fs-7">
                    <Skeleton height="18px" width="80%" />
                  </span>
                </td>

                <td class="text-end">
                  <span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                    <Skeleton height="34px" />
                  </span>
                  <span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                    <Skeleton height="34px" />
                  </span>
                  <span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                    <Skeleton height="34px" />
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:then accounts}
      {#if accounts.length}
        <div class="table-responsive">
          <table class="table align-middle gs-0 gy-5">
            <thead>
              <tr>
                <th class="p-0 w-50px"></th>
                <th class="p-0 min-w-200px"></th>
                <th class="p-0 min-w-40px"></th>
              </tr>
            </thead>
            <tbody>
              {#each accounts as account, i}
                <tr>
                  <td>
                    <a
                      href="{getURL(config.routing.accountDetail, {
                        stakeAddress: account.stakeAddress,
                        color: i % colors.length,
                      })}"
                      tabindex="-1"
                      class="btn btn-link p-0 symbol symbol-50px me-2"
                    >
                      <span class="symbol-label">
                        <WalletIcon --color="{colors[i % colors.length]}" />
                      </span>
                    </a>
                  </td>
                  <td>
                    <a
                      href="{getURL(config.routing.accountDetail, {
                        stakeAddress: account.stakeAddress,
                        color: i % colors.length,
                      })}"
                      tabindex="-1"
                      class="btn btn-link p-0 text-dark fw-bolder text-hover-primary mb-1 fs-6"
                      >{account.name}</a
                    >
                    {#if account.syncing}
                      <SyncBadge
                        text="Syncing"
                        customClass="badge badge-light-warning w-80px pe-8 m-2 syncing-badge"
                      />
                    {/if}
                    <span class="d-none d-sm-block text-muted fw-bold d-block fs-7"
                      >{account.stakeAddress}</span
                    >
                  </td>
                  <td class="text-end">
                    <button
                      on:click="{() =>
                        mainView.set({
                          component: UpdateAccount,
                          props: { stakeAddress: account.stakeAddress, currentName: account.name },
                        })}"
                      type="button"
                      tabindex="0"
                      class="btn btn-sm btn-icon btn-bg-light btn-active-color-warning"
                    >
                      <span class="svg-icon svg-icon-2">
                        <PencilIcon />
                      </span>
                    </button>
                    <button
                      on:click="{() => handleDelete(account.name, account.stakeAddress)}"
                      type="button"
                      tabindex="0"
                      class="btn btn-sm btn-icon btn-bg-light btn-active-color-danger"
                    >
                      <span class="svg-icon svg-icon-2">
                        <TrashIcon />
                      </span>
                    </button>
                    <a
                      href="{getURL(config.routing.accountDetail, {
                        stakeAddress: account.stakeAddress,
                        color: i % colors.length,
                      })}"
                      tabindex="0"
                      class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                    >
                      <span class="svg-icon svg-icon-2">
                        <RightArrowIcon />
                      </span>
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="p-20 text-center fs-5 text-muted fw-bold">
          <p>No account</p>
          <p>
            <button on:click="{handleAddAccount}" type="button" class="btn btn-sm btn-primary">
              <span class="svg-icon svg-icon-2">
                {#if categorySlug && categorySlug.length}
                  <CrossArrowIcon />
                {:else}
                  <PlusIcon />
                {/if}
              </span>
              {categorySlug ? 'Manage' : 'Add account'}
            </button>
          </p>
        </div>
      {/if}
    {:catch error}
      <div class="p-20 m-10 text-center">
        <span style="color: red">{error.message}</span>
      </div>
    {/await}
  </div>
</div>

<Modal
  bind:this="{deleteModal}"
  action="{deleteAction}"
  actionBtnText="Delete"
  outClick="{true}"
  actionBtnClass="btn btn-danger"
  callback="{() => addAccountEvent.set(new Date())}"
>
  <svelte:fragment slot="title">
    <span class="text-danger">Delete Confirmation</span>
  </svelte:fragment>
  <div class="text-center" slot="body">
    <p>You are about to delete the following account:</p>
    <p class="text-danger fw-bolder">
      {deleteAccountName}
    </p>
  </div>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">
    <span class="text-danger">Server Error</span>
  </svelte:fragment>
  <p slot="body" class="text-center">
    Oops, something unexpected happened. Please try again later or contact support.
  </p>
</Modal>
