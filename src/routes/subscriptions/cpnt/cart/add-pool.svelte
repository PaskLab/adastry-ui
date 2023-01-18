<script lang="ts">
	import BackArrow from '$lib/components/icons/back-arrow.svelte';
	import { getContext } from 'svelte';
	import AddMenu from './add-menu.svelte';
	import Skeleton from '$lib/components/global/skeleton.svelte';
	import ActionBtn from '$lib/components/global/action-button.svelte';
	import CartList from './list.svelte';
	import type { UserPoolListType, UserPoolType } from '$lib/api/types/user-pool-list.type';
	import type { Writable, Readable } from 'svelte/store';
	import type { ViewType } from '$lib/types/view.type';

	// Routing
	let mainView = getContext<Writable<ViewType>>('mainView');

	// Context
	const pPools = getContext<Readable<Promise<UserPoolListType>>>('userPools');
	const selectedPools = getContext<Writable<UserPoolListType>>('selectedPools');

	// Process data
	const pInactivePools = filterInactivePools();

	// Form
	let wait = false;

	interface InactivePoolType extends UserPoolType {
		selected: boolean;
	}

	async function filterInactivePools(): Promise<InactivePoolType[]> {
		try {
			const pools = await $pPools;

			return pools
				.filter((p) => !p.isMember && !$selectedPools.some((sP) => sP.poolId === p.poolId))
				.map((p) => ({ ...p, selected: false }));
		} catch (e) {
			console.error(e);
		}
		return [];
	}

	async function select(): Promise<void> {
		wait = true;
		const inactivePools = await pInactivePools;
		const selection = inactivePools.filter((p) => p.selected);
		selectedPools.set([...$selectedPools, ...selection]);
		mainView.set({ component: CartList, props: {} });
	}
</script>

<div class="card card-bordered mb-xl-8">
	<div class="card-header">
		<h3 class="card-title align-items-start flex-column">
			<span class="card-label fw-bolder fs-3 mb-1">Add Pools to cart</span>
		</h3>
		<div class="card-toolbar">
			<button
				on:click="{() => mainView.set({ component: AddMenu, props: {} })}"
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

	<div class="card-body py-10  d-flex flex-column">
		{#await pInactivePools}
			{#each [1, 2, 3, 4] as _}
				<div class="d-flex flex-row py-2">
					<div
						class="d-flex justify-content-center me-5 form-check form-check-custom form-check-solid form-check-inline"
					>
						<Skeleton height="23px" width="23px" />
					</div>
					<div class="d-flex flex-column">
						<span class="py-1"><Skeleton height="18px" width="130px" /></span>
						<span><Skeleton height="14px" width="430px" /></span>
					</div>
				</div>
			{/each}
		{:then pools}
			{#if pools.length < 1}
				<div class="p-20 text-center fs-5 text-muted fw-bold">
					<p>No unsubscribed pool to select.</p>
					<p>
						Only unsubscribed pools to which your accounts are delegated to will be displayed here.
					</p>
				</div>
			{:else}
				{#each pools as pool}
					<div class="d-flex flex-row py-2">
						<div
							class="d-flex justify-content-center me-4 form-check form-check-custom form-check-solid form-check-inline"
						>
							<input class="form-check-input" type="checkbox" bind:checked="{pool.selected}" />
						</div>
						<div
							on:click="{() => (pool.selected = !pool.selected)}"
							class="d-flex flex-column bg-hover-light p-2 rounded"
						>
							<span class="fw-bolder fs-6">{pool.name}</span>
							<span class="fw-bold fs-7 text-muted text-truncate mw-250px mw-sm-450px">
								{pool.poolId}</span
							>
						</div>
					</div>
				{/each}
				<div class="text-center">
					<ActionBtn wait="{wait}" action="{select}" type="button" text="Select" />
				</div>
			{/if}
		{:catch error}
			<div class="text-center text-danger">
				{error.message}
			</div>
		{/await}
	</div>
</div>
