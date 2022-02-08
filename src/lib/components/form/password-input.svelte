<script lang="ts">
  import { z, ZodString } from 'zod';
  import InputError from './_validation-error.svelte';

  export let name = '';
  export let id = 'form-' + name;
  export let label: string | boolean = true;
  export let value: string;
  export let placeholder = '';
  export let error = false;
  export let schema: ZodString = z.string({
    required_error: 'Required',
    invalid_type_error: 'Must be a string'
  });

  let init = false;
  let errorMessages: string[] = [];

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
</script>

{#if label}
  <label class="form-label fs-6 fw-bolder text-dark" for="{id}">{label.length ? label : name}</label>
{/if}

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

<InputError error="{error}" errorMessages="{errorMessages}" />

<style>
  label {
    text-transform: capitalize;
  }
</style>
