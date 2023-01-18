# Adastry UI

[Adastry.io](https://adastry.io) official UI project.

The project is based on SvelteKit and act as a client interface to the Adastry API.

The project is open source to provide guideline and learning material.

## Building

To create a production version of your app:

```bash
npm run build
```

### Dev Notes

#### WebAssembly & Top level await support

Required to support Cardano Lucid library.
Install `vite-plugin-wasm` and `vite-plugin-top-level-await` listed in resources bellow.

``` typescript
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

const config: UserConfig = {
	plugins: [sveltekit(), topLevelAwait(), wasm()],
	optimizeDeps: {
		esbuildOptions: {
			target: 'es2020'
		},
		// Excluded cause of wasm deps resolution issue
		exclude: ['lucid-cardano']
	},
	build: {
		target: 'es2020'
	},
	
	...
	
};
```

#### node-fetch pollyfill

Vite configuration to support node-fetch and avoid build fail with the following error:

```
'promisify' is not exported by __vite-browser-external 
```

Install node-fetch polyfill add the following to `vite.config.ts`:

``` typescript

const config: UserConfig = {
	...
	
	resolve: {
        alias: {
          'node-fetch': 'node-fetch-polyfill',
        },
    },
	
	
	...
	
};
```

### Resources

- https://github.com/Menci/vite-plugin-top-level-await
- https://github.com/Menci/vite-plugin-wasm
- https://www.npmjs.com/package/node-fetch-polyfill
