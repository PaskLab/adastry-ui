<script lang="ts">
  import { getContext } from 'svelte';
  import SignInForm from './_sign-in.svelte';
  import FormSignup from './_sign-up-form.svelte';
  import NamiSignup from './_sign-up-nami.svelte';
  import LeftIcon from '$lib/components/icons/left-arrow.svelte';
  import { darkMode } from '$lib/stores/session.store';
  import NamiIcon from '$lib/components/icons/nami.svelte';
  import PencilFormIcon from '$lib/components/icons/pencil-form.svelte';

  // Component Routing
  const mainView = getContext('mainView');

  function displaySignInForm(): void {
    mainView.set(SignInForm);
  }

  function displayFormSignup(): void {
    mainView.set(FormSignup);
  }
  function displayNamiSignup(): void {
    mainView.set(NamiSignup);
  }
</script>

<div class="mb-8">
  <button
    type="button"
    on:click="{displaySignInForm}"
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

<div class="mb-10 text-center">
  <h1 class="text-dark mb-10">Sign-Up your way</h1>

  <div class="mb-5">
    <button
      type="button"
      on:click="{displayFormSignup}"
      class="btn btn-flex flex-center btn-primary w-100"
    >
      <span class="svg-icon svg-icon-2x"><PencilFormIcon /></span>
      <span class="d-flex flex-column align-items-start ms-2 min-w-125px">
        <span class="fs-3 fw-bolder">Classic Form</span>
        <span class="fs-7">Fill the form</span>
      </span>
    </button>
  </div>

  <div class="mb-5">
    <button
      type="button"
      on:click="{displayNamiSignup}"
      class="btn btn-flex flex-center btn-info w-100"
    >
      <span class="svg-icon svg-icon-2x"><NamiIcon /></span>
      <span class="d-flex flex-column align-items-start ms-2 min-w-125px">
        <span class="fs-3 fw-bolder">Nami Wallet</span>
        <span class="fs-7">Ownership proof</span>
      </span>
    </button>
  </div>
</div>
