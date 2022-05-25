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
    createTimestamp,
  } from '$lib/utils/helper.utils';
  import Pager from '$lib/components/global/pager.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { get } from 'svelte/store';
  import type { TransactionListType } from '$lib/api/types/account-transaction.type';
  import Tooltip from '$lib/components/global/tooltip.svelte';
  import NoticeIcon from '$lib/components/icons/notice.svelte';

  const pageStore = getContext<Writable<number>>('transactionPage');
  let currentPage = get(pageStore);
  let limit = 20;
  let pTransactions: Promise<TransactionListType>;
  let scrollTo: Element;

  $: pageStore.set(currentPage);

  $: pTransactions = getTransactions($page.params.stakeAddress, {
    limit: limit,
    page: currentPage,
  });
</script>

<div class="card" bind:this="{scrollTo}">
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
        <table class="table table-row-bordered table-row-gray-100 align-middle gy-3 fs-8 fs-md-6">
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
              <tr class="border-bottom-0">
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
                      {amount.unit === 'lovelace'
                        ? toAda(amount.quantity - (record.needReview ? 0 : record.fees))
                        : amount.quantity}
                    </div>
                  {/each}
                </td>
                <td>
                  {record.txType === 'RX' ? '' : toAda(record.fees)}
                </td>
                <td>
                  {#each record.tags as tag}
                    <div class="badge badge-light-info me-1 mb-1">
                      {tag}
                    </div>
                  {/each}
                </td>
              </tr>
              <tr class="d-none d-sm-table-row">
                <td colspan="3">
                  <p class="fw-bolder">Transaction Hash</p>
                  <p>
                    <a
                      class="force-wrap"
                      href="https://cardanoscan.io/transaction/{record.txHash}"
                      target="_blank">{record.txHash}</a
                    >
                  </p>
                </td>
                <td colspan="2">
                  {#if record.needReview}
                    <div
                      class="notice d-flex bg-light-warning rounded border-primary border border-dashed p-2 review-notice mx-auto"
                    >
                      <span class="svg-icon svg-icon-3qx svg-icon-primary me-4">
                        <NoticeIcon />
                      </span>
                      <div class="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
                        <div class="mb-3 mb-md-0 fw-bold">
                          <div class="text-gray-900 fw-bolder mb-1">
                            This transaction needs to be reviewed
                          </div>
                          <div class="fs-8 text-gray-700 pe-7">
                            Transactions on Cardano can be much more complex than traditional
                            transactions limited to 2 parties. The outcome of a transaction using
                            multisig or a smart contract may tell a different story than what
                            actually happened. User intervention is therefore required.
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Pager
        pageSize="{limit}"
        totalItems="{transactions.count}"
        bind:currentPage
        scrollTo="{scrollTo}"
      />
    </div>
  {:catch error}
    <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
  {/await}
</div>

<style lang="scss">
  .force-wrap {
    overflow-wrap: anywhere;
  }
  .review-notice {
    max-width: 460px;
  }
</style>
