<script lang="ts">
  import CrossIcon from '../icons/cross.svelte';

  export let isOpen = false;
  export let backdrop = true;
  export let action = close;
  export let callback: () => void;
  export let actionBtnText = 'Confirm';
  export let closeBtnText = 'Close';
  export let hideClose = false;
  export let hideAction = false;
  export let outClick = false;

  export function open(): void {
    isOpen = true;
  }

  export function close(): void {
    isOpen = false;
    if (callback) callback();
  }

  function handleOutClick() {
    if (outClick) {
      close();
    }
  }

  function handleEsc(event): void {
    if (event.key === 'Escape') {
      close();
    }
  }
</script>

<svelte:window on:keydown="{handleEsc}" />

<div
  on:click|stopPropagation="{handleOutClick}"
  class="modal fade {isOpen ? 'show' : ''}"
  tabindex="-1"
>
  <div on:click|stopPropagation class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">
          <slot name="title" />
        </h3>

        <!--begin::Close-->
        <div
          on:click="{close}"
          class="btn btn-icon btn-sm btn-active-light-primary ms-2"
          aria-label="Close"
        >
          <span class="svg-icon svg-icon-2x">
            <CrossIcon />
          </span>
        </div>
        <!--end::Close-->
      </div>

      <div class="modal-body">
        <slot name="body" />
      </div>

      <div class="modal-footer">
        {#if !hideClose}
          <button on:click="{close}" type="button" class="btn btn-light">{closeBtnText}</button>
        {/if}
        {#if !hideAction}
          <button on:click="{action}" type="button" class="btn btn-primary">{actionBtnText}</button>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if isOpen}
  <div class="modal-backdrop fade {backdrop ? 'show' : ''}"></div>
{/if}

<style>
  .show {
    display: block !important;
  }
  .modal-body {
    font-size: 16px;
  }
  .modal-body,
  .modal-title {
    color: #5e6278;
  }
</style>
