import type { SvelteComponent } from 'svelte';
import type { ViewType } from '$lib/types/view.type';

export type NavOptionType = {
  id: string;
  type: 'link' | 'view';
  view?: ViewType;
  href?: string;
  icon?: SvelteComponent;
  text: string;
};
