<script lang="ts">
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import { getContext } from 'svelte';
  import AccountList from '../accounts/list.svelte';
  import { getUserAccounts } from '$lib/api/wallets';
  import Modal from '$lib/components/global/modal.svelte';
  import SubmitBtn from '$lib/components/global/action-button.svelte';
  import { getCategoryAccountsList, updateCategoryAccounts } from '$lib/api/category';
  import type { ViewType } from '$lib/types/view.type';
  import type { Writable } from 'svelte/store';
  import type { AccountItemType } from '$lib/api/types/account-list.type';

  export let categoryName = '';
  export let categorySlug = '';
  export let categoryColor = '';

  // Fetch data
  let pAccounts = getUserAccounts();
  let pCategoryAccounts = getCategoryAccountsList(categorySlug);
  let selectedAccounts = filterSelected();

  // Routing
  let mainView = getContext<Writable<ViewType>>('accountView');

  // Context
  const refreshCategory = getContext<Writable<Date>>('refresh-category');

  // Logic
  function handleBack() {
    mainView.set({ component: AccountList, props: { categoryName, categorySlug, categoryColor } });
  }

  interface SelectedAccountType extends AccountItemType {
    selected: boolean;
  }

  async function filterSelected(): Promise<SelectedAccountType[]> {
    const accounts = await pAccounts;
    const categoryAccounts = await pCategoryAccounts;

    return accounts.map<SelectedAccountType>((a) => {
      return { ...a, selected: categoryAccounts.some((cA) => cA.stakeAddress === a.stakeAddress) };
    });
  }

  // Form
  let wait = false;
  let successModal: typeof Modal;
  let errorModal: typeof Modal;
  let errorModalBody: { statusCode: number; message: string; error: string };

  function submit(selected: SelectedAccountType[]): void {
    wait = true;
    updateCategoryAccounts(
      categorySlug,
      selected.filter((a) => a.selected).map((a) => a.stakeAddress),
    )
      .then((res) => {
        if (res.statusCode && res.error) {
          errorModalBody = {
            statusCode: res.statusCode,
            message: res.message,
            error: res.error,
          };
          errorModal.open();
          wait = false;
        } else {
          refreshCategory.set(new Date());
          successModal.open();
        }
      })
      .catch(() => {
        wait = false;
        errorModal.open();
      });
  }
</script>

<div class="card" style="border: solid 3px {categoryColor};">
  <div class="card-header">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1" style="color: {categoryColor};"
        >Select {categoryName} accounts</span
      >
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{handleBack}"
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

  <div class="card-body py-3">
    <div class="offset-sm-1 col-sm-10 offset-md-2 col-md-8">
      <form class="form" novalidate="novalidate">
        <div class="mb-10">
          {#await selectedAccounts}
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
              <div class="p-20 text-center fs-5 text-muted fw-bold">
                No inactive account to select
              </div>
            {:else}
              {#each accounts as account}
                <div class="d-flex flex-row py-2">
                  <div
                    class="d-flex justify-content-center me-4 form-check form-check-custom form-check-solid form-check-inline"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      bind:checked="{account.selected}"
                    />
                  </div>
                  <div
                    on:click="{() => (account.selected = !account.selected)}"
                    class="d-flex flex-column bg-hover-light p-2 rounded"
                  >
                    <span class="fw-bolder fs-6">{account.name}</span>
                    <span class="fw-bold fs-7 text-muted text-break"> {account.stakeAddress}</span>
                  </div>
                </div>
              {/each}
              <div class="text-center mt-5">
                <SubmitBtn
                  type="submit"
                  text="Add account"
                  action="{() => submit(accounts)}"
                  wait="{wait}"
                />
              </div>
            {/if}
          {:catch error}
            <div class="text-center text-danger">
              {error.message}
            </div>
          {/await}
        </div>
      </form>
    </div>
  </div>
</div>

<Modal
  bind:this="{successModal}"
  hideClose="{true}"
  outClick="{true}"
  actionBtnText="Continue"
  callback="{handleBack}"
>
  <svelte:fragment slot="title">Category successfully updated!</svelte:fragment>
  <svelte:fragment slot="body">
    <p class="text-center">Category accounts successfully updated!</p>
  </svelte:fragment>
</Modal>

<Modal bind:this="{errorModal}" hideAction="{true}">
  <svelte:fragment slot="title">Failed to update category</svelte:fragment>
  <div slot="body" class="text-center modal-error-message">
    {#if errorModalBody}
      {#if typeof errorModalBody.message !== 'string' && errorModalBody.message.length}
        {#each errorModalBody.message as message}
          <p>{message}</p>
        {/each}
      {:else}
        {errorModalBody.message}
      {/if}
      <p class="mt-5 text-muted mb-0">
        <em>Code: {errorModalBody.statusCode} - {errorModalBody.error}</em>
      </p>
    {:else}
      Failed to update category accounts.
      <br />
      Please try again or contact support.
    {/if}
  </div>
</Modal>
