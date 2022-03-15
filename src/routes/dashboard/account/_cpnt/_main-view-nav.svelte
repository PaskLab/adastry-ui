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

<ul class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder">
  {#each options as option}
    <li class="nav-item">
      <div
        on:click="{() => handleClick(option)}"
        on:keypress|preventDefault="{() => handleClick(option)}"
        class="nav-link text-active-primary py-5 me-6 {option.id === active
          ? 'active cursor-default'
          : 'cursor-pointer'}"
      >
        {option.text}
      </div>
    </li>
  {/each}
</ul>
