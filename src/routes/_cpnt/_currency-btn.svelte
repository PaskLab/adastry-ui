<script lang="ts">
  import DollarIcon from '$lib/components/icons/dollar.svelte';
  import config from '$lib/config.json';
  import TextInput from '$lib/components/form/text-input.svelte';
  import { clickOutside } from '$lib/utils/actions.utils';
  import { onMount } from 'svelte';
  import { getUserProfile, updateUserCurrency } from '$lib/api/user';
  import Skeleton from '$lib/components/global/skeleton.svelte';

  let show = false;
  let currencies = config.currencies;
  let search = '';
  let preferredCurrency = { code: 'USD', name: 'United States Dollar' };

  let promise: Promise<any> = Promise.reject();

  $: {
    // Search field logic
    if (search.length) {
      const regEx = new RegExp(search.replace(' ', ''), 'i');
      currencies = config.currencies.filter(
        (v) => regEx.test(v.code.replace(' ', '')) || regEx.test(v.name.replace(' ', '')),
      );
    } else {
      currencies = config.currencies;
    }
  }

  function handleEsc(event): void {
    if (event.key === 'Escape') {
      show = false;
    }
  }

  onMount(() => {
    promise = getUserProfile();
    promise
      .then((res) => {
        let currency = currencies.find((v) => v.code === res.currency);
        if (currency) preferredCurrency = currency;
      })
      .catch(console.log);
  });

  function changeCurrency(code: string) {
    promise = updateUserCurrency(code);
    promise
      .then(() => {
        let currency = currencies.find((v) => v.code === code);
        if (currency) preferredCurrency = currency;
        location.reload();
      })
      .catch(console.log);
  }
</script>

<svelte:window on:keydown="{handleEsc}" />

<div
  on:click="{() => (show = !show)}"
  class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px position-relative btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
>
  <span class="svg-icon svg-icon-2x">
    <DollarIcon />
  </span>
</div>

<div
  use:clickOutside
  on:outclick="{() => (show = false)}"
  class:show
  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
  style="z-index: 105; position: fixed; inset: 0 0 auto auto; margin: 0; transform: translate(-100px, 66px);"
  data-popper-placement="bottom-end"
>
  <div class="menu-item px-3">
    {#await promise}
      <Skeleton height="66px" />
    {:then promiseResult}
      <div class="menu-content d-flex align-items-center px-7">
        <div class="symbol symbol-50px me-5">
          <div
            class="h-50px w-50px rounded fw-boldest bg-primary text-white font-monospace"
            style="padding: 15px 13px;"
          >
            {preferredCurrency.code}
          </div>
        </div>
        <div class="d-flex flex-column fw-bolder text-muted">
          Preferred Currency
          <div class="text-dark">{preferredCurrency.name}</div>
        </div>
      </div>
    {:catch error}
      <div class="text-danger text-center p-5">{config.messages.failedFetch}</div>
    {/await}
  </div>

  <div class="separator my-2"></div>

  <div class="menu-item px-4 pb-5">
    <TextInput
      placeholder="Search Currency"
      clear="{true}"
      validation="{false}"
      bind:value="{search}"
    />
  </div>

  <div class="menu-item px-5 mh-400px overflow-scroll">
    {#if currencies.length}
      {#each currencies as currency}
        <div on:click="{() => changeCurrency(currency.code)}" type="button" class="menu-link px-5">
          <div class="symbol symbol-50px me-5">
            <div
              class="h-50px w-50px rounded fw-boldest bg-warning text-white font-monospace"
              style="padding: 15px 13px;"
            >
              {currency.code}
            </div>
          </div>
          <div class="d-flex flex-column">
            {currency.name}
          </div>
        </div>
      {/each}
    {:else}
      <p class="text-muted text-center">No match found...</p>
    {/if}
  </div>
</div>
