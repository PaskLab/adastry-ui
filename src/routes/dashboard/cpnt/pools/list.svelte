<script lang="ts">
	import config from '$lib/config.json';
	import Skeleton from '$lib/components/global/skeleton.svelte';
	import { getPoolsROS } from '$lib/api/stats';
	import Tooltip from '$lib/components/global/tooltip.svelte';
	import { getLastEpoch } from '$lib/api/epoch';
	import type { PoolROSType } from '$lib/api/types/pool-ros.type';

	let pPoolsROS = fetchData();

	async function fetchData(): Promise<PoolROSType[]> {
		const lastEpoch = await getLastEpoch();
		return getPoolsROS(lastEpoch ? lastEpoch.epoch - 75 : 208);
	}
</script>

<div class="card mb-xl-8">
	<div class="card-header border-0 pt-5">
		<h3 class="card-title align-items-start flex-column">
			<span class="card-label fw-bolder fs-3 mb-1">Past year Pools Stats</span>
			{#await pPoolsROS then pools}
				<span class="text-muted fw-bold fs-7">
					{pools.length} pool{pools.length > 1 ? 's' : ''}
				</span>
			{/await}
		</h3>
	</div>

	<div class="card-body py-3">
		<div class="table-responsive">
			<table class="table align-middle gs-0 gy-5">
				<thead class="fw-boldest">
					<tr>
						<th class="w-100 fs-4">Pools</th>
						<th class="text-end min-w-80px fs-4"
							><Tooltip text="Return on Operation">ROO</Tooltip></th
						>
						<th class=" text-end min-w-80px fs-4"><Tooltip text="Return on Stake">ROS</Tooltip></th>
					</tr>
				</thead>
				<tbody>
					{#await pPoolsROS}
						<tr>
							<td>
								<Skeleton width="50%" height="20px" />
								<span class="text-muted fw-bold d-block fs-7">
									<Skeleton height="18px" width="80%" />
								</span>
							</td>

							<td class="text-end">
								<span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
									<Skeleton height="34px" />
								</span>
							</td>

							<td class="text-end">
								<span class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
									<Skeleton height="34px" />
								</span>
							</td>
						</tr>
					{:then pools}
						{#each pools as pool, i}
							<tr>
								<td>
									<span class="fs-6 white fw-bolder">
										{pool.poolName.replace('[', ' [')}
									</span>

									<span class="d-none d-sm-block text-muted fw-bold d-block fs-7"
										>{pool.poolId}</span
									>
								</td>
								<td class="text-end fw-bolder"
									>{pool.roo ? (pool.roo * 100).toFixed(2) + ' %' : ''}</td
								>
								<td class="text-end fw-bolder">{(pool.ros * 100).toFixed(2)} %</td>
							</tr>
						{/each}
					{:catch error}
						<tr>
							<td class="text-center" colspan="3">
								<span style="color: red">{config.messages.failedFetch}</span>
							</td>
						</tr>
					{/await}
				</tbody>
			</table>
		</div>
	</div>
</div>
