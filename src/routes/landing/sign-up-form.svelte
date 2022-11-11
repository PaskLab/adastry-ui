<script lang="ts">
	import { z, ZodLiteral } from 'zod';
	import { getContext } from 'svelte';
	import SignInForm from './sign-in.svelte';
	import TextInput from '$lib/components/form/text-input.svelte';
	import CreatePasswordInput from '$lib/components/form/create-password.svelte';
	import PasswordInput from '$lib/components/form/password-input.svelte';
	import SubmitBtn from '$lib/components/global/action-button.svelte';
	import LeftIcon from '$lib/components/icons/left-arrow.svelte';
	import Checkbox from '$lib/components/form/checkbox.svelte';
	import Modal from '$lib/components/global/modal.svelte';
	import { create } from '$lib/api/user';
	import { darkMode } from '$lib/stores/session.store';
	import type { ErrorModalBodyType } from '../../lib/types/error-modal-body.type';

	// Component Routing
	const mainView = getContext('mainView');
	function displaySignInForm(): void {
		mainView.set(SignInForm);
	}

	// Form
	let usernameField: typeof TextInput;
	let username = '';
	let nameField: typeof TextInput;
	let name = '';
	let passwordField: typeof CreatePasswordInput;
	let password = '';
	let confirmPasswordField: typeof PasswordInput;
	let confirmPassword: string;
	let acceptTermsField: typeof Checkbox;
	let confirmSchema: ZodLiteral<string>;

	const cpErrorMap: z.ZodErrorMap = (issue, ctx) => {
		if (typeof ctx.data === 'undefined') {
			return { message: 'Required' };
		}
		return { message: "Passwords don't match" };
	};

	const atErrorMap: z.ZodErrorMap = (issue, ctx) => {
		if (typeof ctx.data === 'undefined') {
			return { message: 'Required' };
		}
		return { message: 'You need to accept the Terms & Conditions' };
	};

	$: confirmSchema = z.literal(password, { errorMap: cpErrorMap });

	// Clear confirmPassword on password change
	$: confirmPassword = password ? '' : '';

	// Modals
	let wait = false;
	let successModal: typeof Modal;
	let errorModal: typeof Modal;
	let errorModalBody: ErrorModalBodyType;
	let internalErrorModal: typeof Modal;

	function submit(): void {
		const fields = [
			usernameField.validate(),
			nameField.validate(),
			passwordField.validate(),
			confirmPasswordField.validate(),
			acceptTermsField.validate()
		];
		if (fields.every((field) => field)) {
			wait = true;
			create(username.trim(), password.trim(), name.trim())
				.then((res) => {
					if ([200, 201].includes(res.statusCode)) {
						successModal.open();
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
					internalErrorModal.open();
				});
		}
	}
</script>

<div class="mb-8">
	<button
		type="button"
		on:click={displaySignInForm}
		class="btn btn-sm btn-active-light-primary fw-bolder fs-6 {$darkMode
			? 'btn-color-white'
			: 'btn-color-gray-700'} position-relative"
		style="right: 20px;"
	>
		<span class="svg-icon svg-icon-muted svg-icon-2hx">
			<LeftIcon />
		</span>
		Back to sign-in
	</button>
</div>

<form class="form w-100" novalidate="novalidate">
	<div class="mb-10 text-center">
		<h1 class="text-dark mb-3">Create an Account</h1>
	</div>

	<div class="row fv-row mb-7">
		<div class="col-xl-6">
			<TextInput
				bind:this={usernameField}
				name="username"
				bind:value={username}
				schema={z.string().nonempty()}
				customClass="form-control-lg form-control-solid"
			/>
		</div>
		<div class="col-xl-6">
			<TextInput
				bind:this={nameField}
				name="name"
				placeholder="*Optional*"
				bind:value={name}
				schema={z.string().optional()}
				customClass="form-control-lg form-control-solid"
			/>
		</div>
	</div>
	<div class="fv-row mb-5">
		<CreatePasswordInput
			bind:this={passwordField}
			name="password"
			bind:value={password}
			customClass="form-control-lg form-control-solid"
		/>
	</div>
	<div class="fv-row mb-5">
		<PasswordInput
			bind:this={confirmPasswordField}
			name="confirm-password"
			label="Confirm Password"
			bind:value={confirmPassword}
			schema={confirmSchema}
			customClass="form-control-lg form-control-solid"
		/>
	</div>
	<div class="fv-row mb-10">
		<Checkbox bind:this={acceptTermsField} schema={z.literal(true, { errorMap: atErrorMap })}>
			<span
				class="form-check-label fw-bold {$darkMode ? 'btn-color-white' : 'btn-color-gray-700'} fs-6"
			>
				I Agree to the
				<a href="/terms-and-conditions" target="_blank" class="ms-1 link-primary"
					>Terms and conditions</a
				>.
			</span>
		</Checkbox>
	</div>

	<div class="text-center">
		<SubmitBtn
			type="submit"
			text="Create an account"
			action={submit}
			{wait}
			customClass="btn btn-primary btn-lg btn-primary w-100 mb-5"
		/>
	</div>
</form>

<Modal
	bind:this={successModal}
	hideClose={true}
	actionBtnText="Continue"
	callback={() => (location.href = '/')}
>
	<svelte:fragment slot="title">Account successfully created!</svelte:fragment>
	<p slot="body" class="text-center">
		User <strong>{username}</strong> successfully created!
		<br />
		You will be redirected to the login screen.
	</p>
</Modal>

<Modal
	bind:this={errorModal}
	hideAction={true}
	outClick={true}
	callback={() => (errorModalBody = undefined)}
>
	<svelte:fragment slot="title"
		><span class="text-danger">Failed to create account</span></svelte:fragment
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
			Account creation failed. Please try again or contact support.
		{/if}
	</div>
</Modal>

<Modal bind:this={internalErrorModal} hideAction={true}>
	<svelte:fragment slot="title"><span class="text-danger">Server Error</span></svelte:fragment>
	<p slot="body" class="text-center">
		Oops, something unexpected happened. Please try again later or contact support.
	</p>
</Modal>

<style lang="scss">
	.modal-error-message:first-letter {
		text-transform: capitalize;
	}
</style>
