<script lang="ts">
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import ExportBtn from './export-btn.svelte';
  import { getContext } from 'svelte';
  import AccountList from './list.svelte';
  import YearPicker from '../../account/cpnt/export/year-picker.svelte';
  import MonthPicker from '$route/account/cpnt/export/month-picker.svelte';
  import FormatPicker from '../../account/cpnt/export/format-picker.svelte';
  import QuarterPicker from '../../account/cpnt/export/quarter-picker.svelte';
  import { getBulkRewardsCSV } from '$lib/api/wallets';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { BulkExportParamsType } from '$lib/types/bulk-export-params.type';

  export let categoryName = '';
  export let categorySlug = '';
  export let categoryColor = '';

  // Routing
  let mainView = getContext<Writable<ViewType>>('accountView');

  const currentYear = new Date().getFullYear();

  // Rewards Export params
  let rwSelectedYear = currentYear;
  const rwFormats = {
    default: 'Default',
    koinly: 'Koinly',
    spo: 'SPO',
    multiowner: 'Multi-Owner SPO',
    transaction: 'As transactions',
  };
  let rwStartMonth = 1;
  let rwSelectedPeriod: number | null = null;
  let rwSelectedFormat = 'default';
  let rewardParams: BulkExportParamsType;

  // Reactive
  $: rewardParams = {
    year: rwSelectedYear,
    format: rwSelectedFormat,
    startMonth: rwStartMonth,
    quarter: rwSelectedPeriod ? rwSelectedPeriod : undefined,
    ...(categorySlug && categorySlug.length ? { slug: categorySlug } : {}),
  };
</script>

<div
  class="card"
  style="{categoryColor && categoryColor.length ? 'border: solid 3px ' + categoryColor : ''}"
>
  <div class="card-header">
    <h3 class="card-title">
      {#if categoryName && categoryName.length}
        <span style="{categoryColor && categoryColor.length ? 'color: ' + categoryColor : ''}"
          >{categoryName} >
        </span>
      {/if}
      <span class="ps-1">Export Rewards History</span>
    </h3>
    <div class="card-toolbar">
      <button
        on:click="{() =>
          mainView.set({
            component: AccountList,
            props: { categoryName, categorySlug, categoryColor },
          })}"
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

  <div class="card-body border-top p-9">
    <div class="d-flex flex-wrap align-items-end">
      <YearPicker from="{2020}" to="{currentYear}" bind:selectedYear="{rwSelectedYear}" />
    </div>

    <div class="separator separator-dashed my-6"></div>

    <div class="d-flex flex-wrap align-items-end">
      <MonthPicker bind:selected="{rwStartMonth}" />
    </div>

    <div class="separator separator-dashed my-6"></div>

    <div class="d-flex flex-wrap align-items-end">
      <QuarterPicker bind:selected="{rwSelectedPeriod}" />
    </div>

    <div class="separator separator-dashed my-6"></div>

    <div class="d-flex flex-wrap align-items-end mb-10">
      <FormatPicker formats="{rwFormats}" bind:selectedFormat="{rwSelectedFormat}" />
    </div>

    <ExportBtn action="{() => getBulkRewardsCSV(rewardParams)}" />
  </div>
</div>
