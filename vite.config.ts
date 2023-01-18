import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

const config: UserConfig = {
	plugins: [sveltekit(), topLevelAwait(), wasm()],
	server: {
		port: 3000,
		strictPort: true
	},
	optimizeDeps: {
		esbuildOptions: {
			target: 'es2020'
		},
		exclude: ['lucid-cardano']
	},
	build: {
		target: 'es2020'
	}
};

export default config;
