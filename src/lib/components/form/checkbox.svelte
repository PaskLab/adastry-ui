<script lang="ts">
  import { z, ZodBoolean, ZodNullable } from 'zod';
  import InputError from './_validation-error.svelte';

  export let name = '';
  export let id = 'form-' + name;
  export let label: string | boolean = true;
  export let checked: boolean;
  export let error = false;
  export let schema: ZodNullable<ZodBoolean> = z.boolean().nullable();

  let init = false;
  let errorMessages: string[] = [];

  function initValidation(): void {
    init = true;
  }

  export function validate(): boolean {
    let result = schema.safeParse(checked);

    error = !result.success;
    errorMessages = [];

    if (!result.success) {
      errorMessages = result.error.issues.map((issue) => issue.message);
    }

    return result.success;
  }

  $: if (init) {
    checked = checked;
    validate();
  }
</script>

<label class="form-check form-check-custom form-check-solid form-check-inline">
  <input
    on:focusout="{initValidation}"
    id="{id}"
    class="form-check-input"
    type="checkbox"
    name="{name}"
    bind:checked
  />
  <slot>{label && label.length ? label : name}</slot>
</label>

<InputError error="{error}" errorMessages="{errorMessages}" />

<style>
  label:first-letter {
    text-transform: capitalize;
  }
</style>
