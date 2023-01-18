<script lang="ts">
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import GiftIcon from '$lib/components/icons/gift.svelte';
  import CardIcon from '$lib/components/icons/credit-card.svelte';
  import { getContext } from 'svelte';
  import AccountList from './list.svelte';
  import ExportRewards from './reward-export.svelte';
  import ExportTransactions from './transaction-export.svelte';
  import RestrictionNotice from '../../../account/cpnt/export/restriction-notice.svelte';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Routing
  let mainView = getContext<Writable<ViewType>>('mainView');
</script>

<div class="card card-bordered mb-xl-8">
  <div class="card-header">
    <h3 class="card-title align-items-start flex-column">
      <span class="card-label fw-bolder fs-3 mb-1">Export Options</span>
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{() => mainView.set({ component: AccountList, props: {} })}"
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
      on:click="{() => mainView.set({ component: ExportRewards, props: {} })}"
      type="button"
      class="btn btn-lg btn-primary w-250px py-5 mb-10"
    >
      <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
        <GiftIcon />
      </span>
      Rewards History
    </button>
    <button
      on:click="{() => mainView.set({ component: ExportTransactions, props: {} })}"
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
