<script lang="ts">
  import { z, ZodString } from 'zod';
  import InputError from './_validation-error.svelte';

  export let name = '';
  export let id = 'form-' + name;
  export let label: string | boolean = true;
  export let value: string | undefined = undefined;
  export let placeholder = '';
  export let error = false;
  export let schema: ZodString = z
    .string()
    .regex(
      new RegExp('((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$'),
      'Passwords must contain at least: 1 upper case letter, 1 lower case letter, 1 number or special character'
    )
    .min(8);

  let hidden = true;
  let init = false;
  let errorMessages: string[] = [];
  let indToDisplay = 0;

  function initValidation(): void {
    init = true;
  }

  export function validate(): boolean {
    let result = schema.safeParse(value);

    error = !result.success;
    errorMessages = [];

    if (!result.success) {
      errorMessages = result.error.issues.map((issue) => issue.message);
    }

    return result.success;
  }

  $: if (init) {
    value = value;
    validate();
  }

  function toggleHidden() {
    hidden = !hidden;
  }

  function handleIndicator(value) {
    const rule1 = new RegExp('[a-z]+');
    const rule2 = new RegExp('[A-Z]+');
    const rule3 = new RegExp('((?=.*\\d)|(?=.*\\W+))(?![.\\n])');
    const rule4 = new RegExp('.{8,}');

    indToDisplay = 0;

    if (rule1.test(value)) indToDisplay++;
    if (rule2.test(value)) indToDisplay++;
    if (rule3.test(value)) indToDisplay++;
    if (rule4.test(value)) indToDisplay++;
  }

  $: handleIndicator(value);
</script>

{#if label}
  <label class="form-label fs-6 fw-bolder text-dark" for="{id}">{label.length ? label : name}</label
  >
{/if}

<div class="position-relative mb-3">
  {#if hidden}
    <input
      id="{id}"
      class="form-control form-control-lg form-control-solid {error
        ? 'is-invalid'
        : init && value.length
        ? 'is-valid'
        : ''}"
      type="password"
      name="{name}"
      placeholder="{placeholder}"
      autocomplete="off"
      on:focusout|once="{initValidation}"
      bind:value
    />
  {:else}
    <input
      id="{id}"
      class="form-control form-control-lg form-control-solid {error
        ? 'is-invalid'
        : init && value.length
        ? 'is-valid'
        : ''}"
      type="text"
      name="{name}"
      placeholder="{placeholder}"
      autocomplete="off"
      on:focusout|once="{initValidation}"
      bind:value
    />
  {/if}
  <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
    {#if hidden}
      <i on:mousedown="{toggleHidden}" class="bi bi-eye fs-2"></i>
    {:else}
      <i on:mousedown="{toggleHidden}" class="bi bi-eye-slash fs-2"></i>
    {/if}
  </span>
</div>

<div class="d-flex align-items-center mb-3">
  <div
    class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2 {indToDisplay > 0
      ? 'active'
      : ''}"
  ></div>
  <div
    class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2 {indToDisplay > 1
      ? 'active'
      : ''}"
  ></div>
  <div
    class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2 {indToDisplay > 2
      ? 'active'
      : ''}"
  ></div>
  <div
    class="flex-grow-1 bg-secondary bg-active-success rounded h-5px {indToDisplay > 3
      ? 'active'
      : ''}"
  ></div>
</div>

{#if error}
  <InputError error="{error}" errorMessages="{errorMessages}" />
{:else}
  <div class="text-muted">
    Use 8 or more characters with a mix of upper & lowercase letters, numbers or symbols.
  </div>
{/if}

<style>
  label:first-letter {
    text-transform: capitalize;
  }

  .is-invalid,
  .is-valid {
    background-position: right calc(2.375em + 0.375rem) center !important;
  }
</style>
