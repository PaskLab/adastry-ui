<script lang="ts">
  import config from '$lib/config.json';
  import { darkMode } from '$lib/stores/session.store';
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
  import ChevronDown from '$lib/components/icons/chevron-down.svelte';
  import ChevronUp from '$lib/components/icons/chevron-up.svelte';
  import UpDownArrow from '$lib/components/icons/up-down-arrow.svelte';
  import Metadata from './metadata.svelte';

  const pageStore = getContext<Writable<number>>('transactionPage');
  let currentPage = get(pageStore);
  let limit = 20;
  let pTransactions: Promise<TransactionListType>;
  let scrollTo: Element;

  const display = {
    txTitle: {
      RX: 'Received',
      TX: 'Sent',
      MX: 'Multi-Signatures',
    },
  };

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
      {#if transactions.count < 1}
        <div class="p-20 text-center fs-5 text-muted fw-bold">No transaction history</div>
      {:else}
        {#each transactions.data as record}
          <div
            class="rounded {$darkMode ? 'bg-lighten' : 'bg-light-mode'} flex-column-fluid mb-5 p-5"
          >
            <div class="d-flex flex-md-row flex-column">
              <div class="flex-column-fluid">
                <h2>
                  <span class="svg-icon svg-icon-2hx">
                    {#if record.txType === 'RX'}
                      <ChevronDown --color="#00ff00" />
                    {:else if record.txType === 'TX'}
                      <ChevronUp --color="#ff0000" />
                    {:else}
                      <UpDownArrow --color="#8850fb" />
                    {/if}
                  </span>
                  {display.txTitle[record.txType]}
                </h2>
                <h6 class="fw-bolder">Transaction Hash</h6>
                <p class="font-monospace">
                  <a
                    class="force-wrap"
                    href="https://cardanoscan.io/transaction/{record.txHash}"
                    target="_blank">{record.txHash}</a
                  >
                </p>
              </div>
              <div class="flex-column">
                <div class="text-right font-monospace mb-2">
                  <Tooltip text="{formatDate(dateFromUnix(record.blockTime))}">
                    {createTimestamp(dateFromUnix(record.blockTime))}
                  </Tooltip>
                </div>
                {#if record.txType !== 'RX'}
                  <p class="text-right">
                    <strong>Fees:</strong>
                    <span class="text-danger">{toAda(record.fees)}</span> <strong>₳</strong>
                  </p>
                {/if}
                {#if record.tags.length}
                  <div class="text-right">
                    {#each record.tags as tag}
                      <div class="badge badge-light-primary ms-1 mb-1">
                        {tag}
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>

            <div class="d-flex flex-md-row flex-column">
              <div
                class="d-flex flex-row-fluid flex-wrap w-md-50 rounded border-dashed border-success border-2 p-2 m-5 received-box min-h-55px"
              >
                {#each record.received as amount}
                  <div>
                    <div class="m-2 px-2 py-1 rounded bg-success">
                      {amount.unit === 'lovelace' ? '' : parseAssetHex(amount.unit).name + ' :'}
                      <strong
                        >{amount.unit === 'lovelace'
                          ? toAda(amount.quantity) + ' ₳'
                          : amount.quantity}</strong
                      >
                    </div>
                  </div>
                {/each}
              </div>
              <div
                class="d-flex flex-row-fluid flex-wrap w-md-50 rounded border-dashed border-danger border-2 p-2 m-5 sent-box min-h-55px"
              >
                {#each record.sent as amount}
                  {#if amount.unit !== 'lovelace' || toAda(amount.quantity - (record.needReview ? 0 : record.fees))}
                    <div>
                      <div class="m-2 px-2 py-1 rounded bg-danger">
                        {amount.unit === 'lovelace' ? '' : parseAssetHex(amount.unit).name + ' :'}
                        <strong>
                          {amount.unit === 'lovelace'
                            ? toAda(amount.quantity - (record.needReview ? 0 : record.fees)) + ' ₳'
                            : amount.quantity}
                        </strong>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>

            {#if record.metadata.length > 2}
              <svelte:component this="{Metadata}" metadata="{record.metadata}" />
            {/if}

            {#if record.needReview}
              <div
                class="d-flex notice bg-light-warning rounded border-primary border border-dashed p-2  mx-auto"
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
                      Transactions on Cardano can be much more complex than traditional transactions
                      limited to 2 parties. The outcome of a transaction using multisig or a smart
                      contract may tell a different story than what actually happened. User
                      intervention is therefore required.
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      {/if}

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
  .text-right {
    text-align: right;
  }
  .bg-light-mode {
    background-color: #f8f8f8;
    .received-box {
      background-color: #ffffff;
    }
    .sent-box {
      background-color: #ffffff;
    }
  }
  .received-box {
    background-image: url(/img/svg/icon/chevron-down.svg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
  .sent-box {
    background-image: url(/img/svg/icon/chevron-up.svg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }
</style>
