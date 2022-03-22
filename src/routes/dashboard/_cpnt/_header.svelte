<script lang="ts">
  import { darkMode } from '$lib/stores/session.store';
  import LogoIcon from '$lib/components/icons/logo.svelte';
  import DarkModeBtn from './_dark-mode-btn.svelte';
</script>

<div class="header">
  <!--begin::Container-->
  <div class="container-xxl d-flex align-items-center flex-lg-stack">
    <!--begin::Brand-->
    <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-2 me-lg-5">
      <!--begin::Wrapper-->
      <div class="flex-grow-1">
        <a href="/dashboard">
          <span class="svg-icon svg-icon-3x">
            <LogoIcon color="{$darkMode ? '#FFFFFF' : '#757570'}" />
          </span>
          <span class="brand-link ps-2 h1 position-relative"> Adastry.io </span>
        </a>
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Brand-->
    <!--begin::Toolbar wrapper-->
    <div class="d-flex align-items-stretch flex-shrink-0">
      <!--begin::Theme mode-->
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <!--begin::Theme mode docs-->
        <DarkModeBtn />
        <!--end::Theme mode docs-->
      </div>
      <!--end::Theme mode-->
      <!--begin::User menu-->
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <!--begin::Menu wrapper-->
        <div
          class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px position-relative btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
        >
          <!--begin::Svg Icon | path: icons/duotune/communication/com013.svg-->
          <span class="svg-icon svg-icon-2x">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6.28548 15.0861C7.34369 13.1814 9.35142 12 11.5304 12H12.4696C14.6486 12 16.6563 13.1814 17.7145 15.0861L19.3493 18.0287C20.0899 19.3618 19.1259 21 17.601 21H6.39903C4.87406 21 3.91012 19.3618 4.65071 18.0287L6.28548 15.0861Z"
                fill="black"></path>
              <rect opacity="0.3" x="8" y="3" width="8" height="8" rx="4" fill="black"></rect>
            </svg>
          </span>
          <!--end::Svg Icon-->
        </div>

        <!--end::Menu wrapper-->
      </div>
      <!--end::User menu-->
    </div>
    <!--end::Toolbar wrapper-->
  </div>
  <!--end::Container-->
</div>

<style lang="scss">
  .brand-link {
    top: 5px;
    color: #757570;
  }
  :global(.dark-mode) .brand-link {
    color: #fff;
  }
</style>
