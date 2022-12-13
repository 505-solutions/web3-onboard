import adapterStatic from '@sveltejs/adapter-static'
import adapterVercel from '@sveltejs/adapter-vercel'
import { kitDocsPlugin } from '@svelteness/kit-docs/node'
import Icons from 'unplugin-icons/vite'
import preprocess from 'svelte-preprocess'
import { resolve } from 'path'
import nodePolyfills from 'rollup-plugin-polyfill-node'
const MODE = process.env.NODE_ENV

const development = MODE === 'development'

const { adapter, adapterName } = process.env.VERCEL
  ? { adapter: adapterVercel, adapterName: 'vercel' }
  : { adapter: adapterStatic, adapterName: 'static' }

console.log(`Using ${adapterName} adapter`)

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    preprocess({
      postcss: true
    })
  ],

  kit: {
    adapter: adapter(),
    prerender: {
      default: true,
      entries: ['*']
    },
    vite: {
      build: {
        rollupOptions: {
          external: [
            '@web3-react/core',
            '@web3-react/eip1193',
            '@web3-react/metamask',
            '@web3-react/network',
            '@web3-react/walletconnect',
            '@web3-react/types',
            '@web3-react/url',
            '@web3-onboard/coinbase',
            '@web3-onboard/core',
            '@web3-onboard/dcent',
            '@web3-onboard/enkrypt',
            '@web3-onboard/fortmatic',
            '@web3-onboard/gas',
            '@web3-onboard/gnosis',
            '@web3-onboard/injected-wallets',
            '@web3-onboard/keepkey',
            '@web3-onboard/keystone',
            '@web3-onboard/ledger',
            '@web3-onboard/magic',
            '@web3-onboard/mew-wallet',
            '@web3-onboard/portis',
            '@web3-onboard/sequence',
            '@web3-onboard/tallyho',
            '@web3-onboard/trezor',
            '@web3-onboard/uauth',
            '@web3-onboard/walletconnect',
            '@web3-onboard/web3auth'
          ],
          plugins: [nodePolyfills({ crypto: true, http: true })]
        },
        commonjsOptions: {
          transformMixedEsModules: true
        }
      },
      resolve: {
        alias: {
          $fonts: resolve(process.cwd(), 'src/lib/fonts'),
          crypto: 'crypto-browserify',
          stream: 'stream-browserify',
          assert: 'assert'
        }
      },
      plugins: [
        Icons({ compiler: 'svelte' }),
        kitDocsPlugin({
          shiki: {
            theme: 'material-ocean'
          }
        }),
        development &&
          nodePolyfills({
            include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')],
            http: true,
            crypto: true
          })
      ],
      define: {
        'import.meta.env.VERCEL': JSON.stringify(process.env.VERCEL)
      },
      optimizeDeps: {
        exclude: ['@ethersproject/hash', 'wrtc', 'http'],
        include: [
          '@web3-onboard/core',
          '@web3-onboard/gas',
          '@web3-onboard/sequence',
          '@web3-onboard/torus',
          'js-sha3',
          '@ethersproject/bignumber'
        ]
      }
    }
  }
}

export default config
