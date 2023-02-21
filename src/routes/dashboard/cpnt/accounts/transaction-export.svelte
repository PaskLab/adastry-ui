<script lang="ts">
  import BackArrow from '$lib/components/icons/back-arrow.svelte';
  import ExportBtn from './export-btn.svelte';
  import { getContext } from 'svelte';
  import AccountList from './list.svelte';
  import YearPicker from '../../../account/cpnt/export/year-picker.svelte';
  import MonthPicker from '$route/account/cpnt/export/month-picker.svelte';
  import FormatPicker from '../../../account/cpnt/export/format-picker.svelte';
  import QuarterPicker from '../../../account/cpnt/export/quarter-picker.svelte';
  import { getBulkTransactionCSV } from '$lib/api/wallets';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';
  import type { BulkExportParamsType } from '$lib/types/bulk-export-params.type';

  // Routing
  let mainView = getContext<Writable<ViewType>>('mainView');

  const currentYear = new Date().getFullYear();

  // Transactions Export params
  let txSelectedYear = currentYear;
  let txStartMonth = 1;
  let txSelectedPeriod: number | null = null;
  const txFormats = { default: 'Default', koinly: 'Koinly' };
  let txSelectedFormat = 'default';
  let txParams: BulkExportParamsType;

  // Reactive
  $: txParams = {
    year: txSelectedYear,
    format: txSelectedFormat,
    startMonth: txStartMonth,
    quarter: txSelectedPeriod ? txSelectedPeriod : undefined,
  };
</script>

<div class="card card-bordered mb-xl-8">
  <div class="card-header">
    <div class="card-title m-0">
      <h3 class="fw-bolder m-0">Export Transactions History</h3>
    </div>
    <div class="card-toolbar">
      <!--begin::Menu-->
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

  <div class="card-body border-top p-9">
    <div class="d-flex flex-wrap align-items-end">
      <YearPicker from="{2017}" to="{currentYear}" bind:selectedYear="{txSelectedYear}" />
    </div>

    <div class="separator separator-dashed my-6"></div>

    <div class="d-flex flex-wrap align-items-end">
      <MonthPicker bind:selected="{txStartMonth}" />
    </div>

    <div class="separator separator-dashed my-6"></div>

    <div class="d-flex flex-wrap align-items-end">
      <QuarterPicker bind:selected="{txSelectedPeriod}" />
    </div>

    <div class="separator separator-dashed my-6"></div>

    <div class="d-flex flex-wrap align-items-end mb-10">
      <FormatPicker formats="{txFormats}" bind:selectedFormat="{txSelectedFormat}" />
    </div>

    <ExportBtn action="{getBulkTransactionCSV}" bind:params="{txParams}" />
  </div>
</div>
