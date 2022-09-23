<script lang="ts">
  import type { SvelteComponent } from 'svelte';
  import { getContext } from 'svelte';

  type NavOptions = {
    id: string;
    component: typeof SvelteComponent;
    icon: typeof SvelteComponent;
    text: string;
  };

  export let options: NavOptions[];
  export let active = options[0].id;
  let mainView = getContext('mainView');

  function handleClick(option: NavOptions) {
    if (active != option.id) active = option.id;
    mainView.set(option.component);
  }
</script>

<div class="mb-10">
  <ul class="nav row mb-10">
    {#each options as option}
      <li class="nav-item col-12 col-lg mb-5 mb-lg-0">
        <div
          tabindex="0"
          on:click="{() => handleClick(option)}"
          on:keypress|preventDefault="{() => handleClick(option)}"
          class="{option.id === active
            ? 'active cursor-default'
            : ''} nav-link btn btn-flex btn-color-gray-400 btn-outline btn-outline-default d-flex flex-grow-1 flex-column flex-center py-5 h-1250px h-lg-175px"
        >
          <!--begin::Svg Icon | path: icons/duotune/abstract/abs027.svg-->
          <span class="svg-icon svg-icon-3x mb-5 mx-0">
            <svelte:component this="{option.icon}" />
          </span>
          <!--end::Svg Icon-->
          <span class="fs-6 fw-bold">{@html option.text}</span>
        </div>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .nav-link {
    &:hover,
    &.active {
      color: #fff;
      background: #7cb342;
      border-color: #7cb342;
      :global(svg path) {
        fill: #fff !important;
      }
    }
  }
</style>
