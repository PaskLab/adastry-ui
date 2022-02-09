<script lang="ts">
  import { assets } from '$app/paths';
  import SignInForm from './auth/_sign-in.svelte';
  import { setContext, getContext } from 'svelte';
  import { writable, Writable } from 'svelte/store';

  // Component Routing
  let selectedForm: typeof SignInForm;

  setContext('selectedForm', writable(SignInForm));
  getContext<Writable<typeof SignInForm>>('selectedForm').subscribe((v) => (selectedForm = v));
</script>

<div class="d-flex flex-column flex-root">
  <!--begin::Authentication - Sign-in -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Aside-->
    <div
      class="d-flex flex-column flex-lg-row-auto w-xl-600px positon-xl-relative"
      style="background-color: #F2C98A"
    >
      <!--begin::Wrapper-->
      <div class="d-flex flex-column position-xl-fixed top-0 bottom-0 w-xl-600px scroll-y">
        <!--begin::Content-->
        <div class="d-flex flex-row-fluid flex-column text-center p-10 pt-lg-20">
          <!--begin::Logo-->
          <a href="/" class="py-9 mb-5">
            <img alt="Logo" src="{assets}/img/svg/logo/google-icon.svg" class="h-60px" />
          </a>
          <!--end::Logo-->
          <!--begin::Title-->
          <h1 class="fw-bolder fs-2qx pb-5 pb-md-10" style="color: #986923;">Welcome to Adastry</h1>
          <!--end::Title-->
          <!--begin::Description-->
          <p class="fw-bold fs-2" style="color: #986923;">Take control over your data</p>
          <p class="fw-bold fs-2" style="color: #986923;">Track your Cardano Rewards</p>
          <!--end::Description-->
        </div>
        <!--end::Content-->
        <!--begin::Illustration-->
        <div
          class="d-flex flex-row-auto bgi-no-repeat bgi-position-x-center bgi-size-contain bgi-position-y-bottom min-h-100px min-h-lg-350px"
          style="background-image: url({assets}/img/illustrations/13.png)"
        ></div>
        <!--end::Illustration-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Aside-->
    <!--begin::Body-->
    <div class="d-flex flex-column flex-lg-row-fluid py-10">
      <!--begin::Content-->
      <div class="d-flex flex-center flex-column flex-column-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10 p-lg-15 mx-auto">
          <svelte:component this="{selectedForm}" />
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Content-->
      <!--begin::Footer-->
      <div class="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
        <!--begin::Links-->
        <div class="d-flex flex-center fw-bold fs-6">
          <a
            href="https://keenthemes.com"
            class="text-muted text-hover-primary px-2"
            target="_blank"
          >
            About
          </a>
          <a
            href="https://1.envato.market/EA4JP"
            class="text-muted text-hover-primary px-2"
            target="_blank"
          >
            Pricing
          </a>
          <a
            href="https://1.envato.market/EA4JP"
            class="text-muted text-hover-primary px-2"
            target="_blank"
          >
            Privacy
          </a>
          <a
            href="https://devs.keenthemes.com"
            class="text-muted text-hover-primary px-2"
            target="_blank"
          >
            Terms & Conditions
          </a>
        </div>
        <!--end::Links-->
      </div>
      <!--end::Footer-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Authentication - Sign-in-->
</div>
