<script lang="ts">
  import { darkMode } from '$lib/stores/session.store';
  import LogoIcon from '$lib/components/icons/logo.svelte';
  import DarkModeBtn from './_cpnt/_dark-mode-btn.svelte';
  import LogoutBtn from './_cpnt/_logout-btn.svelte';
  import CurrencyBtn from './_cpnt/_currency-btn.svelte';
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
        <Tooltip text="Dark mode">
          <DarkModeBtn />
        </Tooltip>
      </div>
      <div class="d-flex align-items-center ms-1 ms-lg-3">
        <Tooltip text="Preferred Currency">
          <CurrencyBtn />
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
