<script lang="ts">
  import config from '$lib/config.json';
  import { getHistory } from '$lib/api/wallets';
  import { page } from '$app/stores';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import type { AccountHistoryType } from '$lib/api/types/account-history.type';
  import { toAda } from '$lib/utils/helper.utils';
  import Pager from '$lib/components/global/pager.svelte';

  let pHistory: Promise<AccountHistoryType>;
  let currentPage = 1;
  let limit = 50;

  $: pHistory = getHistory($page.params.stakeAddress, { limit: limit, page: currentPage });
</script>

<div class="card">
  {#await pHistory}
    <Skeleton height="1000px" />
  {:then history}
    <div class="card-header border-0 pt-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bolder fs-3 mb-1">Account History</span>
        <span class="text-muted mt-1 fw-bold fs-7"
          >{history.count} registered epoch{history.count > 1 ? 's' : ''}</span
        >
      </h3>
      <Pager pageSize="{limit}" totalItems="{history.count}" bind:currentPage />
    </div>
    <div class="card-body py-3">
      <div class="table-responsive">
        <table class="table table-row-bordered table-row-gray-100 align-middle gy-3">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>Epoch</th>
              <th>Rewards (₳)</th>
              <th>Active Stake (₳)</th>
              <th>Revised Rewards (₳)</th>
              <th>Op Rewards (₳)</th>
              <th>Stake Share (%)</th>
              <th>Pool</th>
            </tr>
          </thead>
          <tbody class="font-monospace">
            {#each history.data as record}
              <tr>
                <td>
                  {record.epoch}
                </td>
                <td>
                  {toAda(record.rewards)}
                </td>
                <td>
                  {toAda(record.activeStake)}
                </td>
                <td>
                  {toAda(record.revisedRewards)}
                </td>
                <td>
                  {toAda(record.opRewards)}
                </td>
                <td>
                  {record.stakeShare}
                </td>
                <td>
                  {record.pool.name.replace('[', ' [')}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <Pager pageSize="{limit}" totalItems="{history.count}" bind:currentPage />
    </div>
  {:catch error}
    <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
  {/await}
</div>
