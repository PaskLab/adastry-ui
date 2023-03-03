<script lang="ts">
  import ExportBtn from './export-btn.svelte';
  import YearPicker from './year-picker.svelte';
  import FormatPicker from './format-picker.svelte';
  import MonthPicker from './month-picker.svelte';
  import QuarterPicker from './quarter-picker.svelte';
  import RestrictionNotice from './restriction-notice.svelte';
  import { page } from '$app/stores';
  import { getRewardsCSV, getTransactionCSV } from '$lib/api/wallets';
  import type { ExportParamsType } from '$lib/types/export-params.type';

  export let premium = false;

  const currentYear = new Date().getFullYear();
  const stakeAddress = $page.params.stakeAddress;

  // Rewards Export params
  let rwSelectedYear = currentYear;
  let rwStartMonth = 1;
  let rwSelectedPeriod: number | null = null;
  const rwFormats = {
    default: 'Default',
    koinly: 'Koinly',
    spo: 'SPO',
    multiowner: 'Multi-Owner SPO',
    transaction: 'As transactions',
  };
  let rwSelectedFormat = 'default';
  let rewardParams: ExportParamsType;
  // Transactions Export params
  let txSelectedYear = currentYear;
  let txStartMonth = 1;
  let txSelectedPeriod: number | null = null;
  const txFormats = { default: 'Default', koinly: 'Koinly' };
  let txSelectedFormat = 'default';
  let txParams: ExportParamsType;

  // Reactive
  $: rewardParams = {
    stakeAddress,
    year: rwSelectedYear,
    format: rwSelectedFormat,
    startMonth: rwStartMonth,
    quarter: rwSelectedPeriod ? rwSelectedPeriod : undefined,
  };
  $: txParams = {
    stakeAddress,
    year: txSelectedYear,
    format: txSelectedFormat,
    startMonth: txStartMonth,
    quarter: txSelectedPeriod ? txSelectedPeriod : undefined,
  };
</script>

{#if premium}
  <div class="row">
    <div class="col col-12 col-md-6">
      <div class="card mb-5 mb-xl-10">
        <div class="card-header border-0">
          <div class="card-title m-0">
            <h3 class="fw-bolder m-0">Export History (Rewards)</h3>
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

          <ExportBtn action="{() => getRewardsCSV(rewardParams)}" />
        </div>
      </div>
    </div>

    <div class="col col-12 col-md-6">
      <div class="card mb-5 mb-xl-10">
        <div class="card-header border-0">
          <div class="card-title m-0">
            <h3 class="fw-bolder m-0">Export Transactions</h3>
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

          <ExportBtn action="{() => getTransactionCSV(txParams)}" />
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="row">
    <div class="col col-12">
      <RestrictionNotice />
    </div>
  </div>
{/if}
