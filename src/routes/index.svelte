<script lang="ts">
  import Aside from './landing/_aside.svelte';
  import Footer from './landing/_footer.svelte';
  import SignInForm from './landing/_sign-in.svelte';
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import type { SvelteComponent } from 'svelte';
  import type { Writable } from 'svelte/store';

  // Component Routing
  let mainView: typeof SvelteComponent;

  setContext('mainView', writable<typeof SvelteComponent>(SignInForm));
  getContext<Writable<typeof SvelteComponent>>('mainView').subscribe((v) => (mainView = v));
</script>

<div class="d-flex flex-column flex-root">
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <Aside />
    <div class="d-flex flex-column flex-lg-row-fluid py-10 landing-bg">
      <div class="d-flex flex-center flex-column flex-column-fluid">
        <div class="w-lg-500px p-10 p-lg-15 mx-auto">
          <svelte:component this="{mainView}" />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</div>

<style lang="scss">
  :global(.dark-mode) .landing-bg {
    background-color: #0b0d17;
  }
</style>
