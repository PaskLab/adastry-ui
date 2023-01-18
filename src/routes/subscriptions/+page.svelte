<script lang="ts">
  import Cart from './cpnt/cart/cart.svelte';
  import Subscriptions from './cpnt/active-accounts.svelte';
  import Invoices from './cpnt/invoice.svelte';
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { getAccountsState, getInvoiceList } from '$lib/api/billing';
  import type { AccountStateType } from '$lib/api/types/account-state.type';
  import type { InvoiceListType } from '$lib/api/types/invoice.type';

  // Context
  const accountsState = setContext(
    'accountsState',
    writable<Promise<AccountStateType[]>>(new Promise<AccountStateType[]>(() => [])),
  );
  const invoices = setContext(
    'invoices',
    writable<Promise<InvoiceListType>>(
      new Promise<InvoiceListType>(() => ({ count: 0, data: [] })),
    ),
  );

  onMount(() => {
    // Fetch
    accountsState.set(getAccountsState());
    invoices.set(getInvoiceList());
  });
</script>

<svelte:head>
  <title>Subscriptions - Adastry</title>
</svelte:head>

<div class="content flex-row-fluid">
  <Cart />
  <Invoices />
  <Subscriptions />
</div>
