<script lang="ts">
  import { darkMode } from '$lib/stores/session.store';
  import HomeIcon from '$lib/components/icons/home.svelte';
  import CartIcon from '$lib/components/icons/cart.svelte';
  import LogoIcon from '$lib/components/icons/logo.svelte';
  import DarkModeBtn from './cpnt/dark-mode-btn.svelte';
  import CogIcon from '$lib/components/icons/cog.svelte';
  import LogoutBtn from './cpnt/logout-btn.svelte';
  import CurrencyBtn from './cpnt/currency-btn.svelte';
  import config from '$lib/config.json';
  import { getURL } from '$lib/utils/api.utils';
  import Tooltip from '$lib/components/global/tooltip.svelte';
</script>

<div class="header">
  <div class="container-xxl d-flex align-items-center flex-lg-stack">
    <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-2 me-lg-5">
      <div class="flex-grow-1">
        <a href="{getURL(config.routing.dashboard)}">
          <span class="svg-icon svg-icon-3x">
            <LogoIcon color="{$darkMode ? '#FFFFFF' : '#757570'}" />
          </span>
          <span class="brand-link ps-2 h1 position-relative"> Adastry.io </span>
        </a>
      </div>
    </div>
    <div class="d-flex align-items-stretch flex-shrink-0">
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="Home">
          <a
            href="/dashboard"
            class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
          >
            <span class="svg-icon svg-icon-2x">
              <HomeIcon />
            </span>
          </a>
        </Tooltip>
      </div>
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="Subscriptions">
          <a
            href="/subscriptions"
            class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
          >
            <span class="svg-icon svg-icon-2x">
              <CartIcon />
            </span>
          </a>
        </Tooltip>
      </div>
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="User Settings">
          <a
            href="/settings"
            class="btn btn-color-gray-800 btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px"
          >
            <span class="svg-icon svg-icon-2x">
              <CogIcon />
            </span>
          </a>
        </Tooltip>
      </div>
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="Preferred Currency">
          <CurrencyBtn />
        </Tooltip>
      </div>
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="Dark mode">
          <DarkModeBtn />
        </Tooltip>
      </div>
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="Logout">
          <LogoutBtn />
        </Tooltip>
      </div>
    </div>
  </div>
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
