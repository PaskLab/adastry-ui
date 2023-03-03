<script lang="ts">
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import GiftIcon from '$lib/components/icons/gift.svelte';
  import CardIcon from '$lib/components/icons/credit-card.svelte';
  import { getContext } from 'svelte';
  import AccountList from './list.svelte';
  import ExportRewards from './reward-export.svelte';
  import ExportTransactions from './transaction-export.svelte';
  import RestrictionNotice from '../../account/cpnt/export/restriction-notice.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  export let categoryName = '';
  export let categorySlug = '';
  export let categoryColor = '';

  function handleBack() {
    mainView.set({ component: AccountList, props: { categoryName, categorySlug, categoryColor } });
  }

  // Routing
  let mainView = getContext<Writable<ViewType>>('accountView');
</script>

<div
  class="card"
  style="{categoryColor && categoryColor.length ? 'border: solid 3px ' + categoryColor : ''}"
>
  <div class="card-header">
    <h3 class="card-title">
      {#if categoryName && categoryName.length}
        <span style="{categoryColor && categoryColor.length ? 'color: ' + categoryColor : ''}"
          >{categoryName} ></span
        >
      {/if}
      <span>Export Options</span>
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

  <div class="card-body py-10 text-center d-flex flex-column align-items-center">
    <RestrictionNotice />

    <button
      on:click="{() =>
        mainView.set({
          component: ExportRewards,
          props: { categoryName, categorySlug, categoryColor },
        })}"
      type="button"
      class="btn btn-lg btn-primary w-250px py-5 mb-10"
    >
      <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
        <GiftIcon />
      </span>
      Rewards History
    </button>
    <button
      on:click="{() =>
        mainView.set({
          component: ExportTransactions,
          props: { categoryName, categorySlug, categoryColor },
        })}"
      type="button"
      class="btn btn-lg btn-info w-250px py-5 mb-10"
    >
      <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
        <CardIcon />
      </span>
      Transactions History
    </button>
  </div>
</div>
