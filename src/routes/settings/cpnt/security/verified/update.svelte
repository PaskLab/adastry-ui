<script lang="ts">
	import { z } from 'zod';
	import BackArrow from '$lib/components/icons/back-arrow.svelte';
	import { getContext } from 'svelte';
	import AccountList from './list.svelte';
	import ActionBtn from '$lib/components/global/action-button.svelte';
	import Modal from '$lib/components/global/modal.svelte';
	import TextInput from '$lib/components/form/text-input.svelte';
	import { updateVerifiedAddress } from '$lib/api/user';
	import type { Writable } from 'svelte/store';
	import type { ViewType } from '$lib/types/view.type';

	export let stakeAddress = '';
	export let currentName = '';

	// Routing
	let verifiedView = getContext<Writable<ViewType>>('verifiedView');

	// Form
	let nameField: typeof TextInput;
	let name = currentName;
	let wait = false;
	let errorModal: typeof Modal;
	let errorModalBody: { statusCode: number; message: string; error: string };

	function submit(): void {
		const fields = [nameField.validate()];
		if (fields.every((field) => field)) {
			wait = true;
			updateVerifiedAddress(stakeAddress, name.trim())
				.then((res) => {
					if ([200, 201].includes(res.statusCode)) {
						verifiedView.set({ component: AccountList, props: {} });
					} else {
						wait = false;
						if (res.statusCode && res.error) {
							errorModalBody = {
								statusCode: res.statusCode,
								message: res.message,
								error: res.error
							};
						}
						errorModal.open();
					}
				})
				.catch(() => {
					wait = false;
					errorModal.open();
				});
		}
	}
</script>

<div class="card mb-5 mb-xl-10">
	<div class="card-header border-0">
		<div class="card-title">
			<h3 class="m-0">Rename {currentName}</h3>
		</div>
		<div class="card-toolbar">
			<!--begin::Menu-->
			<button
				on:click={() => verifiedView.set({ component: AccountList, props: {} })}
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

	<div class="card-body border-top p-9">
		<div class="offset-md-3 col-md-6">
			<form class="form" novalidate="novalidate">
				<div class="my-10">
					<TextInput
						bind:this={nameField}
						bind:value={name}
						name="name"
						label="New account Name"
						placeholder="My verified account name"
						schema={z.string().nonempty()}
					/>
				</div>

				<div class="mb-10 text-center">
					<ActionBtn type="submit" text="Save" action={submit} {wait} />
				</div>
			</form>
		</div>
	</div>
</div>

<Modal
	bind:this={errorModal}
	hideAction={true}
	outClick={true}
	callback={() => (errorModalBody = undefined)}
>
	<svelte:fragment slot="title"
		><span class="text-danger">Failed to update account</span></svelte:fragment
	>
	<div slot="body" class="text-center modal-error-message" style="overflow-wrap: break-word">
		{#if errorModalBody}
			{#if typeof errorModalBody.message !== 'string' && errorModalBody.message.length}
				{#each errorModalBody.message as message}
					<p>{message}</p>
				{/each}
			{:else}
				{errorModalBody.message}
			{/if}
			{#if errorModalBody.statusCode && errorModalBody.error}
				<p class="mt-5 text-muted mb-0">
					<em>Code: {errorModalBody.statusCode} - {errorModalBody.error}</em>
				</p>
			{/if}
		{:else}
			Account update failed. Please try again or contact support.
		{/if}
	</div>
</Modal>

<style lang="scss">
	.modal-error-message:first-letter {
		text-transform: capitalize;
	}
</style>
