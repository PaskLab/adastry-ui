<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import { createTimestamp } from '$lib/utils/helper.utils.js';
  import type { AccountStateType } from '$lib/api/types/account-state.type';
  import type { Readable } from 'svelte/store';

  // Context
  let pAccounts: Promise<AccountStateType[]>;
  let pActiveAccounts: Promise<AccountStateType[]>;
  const unsubscriber = getContext<Readable<Promise<AccountStateType[]>>>('accountsState').subscribe(
    (v) => {
      pAccounts = v;
      // Process data
      pActiveAccounts = filterActiveAccounts();
    },
  );

  async function filterActiveAccounts(): Promise<AccountStateType[]> {
    try {
      const accounts = await pAccounts;
      return accounts.filter((a) => a.active);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  onDestroy(() => {
    unsubscriber();
  });
</script>

<div class="card mb-xl-8 mb-10">
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Active Accounts</span>
      <span class="text-muted fw-bold fs-7">Premium features are enabled for active accounts</span>
      {#await pActiveAccounts then actives}
        <span class="text-muted fw-bold fs-7"
          >{actives.length} active{actives.length > 1 ? 's' : ''}</span
        >
      {/await}
    </h3>
  </div>

  <div class="card-body py-3">
    {#await pActiveAccounts}
      {#each [1, 2, 3] as _}
        <div class="d-flex justify-content-between my-3 flex-wrap">
          <div class="py-2">
            <Skeleton height="22px" width="430px" />
          </div>
          <div class="py-2">
            <Skeleton height="22px" width="100px" />
          </div>
          <div class="py-2">
            <Skeleton height="22px" width="185px" />
          </div>
        </div>
      {/each}
    {:then accounts}
      {#if accounts.length < 1}
        <div class="p-20 text-center fs-5 text-muted fw-bold">No active accounts</div>
      {:else}
        {#each accounts as account, i}
          <div class="d-flex justify-content-between my-3 flex-wrap">
            <div class="d-flex flex-column py-2 min-w-lg-450px">
              <span class="fw-bolder fs-6">{account.name}</span>
              <span class="fw-bold fs-7 text-muted text-truncate mw-275px mw-sm-450px">
                {account.stakeAddress}</span
              >
            </div>
            <div class="d-flex align-items-center py-2">
              {#if account.type === 'account'}
                <span class="badge badge-primary">Paid Account</span>
              {:else if account.type === 'pool'}
                <span class="badge badge-warning">Paid Pool</span>
              {:else if account.type === 'member'}
                <span class="badge badge-info">Armada Supporter</span>
              {/if}
            </div>
            <div class="d-flex align-items-center py-2 min-w-200px">
              {#if account.createdAt.length}
                Expires on

                {(() => {
                  const date = new Date(Number(account.createdAt).valueOf());
                  date.setFullYear(date.getFullYear() + 1);
                  return createTimestamp(date);
                })()}
              {:else if account.type === 'member'}
                Expires when you leave
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    {:catch error}
      <div class="text-center text-danger">
        {error.message}
      </div>
    {/await}
  </div>
</div>
