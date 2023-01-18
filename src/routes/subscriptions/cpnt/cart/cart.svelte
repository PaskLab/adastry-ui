<script lang="ts">
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import CartList from './list.svelte';
	import { getUserPools } from '$lib/api/wallets';
	import type { AccountListType } from '$lib/api/types/account-list.type';
	import type { PoolType } from '$lib/api/types/pool.type';
	import type { ViewType } from '$lib/types/view.type';
	import type { Writable } from 'svelte/store';
	import type { UserPoolListType } from '$lib/api/types/user-pool-list.type';

	// Routing
	let mainView: ViewType;
	setContext('mainView', writable<ViewType>({ component: CartList, props: {} }));
	const unsubsriber = getContext<Writable<ViewType>>('mainView').subscribe((v) => (mainView = v));

	// Context
	setContext('selectedAccounts', writable<AccountListType>([]));
	setContext('selectedPools', writable<PoolType[]>([]));
	const userPools = setContext(
		'userPools',
		writable<Promise<UserPoolListType>>(new Promise<UserPoolListType>(() => []))
	);

	onMount(() => {
		// Fetch
		userPools.set(getUserPools());
	});

	onDestroy(() => {
		unsubsriber();
	});
</script>

<svelte:component this="{mainView.component}" {...mainView.props} />
