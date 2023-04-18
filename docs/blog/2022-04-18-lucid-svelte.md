---
slug: lucid-svelte-quickstart
title: Using Cardano Lucid on Svelte
authors: [pascal]
tags: [Lucid, Cardano, SvelteKit]
---

If you are interested in both Web3, Cardano and cutting edge web app, you've probably already
heard about [Svelte](https://svelte.dev/) and  a Web3 library named [Lucid](https://lucid.spacebudz.io/).
At the time of writing this post, both Svelte and Lucid are fairly new players,
and they both share a common attribute: an efficient simplicity.
Adastry’s UI leverages both and I loved the experience so far.
Since I remember struggling a little getting started, I thought sharing my experience would help.


## Quick start instructions

To get Lucid to work on SvelteKit, you must install and tweak a few things beforehand.
Here's what I did to get in gear:

#### Obviously, install Lucid library:

```bash
npm i lucid-cardano
```

#### Add support for the Node version of Fetch

Node fetch isn’t the same as your browser fetch API. If you intend to use Lucid on the browser side,
install the fetch polyfill, otherwise svelte will complain at compile time:

```bash
npm i node-fetch-polyfill
```

#### Add WebAssembly support 

Lucid leverages the [Cardano Multiplatform Library](https://github.com/dcSpark/cardano-multiplatform-lib)
written in Rust for fast computation. For this library you need to add WebAssembly support:

```bash
npm i vite-plugin-wasm
```

#### Add top level await support

Top level await has been supported since ES2022, but if you target an older JS version for compatibility
like I do, you’ll need this work-around:

```bash
npm i vite-plugin-top-level-await
```

### Do some project configurations

Now, adjust your vite.config.ts file accordingly with the libraries we just installed.
Feel free to take out some parts if you don't need the fetch polyfill or the top level await plugin.

```typescript
// vite.config.ts
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

const config: UserConfig = {
  plugins: [sveltekit(), topLevelAwait(), wasm()],

  //…,

  resolve: {
    alias: {
      'node-fetch': 'node-fetch-polyfill',
    },
  },
  optimizeDeps: {
  esbuildOptions: {
    target: 'es2020',
  },
  exclude: ['lucid-cardano'],
  },
  build: {
    target: 'es2020',
  },
};
```

:::info
Support for **top level await** has been added in recent javascript version, you might not require
the top level plugin if you compile your code to a version after `es2020`. Just make sure you
understand the implication regarding backward compatibility.

exemple

    target: 'esnext',
:::

#### Typescript configuration

If using typescript, make sure that the targeted JS version is the same in both `vite.config.ts`
and `tsconfig.json`.

````json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "target": "ES2020"
  }
}
````

### And... you're good to go!

The errors triggered by SvelteKit weren't so obvious when I researched this solution, so I hope it
will save you some time. Let me know if you find anything missing to my instructions.

**Happy coding!**
