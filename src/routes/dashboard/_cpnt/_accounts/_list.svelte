<script lang="ts">
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import RightArrowIcon from '$lib/components/icons/right-arrow.svelte';
  import PlusIcon from '$lib/components/icons/plus.svelte';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import { getUserAccounts } from '$lib/api/wallets';
  import { getContext } from 'svelte';
  import type { SvelteComponent } from 'svelte';
  import type { Writable } from 'svelte/store';
  import AddAccount from './_add.svelte';
  import config from '$lib/config.json';
  import { getURL } from '$lib/utils/api.utils';

  const pAccounts = getUserAccounts();

  const colors = config.theme.colors;

  // Routing
  let mainView = getContext<Writable<typeof SvelteComponent>>('mainView');

  function handleAdd() {
    mainView.set(AddAccount);
  }
</script>

<div class="card card-xl-stretch mb-xl-8">
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">My wallet accounts</span>
      {#await pAccounts then accounts}
        <span class="text-muted fw-bold fs-7"
          >{accounts.length} account{accounts.length > 1 ? 's' : ''}</span
        >
      {/await}
    </h3>
    <div class="card-toolbar">
      <!--begin::Menu-->
      <button
        on:click="{handleAdd}"
        type="button"
        class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
      >
        <span class="svg-icon svg-icon-2">
          <PlusIcon />
        </span>
        Add account
      </button>
    </div>
  </div>

  <div class="card-body py-3">
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
          {#await pAccounts}
            <tr>
              <th>
                <div class="symbol symbol-50px me-2">
                  <span class="symbol-label">
                    <Skeleton height="54px" />
                  </span>
                </div>
              </th>
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
              </td>
            </tr>
          {:then accounts}
            {#each accounts as account, i}
              <tr>
                <th>
                  <a
                    href="{getURL(config.routing.accountDetail, {
                      stakeAddress: account.stakeAddress,
                      color: i % colors.length
                    })}"
                    tabindex="-1"
                    class="btn btn-link p-0 symbol symbol-50px me-2"
                  >
                    <span class="symbol-label">
                      <WalletIcon --color="{colors[i % colors.length]}" />
                    </span>
                  </a>
                </th>
                <td>
                  <a
                    href="{getURL(config.routing.accountDetail, {
                      stakeAddress: account.stakeAddress,
                      color: i % colors.length
                    })}"
                    tabindex="-1"
                    class="btn btn-link p-0 text-dark fw-bolder text-hover-primary mb-1 fs-6"
                    >{account.name}</a
                  >
                  <span class="d-none d-sm-block text-muted fw-bold d-block fs-7"
                    >{account.stakeAddress}</span
                  >
                </td>
                <td class="text-end">
                  <a
                    href="{getURL(config.routing.accountDetail, {
                      stakeAddress: account.stakeAddress,
                      color: i % colors.length
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
          {:catch error}
            <tr>
              <td class="text-center" colspan="3"
                ><span style="color: red">{error.message}</span></td
              >
            </tr>
          {/await}
        </tbody>
      </table>
    </div>
  </div>
</div>
