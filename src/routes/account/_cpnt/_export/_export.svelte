<script lang="ts">
  import ExportBtn from './_export-btn.svelte';
  import YearPicker from './_year-picker.svelte';
  import FormatPicker from './_format-picker.svelte';
  import { page } from '$app/stores';
  import { getRewardsCSV, getTransactionCSV } from '$lib/api/wallets';

  type ExportParamsType = {
    stakeAddress: string;
    year: number;
    format: string;
  };
  const currentYear = new Date().getFullYear();
  const stakeAddress = $page.params.stakeAddress;

  // Rewards Export params
  let rwSelectedYear = currentYear;
  const rwFormats = {
    default: 'Default',
    koinly: 'Koinly',
    spo: 'SPO',
    multiowner: 'Multi-Owner SPO',
    transaction: 'As transactions'
  };
  let rwSelectedFormat = 'default';
  let rewardParams: ExportParamsType;
  // Transactions Export params
  let txSelectedYear = currentYear;
  const txFormats = { default: 'Default', koinly: 'Koinly' };
  let txSelectedFormat = 'default';
  let txParams: ExportParamsType;

  // Reactive
  $: rewardParams = { stakeAddress, year: rwSelectedYear, format: rwSelectedFormat };
  $: txParams = { stakeAddress, year: txSelectedYear, format: txSelectedFormat };
</script>

<div class="row">
  <div class="col col-12 col-md-6">
    <div class="card mb-5 mb-xl-10">
      <div class="card-header border-0 cursor-pointer">
        <div class="card-title m-0">
          <h3 class="fw-bolder m-0">Export Rewards</h3>
        </div>
      </div>

      <div class="collapse show">
        <div class="card-body border-top p-9">
          <div class="d-flex flex-wrap align-items-end">
            <YearPicker from="{2020}" to="{currentYear}" bind:selectedYear="{rwSelectedYear}" />
          </div>
          <div class="separator separator-dashed my-6"></div>

          <div class="d-flex flex-wrap align-items-end mb-10">
            <FormatPicker formats="{rwFormats}" bind:selectedFormat="{rwSelectedFormat}" />
          </div>

          <ExportBtn action="{getRewardsCSV}" bind:params="{rewardParams}" />
        </div>
      </div>
    </div>
  </div>

  <div class="col col-12 col-md-6">
    <div class="card mb-5 mb-xl-10">
      <div class="card-header border-0 cursor-pointer">
        <div class="card-title m-0">
          <h3 class="fw-bolder m-0">Export Transactions</h3>
        </div>
      </div>

      <div class="collapse show">
        <div class="card-body border-top p-9">
          <div class="d-flex flex-wrap align-items-end">
            <YearPicker from="{2017}" to="{currentYear}" bind:selectedYear="{txSelectedYear}" />
          </div>
          <div class="separator separator-dashed my-6"></div>

          <div class="d-flex flex-wrap align-items-end mb-10">
            <FormatPicker formats="{txFormats}" bind:selectedFormat="{txSelectedFormat}" />
          </div>

          <ExportBtn action="{getTransactionCSV}" bind:params="{txParams}" />
        </div>
      </div>
    </div>
  </div>
</div>
