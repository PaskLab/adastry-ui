<script lang="ts">
  import { assets } from '$app/paths';
  import Logo from '$lib/components/icons/logo.svelte';
  import BerryLogo from '$lib/components/icons/berry-pool.svelte';
</script>

<!--313140-->
<div
  class="d-flex flex-column flex-lg-row-auto w-xl-600px positon-xl-relative"
  style="background-color: #121523"
>
  <div class="d-flex flex-column position-xl-fixed top-0 bottom-0 w-xl-600px scroll-y">
    <div class="d-flex flex-row-fluid flex-column text-center p-10 pt-lg-20">
      <a href="/" class="py-9 mb-5">
        <span id="main-logo" class="svg-icon">
          <Logo color="#fff" />
        </span>
      </a>
      <h1 class="fw-bolder fs-2qx pb-5 pb-md-10" style="color: #fff;">
        <div><span class="beta">Beta</span></div>
        Welcome to Adastry
      </h1>
      <p class="fw-bold fs-3" style="color: #ececec;">Take control over your data</p>
      <p class="fw-bold fs-6" style="color: #8f8f8f;">View - Monitor - Export</p>
      <p class="fw-bold fs-3" style="color: #ececec;">A tracking tool for Cardano</p>
    </div>
    <div class="d-flex d-none d-lg-block flex-row-auto p-10 text-center text-white">
      <p class="fs-5">
        Brought to you by <a href="https://berrypool.io/" target="_blank">Berry Pool</a> &
        <a href="https://armada-alliance.com/" target="_blank">Armada Alliance</a>
      </p>
      <p>
        <span class="svg-icon svg-icon-5x px-1 opacity-hover">
          <a href="https://berrypool.io/" target="_blank">
            <BerryLogo />
          </a>
        </span>
        <a href="https://armada-alliance.com/" target="_blank">
          <img
            class="px-1 opacity-hover"
            src="{assets}/img/animation/ship.webp"
            alt="Armada Alliance Logo"
            height="65"
            style="position: relative; top: 5px;"
          />
        </a>
      </p>
      <p class="mt-10">
        Built with <span class="fs-2 position-relative" style="top: 3px">❤</span> by
        <a href="https://twitter.com/PaskLab" target="_blank">PaskLab</a>
      </p>
    </div>
  </div>
</div>

<style>
  #main-logo :global(svg) {
    height: 140px;
    width: 140px;
  }

  .opacity-hover:hover {
    opacity: 0.5;
    transition: opacity 0.4s ease;
  }

  .beta {
    position: relative;
    left: 122px;
    top: 10px;
    color: #7cb342;
    font-size: calc(0.8rem + 1.2vw) !important;
  }
</style>
