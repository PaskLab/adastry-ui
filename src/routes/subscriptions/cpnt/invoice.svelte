<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import { createTimestamp, toAda } from '$lib/utils/helper.utils.js';
  import PendingBadge from '$lib/components/global/pending-badge.svelte';
  import type { Writable } from 'svelte/store';
  import type { InvoiceListType } from '$lib/api/types/invoice.type';
  import { getAccountsState, getInvoiceList } from '$lib/api/billing';
  import type { AccountStateType } from '$lib/api/types/account-state.type';

  // Context
  let pInvoices: Promise<InvoiceListType>;
  const invoicesStore = getContext<Writable<Promise<InvoiceListType>>>('invoices');
  const accountsState = getContext<Writable<Promise<AccountStateType[]>>>('accountsState');
  const unsubscriber = invoicesStore.subscribe((v) => (pInvoices = v));

  // Refresh 3 minutes on pending invoice
  $: pInvoices
    .then((invoices) => {
      if (invoices.data.some((i) => !i.confirmed && !i.canceled)) {
        console.log('Check again in 3 minutes!');
        setTimeout(() => {
          invoicesStore.set(getInvoiceList());
          accountsState.set(getAccountsState());
        }, 3000 * 60);
      }
    })
    .catch(console.error);

  onDestroy(() => {
    unsubscriber();
  });
</script>

<div class="card d-flex mb-xl-8 mb-10 pb-4">
  <div class="card-header border-0 pt-5">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Invoices</span>
      {#await pInvoices then invoiceList}
        <span class="text-muted fw-bold fs-7"
          >{invoiceList.count} invoice{invoiceList.count > 1 ? 's' : ''}</span
        >
      {/await}
    </h3>
  </div>

  <div class="card-body py-3">
    {#await pInvoices}
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
    {:then invoiceList}
      {#if invoiceList.count < 1}
        <div class="p-20 text-center fs-5 text-muted fw-bold">No invoice</div>
      {:else}
        {#each invoiceList.data as invoice, i}
          <div class="rounded {i % 2 ? '' : 'bg-lighten'} p-4 d-flex flex-column">
            <div class="d-flex justify-content-between  flex-wrap">
              <div class="d-flex flex-column min-w-lg-450px">
                <span class="fw-bolder text-primary fs-6">Invoice {invoice.invoiceId}</span>
                <span class="fw-bold fs-7">Tx Hash:</span>
                <span class="fw-bold fs-7 text-muted  mw-275px mw-sm-500px"> {invoice.txHash}</span>
              </div>
              <div class="d-flex align-items-center py-2">
                {#if invoice.canceled}
                  <span class="badge badge-danger">Canceled</span>
                {:else if invoice.confirmed}
                  <span class="badge badge-success">Confirmed</span>
                {:else}
                  <PendingBadge text="Pending" />
                {/if}
              </div>
              <div
                class="d-flex fw-boldest text-primary align-content-center align-items-center py-2 min-w-50px"
              >
                ₳{toAda(invoice.totalAmount)}
              </div>
              <div class="d-flex align-items-center py-2 min-w-125px">
                {(() => {
                  const date = new Date(Number(invoice.createdAt).valueOf());
                  date.setFullYear(date.getFullYear() + 1);
                  return createTimestamp(date);
                })()}
              </div>
            </div>
            <ul class="mt-2">
              {#each invoice.accounts as stakeAddress}
                <li>{stakeAddress}</li>
              {/each}
              {#each invoice.pools as poolId}
                <li>{poolId}</li>
              {/each}
            </ul>
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
