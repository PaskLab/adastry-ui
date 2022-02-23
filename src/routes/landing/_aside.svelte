<script lang="ts">
  import { assets } from '$app/paths';
  import Logo from '$lib/components/icons/logo.svelte';
</script>

<div
  class="d-flex flex-column flex-lg-row-auto w-xl-600px positon-xl-relative"
  style="background-color: #F2C98A"
>
  <div class="d-flex flex-column position-xl-fixed top-0 bottom-0 w-xl-600px scroll-y">
    <div class="d-flex flex-row-fluid flex-column text-center p-10 pt-lg-20">
      <a href="/" class="py-9 mb-5">
        <span id="main-logo" class="svg-icon">
          <Logo color="#fde1b4" />
        </span>
      </a>
      <h1 class="fw-bolder fs-2qx pb-5 pb-md-10" style="color: #986923;">Welcome to Adastry</h1>
      <p class="fw-bold fs-2" style="color: #986923;">Take control over your data</p>
      <p class="fw-bold fs-2" style="color: #986923;">Track your Cardano Rewards</p>
    </div>
    <div
      class="d-flex d-none d-lg-block flex-row-auto bgi-no-repeat bgi-position-x-center bgi-size-contain bgi-position-y-bottom min-h-100px min-h-lg-350px"
      style="background-image: url({assets}/img/illustrations/13.png)"
    ></div>
  </div>
</div>

<style>
  #main-logo :global(svg) {
    height: 140px;
    width: 140px;
  }
</style>
