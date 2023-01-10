<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import CheckIcon from '$lib/components/icons/check-badge.svelte';
	import CrossIcon from '$lib/components/icons/cross-badge.svelte';

	export let isFree = false;
	export let price = 0;
	export let priceBase = 'Year';
	export let title = '';
	export let description = '';
	export let options: { [key: string]: { name: string; enabled: boolean } } = {};

	const planPrice = tweened(0, {
		duration: 1600,
		easing: expoOut
	});

	onMount(() => {
		planPrice.set(price);
	});
</script>

<div class="col-12 col-md-6 col-xl-4 col-xxl-3">
	<div class="d-flex h-100 align-items-center">
		<div class="w-100 d-flex flex-column flex-center rounded-3 bg-light bg-opacity-75 py-15 px-10">
			<div class="mb-7 text-center">
				<h1 class="text-dark mb-5 fw-boldest">{title}</h1>
				<div class="text-gray-400 fw-bold mb-5">
					{description}
				</div>
				<div class="text-center">
					{#if !isFree}
						<span class="mb-2 fs-2x text-primary">₳</span>
					{/if}
					<span class="fs-3x fw-bolder text-primary font-monospace"
						>{isFree ? 'FREE' : $planPrice.toFixed(0)}</span
					>
					{#if !isFree}
						<span class="fs-7 fw-bold opacity-50">/ {priceBase}</span>
					{/if}
				</div>
			</div>
			<div class="w-100 mb-10">
				{#each Object.keys(options) as optionKey}
					<div class="d-flex align-items-center mb-5">
						<span class="fw-bold fs-6 text-gray-800 flex-grow-1 pe-3"
							>{options[optionKey].name}</span
						>
						{#if options[optionKey].enabled}
							<span class="svg-icon svg-icon-1 svg-icon-success">
								<CheckIcon />
							</span>
						{:else}
							<span class="svg-icon svg-icon-1">
								<CrossIcon />
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
