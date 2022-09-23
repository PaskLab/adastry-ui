<script lang="ts">
	import config from '$lib/config.json';
	import Skeleton from '$lib/components/global/skeleton.svelte';
	import PlusIcon from '$lib/components/icons/plus.svelte';
	import PencilIcon from '$lib/components/icons/pencil.svelte';
	import TrashIcon from '$lib/components/icons/trash.svelte';
	import { getContext, onMount } from 'svelte';
	import { getVerifiedAddresses, removeVerifiedAddress } from '$lib/api/user';
	import AddAccount from './add.svelte';
	import UpdateAccount from './update.svelte';
	import Modal from '$lib/components/global/modal.svelte';
	import type { Writable } from 'svelte/store';
	import type { ViewType } from '$lib/types/view.type';
	import type { VerifiedAddressType } from '$lib/api/types/verified-address.type';

	// Routing
	let verifiedView = getContext<Writable<ViewType>>('verifiedView');

	// Fetch
	let pVerifiedAddresses: Promise<VerifiedAddressType[]> = Promise.reject();

	// Modals
	let errorModal: typeof Modal;
	let deleteModal: typeof Modal;
	let deleteAccountName = '';
	let deleteStakeAddress = '';

	// Remove Verified Addresses
	function handleDelete(accountName: string, stakeAddress: string): void {
		deleteAccountName = accountName;
		deleteStakeAddress = stakeAddress;
		deleteModal.open();
	}

	function deleteAction(): void {
		deleteModal.startWait();
		removeVerifiedAddress(deleteStakeAddress)
			.then(() => {
				pVerifiedAddresses = getVerifiedAddresses();
			})
			.catch(() => {
				errorModal.open();
			})
			.finally(() => deleteModal.close());
	}

	onMount(() => {
		pVerifiedAddresses = getVerifiedAddresses();
	});
</script>

<div class="card mb-5 mb-xl-10">
	<div class="card-header border-0">
		<div class="card-title">
			<h3 class="m-0">Verified Accounts</h3>
		</div>
		<div class="card-toolbar">
			<!--begin::Menu-->
			<button
				on:click={() => verifiedView.set({ component: AddAccount, props: {} })}
				type="button"
				class="btn btn-sm btn-color-gray-700 btn-color-primary btn-active-light-primary"
			>
				<span class="svg-icon svg-icon-2">
					<PlusIcon />
				</span>
				Verify an Account
			</button>
		</div>
	</div>

	<div class="card-body border-top p-9">
		{#await pVerifiedAddresses}
			<Skeleton height="120px" />
		{:then verifiedAddresses}
			{#if !verifiedAddresses.length}
				<div class="text-center text-muted p-10">No account has been verified yet</div>
			{/if}
			{#each verifiedAddresses as vA, i}
				{@const accountName = vA.name.length ? vA.name : `Verified account #${i}`}
				<div class="rounded bg-hover-lighten cursor-default d-flex p-2">
					<div class="flex-row-fluid">
						<div>
							<span class="text-dark fw-bolder mb-1 fs-6">{accountName}</span>
						</div>
						<div>
							<span class="d-none d-sm-block text-muted fw-bold d-block fs-7"
								>{vA.stakeAddress}</span
							>
						</div>
					</div>

					<div class="w-80px d-flex align-items-center">
						<button
							on:click={() =>
								verifiedView.set({
									component: UpdateAccount,
									props: { stakeAddress: vA.stakeAddress, currentName: accountName }
								})}
							type="button"
							tabindex="0"
							class="btn btn-sm btn-icon btn-bg-light btn-active-color-warning ms-1"
						>
							<span class="svg-icon svg-icon-2">
								<PencilIcon />
							</span>
						</button>
						<button
							on:click={() => handleDelete(accountName, vA.stakeAddress)}
							type="button"
							tabindex="0"
							class="btn btn-sm btn-icon btn-bg-light btn-active-color-danger ms-1"
						>
							<span class="svg-icon svg-icon-2">
								<TrashIcon />
							</span>
						</button>
					</div>
				</div>
			{/each}
		{:catch error}
			<div class="text-center text-danger p-10">{config.messages.failedFetch}</div>
		{/await}
	</div>
</div>

<Modal
	bind:this={deleteModal}
	action={deleteAction}
	actionBtnText="Delete"
	outClick={true}
	actionBtnClass="btn btn-danger"
	callback={() => {
		deleteAccountName = '';
		deleteStakeAddress = '';
	}}
>
	<svelte:fragment slot="title">
		<span class="text-danger">Delete Confirmation</span>
	</svelte:fragment>
	<div class="text-center" slot="body">
		<p>You are about to delete the following verified account:</p>
		<p class="text-danger fw-bolder">
			{deleteAccountName}
		</p>
	</div>
</Modal>

<Modal bind:this={errorModal} hideAction={true}>
	<svelte:fragment slot="title">
		<span class="text-danger">Server Error</span>
	</svelte:fragment>
	<p slot="body" class="text-center">
		Oops, something unexpected happened. Please try again later or contact support.
	</p>
</Modal>
