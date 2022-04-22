<script lang="ts">
  import CrossIcon from '$lib/components/icons/cross.svelte';
  import ActionBtn from '$lib/components/global/action-button.svelte';

  export let isOpen = false;
  export let backdrop = true;
  export let action = close; // Customizable action. Modal must be close explicitly
  export let callback = () => undefined; // Always called on modal close
  export let actionBtnText = 'Confirm';
  export let actionBtnClass = 'btn btn-primary';
  export let closeBtnText = 'Close';
  export let hideClose = false;
  export let hideAction = false;
  export let outClick = false;
  let wait = false;
  let footer;

  export function open(): void {
    isOpen = true;
    footer.focus();
  }

  export function close(): void {
    wait = false;
    isOpen = false;
    if (callback) callback();
  }

  export function startWait(): void {
    wait = true;
  }

  export function stopWait(): void {
    wait = false;
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

      <div class="modal-footer" bind:this="{footer}">
        {#if !hideClose}
          <button on:click="{close}" type="button" class="btn btn-light">{closeBtnText}</button>
        {/if}
        {#if !hideAction}
          <ActionBtn
            text="{actionBtnText}"
            action="{action}"
            wait="{wait}"
            customClass="{actionBtnClass}"
          />
        {/if}
      </div>
    </div>
  </div>
</div>

{#if isOpen}
  <div class="modal-backdrop fade {backdrop ? 'show' : ''}"></div>
{/if}

<style lang="scss">
  .show {
    display: block !important;
  }
  .modal-body {
    font-size: 16px;
    overflow-x: scroll;

    :global(p:first-letter) {
      text-transform: capitalize;
    }
  }
  .modal-body,
  .modal-title {
    color: #5e6278;
  }
</style>
