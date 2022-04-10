<script lang="ts">
  import config from '$lib/config.json';
  import { getHistory } from '$lib/api/wallets';
  import { page } from '$app/stores';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import type { AccountHistoryListType } from '$lib/api/types/account-history.type';
  import { toAda, dateFromUnix, formatDate } from '$lib/utils/helper.utils';
  import Pager from '$lib/components/global/pager.svelte';
  import { browser } from '$app/env';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import { get } from 'svelte/store';
  import Tooltip from '$lib/components/global/tooltip.svelte';

  export let owner = getContext<Writable<boolean>>('isOwner');

  const pageStore = getContext<Writable<number>>('historyPage');
  let currentPage = get(pageStore);
  let limit = 20;
  let pHistory: Promise<AccountHistoryListType>;

  $: pageStore.set(currentPage);

  $: pHistory = getHistory($page.params.stakeAddress, {
    limit: limit,
    page: currentPage,
  });

  $: if (browser) {
    pHistory
      .then((res) => {
        owner.set(res.data.some((record) => record.owner));
      })
      .catch(console.log);
  }
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
        <table class="table table-row-bordered table-row-gray-100 align-middle gy-3 fs-8 fs-md-6">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>Epoch</th>
              <th>Rewards (₳)</th>
              <th>Active Stake (₳)</th>
              <th>Spot {history.data.length ? `(${history.data[0].spotPrice.code})` : ''}</th>
              <th>Withdrawable (₳)</th>
              <th>Withdrawn (₳)</th>
              {#if $owner}
                <th>Revised Rewards (₳)</th>
                <th>Op Rewards (₳)</th>
                <th>Stake Share (%)</th>
              {/if}
              <th>Pool</th>
            </tr>
          </thead>
          <tbody class="font-monospace">
            {#each history.data as record}
              <tr>
                <td>
                  <Tooltip text="{formatDate(dateFromUnix(record.epoch.startTime))}">
                    {record.epoch.epoch}
                  </Tooltip>
                </td>
                <td class="fw-bolder">
                  <Tooltip
                    text="{record.spotPrice.code} {(
                      record.spotPrice.price * toAda(record.rewards)
                    ).toFixed(2)}"
                  >
                    {toAda(record.rewards)}
                  </Tooltip>
                </td>
                <td>
                  <Tooltip
                    text="{record.spotPrice.code} {(
                      record.spotPrice.price * toAda(record.activeStake)
                    ).toFixed(2)}"
                  >
                    {toAda(record.activeStake)}
                  </Tooltip>
                </td>
                <td>
                  {record.spotPrice.price.toFixed(2)}
                </td>
                <td>
                  {toAda(record.withdrawable)}
                </td>
                <td>
                  {toAda(record.withdrawn)}
                </td>
                {#if $owner}
                  <td>
                    <Tooltip
                      text="{record.spotPrice.code} {(
                        record.spotPrice.price * toAda(record.revisedRewards)
                      ).toFixed(2)}"
                    >
                      {toAda(record.revisedRewards)}
                    </Tooltip>
                  </td>
                  <td>
                    <Tooltip
                      text="{record.spotPrice.code} {(
                        record.spotPrice.price * toAda(record.opRewards)
                      ).toFixed(2)}"
                    >
                      {toAda(record.opRewards)}
                    </Tooltip>
                  </td>
                  <td>
                    {(record.stakeShare * 100).toFixed(4)}
                  </td>
                {/if}
                <td class="text-info">
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
