<script lang="ts">
  import { darkMode } from '$lib/stores/session.store';
  import WalletIcon from '$lib/components/icons/wallet.svelte';
  import LogoIcon from '$lib/components/icons/logo.svelte';
  import DarkModeBtn from './_components/_darkModeBtn.svelte';
</script>

<div class="d-flex flex-column flex-root">
  <!--begin::Page-->
  <div class="page d-flex flex-row flex-column-fluid">
    <!--begin::Wrapper-->
    <div class="wrapper d-flex flex-column flex-row-fluid" id="kt_wrapper">
      <!--begin::Header-->
      <div id="kt_header" class="header">
        <!--begin::Container-->
        <div class="container-xxl d-flex align-items-center flex-lg-stack">
          <!--begin::Brand-->
          <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-2 me-lg-5">
            <!--begin::Wrapper-->
            <div class="flex-grow-1">
              <a href="/dashboard">
                <span class="svg-icon svg-icon-3x">
                  <LogoIcon color="{$darkMode ? '#FFFFFF' : undefined}" />
                </span>
                <span class="ps-2 h1 position-relative" style="top: 5px; color: #FF2052">
                  Adastry.io
                </span>
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
      <!--end::Header-->
      <!--begin::Container-->
      <div
        id="kt_content_container"
        class="d-flex flex-column-fluid align-items-start container-xxl"
      >
        <!--begin::Post-->
        <div class="content flex-row-fluid" id="kt_content">
          <!--begin::Row-->
          <div class="row gy-0 gx-10">
            <!--begin::Col-->
            <div class="col-xl-8">
              <!--begin::General Widget 1-->
              <div class="mb-10">
                <!--begin::Tabs-->
                <ul class="nav row mb-10">
                  <li class="nav-item col-12 col-lg mb-5 mb-lg-0">
                    <a
                      class="nav-link btn btn-flex btn-color-gray-400 btn-outline btn-outline-default btn-active-danger d-flex flex-grow-1 flex-column flex-center py-5 h-1250px h-lg-175px"
                      href="#kt_general_widget_1_1"
                    >
                      <!--begin::Svg Icon | path: icons/duotune/abstract/abs027.svg-->
                      <span class="svg-icon svg-icon-3x mb-5 mx-0">
                        <WalletIcon />
                      </span>
                      <!--end::Svg Icon-->
                      <span class="fs-6 fw-bold">Wallet<br />Accounts</span>
                    </a>
                  </li>

                  <li class="nav-item col-12 col-lg mb-5 mb-lg-0">
                    <a
                      class="nav-link btn btn-flex btn-color-gray-400 btn-outline btn-outline-default btn-active-danger d-flex flex-grow-1 flex-column flex-center py-5 h-1250px h-lg-175px"
                      href="#kt_general_widget_1_5"
                    >
                      <!--begin::Svg Icon | path: icons/duotune/general/gen048.svg-->
                      <span class="svg-icon svg-icon-3x mb-5 mx-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            opacity="0.3"
                            d="M20.5543 4.37824L12.1798 2.02473C12.0626 1.99176 11.9376 1.99176 11.8203 2.02473L3.44572 4.37824C3.18118 4.45258 3 4.6807 3 4.93945V13.569C3 14.6914 3.48509 15.8404 4.4417 16.984C5.17231 17.8575 6.18314 18.7345 7.446 19.5909C9.56752 21.0295 11.6566 21.912 11.7445 21.9488C11.8258 21.9829 11.9129 22 12.0001 22C12.0872 22 12.1744 21.983 12.2557 21.9488C12.3435 21.912 14.4326 21.0295 16.5541 19.5909C17.8169 18.7345 18.8277 17.8575 19.5584 16.984C20.515 15.8404 21 14.6914 21 13.569V4.93945C21 4.6807 20.8189 4.45258 20.5543 4.37824Z"
                            fill="black"></path>
                          <path
                            d="M10.5606 11.3042L9.57283 10.3018C9.28174 10.0065 8.80522 10.0065 8.51412 10.3018C8.22897 10.5912 8.22897 11.0559 8.51412 11.3452L10.4182 13.2773C10.8099 13.6747 11.451 13.6747 11.8427 13.2773L15.4859 9.58051C15.771 9.29117 15.771 8.82648 15.4859 8.53714C15.1948 8.24176 14.7183 8.24176 14.4272 8.53714L11.7002 11.3042C11.3869 11.6221 10.874 11.6221 10.5606 11.3042Z"
                            fill="black"></path>
                        </svg>
                      </span>
                      <!--end::Svg Icon-->
                      <span class="fs-6 fw-bold"
                        >Access
                        <br />Control</span
                      >
                    </a>
                  </li>
                </ul>
              </div>
              <!--end::General Widget 1-->
            </div>
            <!--end::Col-->
            <!--begin::Col-->
            <div class="col-xl-4">
              <!--!!!!!!!!!!!!!!!Right Column !!!!!!!!!!!!!!!!-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Row-->
        </div>
        <!--end::Post-->
      </div>
      <!--end::Container-->
      <!--begin::Footer-->
      <div class="footer pb-4 d-flex flex-lg-column" id="kt_footer">
        <!--begin::Container-->
        <div
          class="container-xxl d-flex flex-column flex-md-row align-items-center justify-content-between"
        >
          <!--begin::Copyright-->
          <div class="text-dark order-2 order-md-1">
            <span class="text-muted fw-bold me-1">2022©</span>
            <a
              href="https://keenthemes.com"
              target="_blank"
              class="text-gray-800 text-hover-primary">Keenthemes</a
            >
          </div>
          <!--end::Copyright-->
          <!--begin::Menu-->
          <ul class="menu menu-gray-600 menu-hover-primary fw-bold order-1">
            <li class="menu-item">
              <a href="https://keenthemes.com" target="_blank" class="menu-link px-2">About</a>
            </li>
            <li class="menu-item">
              <a href="https://devs.keenthemes.com" target="_blank" class="menu-link px-2"
                >Support</a
              >
            </li>
            <li class="menu-item">
              <a href="https://1.envato.market/EA4JP" target="_blank" class="menu-link px-2"
                >Purchase</a
              >
            </li>
          </ul>
          <!--end::Menu-->
        </div>
        <!--end::Container-->
      </div>
      <!--end::Footer-->
    </div>
    <!--end::Wrapper-->
  </div>
  <!--end::Page-->
</div>
