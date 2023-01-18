<script lang="ts">
	import config from '$lib/config.json';
	import BackArrow from '$lib/components/icons/back-arrow.svelte';
	import AddAccount from './add-account.svelte';
	import AddPool from './add-pool.svelte';
	import { getContext } from 'svelte';
	import CartList from './list.svelte';
	import type { Writable } from 'svelte/store';
	import type { ViewType } from '$lib/types/view.type';
	import { toAda } from '$lib/utils/helper.utils.js';

	// Routing
	let mainView = getContext<Writable<ViewType>>('mainView');
</script>

<div class="card card-bordered mb-xl-8">
	<div class="card-header">
		<h3 class="card-title align-items-start flex-column">
			<span class="card-label fw-bolder fs-3 mb-1">Choose a product</span>
		</h3>
		<div class="card-toolbar">
			<button
				on:click="{() => mainView.set({ component: CartList, props: {} })}"
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

	<div
		class="card-body py-10 text-center d-flex flex-row align-content-center justify-content-center"
	>
		<button
			on:click="{() => mainView.set({ component: AddAccount, props: {} })}"
			type="button"
			class="btn btn-lg btn-primary w-250px py-5 mx-2 lh-1"
		>
			<p>Individual accounts</p>
			<p>₳{toAda(config.billing.accountUnitPrice)}<span class="fs-8 fw-light">/account</span></p>
			<span class="fs-8 fw-light">Enable a year of premium features for the selected accounts</span>
		</button>
		<button
			on:click="{() => mainView.set({ component: AddPool, props: {} })}"
			class="btn btn-lg btn-info w-250px py-5 mx-2 lh-1"
		>
			<p>Register a pool</p>
			<p class="fs-6">
				₳{toAda(config.billing.poolUnitPrice)}<span class="fs-8 fw-light">/pool</span>
			</p>
			<span class="fs-8 fw-light"
				>Enable a year of premium features for every accounts delegated of the selected pool</span
			>
		</button>
	</div>
</div>
