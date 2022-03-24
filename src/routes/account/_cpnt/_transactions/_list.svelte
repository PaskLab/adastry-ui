<script lang="ts">
  import config from '$lib/config.json';
  import { getTransactions } from '$lib/api/wallets';
  import { page } from '$app/stores';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import {
    toAda,
    dateFromUnix,
    formatDate,
    parseAssetHex,
    createTimestamp
  } from '$lib/utils/helper.utils';
  import Pager from '$lib/components/global/pager.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { get } from 'svelte/store';
  import type { TransactionListType } from '$lib/api/types/account-transaction.type';
  import Tooltip from '$lib/components/global/tooltip.svelte';

  const pageStore = getContext<Writable<number>>('transactionPage');
  let currentPage = get(pageStore);
  let limit = 20;
  let pTransactions: Promise<TransactionListType>;

  $: pageStore.set(currentPage);

  $: pTransactions = getTransactions($page.params.stakeAddress, {
    limit: limit,
    page: currentPage
  });
</script>

<div class="card">
  {#await pTransactions}
    <Skeleton height="1000px" />
  {:then transactions}
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bolder fs-3 mb-1">Account Transactions</span>
        <span class="text-muted mt-1 fw-bold fs-7">
          {transactions.count} transaction{transactions.count > 1 ? 's' : ''}
        </span>
      </h3>
      <Pager pageSize="{limit}" totalItems="{transactions.count}" bind:currentPage />
    </div>
    <div class="card-body py-3">
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gy-3">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>Date & Time</th>
              <th>Received (₳)</th>
              <th>Sent (₳)</th>
              <th>Fees</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody class="font-monospace">
            {#each transactions.data as record}
              <tr>
                <td>
                  <Tooltip text="{formatDate(dateFromUnix(record.blockTime))}">
                    {createTimestamp(dateFromUnix(record.blockTime))}
                  </Tooltip>
                </td>
                <td>
                  {#each record.received as amount}
                    <div>
                      {amount.unit === 'lovelace' ? 'ADA' : parseAssetHex(amount.unit).name} :
                      {amount.unit === 'lovelace' ? toAda(amount.quantity) : amount.quantity}
                    </div>
                  {/each}
                </td>
                <td>
                  {#each record.sent as amount}
                    <div>
                      {amount.unit === 'lovelace' ? 'ADA' : parseAssetHex(amount.unit).name} :
                      {amount.unit === 'lovelace' ? toAda(amount.quantity) : amount.quantity}
                    </div>
                  {/each}
                </td>
                <td>
                  {toAda(record.fees)}
                </td>
                <td>
                  {#each record.tags as tag}
                    <div class="badge badge-light-info me-1 mb-1">{tag}</div>
                  {/each}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Pager pageSize="{limit}" totalItems="{transactions.count}" bind:currentPage />
    </div>
  {:catch error}
    <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
  {/await}
</div>
