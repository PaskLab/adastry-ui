import type { SvelteComponent } from 'svelte';

export type ViewType = {
  component: typeof SvelteComponent;
  props: { [key: string]: any };
};
