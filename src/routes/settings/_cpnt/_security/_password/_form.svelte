<script lang="ts">
  import { z, ZodLiteral } from 'zod';
  import TextInput from '$lib/components/form/text-input.svelte';
  import ActionButton from '$lib/components/global/action-button.svelte';
  import CreatePasswordInput from '$lib/components/form/create-password.svelte';
  import PasswordInput from '$lib/components/form/password-input.svelte';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import { getContext } from 'svelte';
  import PasswordSignature from './_signature.svelte';
  import type { UpdateUserType } from '$lib/api/types/update-user.type';
  import type { Writable } from 'svelte/store';
  import type { ViewType } from '$lib/types/view.type';

  // Routing
  let passwordView = getContext<Writable<ViewType>>('passwordView');

  // Save profile handler
  export let saveProfile: (
    updateObj: UpdateUserType,
    validatedFields: boolean[],
    waitHandler: (enable: boolean) => void,
  ) => void;

  // Form password
  let oldPassword = '';
  let oldPasswordField: typeof TextInput;
  let newPassword = '';
  let newPasswordField: typeof TextInput;
  let confirmPassword: string;
  let confirmField: typeof TextInput;
  let confirmSchema: ZodLiteral<string>;
  let waitPassword = false;

  $: confirmSchema = z.literal(newPassword, {
    invalid_type_error: "Passwords don't match",
    required_error: 'Required',
  });

  // Clear confirmPassword on password change
  $: confirmPassword = newPassword ? '' : '';

  function savePassword(): void {
    saveProfile(
      { oldPassword: oldPassword.trim(), newPassword: newPassword.trim() },
      [oldPasswordField.validate(), newPasswordField.validate(), confirmField.validate()],
      (enable: boolean) => (waitPassword = enable),
    );
  }
</script>

<div class="card mb-5 mb-xl-10">
  <div class="card-header border-0">
    <div class="card-title">
      <h3 class="m-0">Change Password</h3>
    </div>
  </div>

  <div class="card-body border-top p-9">
    <div class="row mb-6">
      <label class="col-lg-4 col-form-label required fw-bold fs-6" for="form-oldPassword"
        >Password</label
      >
      <div class="col-lg-8 fv-row fv-plugins-icon-container">
        <div class="form-text mb-5">
          <strong>Caution:</strong> This will change your login credentials.
        </div>
        <p>
          <PasswordInput
            bind:this="{oldPasswordField}"
            bind:value="{oldPassword}"
            name="oldPassword"
            label="Old Password"
            schema="{z.string().nonempty('Required')}"
          />
        </p>
        <p>
          <CreatePasswordInput
            bind:this="{newPasswordField}"
            bind:value="{newPassword}"
            name="newPassword"
            label="New Password"
          />
        </p>
        <p>
          <PasswordInput
            bind:this="{confirmField}"
            bind:value="{confirmPassword}"
            name="confirm-password"
            label="Confirm new Password"
            schema="{confirmSchema}"
          />
        </p>
        <div class="text-center text-muted text-uppercase fw-bolder my-10">or</div>
        <div class="text-center">
          <button
            on:click="{() =>
              passwordView.set({
                component: PasswordSignature,
                props: { saveProfile: saveProfile },
              })}"
            type="button"
            class="btn btn-lg btn-warning w-250px py-5 mb-10"
          >
            <span class="svg-icon svg-icon-2 position-relative" style="top: -1px;">
              <WalletIcon />
            </span>
            Reset with Signature
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="card-footer d-flex justify-content-end py-6 px-9">
    <ActionButton type="button" text="Save Changes" action="{savePassword}" wait="{waitPassword}" />
  </div>
</div>
